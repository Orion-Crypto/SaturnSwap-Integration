import Image from 'next/image';
import Link from 'next/link';

export const LogoButton = () => {
    return (
        <>
            <Link href="/">
                <div className="mx-4 flex w-16 items-center justify-center gap-4 text-3xl font-bold">
                    <div>
                        <Image src="/images/SaturnSwapLogo.png" width={64} height={64} alt="Saturn Logo" />
                    </div>
                </div>
            </Link>
        </>
    );
};
