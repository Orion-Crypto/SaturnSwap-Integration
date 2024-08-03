import clsx from 'clsx';

export const PageBackground = ({ showBackgroundImage, toggleAnimation, isNike = false }: any) => {
    return (
        <>
            <div
                className={clsx(
                    isNike ? 'bg-nike-swap-2 absolute inset-0 bg-cover' : 'bg-space-blobs-black absolute inset-0 bg-cover',
                    toggleAnimation
                        ? showBackgroundImage
                            ? 'animate-fade-in opacity-100'
                            : 'animate-fade-out opacity-0'
                        : showBackgroundImage
                          ? 'opacity-100'
                          : 'opacity-0'
                )}
            ></div>
        </>
    );
};
