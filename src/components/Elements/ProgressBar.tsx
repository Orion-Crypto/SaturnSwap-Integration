type ProgressBarProps = {
    bgcolor: string;
    countdown: number;
    maxCountdown: number;
};
export const ProgressBar = ({ bgcolor, countdown, maxCountdown }: ProgressBarProps) => {
    const fillerStyles = {
        width: `${(countdown / maxCountdown) * 100}%`,
    };
    return (
        <div className="h-full w-full rounded-lg bg-white">
            <div style={fillerStyles} className={`h-full rounded-lg ${bgcolor}`} />
        </div>
    );
};
