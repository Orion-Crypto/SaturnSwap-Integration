export const timeAgo = (dateString: string) => {
    const date: any = new Date(dateString);

    //convert this date to local time
    const offset = new Date().getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    // Check if the parsed date is valid
    if (isNaN(date)) {
        return 'Invalid date';
    }

    const now: any = new Date();

    // Ensure that we're subtracting the smaller date from the larger date
    const diffInSeconds = Math.abs((now - date) / 1000);

    const minutes = Math.round(diffInSeconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} min${minutes !== 1 ? '' : ''} ago`;
    } else {
        return `${Math.round(diffInSeconds)} sec${Math.round(diffInSeconds) !== 1 ? '' : ''} ago`;
    }
};
