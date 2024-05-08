import express, { Request, Response } from "express";

const helloRouter = express.Router();

// Sample hello route
// Get all users
helloRouter.get("/", async (req: Request, res: Response) => {
  console.log("inside hello router");

  res.status(200).json({ data: "Hello World!" });
});

export default helloRouter;