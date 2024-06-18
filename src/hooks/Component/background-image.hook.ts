import { queryClient } from '@/hooks/default';
import { useQuery } from '@tanstack/react-query';

const BASE_BACKGROUND_IMAGE_KEY = 'background-image';
export const BACKGROUND_IMAGE_KEY = [BASE_BACKGROUND_IMAGE_KEY];

//---------------------------------------------------------------------------------------------------//
// Show Background Images
//---------------------------------------------------------------------------------------------------//
export const getShowBackgroundImage = () => queryClient.getQueryData(BACKGROUND_IMAGE_KEY);
export const setShowBackgroundImage = (toggle: boolean) => queryClient.setQueryData(BACKGROUND_IMAGE_KEY, toggle);
export const useGetShowBackgroundImage = () => useQuery({ queryKey: BACKGROUND_IMAGE_KEY, queryFn: () => getShowBackgroundImage() ?? false });
//---------------------------------------------------------------------------------------------------//
