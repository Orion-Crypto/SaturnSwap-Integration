import { SaturnSwapError } from '@/types/Classes/SaturnSwapError';

export interface SubmitSimpleTransactionPayloadDTO {
    transactionIds?: string[];
    error?: SaturnSwapError;
}
