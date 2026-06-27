import { Badge } from "@/components/ui/badge";
import { sectionsData } from "../data/sections-data";

const TechStack = () => {
  return (
    <section className="w-full px-4 py-6 border border-gray-100 rounded-lg">
      <div className="flex flex-col items-start justify-start gap-4">
        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="text-2xl font-bold">Tech Stack</h2>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h3 className="text-lg font-bold">Frontend</h3>
          <div className="flex items-center justify-start gap-2">
            {sectionsData.frontend.map((tech) => (
              <Badge variant="outline" key={tech}>
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h3 className="text-lg font-bold">Backend</h3>
          <div className="flex items-center justify-start gap-2 flex-wrap">
            {sectionsData.backend.map((tech) => (
              <Badge variant="outline" key={tech}>
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h3 className="text-lg font-bold">Developer Tools</h3>
          <div className="flex items-center justify-start gap-2">
            {sectionsData.developerTools.map((tech) => (
              <Badge variant="outline" key={tech}>
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
