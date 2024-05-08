import "source-map-support/register";
import express, { Request, Response } from "express";
import serverlessExpress from "@codegenie/serverless-express";
import bodyParser from "body-parser";
import reminderRouter from "./adapters/in/reminderRouter";

const app = express();
app.use(bodyParser.json());
app.use("/reminder", reminderRouter);

export const handler = serverlessExpress({ app });