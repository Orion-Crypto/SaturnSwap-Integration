export enum StatsTime {
    AllTime = 0,
    TwentyFourHours = 86400,
    SevenDays = 604800,
    ThirtyDays = 2592000,
    OneYear = 31536000,
}

export const StatsTimeDictionary: any = {
    [StatsTime.AllTime]: 'All Time',
    [StatsTime.TwentyFourHours]: '24 Hours',
    [StatsTime.SevenDays]: '7 Days',
    [StatsTime.ThirtyDays]: '30 Days',
    [StatsTime.OneYear]: '1 Year',
};
