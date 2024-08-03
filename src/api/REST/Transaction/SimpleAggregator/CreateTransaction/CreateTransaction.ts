import { CreateSimpleTransactionInputDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionInputDTO';
import { CreateSimpleTransactionPayloadDTO } from '@/api/REST/Transaction/SimpleAggregator/Data/CreateSimpleTransactionPayloadDTO';

export const CreateSimpleTransactionAPI = async (input: CreateSimpleTransactionInputDTO) => {
    const baseURL = process.env.NEXT_PUBLIC_REST_API_URL as string;
    const url = `${baseURL}v1/aggregator/simple/create-order-transaction`;

    console.log('input', input);
    console.log('body', JSON.stringify(input));
    const body = JSON.stringify(input);
    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response);

    const data: CreateSimpleTransactionPayloadDTO = await response.json();
    console.log(data);
    return data;
};
