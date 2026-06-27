import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { ReactNode } from "react";

const ProjectCard = ({
  title,
  description,
  content,
  techStack,
}: {
  title: string;
  description: string;
  content: ReactNode;
  techStack: string[];
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>
        <div className="flex items-center justify-start gap-2 flex-wrap">
          {techStack.map((tech) => (
            <Badge variant="outline" key={tech}>
              {tech}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
