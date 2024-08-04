import { SaturnSwapError } from '@/types/Classes/SaturnSwapError';
import { FailTransaction } from '@/types/Transactions/FailTransaction';
import { SuccessTransaction } from '@/types/Transactions/SuccessTransaction';

export interface CreateAdvancedTransactionPayloadDTO {
    successTransactions?: SuccessTransaction[];
    failTransactions?: FailTransaction[];
    error?: SaturnSwapError;
}
