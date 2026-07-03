const ExperienceCard = ({
  title,
  company,
  isCurrent,
  isLast,
  dateStart,
  dateEnd,
}: {
  title: string;
  company: string;
  isCurrent: boolean;
  isLast: boolean;
  dateStart: string;
  dateEnd: string | null;
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`size-2.5 rounded-full mt-1.5 ${isCurrent ? "bg-foreground" : "bg-gray-300"}`}>
          {isCurrent && (
            <span className="block size-2.5 rounded-full bg-foreground animate-pulse-dot" />
          )}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1.5" />}
      </div>
      <div className="flex-1 pb-4">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mt-0.5">{company}</p>
        <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mt-1">
          {dateStart} — {dateEnd}
        </p>
      </div>
    </div>
  );
};

export default ExperienceCard;
