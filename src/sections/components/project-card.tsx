import { ArrowSquareOut } from "@phosphor-icons/react";

const ProjectCard = ({
  title,
  description,
  techStack,
  imageLink,
  link,
}: {
  title: string;
  description: string;
  techStack: string[];
  imageLink?: string;
  link: string;
}) => {
  return (
    <article className="border border-gray-200 rounded-xl p-5 bg-card shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_22px_-12px_rgba(0,0,0,0.25)] transition-shadow duration-350">
      <div className="flex items-start gap-4">
        {imageLink && (
          <div className="size-10 shrink-0 rounded-lg border border-gray-200 overflow-hidden">
            <img
              src={imageLink}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold">{title}</h3>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-gray-400 hover:text-foreground transition-colors mt-0.5"
              aria-label={`${title} ↗`}
            >
              <ArrowSquareOut size={14} />
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-gray-500 border border-gray-300 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
