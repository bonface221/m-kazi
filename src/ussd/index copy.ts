import { Model } from "mongoose";
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
      "Welcome! Ready to register for the Zizi Conference:" +
        "\n1. Get started" +
        "\n2. Get out!"
    );
  },

  // next object links to next state based on user input

  next: {
    "1": "register",
    "2": "quit",
  },
});

menu.state("register", {
  run: () => {
    menu.con("Before we go ahead, whats your name?");
  },
  next: {
    "*[a-zA-Z]+": "register.tickets",
    "0": "__start__",
  },
});

menu.state("register.tickets", {
  run: () => {
    //save the name

    menu.con("How many tickets would you like to reserve?");
  },
  next: {
    // using regex to match user input to next state
    "*\\d+": "end",
  },
});

menu.state("end", {
  run: async () => {
    let tickets = menu.val;
    console.log(menu.args.phoneNumber);
    console.log(menu.args.sessionId);
    console.log(menu.args.text);

    console.log(tickets);

    menu.end(
      "Awesome! You have successfully registered for the Zizi Conference. We will send you a confirmation message shortly. Thank you!"
    );
  },
});
menu.state("quit", {
  run: () => {
    menu.end("Goodbye :)");
  },
});

export default menu;
