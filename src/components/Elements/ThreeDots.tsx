import clsx from 'clsx';

const colorMapping = {
    white: 'text-white',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    black: 'text-black',
};

export const ThreeDots = ({ color = 'white' }: { color?: keyof typeof colorMapping }) => {
    const textColor = colorMapping[color];
    return (
        <div>
            <svg className={textColor} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24">
                <path
                    d="M10 10.8334C10.4603 10.8334 10.8334 10.4603 10.8334 10C10.8334 9.53978 10.4603 9.16669 10 9.16669C9.5398 9.16669 9.16671 9.53978 9.16671 10C9.16671 10.4603 9.5398 10.8334 10 10.8334Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
                <path
                    d="M15.8334 10.8334C16.2936 10.8334 16.6667 10.4603 16.6667 10C16.6667 9.53978 16.2936 9.16669 15.8334 9.16669C15.3731 9.16669 15 9.53978 15 10C15 10.4603 15.3731 10.8334 15.8334 10.8334Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
                <path
                    d="M4.16671 10.8334C4.62694 10.8334 5.00004 10.4603 5.00004 10C5.00004 9.53978 4.62694 9.16669 4.16671 9.16669C3.70647 9.16669 3.33337 9.53978 3.33337 10C3.33337 10.4603 3.70647 10.8334 4.16671 10.8334Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </svg>
        </div>
    );
};
