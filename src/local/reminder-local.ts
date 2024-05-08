import { DynamoDBStreamHandler } from "aws-lambda";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export type Reminder = {
  reminderId?: string;
  userId: string;
  reminderMinutes: number;
  reminderMessage: string;
};

const ses = new SESClient();

// create a function to unmarshall data from dynamodb

export const handler: DynamoDBStreamHandler = async (event) => {

  // 1. Stream Handler -- just initiate Stream adapter and pass the event and await
  // 2. Create Stream Adapter, convert all dynamodb type data to reminder data 
         // - for each dyanmodb record, unmarshal and convert to reimder 
         // - pass the reminder array to Logic layer
  // 3. in ReminderLogic create a new method called processReminder(remider[])
        // for each remider invoke OutAdapter for sending Email
  // 4. Create Notification Port, method name sendNotification(reminder)
  // 5. Create Out Adapter - SESAdapter implementing Notificaiton Port, move the sendEmail logic to the adapter under sendNotification method
        // modify the method to take reminder type instead of multiple parameters
  
  let reminders: Reminder[] = []
  for (const record of event.Records) {
   if (record.eventName === "REMOVE" && record.dynamodb?.OldImage) {
      const reminder = unmarshall(
        record.dynamodb.OldImage as { [key: string]: AttributeValue }
      ) as unknown as Reminder;
      // reminders.push(reminder) // In Adapter ends with this 
      await sendEmail(
        "aaarabhi@gmail.com",
        reminder.userId,
        reminder.reminderMessage,
        "Reminder"
      );
      console.log("Removed Record: %j", reminder);
    }
  }
};

// create a function to send an email to users.

export const sendEmail = async (
  fromEmail: string,
  toEmail: string,
  body: string,
  subject: string
) => {
  try {
    const params = {
      Source: fromEmail,
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };
    const command = new SendEmailCommand(params);
    const sesResult = await ses.send(command);
    return sesResult;
  } catch (err) {
    throw err;
  }
};
