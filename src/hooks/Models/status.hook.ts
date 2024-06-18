import { queryStatus } from '@/api/GraphQL/Status/Query';
import { useQuery } from '@tanstack/react-query';

export const BASE_STATUS_KEY = 'status';

//---------------------------------------------------------------------------------------------------//
// Account Hooks and Functions
//---------------------------------------------------------------------------------------------------//
export const useGetStatus = (parameters: any = {}) =>
    useQuery({
        queryKey: [BASE_STATUS_KEY, 'detail'],
        queryFn: async () => await queryStatus(),
        enabled: parameters?.enabled,
    });

//---------------------------------------------------------------------------------------------------//
