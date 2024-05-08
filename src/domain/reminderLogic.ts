import { NotificationService } from "../port/notification";
import { Repository } from "../port/repository";
import { Reminder } from "./types";

export default class ReminderService {
  private readonly repository: Repository;
  private readonly notification : NotificationService;
  constructor(repository: Repository, notification : NotificationService) {
    this.repository = repository;
    this.notification = notification;
  }

  // call createReminder as a method
  public createReminder = async (reminder: Reminder): Promise<Reminder> => {
    return await this.repository.createReminder(reminder);
  };

  // call getallUserReminder as a method
  public getAllUserReminders = async (
    userId: string
  ): Promise<Reminder[]> => {
    return await this.repository.getallUserReminders(userId);
  };

  public processReminder = async (reminder: Reminder) : Promise<void> =>{
    return await this.notification.sendNotification(reminder);
  }
}
