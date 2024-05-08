import express from "express";
import { Request, Response } from "express";
import { Repository } from "../../port/repository";
import { Reminder } from "../../domain/types";
import ReminderService from "../../domain/reminderLogic";
import ReminderDynamodb from "../out/reminderDynamoDb";
import { SESNotification } from "../out/ses";



const reminderRouter = express.Router();

const reminderService = new ReminderService(new ReminderDynamodb(), new SESNotification());



// create a function for creating reminders.
reminderRouter.post("/", async (req: Request, res: Response) => {
  const reminder: Reminder = req.body;
  try {
    await reminderService.createReminder(reminder);
  } catch (error) {
    return res.status(500).json({ errorMessage: (error as Error).message });
  }
  res.status(200).json({ data: reminder.userId });
});

// create a function to scan all the users.
reminderRouter.get("/", async (req: Request, res: Response) => {
  let reminders: Reminder[] = [];
  try {
    reminders = await reminderService.getAllUserReminders(req.query.userId as string);
  } catch (error) {
    return res.status(500).json({ errorMessage: (error as Error).message });
  }
  res.status(200).json({ data: reminders });
});

export default reminderRouter;
