import { Spinner } from '@/components/Elements/Spinner';
import clsx from 'clsx';

interface CloseButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    style?: string;
}
export const CloseButton = ({ onClick, isLoading, style = 'border-sky-400' }: CloseButtonProps) => {
    return (
        <>
            <div className="relative">
                <div
                    onClick={() => {
                        onClick();
                    }}
                    className={clsx(
                        'absolute right-1 top-1 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border-2 bg-space-900 shadow-sky-md-800 transition-all duration-100',
                        'hover:bg-space-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-sky-sm-800',
                        style
                    )}
                >
                    {isLoading ? <Spinner /> : <CloseIcon />}
                </div>
            </div>
        </>
    );
};

export const CloseIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 19.0002L19.0002 5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.0002 19.0002L5 5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
