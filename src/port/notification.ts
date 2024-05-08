import { Reminder } from "../domain/types";

export interface NotificationService {
    sendNotification(reminder: Reminder): Promise<void>;
    
}