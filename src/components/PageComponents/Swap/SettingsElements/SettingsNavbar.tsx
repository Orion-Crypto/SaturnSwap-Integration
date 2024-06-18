import clsx from 'clsx';
import Image from 'next/image';

export const SettingsNavbar = ({ setShowSettings }: any) => {
    return (
        <>
            <div className="z-50 flex h-10 w-full flex-none justify-start gap-2">
                <div
                    onClick={() => setShowSettings(false)}
                    className={clsx(
                        'flex select-none items-center justify-center rounded-lg border border-sky-600/60 bg-space-700 px-3 text-sm',
                        'cursor-pointer transition-all duration-300 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100'
                    )}
                >
                    <Image src="/images/icons/settings.png" alt="Settings" width={16} height={16} />
                </div>
                <div className="grow"></div>
                <div className="flex items-center text-xl font-bold">Settings</div>
                <div className="grow"></div>
                <div
                    onClick={() => setShowSettings(false)}
                    className={clsx(
                        'flex select-none items-center justify-center rounded-lg border border-sky-600/60 bg-space-700 px-3 text-sm',
                        'cursor-pointer transition-all duration-300 hover:border-sky-400/60 hover:bg-space-400 active:bg-space-100'
                    )}
                >
                    <Image src="/images/icons/x.png" alt="Settings" width={16} height={16} />
                </div>
            </div>
        </>
    );
};
