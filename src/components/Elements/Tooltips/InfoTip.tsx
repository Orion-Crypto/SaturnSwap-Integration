import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';

export const InfoTip = ({ id = 'tool-tip', place = 'right', children }: any) => {
    return (
        <>
            <div
                className={clsx(
                    `${id} flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-xs font-bold`,
                    'border-2 border-sky-600/60 bg-sky-950 hover:bg-sky-600'
                )}
            >
                ?
            </div>
            <Tooltip
                id={id}
                classNameArrow="main-tooltip-arrow"
                className="main-tooltip"
                style={{
                    backgroundColor: '#030326',
                    borderRadius: '10px',
                }}
                opacity={1.0}
                place={place}
                anchorSelect={`.${id}`}
            >
                {children}
            </Tooltip>
        </>
    );
};
