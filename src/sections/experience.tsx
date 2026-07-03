import { sectionsData } from "../data/sections-data";
import ExperienceCard from "./components/experience-card";

const Experience = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        04 — experience
      </p>
      <div className="flex flex-col gap-4">
        {sectionsData.experience.map((exp, i) => (
          <ExperienceCard key={exp.title} {...exp} isLast={i === sectionsData.experience.length - 1} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
