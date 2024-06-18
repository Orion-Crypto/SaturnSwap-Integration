import { CloseButton } from '@/components/Elements/Buttons/CloseButton';
import { setSignatureCount } from '@/hooks/Models/transaction.hook';
import clsx from 'clsx';
import { useState } from 'react';

export const SignModal = ({ signerCount }: { signerCount: number }) => {
    const [isExiting, setIsExiting] = useState(false);
    const closeModal = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            setSignatureCount(null);
        }, 450);
    };
    return (
        <>
            <div
                className={clsx(
                    'fixed bottom-24 z-90 flex w-full animate-fade-in justify-center',
                    isExiting ? 'animate-fade-out' : 'animate-fade-in'
                )}
            >
                <div className="relative h-24 w-144">
                    <div className="absolute -right-4 -top-4">
                        <CloseButton onClick={closeModal} />
                    </div>
                    <div className="flex h-24 w-144 items-center justify-center rounded-3xl border-2 border-sky-800 bg-space-950 p-6 text-lg font-semibold text-white shadow-sky-md-800">
                        <div>{signerCount} Signatures required to complete transactions.</div>
                    </div>
                </div>
            </div>
        </>
    );
};
