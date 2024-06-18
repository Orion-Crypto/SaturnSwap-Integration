import { PoolSelectModal } from '@/components/Elements/Modals/SwapModals/PoolSelectModal';
import { TokenSelectModal } from '@/components/Elements/Modals/SwapModals/TokenSelectModal';
import { SignModal } from '@/components/Elements/Modals/TransactionModals/SignModal';
import { WalletModal } from '@/components/Elements/Modals/WalletModals/WalletModal';
import {
    POOL_SELECT_IS_OPEN_MODAL_KEY,
    TOKEN_SELECT_IS_OPEN_MODAL_KEY,
    WALLET_IS_OPEN_MODAL_KEY,
    useGetIsOpenModal,
} from '@/hooks/Modals/general-modal.hook';
import { useGetSignatureCount } from '@/hooks/Models/transaction.hook';

export const ModalContainer = () => {
    const { data: isOpenWalletModal } = useGetIsOpenModal(WALLET_IS_OPEN_MODAL_KEY);
    const { data: isOpenTokenSelectModal } = useGetIsOpenModal(TOKEN_SELECT_IS_OPEN_MODAL_KEY);
    const { data: isOpenPoolSelectModal } = useGetIsOpenModal(POOL_SELECT_IS_OPEN_MODAL_KEY);
    const { data: signerCount }: any = useGetSignatureCount();

    return (
        <>
            {isOpenWalletModal && <WalletModal />}
            {isOpenTokenSelectModal && <TokenSelectModal />}
            {isOpenPoolSelectModal && <PoolSelectModal />}
            {signerCount && <SignModal signerCount={signerCount} />}
        </>
    );
};
