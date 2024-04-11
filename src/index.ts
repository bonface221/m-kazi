import express, { Request, Response } from "express";
import menu from "./ussd";
import Redis from "ioredis";

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

export const redis = new Redis(6379, "redis://127.0.0.1:6379/0");

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
