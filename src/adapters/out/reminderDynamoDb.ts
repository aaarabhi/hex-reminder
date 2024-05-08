import { Reminder } from "../../domain/types";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { ulid } from "ulid";
import { Repository } from "../../port/repository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-1";
export const ddbClient = new DynamoDBClient({ region: REGION });
export const docClient = DynamoDBDocumentClient.from(ddbClient);

export default class ReminderDynamodb implements Repository {
  public createReminder = async (reminder: Reminder): Promise<Reminder> => {
    console.log("savedReminder");
    try {
      const reminderId = ulid();
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          reminderId: reminderId,
          userId: reminder.userId,
          expiration: this.reminderTimeinEpochTimestamp(
            reminder.reminderMinutes
          ),
          reminderMinutes: reminder.reminderMinutes,
          reminderMessage: reminder.reminderMessage,
        },
      };
      const result = await docClient.send(new PutCommand(params));
      console.log(result);
      return {
        reminderId: reminderId,
        userId: reminder.userId,
        reminderMinutes: reminder.reminderMinutes,
        reminderMessage: reminder.reminderMessage,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  public getallUserReminders = async (userId: string): Promise<Reminder[]> => {
    console.log("getallReminders");
    try {
      const params: QueryCommandInput = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      };
      const { Items } = await docClient.send(new QueryCommand(params));
      console.log(Items);
      return Items as unknown as Reminder[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private reminderTimeinEpochTimestamp = (minutes: number): number => {
    const currentTime = new Date();
    console.log("Current Time::: ", currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + minutes);
    console.log("Reminder Time::: ", currentTime);
    // get unix epoch time from currentTime
    console.log(
      "Reminder Time in TimeStamp Nano Seconds::: ",
      currentTime.getTime()
    );
    console.log(
      "Reminder Time in TimeStamp Milli Seconds -- Unix Epoch Time::: ",
      Math.floor(currentTime.getTime() / 1000)
    );
    return Math.floor(currentTime.getTime() / 1000);
  };
}
