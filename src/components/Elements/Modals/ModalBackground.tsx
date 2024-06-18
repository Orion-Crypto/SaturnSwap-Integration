import { setExitingModal, useGetExitingModal } from '@/hooks/Modals/general-modal.hook';
import clsx from 'clsx';

interface ModalBackgroundProps {
    children: any;
    onClick: () => void;
}
export const ModalBackground = ({ children, onClick }: ModalBackgroundProps) => {
    const { data: isExiting } = useGetExitingModal();

    return (
        <>
            <div
                onClick={() => closeModal(onClick)}
                className={clsx(
                    'fixed inset-0 z-90 h-full w-full cursor-pointer bg-black/60',
                    isExiting ? 'animate-fade-out' : 'animate-fade-in'
                )}
            ></div>
            <div
                className={clsx(
                    'fixed left-1/2 top-1/2 z-90 -translate-x-1/2 -translate-y-1/2 transform-gpu',
                    isExiting ? 'animate-fade-out' : 'animate-fade-in'
                )}
            >
                {children}
            </div>
        </>
    );
};

export const closeModal = (onClick: () => void) => {
    setExitingModal(true);
    setTimeout(() => {
        setExitingModal(false);
        onClick();
    }, 450);
};
