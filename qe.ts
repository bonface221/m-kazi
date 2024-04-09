import UssdMenu from "ussd-menu-builder";

let menu = new UssdMenu();

let sessionData = {};

// Define menu states
menu.startState({
  run: () => {
    // use menu.con() to send a response without terminating session

    menu.con(
      "Welcome. Choose option:" + "\n1. Show Balance" + "\n2. Buy Airtime"
    );
  }, //next object links to next state based on user input
  next: {
    "1": "showBalance",
    "2": "buyAirtime",
    "": function () {
      menu.con(
        "Invalid option. Choose option:" +
          "\n1. Show Balance" +
          "\n2. Buy Airtime"
      );
    },
  },
});

menu.state("showBalance", {
  run: () => {
    console.log(menu.session);
    // const sessionId = menu.session.sessionId;
    // sessionData = {
    //   ...sessionData,
    //   [sessionId]: {
    //     1: "showBalance",
    //   },
    // };

    menu.con(
      'Are you sure you want to check your balance? Reply with "yes" to continue or "no" to go back'
    );
  },
  next: {
    yes: "showBalance.confirm",
    no: "__start__",
  },
});
menu.state("showBalance.confirm", {
  run: () => {
    console.log(sessionData);
    //fetch balance
    console.log(menu.args);
    fetchBalance(menu.args.phoneNumber).then((bal) => {
      // use menu.end() to send response and terminate session
      menu.end("Your balance is KES" + bal);
    });
  },
});
menu.state("buyAirtime", {
  run: () => {
    const sessionId = menu.session.sessionId;
    sessionData = {
      ...sessionData,
      [sessionId]: {
        1: "buyAirtime",
      },
    };
    menu.con("Enter amount: press 00 to go home");
  },
  next: {
    // using regex to match user input to next state
    "00": "__start__",
    "*^\\d{1,4}$": "buyAirtime.confirm",
  },
});

menu.state("buyAirtime.confirm", {
  run: () => {
    console.log(sessionData);
    let amount = Number(menu.val);
    console.log("args", menu.args);
    console.log("result", menu.result);

    buyAirtime(menu.args.phoneNumber, amount).then((r) => {
      menu.end(
        "Airtime bought successfully. Amount: " + formatAmount(amount) + " KES"
      );
    });
  },
});

export default menu;

async function fetchBalance(phoneNumber: string): Promise<number> {
  //fetch balance from db
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 1000;
}
async function buyAirtime(
  phoneNumber: string,
  amount: number
): Promise<boolean> {
  //buy airtime
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "KES" });
}
