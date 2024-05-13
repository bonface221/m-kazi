import express, { Request, Response } from "express";
import menu from "./ussd";
import Redis from "ioredis";

require("dotenv").config();
const REDIS_URL = process.env.REDIS_URL!;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const redis = new Redis(6379, REDIS_URL);

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
