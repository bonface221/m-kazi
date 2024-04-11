import UssdMenu from "ussd-menu-builder";
import { redis } from "..";
import { checkIfSessionExists, getSessionAsJson } from "./functions";

//ussd flow
let menu = new UssdMenu({
  provider: "africasTalking",
});

// Define menu states
menu.startState({
  run: async () => {
    await redis.set(menu.args.sessionId, JSON.stringify({}));

    // use menu.con() to send response without terminating the session
    menu.con(
      "Welcome to MAMA KAZI APP :" +
        "\n1. Laundry" +
        "\n2. Elite Cleaners" +
        "\n3. Fumigation" +
        "\n4. Mama Fua Academy" +
        "\n00. Exit"
    );
  },

  // next object links to next state based on user input
  next: {
    "1": "laundry",
    "2": "eliteCleaners",
    "3": "fumigation",
    "4": "mamaFuaAcademy",
    "00": "quit",
  },
});

// start of laundry services
menu.state("laundry", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    let newData = {
      service: "laundry",
    };

    await redis.set(menu.args.sessionId, JSON.stringify(newData));

    menu.con(
      "Welcome to Laundry Services" + "\n1. Home-Wash" + "\n2. Laundromat"
    );
  },
  next: {
    "1": "homeWash",
    "2": "laundromat",
    "0": "__start__",
  },
});

// start of homewash of the laundry
menu.state("homeWash", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:type"] = "homeWash";

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Welcome to Home Wash Services" +
        "\n Enter number of baskets" +
        "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "homeWash.location",
    "0": "__start__",
  },
});

menu.state("homeWash.location", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:baskets"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "homewash.moreOnLocation",
    "2": "homewash.moreOnLocation",
    "3": "homewash.moreOnLocation",
    "4": "homewash.moreOnLocation",
    "0": "homeWash",
  },
});

menu.state("homewash.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "homeWash.date",
    "0": "homeWash.location",
  },
});

menu.state("homeWash.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for pick up" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "homeWash.time",
    "0": "homeWash.location",
  },
});

menu.state("homeWash.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for pick up" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "homeWash.end",
    "0": "homeWash.date",
  },
});

// end of the ussd flow
menu.state("homeWash.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);
    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of laundromat services of the laundry
menu.state("laundromat", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const newData = {
      service: "laundry",
      "laundry:type": "laundromat",
    };

    await redis.set(menu.args.sessionId, JSON.stringify(newData));

    menu.con(
      "Welcome to Laundromat Services" +
        "\n Enter Pick up location" +
        "\n 0. Back"
    );
  },
  next: {
    "*[a-zA-Z]+": "laundromat.location",
    "0": "laundry",
  },
});

menu.state("laundromat.location", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:laundromat:pickupLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "laundromat.moreOnLocation",
    "2": "laundromat.moreOnLocation",
    "3": "laundromat.moreOnLocation",
    "4": "laundromat.moreOnLocation",
    "0": "laundromat",
  },
});

menu.state("laundromat.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:laundromat:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "laundromat.date",
    "0": "laundromat.location",
  },
});

menu.state("laundromat.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:laundromat:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for pick up" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "laundromat.time",
    "0": "laundromat",
  },
});

menu.state("laundromat.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:laundromat:data"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for pick up" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "laudromat.end",
    "0": "laundromat.date",
  },
});

// end of the ussd flow
menu.state("laudromat.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["laundry:homewash:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);
    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of elite cleaners services
menu.state("eliteCleaners", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    let newData = {
      service: "eliteCleaners",
    };

    await redis.set(menu.args.sessionId, JSON.stringify(newData));

    menu.con(
      "Welcome to Elite Cleaners" +
        "\n1. Deep house cleaning" +
        "\n2. Seat cleaning" +
        "\n3. Carpet cleaning" +
        "\n4. Deep cleaning washrooms" +
        "\n 0. Back"
    );
  },

  next: {
    "1": "eliteCleaners.deepHouseCleaning",
    "2": "eliteCleaners.seatCleaning",
    "3": "eliteCleaners.carpetCleaning",
    "4": "eliteCleaners.deepCleaningWashrooms",
    "0": "__start__",
  },
});

// start of deep cleaning in the elite cleaners services
menu.state("eliteCleaners.deepCleaningWashrooms", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:service"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con(
      "Deep cleaning washrooms services" +
        "\n Enter the number of washrooms  @ Ksh 1500" +
        "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "eliteCleaners.deepCleaningWashrooms.noOfWashrooms",
    "0": "eliteCleaners",
  },
});

