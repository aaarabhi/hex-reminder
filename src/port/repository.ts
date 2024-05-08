import { Reminder } from "../domain/types";

export interface Repository {
    getallUserReminders(userId: string): Promise<Reminder[]>;
    createReminder(reminder: Reminder): Promise<Reminder>;
}

