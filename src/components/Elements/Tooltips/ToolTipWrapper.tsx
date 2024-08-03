import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';

export const ToolTipWrapper = ({ id = 'tool-tip', place = 'right', children, tip, isNike = false }: any) => {
    let styleNormal = {
        backgroundColor: '#030326',
        borderRadius: '10px',
    };

    let styleNike = {
        backgroundColor: '#2B190B',
        borderRadius: '10px',
        borderColor: '#9F5930',
    };

    const borderColor = isNike ? 'main-tooltip-nike' : 'main-tooltip';
    const isNikeArrow = isNike ? 'main-tooltip-arrow-nike' : 'main-tooltip-arrow';
    return (
        <>
            <div className={clsx(`${id} flex cursor-pointer items-center justify-center rounded-md text-xs font-bold`)}>{children}</div>
            <Tooltip
                id={id}
                classNameArrow={clsx(isNikeArrow)}
                className={clsx(borderColor, 'z-50')}
                style={isNike ? styleNike : styleNormal}
                opacity={1.0}
                place={place}
                anchorSelect={`.${id}`}
            >
                {tip}
            </Tooltip>
        </>
    );
};
