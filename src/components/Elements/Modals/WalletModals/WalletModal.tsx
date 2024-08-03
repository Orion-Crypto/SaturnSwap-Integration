import { CloseButton } from '@/components/Elements/Buttons/CloseButton';
import { ModalBackground, closeModal } from '@/components/Elements/Modals/ModalBackground';
import { Spinner } from '@/components/Elements/Spinner';
import { ResetSwapInputs } from '@/components/PageComponents/Swap/Utils/SwapUtils/AutomaticSwapUtilts';
import { WALLET_BALANCE_KEY, useGetConnectedWallet, useIsConnected } from '@/hooks/Cardano/wallet.hooks';
import { setIsHardwareWallet, useGetIsHardwareWallet } from '@/hooks/Component/hardware-wallet.hook';
import { WALLET_IS_OPEN_MODAL_KEY, setIsOpenModal, setModalData, useGetIsOpenModal } from '@/hooks/Modals/general-modal.hook';
import { queryClient } from '@/hooks/default';
import { CardanoWalletType } from '@/types/Enums/Wallet';
import CardanoWallet from '@/utils/cardano/wallet';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export const WalletModal = ({ isNike }: any) => {
    const { refetch } = useGetIsOpenModal(WALLET_IS_OPEN_MODAL_KEY);
    const close = () => {
        setIsOpenModal(WALLET_IS_OPEN_MODAL_KEY, false);
        setModalData({});
        refetch();
    };

    const { data: isHardwareWallet }: any = useGetIsHardwareWallet();
    return (
        <>
            <ModalBackground onClick={close}>
                <div className="z-90 flex h-full w-full flex-col items-center justify-center">
                    <div
                        className={clsx(
                            'flex flex-col items-center gap-6 rounded-3xl border-2 ',
                            'w-80 p-4 md:w-128 md:p-6',
                            isNike ? 'border-nike-orange-500 bg-nike-orange-900' : 'border-sky-500 bg-space-800'
                        )}
                    >
                        <MainModal close={close} isNike={isNike} />
                    </div>
                    <div
                        className={clsx(
                            'mt-8 flex flex-col items-center gap-6 rounded-3xl border-2 p-4 ',
                            'w-80 md:w-128',
                            isNike ? 'border-nike-orange-500 bg-nike-orange-900' : 'border-sky-500 bg-space-800'
                        )}
                    >
                        <div className="flex items-center justify-start gap-2">
                            <input
                                id="is_hardware_wallet"
                                name="is_hardware_wallet"
                                type="checkbox"
                                className={clsx(
                                    'flex h-8 w-8 cursor-pointer items-center justify-start rounded-lg border-0 px-2 font-bold',
                                    'focus:ring-2',
                                    isNike ? 'bg-nike-orange-600 focus:ring-nike-orange-500' : 'bg-sky-600 focus:ring-sky-400'
                                )}
                                onChange={(event: any) => {
                                    setIsHardwareWallet(event.target.checked);
                                }}
                                defaultChecked={isHardwareWallet}
                            />
                            <div className="font-bold text-white">Is Hardware Wallet</div>
                        </div>
                    </div>
                </div>
            </ModalBackground>
        </>
    );
};

const MainModal = ({ close, isNike }: any) => {
    const { refetch } = useIsConnected();
    const { data: connectedWallet }: any = useGetConnectedWallet();

    const walletKeys = Object.keys(Wallets);
    return (
        <>
            <div className="absolute -right-4 -top-4">
                <CloseButton onClick={() => closeModal(close)} isNike={isNike} />
            </div>
            <div
                className={clsx(
                    'flex h-128 w-full flex-col gap-6 overflow-y-auto overflow-x-hidden p-2',
                    isNike ? 'scrollbar-nike-orange-500-md' : 'scrollbar-sky-500'
                )}
            >
                <div className="flex flex-col items-center gap-4 text-3xl font-bold text-white">Select Wallet</div>
                <div className="flex w-full flex-col gap-4">
                    {walletKeys.map((walletKey: any, i: any) => {
                        const wallet: any = Wallets[walletKey];
                        const isConnected = connectedWallet?.walletType === wallet.walletType;
                        return <WalletTab key={i} wallet={wallet} isConnected={isConnected} refetch={refetch} close={close} isNike={isNike} />;
                    })}
                </div>
            </div>
        </>
    );
};

export const WalletTab = ({ wallet, isConnected, refetch, close, isNike }: any) => {
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
                                'border-2  text-white transition-all duration-300 active:translate-x-0.5 active:translate-y-0.5',
                                isNike
                                    ? 'active:shadow-nike-orange-sm-300 border-nike-orange-500 bg-nike-orange-600 shadow-nike-orange-md-500'
                                    : 'border-sky-300 bg-sky-600 shadow-sky-md-300 active:shadow-sky-sm-300'
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
                                ' transition-all duration-300 active:translate-x-0.5 active:translate-y-0.5 ',
                                isNike
                                    ? 'active:shadow-nike-orange-sm-300 border-nike-orange-500 bg-nike-orange-900 text-nike-orange-500 shadow-nike-orange-md-500'
                                    : 'border-sky-300 bg-space-800 text-sky-300 shadow-sky-md-300 active:shadow-sky-sm-300'
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
    Vespr: { name: 'Vespr', image: '/images/wallets/Vespr.png', walletType: CardanoWalletType.Vespr },
    Nami: { name: 'Nami', image: '/images/wallets/Nami.png', walletType: CardanoWalletType.Nami },
    Eternl: { name: 'Eternl', image: '/images/wallets/Eternl.png', walletType: CardanoWalletType.Eternl },
    Lace: { name: 'Lace', image: '/images/wallets/Lace.png', walletType: CardanoWalletType.Lace },
    Flint: { name: 'Flint', image: '/images/wallets/Flint.png', walletType: CardanoWalletType.Flint },
    Gero: { name: 'Gero', image: '/images/wallets/Gero.png', walletType: CardanoWalletType.Gero },
    Typhon: { name: 'Typhon', image: '/images/wallets/Typhon.png', walletType: CardanoWalletType.Typhon },
    Nufi: { name: 'Nufi', image: '/images/wallets/NuFi.png', walletType: CardanoWalletType.NuFi },
    Begin: { name: 'Begin', image: '/images/wallets/Begin.png', walletType: CardanoWalletType.Begin },
    Yoroi: { name: 'Yoroi', image: '/images/wallets/Yoroi.png', walletType: CardanoWalletType.Yoroi },
};

const connect = async (walletType: CardanoWalletType, setIsLoading: any, refetch: any) => {
    setIsLoading(true);
    await CardanoWallet.connect(walletType);
    refetch();
    queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY(null) });
    ResetSwapInputs();
    setIsLoading(false);
};

const disconnect = async (setIsLoading: any, refetch: any) => {
    setIsLoading(true);
    CardanoWallet.disconnect();
    refetch();
    queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_KEY(null) });
    ResetSwapInputs();
    setIsLoading(false);
};
