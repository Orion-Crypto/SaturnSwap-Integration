import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

export const BASE_TRENDING_FEED_KEY = 'trending-feed';
export const SHOW_TRENDING_FEED = [BASE_TRENDING_FEED_KEY, 'show'];

//---------------------------------------------------------------------------------------------------//
// Info Tab Functions
//---------------------------------------------------------------------------------------------------//
export const getShowTrendingFeed = () => queryClient.getQueryData(SHOW_TRENDING_FEED);
export const setShowTrendingFeed = (show: boolean) => queryClient.setQueryData(SHOW_TRENDING_FEED, show);
export const useGetShowTrendingFeed = () => useQuery({ queryKey: SHOW_TRENDING_FEED, queryFn: () => getShowTrendingFeed() ?? false });
//---------------------------------------------------------------------------------------------------//
