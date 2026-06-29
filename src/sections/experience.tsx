import { sectionsData } from "@/src/data/sections-data";
import ExperienceCard from "./components/experience-card";

const Experience = () => {
  return (
    <section className="w-full px-4 py-6 border border-gray-100 dark:border-gray-800 rounded-lg">
      <div className="flex flex-col items-start justify-start gap-2">
        <h3 className="text-lg font-bold">Experience</h3>
      </div>
      <div className="mt-6 flex flex-col items-start justify-start">
        {sectionsData.experience.map((experience, index) => (
          <ExperienceCard
            key={experience.title}
            {...experience}
            index={index}
            isLast={index === sectionsData.experience.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
