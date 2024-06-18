export enum CardanoWalletType {
    None = 'None',
    Nami = 'Nami',
    Eternl = 'Eternl',
    Flint = 'Flint',
    Gero = 'Gero',
    Typhon = 'Typhon',
    NuFi = 'Nufi',
    Lace = 'Lace',
    Vespr = 'Vespr',
    Begin = 'Begin',
    Yoroi = 'Yoroi',
}

export enum WalletType {
    None = 0,
    Fee = 1, // Wallet that is given fee payments
    Sign = 2, // Wallet that is used to sign transactions
    ContractFee = 3, // Wallet that is given fee payments for raw contract exectution
    User = 4, // A user's wallet
    FeePayment = 5, // A wallet used to pay for a fee for a liquidity transaction
    GovernanceClaim = 6, // A wallet used to hold all governance claims
    GovernanceClaimStandard = 7, // A wallet used to hold all standard governance claims for each round
    GovernanceClaimSpecial = 8, // A wallet used to hold all special governance claims for each round
}
