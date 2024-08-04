import { SaturnSwapError } from '@/types/Classes/SaturnSwapError';

export interface SubmitAdvancedTransactionPayloadDTO {
    transactionIds?: string[];
    error?: SaturnSwapError;
}
