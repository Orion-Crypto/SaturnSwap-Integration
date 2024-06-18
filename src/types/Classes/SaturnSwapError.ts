export interface SaturnSwapError {
    message?: string;
    code?: string;
    link?: string;
}

export const ConnectWalletError = { message: 'Please connect your wallet' } as SaturnSwapError;
export const InvalidInputError = {
    message: 'Invalid transaction input. Please reach out for help in the Saturn Swap Discord server',
    link: 'https://discord.com/invite/NvVNfQmPjp',
} as SaturnSwapError;

export const InvalidTransactionSignatureError = {
    message: 'Invalid transaction signature. Please reach out for help in the Saturn Swap Discord server',
    link: 'https://discord.com/invite/NvVNfQmPjp',
} as SaturnSwapError;
