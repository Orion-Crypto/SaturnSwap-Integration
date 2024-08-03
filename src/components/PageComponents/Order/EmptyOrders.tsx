import { Spinner } from '@/components/Elements/Spinner';
import Image from 'next/image';

export const EmptyOrders = ({ isLoading }: any) => {
    return (
        <>
            {isLoading ? (
                <div className="flex h-24 w-full items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="items-center justify-center self-center text-center text-lg font-bold text-white">
                        No orders found for this address
                    </div>
                    <div className="ml-31 z-20 -mt-5 flex h-full w-full flex-col items-center overflow-hidden">
                        <Image src={'/images/other/blob-checking-list.png'} alt={'Blob Checking List'} width={760} height={760} quality={100} />
                    </div>
                </>
            )}
        </>
    );
};
