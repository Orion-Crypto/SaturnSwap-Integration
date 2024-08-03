import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';

export const InfoTip = ({ id = 'tool-tip', place = 'right', isNike = false, children }: any) => {
    const infoColor = isNike
        ? 'border-nike-orange-500/60 bg-nike-orange-800 hover:bg-nike-orange-600'
        : 'border-sky-600/60 bg-sky-950 hover:bg-sky-600';

    const backgroundColor = isNike ? '#663729' : '#030326';
    const borderColor = isNike ? 'main-tooltip-nike' : 'main-tooltip';
    const isNikeArrow = isNike ? 'main-tooltip-arrow-nike' : 'main-tooltip-arrow';
    return (
        <>
            <div
                className={clsx(
                    `${id} flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 text-xs font-bold text-white`,
                    infoColor
                )}
            >
                ?
            </div>
            <Tooltip
                id={id}
                classNameArrow={clsx(isNikeArrow)}
                className={clsx('z-50', borderColor)}
                style={{
                    backgroundColor: backgroundColor,
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
