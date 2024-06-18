import { getConnectedWallet, setConnectedWallet } from '@/hooks/Cardano/wallet.hooks';
import { setNotification } from '@/hooks/Component/notification.hook';
import { Wallet } from '@/types/Classes/wallet';
import { CardanoNetwork } from '@/types/Enums/Blockchain/Network';
import { CardanoWalletType } from '@/types/Enums/Blockchain/Wallets';
import { NotificationType } from '@/types/Enums/NotificationType';
import { Lucid } from 'lucid-cardano';

class CardanoWallet {
    static lucid: Lucid | undefined;

    //---------------------------------------------------------------------------//
    // Wallet functions
    //---------------------------------------------------------------------------//
    static async connect(wallet: CardanoWalletType) {
        try {
            const cardano: any = window.cardano;
            if (!cardano) {
                const error = 'Error: window.cardano is null or undefined. You must have a Cardano Wallet Extension (such as Nami) to connect.';
                console.error(error);
                setNotification({
                    notificationType: NotificationType.Error,
                    data: {
                        message: error,
                    },
                });
                return false;
            }

            if (wallet === CardanoWalletType.None) {
                const error = 'Error: Cardano Wallet not selected.';
                console.error(error);
                setNotification({
                    notificationType: NotificationType.Error,
                    data: {
                        message: error,
                    },
                });
                return false;
            }

            const walletSet = await this.setWallet(cardano, wallet);
            if (!walletSet) {
                const error = 'Error: Wallet not set.';
                console.error(error);
                setNotification({
                    notificationType: NotificationType.Error,
                    data: {
                        message: error,
                    },
                });
                return false;
            }

            const correctNetwork = this.isCorrectNetwork();
            if (!correctNetwork) {
                const error = 'Error: Incorrect Network.';
                console.error(error);
                setNotification({
                    notificationType: NotificationType.Error,
                    data: {
                        message: error,
                    },
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static disconnect() {
        const cardano: any = window.cardano;
        if (!cardano) return false;

        this.lucid = undefined;
        //removeJWTToken();
        setConnectedWallet(null);
    }

    static async signData(data: string) {
        try {
            if (!this.lucid) return null;

            const address = await this.lucid?.wallet?.address();
            const { fromText } = await import('lucid-cardano');
            const messageToSign = fromText(data);
            const signedMessage = await this.lucid?.wallet?.signMessage(address, messageToSign);
            return signedMessage;
        } catch (error) {
            console.error(error);
            throw new Error('Sign Data Error');
        }
    }

    static async isConnected() {
        const cardano: any = window.cardano;
        if (!cardano) return false;

        // If the lucid api exists, we are already connected
        if (this.lucid && this.isCorrectNetwork()) return true;

        // Attempt to connect on refresh
        const connectedWalletData: any = getConnectedWallet();
        const walletAPI = this.getWalletAPI(cardano, connectedWalletData?.walletType);
        const isEnabled = await walletAPI?.isEnabled();

        if (isEnabled) {
            await this.setWallet(cardano, connectedWalletData?.walletType);
        } else {
            this.lucid = undefined;
            return false;
        }

        const correctNetwork = this.isCorrectNetwork();
        if (!correctNetwork) {
            return false;
        }

        return true;
    }

    static async getNetworkId(api: any) {
        if (!api) return null;

        const networkId = await api.getNetworkId();
        return networkId;
    }

    static async setWallet(cardano: any, wallet: CardanoWalletType) {
        const api = await this.getWalletAPI(cardano, wallet).enable();
        if (!api) return false;

        const networkId = await this.getNetworkId(api);
        const network = networkId === 1 ? 'Mainnet' : 'Preprod';
        const { Lucid } = await import('lucid-cardano');

        this.lucid = await Lucid.new(undefined, network);
        this.lucid.selectWallet(api);
        const address = await this.lucid?.wallet.address();
        setConnectedWallet({ walletType: wallet, address } as Wallet);
        return true;
    }
    //---------------------------------------------------------------------------//

    //---------------------------------------------------------------------------//
    // Balance functions
    //---------------------------------------------------------------------------//
    static async getBalance(asset: string | null = null, decimals = 6) {
        const isConnected = await this.isConnected();
        if (!this.lucid || !isConnected) return null;

        let utxos = await CardanoWallet.lucid?.wallet.getUtxos();
        if (!utxos) return null;

        // Filter utxos that have the asset
        if (asset) {
            utxos = utxos.filter((utxo: any) => {
                return utxo.assets[asset] !== undefined;
            });
        }

        // Sort utxos by asset value and get the first 120
        utxos.sort((a: any, b: any) => {
            if (asset) {
                return Number(b.assets[asset]) - Number(a.assets[asset]);
            } else {
                return Number(b.assets.lovelace) - Number(a.assets.lovelace);
            }
        });

        //now we make it so utxos = only the first 120 of those sorted utxos
        utxos = utxos.slice(0, 120);

        let balance: any = 0;
        for (const utxo of utxos) {
            let utxoBalance: any = 0;
            if (asset) {
                utxoBalance = utxo.assets[asset];
            } else {
                utxoBalance = utxo.assets.lovelace;
            }

            if (!utxoBalance) continue;
            balance += Number(utxoBalance);
        }

        if (asset) {
            const power = Math.pow(10, decimals);
            balance = Math.floor(balance / power);
        } else {
            const power = Math.pow(10, decimals);

            // We may need to increase these values or make this linear scaling with the number of assets in a users wallet for locked ada
            const balanceAdjustment = 10 * power; // Subtract the minimum fee (10 ada per 1000 ada in wallet, min 10 ada balance adjustment)
            const balanceThreshold = 1000 * power;
            const maxAdjustmentAmount = Math.ceil(balance / balanceThreshold);

            balance -= balanceAdjustment * maxAdjustmentAmount;
            balance = Math.floor(balance / power);
        }

        if (balance < 0) balance = 0;
        return balance;
    }

    static async getAllAssetBalances() {
        const isConnected = await this.isConnected();
        if (!this.lucid || !isConnected) return null;

        const utxos = await CardanoWallet.lucid?.wallet.getUtxos();
        if (!utxos) return null;

        let balances: { [asset: string]: bigint } = {};

        // Loop through each utxo and each asset within that utxo
        for (const utxo of utxos) {
            const assets = utxo.assets;
            for (const asset in assets) {
                // Convert asset balance from string/BigInt (if API provides such) to BigInt for proper addition
                const assetAmount = BigInt(assets[asset]);

                if (asset in balances) {
                    balances[asset] += assetAmount;
                } else {
                    balances[asset] = assetAmount;
                }
            }
        }

        // Convert bigint to string if serialization or further processing is necessary
        const formattedBalances: { [asset: string]: string } = {};
        for (const asset in balances) {
            formattedBalances[asset] = balances[asset].toString();
        }

        return formattedBalances;
    }

    //---------------------------------------------------------------------------//

    //---------------------------------------------------------------------------//
    // Helper functions
    //---------------------------------------------------------------------------//
    static getWalletAPI(cardanoWindow: any, walletType: CardanoWalletType) {
        if (walletType === CardanoWalletType.None) {
            return null;
        } else if (walletType === CardanoWalletType.Nami) {
            return cardanoWindow.nami;
        } else if (walletType === CardanoWalletType.Eternl) {
            return cardanoWindow.eternl;
        } else if (walletType === CardanoWalletType.Lace) {
            return cardanoWindow.lace;
        } else if (walletType === CardanoWalletType.Flint) {
            return cardanoWindow.flint;
        } else if (walletType === CardanoWalletType.Gero) {
            return cardanoWindow.gerowallet;
        } else if (walletType === CardanoWalletType.Typhon) {
            return cardanoWindow.typhoncip30;
        } else if (walletType === CardanoWalletType.NuFi) {
            return cardanoWindow.nufi;
        } else if (walletType === CardanoWalletType.Vespr) {
            return cardanoWindow.vespr;
        } else if (walletType === CardanoWalletType.Begin) {
            return cardanoWindow.begin;
        } else if (walletType === CardanoWalletType.Yoroi) {
            return cardanoWindow.yoroi;
        }

        return null;
    }

    static isCorrectNetwork() {
        if (!this.lucid) return false;

        const networkString = process.env.NEXT_PUBLIC_CARDANO_NETWORK;
        const network = networkString === 'mainnet' ? CardanoNetwork.Mainnet : CardanoNetwork.Preprod;
        const networkId = this.lucid.network;

        if (
            (network === CardanoNetwork.Mainnet && networkId.toString() === 'Mainnet') ||
            (network === CardanoNetwork.Preprod && networkId.toString() === 'Preprod')
        ) {
            return true;
        }
        return false;
    }
    //---------------------------------------------------------------------------//
}

export default CardanoWallet;
