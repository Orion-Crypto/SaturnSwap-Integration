import { BackgroundSpaceBlobsBrown } from '@/utils/css/background';
import clsx from 'clsx';

export const PageBackground = ({ showBackgroundImage, toggleAnimation }: any) => {
    return (
        <>
            <div
                className={clsx(
                    BackgroundSpaceBlobsBrown, //'bg-space-blobs-brown absolute inset-0 bg-cover',
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
