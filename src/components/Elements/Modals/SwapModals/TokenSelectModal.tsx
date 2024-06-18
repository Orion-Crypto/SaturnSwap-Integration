'use client';

import { ModalBackground, closeModal } from '@/components/Elements/Modals/ModalBackground';
import { DefaultGraphQLFilter, SearchBar } from '@/components/Elements/SearchBar';
import { Spinner } from '@/components/Elements/Spinner';
import { getSwap, setSwap } from '@/hooks/Component/swap.hook';
import { TOKEN_SELECT_IS_OPEN_MODAL_KEY, setIsOpenModal, setModalData, useGetIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { setSelectedPool } from '@/hooks/Modals/pool-select-modal.hook';
import { BASE_POOL_KEY, useGetPools } from '@/hooks/Models/pool.hook';
import { POOL_SEARCH_KEY, useGetSearchValue } from '@/hooks/Models/search.hook';
import { isHttpsURL, isLocalURL } from '@/utils/image';
import clsx from 'clsx';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';

export const TokenSelectModal = () => {
    const { refetch } = useGetIsOpenModal(TOKEN_SELECT_IS_OPEN_MODAL_KEY);
    const close = () => {
        setIsOpenModal(TOKEN_SELECT_IS_OPEN_MODAL_KEY, false);
        setModalData({});
        refetch();
    };

    return (
        <>
            <ModalBackground onClick={close}>
                <div className="z-90 flex h-full w-full items-center justify-center">
                    <div
                        className={clsx(
                            '-mt-12 flex h-144 flex-col gap-2 rounded-xl border-2 border-sky-900/80 bg-space-950 shadow-full-sky-xl-900',
                            'w-80 p-4 md:w-120 md:p-4'
                        )}
                    >
                        <MainModal close={close} />
                    </div>
                </div>
            </ModalBackground>
        </>
    );
};

const MainModal = ({ close }: any) => {
    const searchKey: any = POOL_SEARCH_KEY;
    const refetchKey: any = [BASE_POOL_KEY, 'infinite'];

    // Get Pools that have the other token (only ada for now)
    const { data: search }: any = useGetSearchValue(searchKey);
    const pageSize = 30;
    const {
        data: pools,
        isLoading,
        fetchNextPage,
        hasNextPage,
    }: any = useGetPools({
        first: pageSize,
        where: GetPoolFilter(search),
        order: '{created_at: ASC}',
    });

    return (
        <>
            <div className="flex justify-center">
                <div className="text-center text-xl font-semibold text-zinc-200">{'Select Token'}</div>
            </div>
            <div>
                <SearchBar
                    classNames="h-12 mt-2"
                    placeholderText={'Search Tokens'}
                    searchKey={searchKey}
                    refetchKey={refetchKey}
                    graphQLFilter={DefaultGraphQLFilter}
                />
            </div>
            <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-xl pr-2 pt-3">
                {isLoading ? (
                    <div className="flex h-24 w-full items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        loadMore={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={
                            <div key={0} className="flex h-24 w-full items-center justify-center">
                                <Spinner />
                            </div>
                        }
                        useWindow={false}
                    >
                        <div className="flex w-full flex-col gap-4">
                            {pools?.pages?.map(
                                (page: any, pageIndex: any) =>
                                    page?.edges?.map((pageData: any, edgeIndex: any) => {
                                        const pool = pageData?.node;
                                        const index = pageIndex * pageSize + edgeIndex;
                                        return <PoolSelector key={index} pool={pool} close={close} />;
                                    })
                            )}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
};

const PoolSelector = ({ pool, close, isTokenModalVersion }: any) => {
    const tokenProjectOne = pool?.token_project_one;
    const tokenProjectTwo = pool?.token_project_two;
    const image = isHttpsURL(tokenProjectTwo.image) || isLocalURL(tokenProjectTwo.image) ? tokenProjectTwo.image : '/images/SaturnSwapLogo.png';
    const resetSwapInputs = () => {
        const swap: any = getSwap();
        if (!swap) return;

        swap.tokenAmountSell = 0;
        swap.tokenAmountBuy = 0;

        setSwap(swap);
    };
    return (
        <>
            <div
                onClick={() => {
                    setSelectedPool(pool);
                    closeModal(close);
                    resetSwapInputs();
                }}
                className={clsx(
                    'flex h-18 w-full flex-none cursor-pointer select-none items-center rounded-lg border border-sky-700/60',
                    'bg-space-800 transition-all duration-300 hover:bg-space-500'
                )}
            >
                <div className="flex w-full items-center">
                    <div>
                        <div className="flex h-16 w-16 items-center justify-center">
                            <Image src={image} alt="Cardano" width={32} height={32} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex w-full items-center gap-4 text-white">{tokenProjectTwo.name}</div>
                        <div className="text-xs text-zinc-400">({tokenProjectTwo.name})</div>
                    </div>
                </div>
            </div>
        </>
    );
};

const GetPoolFilter = (search: string) => {
    if (search) {
        const filter = `{ is_verified: { eq: true }, ${search ?? ''} }`;
        return filter;
    }
    return `{ is_verified: { eq: true } }`;
};
