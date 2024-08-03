import { Spinner } from '@/components/Elements/Spinner';
import { ToolTipWrapper } from '@/components/Elements/Tooltips/ToolTipWrapper';
import {
    InputAutomaticAdaSwapInputs,
    InputAutomaticTokenSwapInputs,
} from '@/components/PageComponents/Swap/Utils/SwapUtils/AutomaticSwapUtilts';
import { formatCommaValue } from '@/utils/number';
import clsx from 'clsx';

export const BalanceOneSection = ({
    swapType,
    orderType,
    tokenProjectOne,
    tokenProjectTwo,
    flattenedBuyPoolUtxos,
    flattenedSellPoolUtxos,
    marketPrice,
    isBuy,
    tokenSellPreviouslyUpdated,
    tokenBuyPreviouslyUpdated,
    balanceTokenProjectOne,
    balanceTokenProjectTwo,
    address,
    isLoadingBalanceTokenProjectOne,
    isTokenSelected,
    isNike = false,
    isParty = false,
}: any) => {
    let balanceString = '';
    if (!!balanceTokenProjectOne) {
        balanceString = formatCommaValue(balanceTokenProjectOne);
    }
    return (
        <>
            <div className="flex h-6 flex-none items-center gap-2">
                {!!address && isTokenSelected && (
                    <ToolTipWrapper
                        id={`balance-one`}
                        place={'top'}
                        tip={
                            <div className="z-50 flex flex-col items-center justify-center gap-4">
                                <div>{'Shows an approximate tradable amount of ₳ in your wallet.'}</div>
                                <div>{'This may display less ₳ then what the wallet shows due to ₳ locked in min UTXOs.'}</div>
                            </div>
                        }
                        isNike={isNike}
                    >
                        <div className="flex items-center justify-center gap-1 text-2xs">
                            <div className="text-zinc-300">Balance:</div>
                            {isLoadingBalanceTokenProjectOne ? (
                                <div className="mt-0.5">
                                    <Spinner width="w-3" height="h-3" />
                                </div>
                            ) : (
                                <div className="text-zinc-300">~{balanceString}</div>
                            )}
                        </div>
                    </ToolTipWrapper>
                )}
                {!!address && isBuy && isTokenSelected && (
                    <div
                        className={clsx(
                            'flex cursor-pointer items-center justify-center rounded-lg p-1 font-bold',
                            'border  transition-all duration-300',
                            isParty
                                ? ' border-nike-party-orange-600/60 bg-nike-orange-700/60 hover:bg-nike-party-orange-800/40'
                                : isNike
                                  ? 'border-nike-orange-500/60 bg-nike-orange-900 hover:bg-nike-orange-800'
                                  : 'border-sky-600/60 bg-space-400 hover:bg-sky-900'
                        )}
                        onClick={() =>
                            InputAutomaticAdaSwapInputs(
                                swapType,
                                orderType,
                                tokenProjectOne,
                                tokenProjectTwo,
                                flattenedBuyPoolUtxos,
                                flattenedSellPoolUtxos,
                                marketPrice,
                                isBuy ? true : false,
                                isBuy ? false : true,
                                tokenSellPreviouslyUpdated,
                                tokenBuyPreviouslyUpdated,
                                balanceTokenProjectOne,
                                balanceTokenProjectTwo,
                                address
                            )
                        }
                    >
                        <div className="text-xs text-zinc-300">Max</div>
                    </div>
                )}
            </div>
        </>
    );
};

export const BalanceTwoSection = ({
    swapType,
    orderType,
    tokenProjectOne,
    tokenProjectTwo,
    flattenedBuyPoolUtxos,
    flattenedSellPoolUtxos,
    marketPrice,
    isBuy,
    tokenSellPreviouslyUpdated,
    tokenBuyPreviouslyUpdated,
    showBalanceTokenProjectOne,
    showBalanceTokenProjectTwo,
    spendBalanceTokenProjectOne,
    spendBalanceTokenProjectTwo,
    address,
    isLoadingBalanceTokenProjectTwo,
    isTokenSelected,
    isNike = false,
    isParty = false,
}: any) => {
    let balance = 0;
    let balanceString = '';
    let balanceText = 'Balance:';
    if (isBuy) {
        if (!!showBalanceTokenProjectTwo) {
            balance = showBalanceTokenProjectTwo;
            balanceString = formatCommaValue(showBalanceTokenProjectTwo);
        }
    } else {
        if (!!spendBalanceTokenProjectTwo) {
            balance = spendBalanceTokenProjectTwo;
            balanceString = formatCommaValue(spendBalanceTokenProjectTwo);
        }
        balanceText = 'Spendable:';
    }

    return (
        <>
            <div className="flex h-6 flex-none items-center gap-2">
                {!!address && isTokenSelected && (
                    <ToolTipWrapper
                        id={`balance-two`}
                        place={'top'}
                        tip={
                            <div className="z-50 flex flex-col items-center justify-center gap-4">
                                <div>{'Shows an approximate tradable amount of token in your wallet.'}</div>
                                <div>
                                    {
                                        'This may display less spendable tokens then what your wallet shows to enable smoother transaction building.'
                                    }
                                </div>
                            </div>
                        }
                        isNike={isNike}
                    >
                        <div className="flex items-center justify-center gap-1 text-2xs">
                            <div className="text-zinc-300">{balanceText}</div>
                            {isLoadingBalanceTokenProjectTwo ? (
                                <div className="mt-1">
                                    <Spinner width="w-3" height="h-3" />
                                </div>
                            ) : (
                                <div className="text-zinc-300">~{balanceString}</div>
                            )}
                        </div>
                    </ToolTipWrapper>
                )}
                {!!address && !isBuy && isTokenSelected && (
                    <div
                        className={clsx(
                            'flex cursor-pointer items-center justify-center rounded-lg p-1 font-bold',
                            'border transition-all duration-300',
                            isParty
                                ? ' border-nike-party-orange-600/60 bg-nike-orange-700/60 hover:bg-nike-party-orange-800/40'
                                : isNike
                                  ? 'border-nike-orange-500/60 bg-nike-orange-900 hover:bg-nike-orange-800'
                                  : 'border-sky-600/60 bg-space-400 hover:bg-sky-900'
                        )}
                        onClick={() =>
                            InputAutomaticTokenSwapInputs(
                                swapType,
                                orderType,
                                tokenProjectOne,
                                tokenProjectTwo,
                                flattenedBuyPoolUtxos,
                                flattenedSellPoolUtxos,
                                marketPrice,
                                isBuy ? false : true, //tokenSellUpdated
                                isBuy ? true : false, //tokenBuyUpdated
                                tokenSellPreviouslyUpdated,
                                tokenBuyPreviouslyUpdated,
                                showBalanceTokenProjectOne,
                                balance,
                                address
                            )
                        }
                    >
                        <div className="text-xs text-zinc-300">Max</div>
                    </div>
                )}
            </div>
        </>
    );
};
