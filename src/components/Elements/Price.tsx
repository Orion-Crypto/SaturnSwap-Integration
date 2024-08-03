export const SubPrice = (price: number, precision: number = 4, prefix: any = '', suffix: any = '') => {
    // Convert the number to a fixed-point notation string
    let numStr = price.toFixed(precision + 4); // Extra precision to handle leading zeros

    // Ensure there is a decimal point in the number
    if (!numStr.includes('.')) {
        numStr += '.0';
    }

    // Split the number into the main part and the rest
    let [mainPart, restPart] = numStr.split('.');

    // Find leading zeros in the rest part
    const match = restPart.match(/^(0+)/);
    const leadingZeros = match ? match[0].length : 0;

    // Determine the formatted notation
    let formattedNotation: JSX.Element;

    if (leadingZeros >= 2) {
        // Subscript part for leading zeros
        let subscriptPart = <sub>{leadingZeros}</sub>;
        // Remaining part after leading zeros, limited to three digits
        let remainingPart = restPart.slice(leadingZeros, leadingZeros + 3);
        formattedNotation = (
            <span>
                {prefix}
                {mainPart}.0{subscriptPart}
                {remainingPart}
                {suffix}
            </span>
        );
    } else {
        // Normal formatting with up to three decimal places
        let remainingPart = restPart.slice(0, precision);
        formattedNotation = (
            <span>
                {prefix}
                {mainPart}.{remainingPart}
                {suffix}
            </span>
        );
    }

    // Special case: handle integers properly to avoid subscript issues
    if (price % 1 === 0) {
        formattedNotation = (
            <span>
                {prefix}
                {price.toFixed(precision)}
                {suffix}
            </span>
        );
    }

    return formattedNotation;
};
