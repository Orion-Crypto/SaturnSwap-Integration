import { CreateSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionInputDTO';
import { CreateSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionPayloadDTO';

export const CreateSimpleTransactionAPI = async (input: CreateSimpleTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/simple/create-order-transaction`;

    const body = JSON.stringify(input);
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: CreateSimpleTransactionPayloadDTO = await response.json();
    return data;
};
