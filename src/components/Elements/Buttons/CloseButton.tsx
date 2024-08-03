import { Spinner } from '@/components/Elements/Spinner';
import clsx from 'clsx';

interface CloseButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    style?: string;
    isNike?: boolean;
    isParty?: boolean;
}
export const CloseButton = ({ onClick, isLoading, style = 'border-sky-400', isNike = false, isParty = false }: CloseButtonProps) => {
    if (isNike && !isParty) {
        style = 'border-nike-orange-500';
    }
    if (isParty) {
        style = 'border-nike-party-orange-600';
    }
    return (
        <>
            <div className="relative">
                <div
                    onClick={() => {
                        onClick();
                    }}
                    className={clsx(
                        'absolute right-1 top-1 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all duration-100',
                        ' active:translate-x-0.5 active:translate-y-0.5 ',
                        isParty
                            ? 'border-nike-party-orange-600 bg-nike-orange-700 text-nike-party-orange-500 shadow-nike-orange-md-500 active:shadow-nike-orange-sm-500'
                            : isNike
                              ? 'border-nike-orange-500 bg-nike-orange-900 text-nike-orange-500 shadow-nike-orange-md-500 active:shadow-nike-orange-sm-500'
                              : 'bg-space-900 shadow-sky-md-800 hover:bg-space-300 active:shadow-sky-sm-800',
                        style
                    )}
                >
                    {isLoading ? <Spinner /> : <CloseIcon isNike={isNike} />}
                </div>
            </div>
        </>
    );
};

export const CloseIcon = ({ isNike = false }: any) => {
    const fill = !isNike ? '#38bdf8' : '#d97b38';
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 19.0002L19.0002 5" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.0002 19.0002L5 5" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
