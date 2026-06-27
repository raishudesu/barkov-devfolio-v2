import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ExperienceCard = ({
  title,
  company,
  isCurrent,
  index,
  isLast,
  dateStart,
  dateEnd,
}: {
  title: string;
  company: string;
  isCurrent: boolean;
  index: number;
  isLast: boolean;
  dateStart: string;
  dateEnd: string | null;
}) => {
  return (
    <div className="flex w-full gap-3">
      <div className="relative flex w-2 shrink-0 flex-col items-center self-stretch">
        {index > 0 && (
          <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-gray-200" />
        )}
        <div
          className={cn(
            "relative z-10 mt-5 h-2 w-2 shrink-0 rounded-full",
            isCurrent ? "bg-green-500" : "bg-gray-200",
          )}
        />
        {!isLast && (
          <div className="absolute bottom-0 left-1/2 top-6 w-px -translate-x-1/2 bg-gray-200" />
        )}
      </div>
      <Card className="w-full flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{company}</CardDescription>
          <CardContent>
            {dateStart} - {dateEnd}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ExperienceCard;
