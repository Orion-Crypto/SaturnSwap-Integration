import { CreateAdvancedTransactionInputDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/CreateAdvancedTransactionInputDTO';
import { CreateAdvancedTransactionPayloadDTO } from '@/api/REST/Transaction/AdvancedAggregator/Data/CreateAdvancedTransactionPayloadDTO';

export const CreateAdvancedTransactionAPI = async (input: CreateAdvancedTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/advanced/create-order-transaction`;

    const body = JSON.stringify(input);
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: CreateAdvancedTransactionPayloadDTO = await response.json();
    return data;
};
