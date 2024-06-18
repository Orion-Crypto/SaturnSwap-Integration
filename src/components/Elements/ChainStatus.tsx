'use client';

import clsx from 'clsx';
import { useState } from 'react';

export const ChainStatus = ({ chainLoadHour, chainLoadDay }: any) => {
    //round chainload to 2 decimals
    chainLoadHour = Math.round(chainLoadHour * 100) / 100;
    chainLoadDay = Math.round(chainLoadDay * 100) / 100;

    const [isHovered, setIsHovered] = useState(false);

    let textColor = 'text-white-500 h-5 w-5 mt-0.5 mx-0.5'; // This is where you apply your Tailwind color class
    let style = { filter: 'drop-shadow(0 0 4px #000000)' };

    let chainLoadHourColor = 'text-green-500';
    let chainLoadDayColor = 'text-green-500';

    if (chainLoadHour < 80) {
        textColor = 'text-green-500 h-5 w-5 mt-0.5 mx-0.5';
        style = { filter: 'drop-shadow(0 0 4px #22c55e)' };
        chainLoadHourColor = 'text-green-500';
    } else if (chainLoadHour < 95 && chainLoadHour >= 80) {
        textColor = 'text-yellow-300 h-5 w-5 mt-0.5 mx-0.5';
        style = { filter: 'drop-shadow(0 0 4px #fde047)' };
        chainLoadHourColor = 'text-yellow-300';
    } else if (chainLoadHour >= 95) {
        textColor = 'text-red-600 h-5 w-5 mt-0.5 mx-0.5';
        style = { filter: 'drop-shadow(0 0 4px #e11d48)' };
        chainLoadHourColor = 'text-red-600';
    }

    if (chainLoadDay < 80) {
        chainLoadDayColor = 'text-green-500';
    } else if (chainLoadDay < 95 && chainLoadDay >= 80) {
        chainLoadDayColor = 'text-yellow-300';
    }
    if (chainLoadDay >= 95) {
        chainLoadDayColor = 'text-red-600';
    }

    return (
        <>
            <div
                className="fixed bottom-4 right-4 w-32 cursor-default flex-col items-center justify-around rounded-lg border-2 border-sky-700 bg-space-950 text-sm"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={clsx('my-1 mr-5 h-full items-center justify-end text-center', isHovered ? 'flex' : 'hidden')}>
                    <div className="text-white">1H : </div>
                    <div className={clsx('mx-1 text-center', chainLoadHourColor)}>{chainLoadHour}%</div>
                </div>
                <div className={clsx('mr-5 items-center justify-end text-center', isHovered ? 'flex' : 'hidden')}>
                    <div className="text-center text-white">24H : </div>
                    <div className={clsx('mx-1 text-center', chainLoadDayColor)}>{chainLoadDay}%</div>
                </div>
                <div className="my-1 flex h-full items-center justify-center">
                    <svg className={textColor} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5" style={style}>
                        <circle fill="currentColor" cx="2.3" cy="2.3" r="1.7"></circle>
                    </svg>
                    <div className="mr-2 flex h-full items-center text-center text-white">Chain Load</div>
                </div>
            </div>
        </>
    );
};
