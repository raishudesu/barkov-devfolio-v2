import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CertificationCard = ({
  title,
  description,
  imageLink,
}: {
  title: string;
  description: string;
  imageLink?: string | null;
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {imageLink && (
          <AspectRatio ratio={16 / 11}>
            <img
              src={imageLink}
              alt={title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationCard;
