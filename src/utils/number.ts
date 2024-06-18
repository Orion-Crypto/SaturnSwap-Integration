export const formatNumber = (number: number, decimals: number = 2) => {
    if (!number) return '0';

    // Convert the number to a string and round to the specified number of decimal places
    const numberString = number.toFixed(decimals);

    // Split the string into integer and decimal parts
    let [integerPart, decimalPart] = numberString.split('.');

    // Check if the number is negative
    let isNegative = false;
    if (integerPart.charAt(0) === '-') {
        isNegative = true;
        integerPart = integerPart.substring(1); // remove the '-' sign
    }

    // Split the integer part into an array of characters
    let integerArray = integerPart.split('');

    // Determine the starting index for adding commas
    let commaIndex = integerArray.length % 3;

    // If number is exactly 3 digits, do not add comma
    if (commaIndex === 0 && integerArray.length !== 1) {
        commaIndex += 3;
    }

    // Iterate over the array, adding commas at appropriate positions
    for (let i = commaIndex; i < integerArray.length; i += 4) {
        integerArray.splice(i, 0, ',');
    }

    // Join the integer array back into a string
    integerPart = integerArray.join('');

    // Append the '-' sign if the number is negative
    if (isNegative) {
        integerPart = '-' + integerPart;
    }

    // If there is a decimal part and it's not all zeros, append it
    if (decimalPart && parseInt(decimalPart) !== 0) {
        return `${integerPart}.${decimalPart}`;
    } else {
        return integerPart;
    }
};

export const formatTokenValue = (value: number, decimal: number = 0) => {
    if (decimal != 0) value = value / Math.pow(10, decimal);

    if (value >= 1e12) {
        // Trillion
        return `${(value / 1e12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}T`;
    } else if (value >= 1e9) {
        // Billion
        return `${(value / 1e9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
    } else if (value >= 1e6) {
        // Million
        return `${(value / 1e6).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
    } else {
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
};

export const formatModuleTokenValue = (value: number, decimal: number = 0) => {
    if (decimal != 0) value = value / Math.pow(10, decimal);

    if (value >= 1e12) {
        // Trillion
        return `${(value / 1e12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}T`;
    } else if (value >= 1e9) {
        // Billion
        return `${(value / 1e9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}B`;
    } else if (value >= 1e6) {
        // Million
        return `${(value / 1e6).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}M`;
    } else {
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    }
};

export const formatTokenGraphValue = (value: number = 0, decimal: number = 0, isMobile: boolean = false) => {
    if (decimal != 0) value = value / Math.pow(10, decimal);

    if (value >= 1e12) {
        // Trillion
        return `${(value / 1e12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}T`;
    } else if (value >= 1e9) {
        // Billion
        return `${(value / 1e9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
    } else if (value >= 1e6) {
        // Million
        return `${(value / 1e6).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
    } else if (value >= 1e3 && isMobile == false) {
        // Thousand
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (value >= 1e3 && isMobile == true) {
        // Thousand
        return `${(value / 1e3)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
    } else {
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    }
};
