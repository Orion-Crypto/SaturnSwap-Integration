// Dates come back from the server in UTC format
// This converts UTC ISO datestrings into a Local ISO format
export const convertUTCISOStringToLocalISOString = (dateStr: string): string => {
    const date = new Date(dateStr);

    const twoDigitFormat = {
        minimumIntegerDigits: 2,
        useGrouping: false,
    };
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toLocaleString('en-US', twoDigitFormat);
    const day = date.getDate().toLocaleString('en-US', twoDigitFormat);
    const hours = date.getHours().toLocaleString('en-US', twoDigitFormat);
    const minutes = date.getMinutes().toLocaleString('en-US', twoDigitFormat);
    const seconds = date.getSeconds().toLocaleString('en-US', twoDigitFormat);
    const milliseconds = date.getMilliseconds().toLocaleString('en-US', {
        minimumIntegerDigits: 3,
        useGrouping: false,
    });
    const localISOString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}T`;

    return localISOString;
};
export const convertDateStringToInput = (dateStr: string): string => {
    const inputDateString = dateStr.split('.')[0];
    return inputDateString;
};

export const timeAgo = (dateString: string, suffix: string = 'ago') => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.abs((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} year${years !== 1 ? 's' : ''} ${suffix}`;
    } else if (months > 0) {
        return `${months} month${months !== 1 ? 's' : ''} ${suffix}`;
    } else if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ${suffix}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;
    } else if (minutes > 0) {
        return `${minutes} min${minutes !== 1 ? '' : ''} ago`;
    } else {
        return `${Math.floor(diffInSeconds)} sec${Math.floor(diffInSeconds) !== 1 ? '' : ''} ${suffix}`;
    }
};

export const timeAgoShorthand = (dateString: string, suffix: string = 'ago') => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.abs((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years}y ${suffix}`;
    } else if (months > 0) {
        return `${months}M ${suffix}`;
    } else if (days > 0) {
        return `${days}d ${suffix}`;
    } else if (hours > 0) {
        return `${hours}h ${suffix}`;
    } else if (minutes > 0) {
        return `${minutes}m ${suffix}`;
    } else {
        return `${Math.floor(diffInSeconds)}s ${suffix}`;
    }
};

//eg. 05-30-2024
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Convert this date to local time
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    // Format the date to "MM-DD-YYYY"
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const day = date.getDate(); // getDate() returns 1-31
    const year = date.getFullYear(); // getFullYear() returns the 4-digit year

    // Pad the month and day with a leading zero if necessary
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${formattedMonth}-${formattedDay}-${year}`;
};

//eg. Jan-04-2023 11:30 AM
export const formatDateTimeName = (dateString: string) => {
    const date = new Date(dateString);

    // Convert this date to local time
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    // Check if the parsed date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    // Define arrays for month names and AM/PM suffix
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()]; // getMonth() returns 0-11
    const day = date.getDate(); // getDate() returns 1-31
    const year = date.getFullYear(); // getFullYear() returns the 4-digit year

    // Get hours and minutes
    let hours = date.getHours(); // getHours() returns 0-23
    const minutes = date.getMinutes(); // getMinutes() returns 0-59

    // Determine AM/PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad the minutes with a leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${month}-${day}-${year} ${hours}:${formattedMinutes} ${ampm}`;
};

export const formatDatetimeFull = (dateString: string) => {
    if (!dateString) return '';

    // Parse the date string
    const date = new Date(dateString);

    // Convert to UTC
    const utcDate = new Date(date.toISOString());

    // Format the date in the desired display format
    const options: any = {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    // Format the date to the required format
    const formattedDate = utcDate.toLocaleString('en-US', options);

    // Add "th" after the day and append "UTC"
    const day: any = utcDate.getUTCDate();
    const daySuffix = 'th'; // Assuming we only deal with the 19th in this context
    const displayTime = formattedDate.replace(day, `${day}${daySuffix}`) + ' UTC';

    return displayTime;
};

export const isTimeWithinLastMinute = (time: any) => {
    if (!time) return false; // If time is undefined or null, return false

    const currentTime: any = new Date();
    const successfulTime: any = new Date(time);

    // Calculate the difference in milliseconds
    const timeDifference = currentTime - successfulTime;

    // Check if the difference is less than or equal to 60,000 milliseconds (1 minute)
    return timeDifference <= 60000 && timeDifference >= 0;
};