// start of deep cleaning washrooms number in the elite cleaners services
menu.state("eliteCleaners.deepCleaningWashrooms.noOfWashrooms", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepCleaningWashrooms:noOfWashrooms"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.deepCleaningWashrooms.moreOnLocation",
    "2": "eliteCleaners.deepCleaningWashrooms.moreOnLocation",
    "3": "eliteCleaners.deepCleaningWashrooms.moreOnLocation",
    "4": "eliteCleaners.deepCleaningWashrooms.moreOnLocation",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepCleaningWashrooms.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepCleaningWashrooms:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "eliteCleaners.deepCleaningWashrooms.date",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepCleaningWashrooms.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepCleaningWashrooms:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for cleaning" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.deepCleaningWashrooms.time",
    "0": "eliteCleaners.deepHouseCleaning",
  },
});
menu.state("eliteCleaners.deepCleaningWashrooms.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepCleaningWashrooms:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for cleaning" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.deepCleaningWashrooms.end",
    "0": "eliteCleaners.deepHouseCleaning",
  },
});
menu.state("eliteCleaners.deepCleaningWashrooms.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepCleaningWashrooms:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);

    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of seat cleaning services in the elite cleaners services
menu.state("eliteCleaners.seatCleaning", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:service"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Seat cleaning services" + "\n No of seats " + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.seatCleaning:noOfSeats",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning:noOfSeats", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:seatCleaning:noOfSeats"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.seatCleaning.moreOnLocation",
    "2": "eliteCleaners.seatCleaning.moreOnLocation",
    "3": "eliteCleaners.seatCleaning.moreOnLocation",
    "4": "eliteCleaners.seatCleaning.moreOnLocation",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:seatCleaning:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "eliteCleaners.seatCleaning.date",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:seatCleaning:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for cleaning" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.seatCleaning.time",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:seatCleaning:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for cleaning" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.seatCleaning.end",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:seatCleaning:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);

    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of carpet cleaning services in the elite cleaners services
menu.state("eliteCleaners.carpetCleaning", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:service"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con(
      "Carpet cleaning services" +
        "\n1. Medium size @ Ksh 1500 " +
        "\n2. Large size @ Ksh 2000 " +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.carpetCleaning.carpetSize",
    "2": "eliteCleaners.carpetCleaning.carpetSize",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning.carpetSize", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:carpetCleaning:carpetSize"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.carpetCleaning.moreOnLocation",
    "2": "eliteCleaners.carpetCleaning.moreOnLocation",
    "3": "eliteCleaners.carpetCleaning.moreOnLocation",
    "4": "eliteCleaners.carpetCleaning.moreOnLocation",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:carpetCleaning:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "eliteCleaners.carpetCleaning.date",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:carpetCleaning:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for cleaning" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.carpetCleaning.time",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:carpetCleaning:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for cleaning" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.carpetCleaning.end",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:carpetCleaning:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);

    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of deep house cleaning services in the elite cleaners services
menu.state("eliteCleaners.deepHouseCleaning", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:service"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con(
      "Deep house cleaning services" +
        "\n1. 1 room @ Ksh 4000" +
        "\n2. 1 bedroom @ Ksh 6000" +
        "\n3. 2 bedroom @ Ksh 8000" +
        "\n4. 3 bedroom @ Ksh 10000" +
        "\n5. 4 bedroom @ Ksh 14000" +
        "\n6. 6 bedroom @ Ksh 21000" +
        "\n7. 7 bedroom @ Ksh 25000" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.deepHouseCleaning.houseSize",
    "2": "eliteCleaners.deepHouseCleaning.houseSize",
    "3": "eliteCleaners.deepHouseCleaning.houseSize",
    "4": "eliteCleaners.deepHouseCleaning.houseSize",
    "5": "eliteCleaners.deepHouseCleaning.houseSize",
    "6": "eliteCleaners.deepHouseCleaning.houseSize",
    "7": "eliteCleaners.deepHouseCleaning.houseSize",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHouseCleaning.houseSize", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepHouseCleaning:houseSize"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "eliteCleaners.deepHouseCleaning.moreOnLocation",
    "2": "eliteCleaners.deepHouseCleaning.moreOnLocation",
    "3": "eliteCleaners.deepHouseCleaning.moreOnLocation",
    "4": "eliteCleaners.deepHouseCleaning.moreOnLocation",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHousingCleaning.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepHousingCleaning:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "eliteCleaners.deepHousingCleaning.date",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHousingCleaning.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepHousingCleaning:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter date for cleaning" + "\n format: DD/MM/YYY" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.deepHousingCleaning.time",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHousingCleaning.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepHousingCleaning:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));
    menu.con("Enter time for cleaning" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.deepHousingCleaning.end",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHousingCleaning.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["eliteCleaners:deepHousingCleaning:time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);

    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of fumigation services
menu.state("fumigation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    let newData = {
      service: "fumigation",
    };

    await redis.set(menu.args.sessionId, JSON.stringify(newData));

    menu.con(
      "Welcome to Fumigation Services" +
        "\n1. Bedsitter @ kshs.2000" +
        "\n2. One bedroom @ kshs. 3000" +
        "\n3. Two bedroom @ kshs. 35000" +
        "\n4. 3 bedroom @ kshs.4000" +
        "\n5. 4 bedroom @ kshs.5000" +
        "\n6. 5 bedroom @ kshs.6000" +
        "\n7. 6 bedroom @ kshs. 6500" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "fumigation.location",
    "2": "fumigation.location",
    "3": "fumigation.location",
    "4": "fumigation.location",
    "5": "fumigation.location",
    "6": "fumigation.location",
    "7": "fumigation.location",
    "0": "__start__",
  },
});

