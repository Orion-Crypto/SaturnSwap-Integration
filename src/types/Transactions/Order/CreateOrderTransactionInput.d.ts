export interface CreateOrderTransactionInput {
    paymentAddress: string;

    // Separate component lists for transaction types
    limitOrderComponents?: LimitOrderComponent[];
    marketOrderComponents?: MarketOrderComponent[];
    cancelComponents?: CancelComponent[];
}

export interface LimitOrderComponent {
    poolId: string;
    tokenAmountA: number;
    tokenAmountB: number;
    limitOrderType: string;

    // Version Data
    version: number;
}

export interface MarketOrderComponent {
    poolId: string;
    tokenAmountA: number;
    marketOrderType: string;

    // Version Data
    version: number;
}

export interface CancelComponent {
    poolUtxoId: string;

    // Version Data
    version: number;
}
