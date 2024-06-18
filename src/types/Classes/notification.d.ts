import { NotificationType } from '@/types/Enums/NotificationType';

export interface NotificationSuccess {
    message?: string;
    link?: string;
}
export interface NotificationWarning {
    message?: string;
    link?: string;
}
export interface NotificationError {
    message?: string;
    address?: string;
    transaction?: string;
    link?: string;
}

export interface NotificationData {
    notificationType?: NotificationType;
    data?: NotificationSuccess | NotificationWarning | NotificationError;
}