menu.state("fumigation.location", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["fumigation:roomSize"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "fumigation.moreOnLocation",
    "2": "fumigation.moreOnLocation",
    "3": "fumigation.moreOnLocation",
    "4": "fumigation.moreOnLocation",
    "0": "fumigation",
  },
});

menu.state("fumigation.moreOnLocation", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["fumigation:location"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "fumigation.date",
    "0": "fumigation.location",
  },
});

// start of date for the fumigation services
menu.state("fumigation.date", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["fumigation:moreOnLocation"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con(
      "Enter date for fumigation" + "\n format: DD/MM/YYY" + "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "fumigation.time",
    "0": "fumigation",
  },
});

// start of time for the fumigation services
menu.state("fumigation.time", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["fumigation:date"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    menu.con("Enter time for fumigation" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "fumigation.end",
    "0": "fumigation.date",
  },
});

// end of the fumigation the ussd flow
menu.state("fumigation.end", {
  run: async () => {
    if (!(await checkIfSessionExists(menu.args.sessionId))) {
      menu.end("Session expired. Please start again.");
    }

    const d = await getSessionAsJson(menu.args.sessionId);

    d["fumigation.time"] = menu.val;

    await redis.set(menu.args.sessionId, JSON.stringify(d));

    const finalData = await getSessionAsJson(menu.args.sessionId);
    console.log(finalData);
    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// start of mama fua academy services
menu.state("mamaFuaAcademy", {
  run: () => {
    menu.con(
      "Welcome to Mama Fua Academy" +
        "\n1. Book Training" +
        "\n2. Sponsor a Mama Fua for training" +
        "\n0. Back"
    );
  },
  next: {
    "1": "bookTraining.name",
    "2": "sponsor.name",
    "0": "__start__",
  },
});

// start of book training
menu.state("bookTraining.name", {
  run: () => {
    menu.con("Enter your name" + "\n0. Back");
  },
  next: {
    "*[a-zA-Z]+": "bookTraining.location",
    "0": "mamaFuaAcademy",
  },
});

menu.state("bookTraining.location", {
  run: () => {
    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "bookTraining.moreOnLocation",
    "2": "bookTraining.moreOnLocation",
    "3": "bookTraining.moreOnLocation",
    "4": "bookTraining.moreOnLocation",
    "0": "mamaFuaAcademy",
  },
});

menu.state("bookTraining.moreOnLocation", {
  run: () => {
    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "bookTraining.idNumber",
    "0": "bookTraining.location",
  },
});

// start of book training -> users -> location -> id number
menu.state("bookTraining.idNumber", {
  run: () => {
    menu.con("Enter your ID number" + "\n0. Back");
  },
  next: {
    "*\\d+": "bookTraining.disclaimer",
    "0": "bookTraining.location",
  },
});

// start of book training -> users -> location -> id number -> disclaimer
menu.state("bookTraining.disclaimer", {
  run: () => {
    menu.con(
      "The total fee is 2500 please pay 1000 as a deposit." +
        "\n If yes press (1) to proceed to payment, press (2) to cancel (0) to go back" +
        "\n1. Yes" +
        "\n2. No" +
        "\n0. Back"
    );
  },
  next: {
    1: "end",
    2: "quit",
    "0": "bookTraining.idNumber",
  },
});

// start of sponsor a mama fua for training
menu.state("sponsor.name", {
  run: () => {
    menu.con("Enter your name or Organization" + "\n0. Back");
  },
  next: {
    "*[a-zA-Z]+": "sponsor.location",
    "0": "mamaFuaAcademy",
  },
});

menu.state("sponsor.location", {
  run: () => {
    menu.con(
      "Pick your location" +
        "\n 1. Nairobi" +
        "\n 2. Mombasa" +
        "\n 3. Kisumu" +
        "\n 4. Eldoret" +
        "\n 0. Back"
    );
  },
  next: {
    "1": "sponsor.moreOnLocation",
    "2": "sponsor.moreOnLocation",
    "3": "sponsor.moreOnLocation",
    "4": "sponsor.moreOnLocation",
    "0": "mamaFuaAcademy",
  },
});

menu.state("sponsor.moreOnLocation", {
  run: () => {
    menu.con("Enter more on your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "sponsor.disclaimer",
    "0": "sponsor.location",
  },
});

menu.state("sponsor.disclaimer", {
  run: () => {
    menu.con(
      "The total fee is 2500, but you can contribute any amount" +
        "\n Would you like to sponsor a Mama Fua for training?" +
        "\n1. Yes" +
        "\n2. No" +
        "\n0. Back"
    );
  },
  next: {
    1: "sponsor.end",
    2: "mamaFuaAcademy",
    "0": "sponsor.phone",
  },
});

// end of the sponsor a mama fua for training
menu.state("sponsor.end", {
  run: () => {
    menu.end("Thanks for enabling our MOTHER-STUDIES programme. GOD BLESS!");
  },
});

// end of the ussd flow
menu.state("end", {
  run: async () => {
    console.log(menu.args.text);
    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});

// ussd quit
menu.state("quit", {
  run: () => {
    menu.end("Goodbye :)");
  },
});

export default menu;
