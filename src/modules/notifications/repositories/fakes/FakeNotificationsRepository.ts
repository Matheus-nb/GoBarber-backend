import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notifications from '../../infra/typeorm/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
    private notifications: Notifications[] = [];

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notifications> {
        const notification = new Notifications();

        Object.assign(notification, {
            id: new ObjectID(),
            content,
            recipient_id,
        });

        this.notifications.push(notification);

        return notification;
    }
}

export default NotificationsRepository;
