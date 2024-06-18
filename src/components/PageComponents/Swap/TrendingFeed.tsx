import { IPFSImage } from '@/components/Elements/IPFSImage';
import { Spinner } from '@/components/Elements/Spinner';
import { useGetTokenProjects } from '@/hooks/Models/tokenProject.hook';
import clsx from 'clsx';

export const TrendingFeed = () => {
    const { data: tokenProjects, isLoading: isLoadingTokenProjects }: any = useGetTokenProjects({
        first: 8,
        where: '',
        order: '{ price: DESC }',
    });
    const tokenProjectsArray = tokenProjects?.pages?.map((page: any) => page?.edges?.map((edge: any) => edge?.node));
    if (isLoadingTokenProjects) {
        return <Spinner />;
    }

    return (
        <div className="mx-32 -mt-16 mb-12 w-full rounded-3xl border-2 border-sky-600/60 bg-space-950 px-4 py-2">
            <div className="grid grid-cols-4">
                {tokenProjectsArray[0].map((tokenProject: any, index: number) => (
                    <TrendingTab key={index} tokenProject={tokenProject} />
                ))}
            </div>
        </div>
    );
};

const TrendingTab = ({ tokenProject }: any) => {
    const isNegativeOneDay = tokenProject.price < 0;
    const priceChangePercentOneDayString = tokenProject.price?.toFixed(2);
    return (
        <div className="my-2 flex flex-col items-start justify-start">
            <div className="-mr-8 ml-8 flex justify-start">
                <div className={clsx('z-10 flex h-7 w-7 rounded-full ')}>
                    <IPFSImage
                        image={tokenProject.image}
                        containerClassNames="relative flex aspect-square w-screen"
                        classNames="rounded-full object-contain"
                        alt={tokenProject.ticker}
                    />
                </div>
                <div className="flex flex-none items-center justify-center text-sm">
                    <div
                        className={
                            priceChangePercentOneDayString === 0 ? 'text-sky-100' : isNegativeOneDay ? 'text-red-500' : 'text-green-500 '
                        }
                    >
                        {priceChangePercentOneDayString === 0 || isNegativeOneDay ? '' : '+'}
                        {priceChangePercentOneDayString}%
                    </div>
                </div>
            </div>
        </div>
    );
};
