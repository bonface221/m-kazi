import UssdMenu from "ussd-builder";

interface NewUSSD extends UssdMenu {
  coolThing: string;
}

//ussd flow
let menu = new UssdMenu({
  provider: "africasTalking",
});
menu.startState({
  run: () => {
    // use menu.con() to send response without terminating the session

    menu.con(
      "Welcome to the USSD app:" +
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

menu.state("laundry", {
  run: () => {
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

menu.state("sponsor.name", {
  run: () => {
    menu.con("Enter your name or Organization" + "\n0. Back");
  },
  next: {
    "*[a-zA-Z]+": "sponsor.phone",
    "0": "mamaFuaAcademy",
  },
});

menu.state("sponsor.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n0. Back");
  },
  next: {
    "*\\d+": "sponsor.disclaimer",
    "0": "sponsor.name",
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

menu.state("sponsor.end", {
  run: () => {
    menu.end("Thanks for enabling our MOTHER-STUDIES programme. GOD BLESS!");
  },
});

menu.state("bookTraining.name", {
  run: () => {
    menu.con("Enter your name" + "\n0. Back");
  },
  next: {
    "*[a-zA-Z]+": "bookTraining.phone",
    "0": "mamaFuaAcademy",
  },
});

menu.state("bookTraining.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n0. Back");
  },
  next: {
    "*\\d+": "bookTraining.location",
    "0": "bookTraining.name",
  },
});

menu.state("bookTraining.location", {
  run: () => {
    menu.con("Enter your location" + "\n0. Back");
  },
  next: {
    "*[a-zA-Z]+": "bookTraining.idNumber",
    "0": "bookTraining.phone",
  },
});

menu.state("bookTraining.idNumber", {
  run: () => {
    menu.con("Enter your ID number" + "\n0. Back");
  },
  next: {
    "*\\d+": "bookTraing.disclaimer",
    "0": "bookTraining.location",
  },
});

menu.state("bookTraining.disclaimer", {
  run: () => {
    menu.con(
      "The total fee is 2500 please pay 1000 as a deposit." +
        " If yes press (y) press (n) to cancel (0) to go back" +
        "\ny. Yes" +
        "\nn. No" +
        "\n0. Back"
    );
  },
  next: {
    y: "end",
    n: "mamaFuaAcademy",
    "0": "bookTraining.idNumber",
  },
});

// start of fumigation services
menu.state("fumigation", {
  run: () => {
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
    "1": "fumigation.phone",
    "2": "fumigation.phone",
    "3": "fumigation.phone",
    "4": "fumigation.phone",
    "5": "fumigation.phone",
    "6": "fumigation.phone",
    "7": "fumigation.phone",
    "0": "__start__",
  },
});

menu.state("fumigation.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n 0. Back");
  },
  next: {
    "*\\d+": "fumigation.date",
    "0": "fumigation",
  },
});

menu.state("fumigation.date", {
  run: () => {
    menu.con(
      "Enter date for fumigation" + "\n format: dd/mm/yyyy" + "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "fumigation.time",
    "0": "fumigation.phone",
  },
});

menu.state("fumigation.time", {
  run: () => {
    menu.con("Enter time for fumigation" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "end",
    "0": "fumigation.date",
  },
});

// start of elite cleaners services
menu.state("eliteCleaners", {
  run: () => {
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

menu.state("eliteCleaners.deepCleaningWashrooms", {
  run: () => {
    menu.con(
      "Deep cleaning washrooms services" +
        "\n Enter the number of washrooms  @ Ksh 1500" +
        "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "eliteCleaners.phone",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.seatCleaning", {
  run: () => {
    menu.con("Seat cleaning services" + "\n No of seats " + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.phone",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.carpetCleaning", {
  run: () => {
    menu.con(
      "Carpet cleaning services" +
        "\n1. Medium size @ Ksh 1500 " +
        "\n2. Large size @ Ksh 2000 " +
        "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "eliteCleaners.phone",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.deepHouseCleaning", {
  run: () => {
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
    // send to next state to input the phone number if the number is bettween 1-7
    "1": "eliteCleaners.phone",
    "2": "eliteCleaners.phone",
    "3": "eliteCleaners.phone",
    "4": "eliteCleaners.phone",
    "5": "eliteCleaners.phone",
    "6": "eliteCleaners.phone",
    "7": "eliteCleaners.phone",
    "0": "eliteCleaners",
  },
});

menu.state("eliteCleaners.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n 0. Back");
  },
  next: {
    "*\\d+": "eliteCleaners.date",
    "0": "eliteCleaners.deepHouseCleaning",
  },
});

menu.state("eliteCleaners.date", {
  run: () => {
    menu.con(
      "Enter date for cleaning" + "\n format: dd/mm/yyyy" + "\n 0. Back"
    );
  },
  next: {
    "*\\d+": "eliteCleaners.time",
    "0": "eliteCleaners.phone",
  },
});

menu.state("eliteCleaners.time", {
  run: () => {
    menu.con("Enter time for cleaning" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "end",
    "0": "eliteCleaners.date",
  },
});

// start of laundromat services
menu.state("laundromat", {
  run: () => {
    menu.con(
      "Welcome to Laundromat Services" +
        "\n Enter Pick up location" +
        "\n 0. Back"
    );
  },
  next: {
    "*[a-zA-Z]+": "laundromat.phone",
    "0": "laundry",
  },
});

menu.state("laundromat.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n 0. Back");
  },
  next: {
    "*\\d+": "laundromat.date",
    "0": "laundromat",
  },
});

menu.state("laundromat.date", {
  run: () => {
    menu.con("Enter date for pick up" + "\n format: dd/mm/yyyy" + "\n 0. Back");
  },
  next: {
    "*\\d+": "laundromat.time",
    "0": "laundromat.phone",
  },
});

menu.state("laundromat.time", {
  run: () => {
    menu.con("Enter time for pick up" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "end",
    "0": "laundromat.date",
  },
});

// start of homewash of the laundry
menu.state("homeWash", {
  run: () => {
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
  run: () => {
    menu.con("Enter your location" + "\n 0. Back");
  },
  next: {
    "*[a-zA-Z]+": "homeWash.phone",
    "0": "homeWash",
  },
});

menu.state("homeWash.phone", {
  run: () => {
    menu.con("Enter your phone number" + "\n 0. Back");
  },
  next: {
    "*\\d+": "homeWash.date",
    "0": "homeWash.location",
  },
});

menu.state("homeWash.date", {
  run: () => {
    menu.con("Enter date for pick up" + "\n format: dd/mm/yyyy" + "\n 0. Back");
  },
  next: {
    "*\\d+": "homeWash.time",
    "0": "homeWash.phone",
  },
});

menu.state("homeWash.time", {
  run: () => {
    menu.con("Enter time for pick up" + "\n format: hh:mm" + "\n 0. Back");
  },
  next: {
    "*\\d+": "end",
    "0": "homeWash.date",
  },
});

menu.state("end", {
  run: async () => {
    menu.end(
      "Awesome. We will send you a confirmation message shortly. Thank you!"
    );
  },
});
menu.state("quit", {
  run: () => {
    menu.end("Goodbye :)");
  },
});

export default menu;
