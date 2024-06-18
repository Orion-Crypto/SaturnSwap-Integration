import { CloseButton } from '@/components/Elements/Buttons/CloseButton';
import { ModalBackground, closeModal } from '@/components/Elements/Modals/ModalBackground';
import { Spinner } from '@/components/Elements/Spinner';
import { resetSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils';
import { useGetConnectedWallet, useIsConnected } from '@/hooks/Cardano/wallet.hooks';
import { WALLET_IS_OPEN_MODAL_KEY, setIsOpenModal, setModalData, useGetIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { WALLET_BALANCE_KEY } from '@/hooks/Models/wallet.hook';
import { queryClient } from '@/hooks/default';
import { CardanoWalletType } from '@/types/Enums/Wallet';
import CardanoWallet from '@/utils/cardano/wallet';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const WalletModal = () => {
    const { refetch } = useGetIsOpenModal(WALLET_IS_OPEN_MODAL_KEY);
    const close = () => {
        setIsOpenModal(WALLET_IS_OPEN_MODAL_KEY, false);
        setModalData({});
        refetch();
    };
    return (
        <>
            <ModalBackground onClick={close}>
                <div className="z-90 flex h-full w-full items-center justify-center">
                    <div
                        className={clsx(
                            'shadow-gray-lg flex flex-col items-center gap-6 rounded-3xl border-2 border-sky-500 bg-space-800',
                            'w-80 p-4 md:w-128 md:p-6'
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
    const { refetch } = useIsConnected();
    const { data: connectedWallet }: any = useGetConnectedWallet();

    const walletKeys = Object.keys(Wallets);
    return (
        <>
            <div className="absolute -right-4 -top-4">
                <CloseButton onClick={() => closeModal(close)} />
            </div>
            <div className="scrollbar-sky-500 flex h-128 w-full flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
                <div className="flex flex-col items-center gap-4 text-3xl font-bold text-white">Select Wallet</div>
                <div className="flex w-full flex-col gap-4">
                    {walletKeys.map((walletKey: any, i: any) => {
                        const wallet: any = Wallets[walletKey];
                        const isConnected = connectedWallet?.walletType === wallet.walletType;
                        return <WalletTab key={i} wallet={wallet} isConnected={isConnected} refetch={refetch} close={close} />;
                    })}
                </div>
            </div>
        </>
    );
};

export const WalletTab = ({ wallet, isConnected, refetch, close }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            <div className="flex w-full rounded-2xl bg-neutral-500/20 p-3 shadow-neutral-lg-400 ">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-500/40">
                    <div className="relative flex aspect-square h-16 w-16 rounded-xl">
                        <Image
                            src={wallet.image}
                            className="select-none rounded-3xl object-contain"
                            fill={true}
                            sizes="25wv"
                            alt={'Wallet Image'}
                            priority={true}
                        />
                    </div>
                </div>
                <div className="mx-3 flex items-center text-xl font-bold text-white">{wallet.name}</div>
                <div className="grow"></div>
                {isConnected ? (
                    <div className="flex w-32 items-center justify-end">
                        <div
                            onClick={async () => {
                                await disconnect(setIsLoading, refetch);
                            }}
                            className={clsx(
                                'flex h-10 w-20 cursor-pointer select-none items-center justify-center rounded-full border text-sm font-bold transition-all duration-100 md:w-32 md:text-base',
                                'border-2 border-sky-300 bg-sky-600 text-black shadow-sky-md-300 transition-all duration-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-sky-sm-300'
                            )}
                        >
                            {isLoading ? <Spinner /> : 'Disconnect'}
                        </div>
                    </div>
                ) : (
                    <div className="flex w-32 items-center justify-end">
                        <div
                            onClick={async () => {
                                await connect(wallet.walletType, setIsLoading, refetch);
                                closeModal(close);
                            }}
                            className={clsx(
                                'flex h-10 w-20 cursor-pointer select-none items-center justify-center rounded-full border text-sm font-bold transition-all duration-100 md:w-32 md:text-base',
                                'border-sky-300 bg-space-800 text-sky-300 shadow-sky-md-300 transition-all duration-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-sky-sm-300'
                            )}
                        >
                            {isLoading ? <Spinner /> : 'Connect'}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const Wallets: any = {
    Nami: { name: 'Nami', image: '/images/wallets/Nami.png', walletType: CardanoWalletType.Nami },
    Eternl: { name: 'Eternl', image: '/images/wallets/Eternl.png', walletType: CardanoWalletType.Eternl },
    Lace: { name: 'Lace', image: '/images/wallets/Lace.png', walletType: CardanoWalletType.Lace },
    Flint: { name: 'Flint', image: '/images/wallets/Flint.png', walletType: CardanoWalletType.Flint },
    Gero: { name: 'Gero', image: '/images/wallets/Gero.png', walletType: CardanoWalletType.Gero },
    Typhon: { name: 'Typhon', image: '/images/wallets/Typhon.png', walletType: CardanoWalletType.Typhon },
    Nufi: { name: 'Nufi', image: '/images/wallets/NuFi.png', walletType: CardanoWalletType.NuFi },
    Vespr: { name: 'Vespr', image: '/images/wallets/Vespr.png', walletType: CardanoWalletType.Vespr },
    Begin: { name: 'Begin', image: '/images/wallets/Begin.png', walletType: CardanoWalletType.Begin },
    Yoroi: { name: 'Yoroi', image: '/images/wallets/Yoroi.png', walletType: CardanoWalletType.Yoroi },
};

const connect = async (walletType: CardanoWalletType, setIsLoading: any, refetch: any) => {
    setIsLoading(true);
    await CardanoWallet.connect(walletType);
    refetch();
    queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY(null) });
    resetSwapInputs();
    setIsLoading(false);
};

const disconnect = async (setIsLoading: any, refetch: any) => {
    setIsLoading(true);
    CardanoWallet.disconnect();
    refetch();
    queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY(null) });
    resetSwapInputs();
    setIsLoading(false);
};
