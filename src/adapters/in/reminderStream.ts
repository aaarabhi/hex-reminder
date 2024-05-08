import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Reminder } from "../../domain/types";
import ReminderDynamodb from "../out/reminderDynamoDb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBRecord } from "aws-lambda/trigger/dynamodb-stream";
import ReminderService from "../../domain/reminderLogic";
import { SESNotification } from "../out/ses";

const reminderService = new ReminderService(new ReminderDynamodb(), new SESNotification());

export class DdbStreamAdapter {
  public async dataConversion(records : DynamoDBRecord[]) {
    for (const record of records) {
      if (record.eventName === "REMOVE" && record.dynamodb?.OldImage) {
        const reminder = unmarshall(
          record.dynamodb.OldImage as { [key: string]: AttributeValue }
        ) as unknown as Reminder;
        await reminderService.processReminder(reminder);
      }
    }
  };
}
