'use client';

import { CONNECTED_WALLET_KEY, IS_CONNECTED_KEY } from '@/hooks/Cardano/wallet.hooks';
import { SHOW_ACTIVITY_FEED } from '@/hooks/Component/activity-feed.hook';
import { BACKGROUND_IMAGE_KEY } from '@/hooks/Component/background-image.hook';
import { SLIPPAGE_TYPE_KEY, SLIPPAGE_VALUE_KEY } from '@/hooks/Component/slippage.hook';
import { AreKeysEqual, localStoragePersistor, queryClient } from '@/hooks/default';
import { DehydrateOptions, QueryKey } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React from 'react';

const persistQueries: QueryKey[] = [
    IS_CONNECTED_KEY,
    CONNECTED_WALLET_KEY,
    BACKGROUND_IMAGE_KEY,
    SHOW_ACTIVITY_FEED,
    SLIPPAGE_TYPE_KEY,
    SLIPPAGE_VALUE_KEY,
];
const dehydrateOptions: DehydrateOptions = {
    shouldDehydrateQuery: ({ queryKey }) => {
        for (const key of persistQueries) {
            if (AreKeysEqual(queryKey, key)) return true;
        }
        return false;
    },
};
const persistOptions = {
    persister: localStoragePersistor,
    hydrateOptions: {},
    dehydrateOptions: dehydrateOptions,
};

export default function Provider({ children }: any) {
    return (
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            {children}
            <ReactQueryDevtools initialIsOpen={true} />
        </PersistQueryClientProvider>
    );
}
