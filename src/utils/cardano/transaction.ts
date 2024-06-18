import { CardanoNetwork } from '@/types/Enums/Blockchain/Network';
import { getNetwork } from '@/utils/cardano/network';

export const getTransactionUrl = (transactionId: string) => {
    const network = getNetwork();
    let url = 'cardanoscan.io';
    if (network === CardanoNetwork.Preprod) {
        url = 'preprod.cardanoscan.io';
    }

    const link = `https://${url}/transaction/${transactionId}`;
    return link;
};

export const getTransactionUrls = (transactionIds: string[]) => {
    const urls = transactionIds.map((transactionId) => getTransactionUrl(transactionId));
    return urls;
};
