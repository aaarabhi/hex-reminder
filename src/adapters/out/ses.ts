import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Reminder } from "../../domain/types";
import { NotificationService } from "../../port/notification";

const ses = new SESClient();

export class SESNotification implements NotificationService {
  public sendNotification = async (reminder: Reminder): Promise<void> => {
    try {
      const params = {
        Source: "aaarabhi@gmail.com",
        Destination: {
          ToAddresses: [reminder.userId],
        },
        Message: {
          Subject: {
            Data: "Reminder",
          },
          Body: {
            Text: {
              Data: reminder.reminderMessage,
            },
          },
        },
      };
      const command = new SendEmailCommand(params);
      const sesResult = await ses.send(command);
    } catch (err) {
      throw err;
    }
  };
}
