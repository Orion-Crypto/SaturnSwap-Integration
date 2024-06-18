import { SaturnSwapError } from '@/types/Classes/SaturnSwapError';

export interface TransactionResult {
    transactionIds?: string[];
    error?: SaturnSwapError;
}
