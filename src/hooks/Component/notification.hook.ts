import { queryClient } from '@/hooks/default';
import { NotificationData } from '@/types/Classes/notification';
import { useQuery } from '@tanstack/react-query';

const BASE_NOTIFICATION_KEY = 'notification';
export const NOTIFICATION_KEY = [BASE_NOTIFICATION_KEY];

export const getNotification = () => queryClient.getQueryData(NOTIFICATION_KEY);
export const setNotification = (notification: NotificationData) => queryClient.setQueryData(NOTIFICATION_KEY, notification);

export const useGetNotification = () => useQuery({ queryKey: NOTIFICATION_KEY, queryFn: () => getNotification() ?? null });
