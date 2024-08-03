import clsx from 'clsx';

type ProgressBarProps = {
    bgColor: string;
    progressColor: string;
    countdown: number;
    maxCountdown: number;
};
export const ProgressBar = ({ bgColor, progressColor, countdown, maxCountdown }: ProgressBarProps) => {
    let percentage = (countdown / maxCountdown) * 100;
    if (percentage < 0) {
        percentage = 0;
    }
    if (percentage > 100) {
        percentage = 100;
    }
    const fillerStyles = {
        width: `${percentage}%`,
    };
    return (
        <div className={clsx('h-full w-full rounded-lg', bgColor)}>
            <div style={fillerStyles} className={`h-full rounded-lg ${progressColor}`} />
        </div>
    );
};
