import { sectionsData } from "../data/sections-data";

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-gray-500 border border-gray-300 rounded-full">
      {children}
    </span>
  );
}

const TechStack = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        02 — tech stack
      </p>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mb-2">frontend</p>
          <div className="flex flex-wrap gap-1.5">
            {sectionsData.frontend.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mb-2">backend</p>
          <div className="flex flex-wrap gap-1.5">
            {sectionsData.backend.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400 mb-2">developer tools</p>
          <div className="flex flex-wrap gap-1.5">
            {sectionsData.developerTools.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
