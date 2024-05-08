import { DynamoDBStreamHandler } from "aws-lambda";
import { DdbStreamAdapter } from "./adapters/in/reminderStream";

const adapter = new DdbStreamAdapter();
export const handler: DynamoDBStreamHandler = async (event) => {
  await adapter.dataConversion(event.Records);
};
