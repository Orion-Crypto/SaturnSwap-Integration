import { setInfoTab } from '@/hooks/Component/info-tab.hook';
import { ORDER_BOOK_POOL_UTXO_KEY } from '@/hooks/Models/poolUtxo.hook';
import { queryClient } from '@/hooks/default';
import { InfoTabType } from '@/types/Enums/InfoTabType';
import { TransactionResult } from '@/types/Transactions/TransactionResult';
import CardanoWallet from '@/utils/cardano/wallet';

export const TransactionInfoTab = (result: TransactionResult) => {
    if (result.transactionIds && result.transactionIds.length > 0 && !result.error) {
        queryClient.invalidateQueries({ queryKey: [ORDER_BOOK_POOL_UTXO_KEY] });
        setInfoTab({
            infoType: InfoTabType.Success,
            data: {
                message: 'Transaction Success! The transaction will appear on chain momentarily.',
                transaction: result.transactionIds[0],
            },
        });
    } else if (result.error?.message === 'Already Cancelled') {
        setInfoTab({
            infoType: InfoTabType.Success,
            data: {
                message: 'Already Cancelled, No action required. The transaction will appear on chain momentarily.',
            },
        });
    } else if (result.error?.code === 'Slippage') {
        setInfoTab({
            infoType: InfoTabType.Info,
            data: {
                message: result.error.message ?? 'Order out of slippage range. Please try again or increase slippage range in settings.',
            },
        });
    } else {
        if (!!result?.error?.code) {
            console.error(result.error);
            return;
        }

        setInfoTab({
            infoType: InfoTabType.Error,
            data: {
                message: result.error?.message ?? 'Transaction Failed! Please reach out for help in the Saturn Swap Discord.',
                link: result.error?.link,
            },
        });
    }
};

// We need this function because Lucid reorders the witnesses incorrectly (this occurs with Levvy Trait Lending but can occur on Saturn Swap as well)
export const SignTransactionKeepingWitnessOrder = async (hexTransaction: any) => {
    const { C, toHex } = await import('lucid-cardano');

    // Reconstruct and sign tx
    const reconstructedTx: any = CardanoWallet.lucid?.fromTx(hexTransaction);
    let transactionWitnessSet: any = reconstructedTx?.txComplete.witness_set();

    let priorKeys = null;
    if (!transactionWitnessSet) {
        transactionWitnessSet = C.TransactionWitnessSet.new();
    } else {
        priorKeys = transactionWitnessSet.vkeys();
    }
    const signature: any = await CardanoWallet.lucid?.wallet.signTx(reconstructedTx.txComplete);

    const currentKeys = signature.vkeys();
    const priorKeysLength = priorKeys?.len() || 0;
    for (let i = 0; i < priorKeysLength; i++) {
        currentKeys.add(priorKeys.get(i));
    }
    transactionWitnessSet.set_vkeys(currentKeys);

    const signedTx = C.Transaction.new(reconstructedTx.txComplete.body(), transactionWitnessSet, reconstructedTx.txComplete.auxiliary_data());
    const signedBytes = signedTx.to_bytes();
    const signedHex = toHex(signedBytes);
    return signedHex;
};
