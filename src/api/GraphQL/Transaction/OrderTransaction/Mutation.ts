import { graphQLClient } from '@/api/Api';
import { CreateOrderTransactionInput } from '@/types/Transactions/Order/CreateOrderTransactionInput';
import { CreateOrderTransactionPayload } from '@/types/Transactions/Order/CreateOrderTransactionPayload';
import { SubmitOrderTransactionInput } from '@/types/Transactions/Order/SubmitOrderTransactionInput';
import { SubmitOrderTransactionPayload } from '@/types/Transactions/Order/SubmitOrderTransactionPayload';
import { gql } from 'graphql-request';

//---------------------------------------------------------------------------------------------------//
// Order Transaction GraphQL Functions
//---------------------------------------------------------------------------------------------------//
export const mutateCreateOrderTransaction = async (input: CreateOrderTransactionInput) => {
    const parameters = { input: input };

    const response: any = await graphQLClient.request(
        gql`
            mutation CreateOrderTransaction($input: CreateOrderTransactionInput!) {
                createOrderTransaction(input: $input) {
                    successTransactions {
                        transactionId
                        hexTransaction
                    }
                    error {
                        message
                        code
                        link
                    }
                }
            }
        `,
        parameters
    );

    const createOrderTransactionPayload: CreateOrderTransactionPayload = response?.createOrderTransaction || {};
    return createOrderTransactionPayload;
};

export const mutateSubmitOrderTransaction = async (input: SubmitOrderTransactionInput) => {
    const parameters = { input: input };
    const response: any = await graphQLClient.request(
        gql`
            mutation SubmitOrderTransaction($input: SubmitOrderTransactionInput!) {
                submitOrderTransaction(input: $input) {
                    transactionIds
                    error {
                        message
                        code
                        link
                    }
                }
            }
        `,
        parameters
    );

    const submitOrderTransactionPayload: SubmitOrderTransactionPayload = response?.submitOrderTransaction || {};
    return submitOrderTransactionPayload;
};
//---------------------------------------------------------------------------------------------------//
