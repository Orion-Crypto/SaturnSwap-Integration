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

// Swap and Liquidity Input Fields Formatting
export const formatCommaValue = (value: number, minimumFractionDigits: number = 0, maximumFractionDigits: number = 2) => {
    // Convert the number to a string with commas
    return value.toLocaleString('en-US', { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: maximumFractionDigits });
};

export const cleanStringNumber = (value: string) => {
    // Remove all characters except digits, commas, and the decimal point
    return value.replace(/[^\d.,]/g, '');
};

export const convertStringToNumber = (value: string) => {
    // Remove all characters except digits, commas, and the decimal point
    const cleanedValue = cleanStringNumber(value);
    // Remove all commas from the string
    const valueWithoutCommas = cleanedValue.replace(/,/g, '');
    // Convert the cleaned string to a float
    return parseFloat(valueWithoutCommas);
};

// Significant Figures Formatting
export const roundToSignificantDigits = (value: number, digits: number): number => {
    if (value === 0 || value == null) return 0;

    const scale = Math.pow(10, digits - Math.ceil(Math.log10(Math.abs(value))));
    return Math.round(value * scale) / scale;
};

// Tokens Formatting
export const formatTokenValue = (value: number, decimal: number = 0) => {
    if (decimal != 0) value = value / Math.pow(10, decimal);

    if (value >= 1e12) {
        // Trillion
        return `${(value / 1e12).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}T`;
    } else if (value >= 1e9) {
        // Billion
        return `${(value / 1e9).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}B`;
    } else if (value >= 1e6) {
        // Million
        return `${(value / 1e6).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
    } else {
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
};

// Stats Formatting
export const formatStatsValue = (value: number = 0, decimal: number = 0) => {
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
    } else if (value >= 1e3) {
        // Thousand
        return `${(value / 1e3).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
    } else {
        return `${value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
};

// For ADA, use convertLoveLacesToDisplayString
export const formatFinancialValue = (value: number) => {
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

export const formatVolumeValue = (value: number | null) => {
    if (value == null) {
        return null;
    }

    if (value >= 1e12) {
        // Trillion
        return `${(value / 1e12).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}T`;
    } else if (value >= 1e9) {
        // Billion
        return `${(value / 1e9).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}B`;
    } else if (value >= 1e6) {
        // Million
        return `${(value / 1e6).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}M`;
    } else {
        return `${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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

export const formatOrderBookNumber = (price: number, decimal: number = 0) => {
    let formattedPrice = '0';

    // Check if the number is greater than or equal to 1 million
    if (Math.abs(price) >= 1e5) {
        // Determine the decimal places based on the provided parameter
        const decimalPlaces = decimal >= 0 ? decimal : 2;

        // Convert the number to millions, billions, trillions, etc.
        if (Math.abs(price) >= 1e12) {
            formattedPrice = (price / 1e12).toFixed(decimalPlaces) + 'T';
        } else if (Math.abs(price) >= 1e9) {
            formattedPrice = (price / 1e9).toFixed(decimalPlaces) + 'B';
        } else if (Math.abs(price) >= 1e6) {
            formattedPrice = (price / 1e6).toFixed(decimalPlaces) + 'M';
        } else if (Math.abs(price) >= 1e5) {
            formattedPrice = (price / 1e5).toFixed(decimalPlaces) + 'K';
        }
    } else {
        // Check if the number has a decimal and limit it to the specified decimal places
        if (price % 1 !== 0) {
            // Calculate the maximum number of characters allowed for the decimal portion
            const maxDecimalLength = 5 - Math.floor(Math.abs(price)).toString().length;

            // Limit the decimal portion to the maximum length
            formattedPrice = price.toFixed(maxDecimalLength).replace(/\.?0+$/, ''); // This line removes trailing zeros
        } else {
            // Limit the number to 5 digits
            if (price.toString().length > 5) {
                formattedPrice = price.toString().slice(0, 5);
            } else {
                formattedPrice = price.toString();
            }
        }
    }
    return formattedPrice;
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
