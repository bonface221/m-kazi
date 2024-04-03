import express, { Request, Response } from "express";
import mongoose from "mongoose";
import menu from "./ussd";

require("dotenv").config();

// const mongoString = process.env.DATABASE_URL!;
// mongoose.connect(mongoString);
// const db = mongoose.connection;
// db.on("error", (error) => console.error(error));
// db.once("connected", () => {
//   console.log("Connected to database");
// });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

//registering USSD handler with express
app.post("/ussd", (req: Request, res: Response) => {
  //ussd logic here
  menu.run(req.body, (ussdResult: string) => {
    res.send(ussdResult);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
