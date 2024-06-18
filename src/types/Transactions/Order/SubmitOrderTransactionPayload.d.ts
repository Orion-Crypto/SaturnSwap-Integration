import { SaturnSwapError } from '@/types/Classes/SaturnSwapError';

export interface SubmitOrderTransactionPayload {
    transactionIds?: string[];
    error?: SaturnSwapError;
}
