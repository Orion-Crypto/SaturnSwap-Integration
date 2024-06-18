import { NumberFormat } from '@/types/Enums/NumberFormat';
import { formatNumber } from '@/utils/number';

export const convertAdaToLovelaces = (ada: number) => {
    return ada * 1000000;
};

export const convertLovelacesToAda = (lovelaces: number) => {
    return lovelaces / 1000000;
};

export const convertLovelacesToDisplayString = (lovelaces: number, format: NumberFormat = NumberFormat.Unit) => {
    if (!lovelaces) return `₳ 0`;
    const ada = convertLovelacesToAda(lovelaces);

    if (format === NumberFormat.Unit) {
        const million = 1000000;
        const thousand = 1000;
        if (ada >= million) {
            return `₳ ${formatNumber(ada / million)}M`;
        } else if (ada >= thousand) {
            return `₳ ${formatNumber(ada / thousand)}K`;
        } else {
            return `₳ ${formatNumber(ada)}`;
        }
    }

    return `₳ ${formatNumber(ada)}`;
};
