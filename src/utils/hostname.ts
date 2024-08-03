export const getHostname = () => {
    if (typeof window !== 'undefined') {
        return window.location.hostname;
    }
    return '';
};

export const getNikePoolName = () => {
    return 'ADA x Nike';
};

export const getNikePoolId = () => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
        return '0605daca-655a-4470-9dd8-a93dd0a39239';
    }

    return 'd0e37969-57ab-45fc-9c7d-547fa22b19c8';
};

export const getNikeTokenProjectId = () => {
    return 'b8d5ceea-b2ec-414a-8001-286321bc3329';
};
