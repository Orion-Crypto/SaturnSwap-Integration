import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_ACTIVITY_FEED_KEY = 'activity-feed';

export const SHOW_ACTIVITY_FEED = [BASE_ACTIVITY_FEED_KEY, 'show'];

//---------------------------------------------------------------------------------------------------//
// Info Tab Functions
//---------------------------------------------------------------------------------------------------//
export const getShowActivityFeed = () => queryClient.getQueryData(SHOW_ACTIVITY_FEED);
export const setShowActivityFeed = (show: boolean) => queryClient.setQueryData(SHOW_ACTIVITY_FEED, show);
export const useGetShowActivityFeed = () => useQuery({ queryKey: SHOW_ACTIVITY_FEED, queryFn: () => getShowActivityFeed() ?? false });
//---------------------------------------------------------------------------------------------------//
