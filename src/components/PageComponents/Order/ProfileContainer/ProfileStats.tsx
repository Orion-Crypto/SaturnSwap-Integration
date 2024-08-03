import { AggregateTokenProjectStats } from '@/components/PageComponents/Token/TokenContainer/TokenContainerUtils';
import { useGetAssetBalances } from '@/hooks/Cardano/wallet.hooks';
import { TOKEN_PROJECT_SEARCH_KEY, useGetSearchValue } from '@/hooks/Models/search.hook';
import { useGetTokenProjectStats } from '@/hooks/Models/stats.hook';
import { formatTokenGraphValue, formatTokenValue } from '@/utils/number';
import Image from 'next/image';

export const ProfileStats = () => {
    const assetBalances = useGetAssetBalances();

    const { data: tokenProjectStats }: any = useGetTokenProjectStats({
        where: '{ time: { eq: 86400 }, offset_time: null }',
    });
    const tokenProjectStatsDict = AggregateTokenProjectStats(tokenProjectStats);

    const tokenProjectDict: any = {};
    if (
        assetBalances === undefined ||
        assetBalances.data === undefined ||
        assetBalances.data === null ||
        tokenProjectStats === undefined ||
        tokenProjectStats === null
    ) {
        return <div></div>;
    }

    for (const value of Object.values(tokenProjectStatsDict) as any[]) {
        const policy_id = value[0].token_project?.policy_id;
        const asset_name = value[0].token_project?.asset_name;
        const key = `${policy_id}${asset_name}`;
        if (key in tokenProjectDict) {
            tokenProjectDict[key].push(value);
        } else {
            tokenProjectDict[key] = [value];
        }
    }

    const tokenData: any = [];

    //Now for each tokenProjectDict object, check if the assetBalance dictionary has such a key, and if so, add the data to the tokenData
    for (const tokenProjectKey in tokenProjectDict) {
        if (tokenProjectKey in assetBalances.data) {
            // Store the balance along with the decimal information
            const balance: any = assetBalances.data[tokenProjectKey];
            const amount = balance / Math.pow(10, tokenProjectDict[tokenProjectKey][0][0].token_project.decimals);
            let price = (tokenProjectDict[tokenProjectKey][0][0].lowest_ask + tokenProjectDict[tokenProjectKey][0][0].highest_bid) / 2;
            if (price > 1000) {
                price = 1000;
            }
            tokenData.push({
                asset: tokenProjectDict[tokenProjectKey][0][0].token_project.name,
                amount: amount,
                image: tokenProjectDict[tokenProjectKey][0][0].token_project.image,
                price: price,
                tvl: tokenProjectDict[tokenProjectKey][0][0].tvl,
            });
        }
    }
    if ('lovelace' in assetBalances.data) {
        const balance: any = assetBalances.data['lovelace'];
        const amount = balance / Math.pow(10, 6);
        const formattedAmount = formatTokenGraphValue(amount);
        tokenData.push({
            asset: 'ADA',
            amount: amount,
            image: '/images/tokens/cardano.png',
            price: 1,
        });
    }

    tokenData.sort((a: any, b: any) => a.asset.localeCompare(b.asset));

    return (
        <div className="h-full w-full border-t-2 border-sky-600/60 lg:border-t-0">
            <div className="grid h-10 w-full grid-cols-3 items-center border-b border-sky-600/60 text-center text-gray-200">
                <div className="font-bold text-white">Token</div>
                <div className="font-bold text-white">Ada</div>
                <div className="font-bold text-white">Price</div>
            </div>

            <div className="flex w-full flex-col lg:h-90">
                {tokenData.map((tokenData: any) => (
                    <div
                        key={tokenData.asset}
                        className="grid grid-cols-3 items-center justify-center border-b border-sky-600/60 text-center text-gray-200"
                    >
                        <div className="flex items-center justify-center gap-2 border-r border-sky-600/60 p-2 text-xs font-semibold">
                            <div className="flex h-5 w-5">
                                <Image src={tokenData.image} width="32" height={'32'} alt={tokenData?.name ? tokenData?.name : 'Token Name'} />
                            </div>
                            <div className="flex gap-1">
                                <div className="hidden lg:flex">{formatTokenValue(tokenData.amount, 0)}</div>
                                <div className="flex lg:hidden">{formatTokenValue(tokenData.amount, 0)}</div>
                                <div className="">{tokenData.asset}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-1 border-r border-sky-600/60 p-2 text-xs font-semibold">
                            <div className="hidden text-gray-200 lg:flex">{formatTokenValue(tokenData.amount * tokenData.price, 0)}</div>
                            <div className="flex text-gray-200 lg:hidden">{formatTokenValue(tokenData.amount * tokenData.price, 0)}</div>
                            <div className="">₳</div>
                        </div>

                        <div className="flex items-center justify-center gap-1  p-2 text-xs font-semibold">
                            <div className="hidden text-gray-200 lg:flex">{formatTokenValue(tokenData.price, 0)}</div>
                            <div className="flex text-gray-200 lg:hidden">{formatTokenValue(tokenData.price, 0)}</div>
                            <div className="">₳</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
