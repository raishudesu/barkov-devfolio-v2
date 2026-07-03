import { sectionsData } from "../data/sections-data";

const Socials = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        06 — socials
      </p>
      <div className="flex flex-col gap-2">
        {sectionsData.socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-[0.5px] decoration-gray-300 hover:decoration-foreground"
          >
            <social.icon size={14} />
            {social.name} ↗
          </a>
        ))}
        <a
          href="mailto:bacaltosbaryshnikov@gmail.com"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-foreground transition-colors underline underline-offset-[3px] decoration-[0.5px] decoration-gray-300 hover:decoration-foreground mt-1"
        >
          <span className="text-[11px]">✉</span>
          bacaltosbaryshnikov@gmail.com ↗
        </a>
      </div>
    </section>
  );
};

export default Socials;
