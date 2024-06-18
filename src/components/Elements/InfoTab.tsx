import { ProgressBar } from '@/components/Elements/ProgressBar';
import { setInfoTab, useGetInfoTab } from '@/hooks/Component/info-tab.hook';
import { CardanoNetwork } from '@/types/Enums/Blockchain/Network';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { getNetwork } from '@/utils/cardano/network';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

enum InfoTabState {
    Entering = 0,
    Exiting = 1,
    Inside = 2,
    Outside = 3,
}

export const InfoTab = () => {
    const { data, isLoading }: any = useGetInfoTab();
    const [countdown, setCountdown] = useState(100);
    const [infoTabState, setInfoTabState] = useState(InfoTabState.Outside);
    const showInfoTab = !isLoading && data && Object.keys(data).length > 0;

    const closeNotification = () => {
        setInfoTabState(InfoTabState.Exiting);
        setTimeout(() => {
            setCountdown(100);
            setInfoTabState(InfoTabState.Outside);
            setInfoTab({});
        }, 1000);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (infoTabState === InfoTabState.Inside) {
                setCountdown((countdown) => countdown - 0.15);
            }
        }, 10);
        return () => clearInterval(intervalId);
    }, [infoTabState]);

    // Use a setTimeout to start the progress bar interval after the enter animation plays
    useEffect(() => {
        setInfoTabState(() => InfoTabState.Entering);
        const timeoutId = setTimeout(() => {
            setInfoTabState(InfoTabState.Inside);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (countdown <= 0) {
            closeNotification();
        }
    }, [countdown]);

    if (!showInfoTab) return <></>;
    const { infoType, data: infoTabData } = data;
    const { link, buttonText, showExplorerButton } = getExplorerButtonData(infoTabData);

    let bgColor = 'bg-emerald-800 border-emerald-500';
    let progressBGColor = 'bg-emerald-500';
    let buttonBGColor =
        'select-none bg-emerald-500 hover:bg-emerald-500 border-2 border-emerald-700 active:bg-emerald-500 shadow-emerald-md-700 active:shadow-emerald-sm-700 active:translate-x-0.5 active:translate-y-0.5';
    let infoTabIcon = '/images/blobs/008-Glob-Reverse.png';
    if (infoType === InfoTabType.Success) {
        bgColor = 'bg-emerald-800 border-emerald-500';
        progressBGColor = 'bg-emerald-500';
        buttonBGColor =
            'select-none bg-emerald-500 hover:bg-emerald-500 border-2 border-emerald-700 active:bg-emerald-500 shadow-emerald-md-700 active:shadow-emerald-sm-700 active:translate-x-0.5 active:translate-y-0.5';
        infoTabIcon = '/images/blobs/008-Glob-Reverse.png';
    } else if (infoType === InfoTabType.Warning) {
        bgColor = 'bg-yellow-600';
        progressBGColor = 'bg-yellow-400';
        buttonBGColor =
            'select-none bg-yellow-400 hover:bg-yellow-400 border-2 border-yellow-500 active:bg-yellow-400 shadow-yellow-md-400 active:shadow-yellow-sm-400 active:translate-x-0.5 active:translate-y-0.5';
        infoTabIcon = '/images/blobs/007-Yolg-Reverse.png';
    } else if (infoType === InfoTabType.Error) {
        bgColor = 'bg-red-900 border-red-500';
        progressBGColor = 'bg-red-500';
        buttonBGColor =
            'select-none bg-red-500 hover:bg-red-500 border-2 border-red-700 active:bg-red-500 shadow-red-md-500 active:shadow-red-sm active:translate-x-0.5 active:translate-y-0.5';
        infoTabIcon = '/images/blobs/005-Rooboo-Reverse.png';
    } else if (infoType === InfoTabType.Info) {
        bgColor = 'bg-blue-900 border-blue-500';
        progressBGColor = 'bg-blue-500';
        buttonBGColor =
            'select-none bg-blue-500 hover:bg-blue-500 border-2 border-blue-700 active:bg-blue-500 shadow-blue-md-700 active:shadow-blue-sm-700 active:translate-x-0.5 active:translate-y-0.5';
        infoTabIcon = '/images/blobs/001-Bob-Reverse.png';
    }
    return (
        <div className="flex w-full justify-end">
            <div
                className={clsx(
                    'fixed z-90 m-4 mt-4 flex w-80 flex-col justify-start overflow-hidden rounded-xl drop-shadow-black-sharp',
                    bgColor,
                    infoTabState === InfoTabState.Entering ? 'mx-4 animate-enter-right' : '',
                    infoTabState === InfoTabState.Exiting ? '-mx-80 animate-exit-right' : '',
                    infoTabState === InfoTabState.Inside ? 'mx-4' : '',
                    infoTabState === InfoTabState.Outside ? '-mx-80' : ''
                )}
            >
                <div className="flex w-full p-4">
                    <div className="flex w-full flex-col justify-start gap-4 rounded-xl text-sm text-white">
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="z-10 flex flex-none items-center justify-center">
                                <Image src={infoTabIcon} width={50} height={50} alt={'BlobImage'} priority={true} />
                            </div>
                            <div className="flex items-center justify-start text-sm font-bold">
                                <div>{infoTabData?.message}</div>
                            </div>
                        </div>
                        <div className={clsx('flex w-full items-end justify-center gap-4')}>
                            {showExplorerButton && (
                                <Link href={link} target="_blank">
                                    <div
                                        className={clsx(
                                            'flex w-36 cursor-pointer items-center justify-center rounded-xl py-3 font-bold transition-all duration-100',
                                            buttonBGColor
                                        )}
                                    >
                                        {buttonText}
                                    </div>
                                </Link>
                            )}
                            <div
                                className={clsx(
                                    'flex w-36 cursor-pointer items-center justify-center rounded-xl py-3 font-bold transition-all duration-100',
                                    buttonBGColor
                                )}
                                onClick={closeNotification}
                            >
                                Close
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-2 w-full">
                    <ProgressBar bgcolor={progressBGColor} countdown={countdown} maxCountdown={100} />
                </div>
            </div>
        </div>
    );
};

const getExplorerButtonData = (infoTabData: any) => {
    let link = '';
    let buttonText = 'View in explorer';
    let showExplorerButton = false;

    const network = getNetwork();
    let url = 'cardanoscan.io';
    if (network === CardanoNetwork.Preprod) {
        url = 'preprod.cardanoscan.io';
    }

    if (infoTabData?.address) {
        link = `https://${url}/address/${infoTabData.address}`;
        buttonText = 'View address';
        showExplorerButton = true;
    } else if (infoTabData?.transaction) {
        link = `https://${url}/transaction/${infoTabData.transaction}`;
        buttonText = 'View Transaction';
        showExplorerButton = true;
    } else if (infoTabData?.link) {
        link = infoTabData?.link;
        buttonText = 'View Info';
        showExplorerButton = true;
    }

    return { link, buttonText, showExplorerButton };
};
