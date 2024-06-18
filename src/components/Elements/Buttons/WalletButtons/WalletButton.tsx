'use client';

import { Wallets } from '@/components/Elements/Modals/WalletModals/WalletModal';
import { Spinner } from '@/components/Elements/Spinner';
import { useGetConnectedWallet, useIsConnected } from '@/hooks/Cardano/wallet.hooks';
import { WALLET_IS_OPEN_MODAL_KEY, setIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { BASE_WALLET_KEY, useGetBalance } from '@/hooks/Models/wallet.hook';
import { queryClient } from '@/hooks/default';
import { truncateAddress } from '@/utils/cardano/address';
import { convertAdaToLovelaces, convertLovelacesToDisplayString } from '@/utils/cardano/lovelaces';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';

export const WalletButton = () => {
    const { data: isConnected, isLoading: isLoadingConnected, isFetching: isFetchingConnected } = useIsConnected();
    const { data: connectedWallet }: any = useGetConnectedWallet();
    const { data: balance, isLoading: isLoadingBalance }: any = useGetBalance();

    const image = Wallets?.[connectedWallet?.walletType]?.image;
    const truncatedAddress = truncateAddress(connectedWallet?.address);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         queryClient.invalidateQueries({ queryKey: [BASE_WALLET_KEY] });
    //     }, 5000);
    //     return () => clearInterval(intervalId);
    // }, []);
    return (
        <>
            <div className="flex gap-3 sm:gap-4">
                {isConnected && (
                    <div
                        onClick={() => {
                            setIsOpenModal(WALLET_IS_OPEN_MODAL_KEY, true);
                        }}
                        className={clsx(
                            'hidden h-12 w-24 cursor-pointer items-center justify-center rounded-2xl font-bold text-white sm:flex',
                            'bg-gradient-to-r from-sky-600 from-50% to-sky-400',
                            'transition-all duration-200 hover:shadow-full-sky-md-500'
                        )}
                    >
                        {isLoadingBalance || (balance !== 0 && !balance) ? (
                            <Spinner />
                        ) : (
                            convertLovelacesToDisplayString(convertAdaToLovelaces(balance))
                        )}
                    </div>
                )}
                <div
                    onClick={() => {
                        setIsOpenModal(WALLET_IS_OPEN_MODAL_KEY, true);
                    }}
                    className={clsx(
                        'flex h-12 w-44 cursor-pointer select-none items-center justify-center gap-4 rounded-2xl font-bold transition-all duration-200 ease-in-out sm:w-48',
                        'bg-gradient-to-r from-sky-600 from-50% to-sky-400',
                        'transition-all duration-200 hover:shadow-full-sky-md-500'
                    )}
                >
                    {image && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-space-300">
                            <div className="relative flex aspect-square h-8 w-8 rounded-xl">
                                <Image
                                    src={image}
                                    className="select-none rounded-3xl object-contain"
                                    fill={true}
                                    sizes="25wv"
                                    alt={'Wallet Image'}
                                    priority={true}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex">
                        <SelectButton
                            connectedString={truncatedAddress ?? 'Connected'}
                            unconnectedString="Select Wallet"
                            isConnected={isConnected}
                            isLoadingConnected={isLoadingConnected}
                            isFetchingConnected={isFetchingConnected}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const SelectButton = ({ connectedString, unconnectedString, isConnected }: any) => {
    if (isConnected) {
        return <div className="text-white">{connectedString}</div>;
    }

    return <div className="text-white">{unconnectedString}</div>;
};
