import clsx from 'clsx';

export const StartTradingButton = () => {
    return (
        <>
            <div
                className={clsx(
                    'flex h-16 w-64 cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-r from-sky-600 from-50% to-sky-300 text-xl font-bold text-white lg:w-80',
                    'transition-all duration-300 hover:shadow-full-sky-lg-500'
                )}
            >
                Start Trading
            </div>
        </>
    );
};
