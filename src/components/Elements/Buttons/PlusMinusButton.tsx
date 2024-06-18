import clsx from 'clsx';

interface PlusMinusButtonProps {
    onClick: () => void;
}

export const PlusButton = ({ onClick }: PlusMinusButtonProps) => {
    return (
        <>
            <div
                onClick={onClick}
                className={clsx(
                    'pl-0.25 flex h-10 w-10 flex-none cursor-pointer select-none items-center justify-center rounded-full pb-0.5 text-3xl font-bold text-white ring-2 ring-sky-400 transition duration-100',
                    'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'
                )}
            >
                +
            </div>
        </>
    );
};

export const MinusButton = ({ onClick }: PlusMinusButtonProps) => {
    return (
        <>
            <div
                onClick={onClick}
                className={clsx(
                    'pl-0.25 flex h-10 w-10 flex-none cursor-pointer select-none items-center justify-center rounded-full pb-0.5 text-3xl font-bold text-white ring-2 ring-sky-400 transition duration-100',
                    'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'
                )}
            >
                -
            </div>
        </>
    );
};
