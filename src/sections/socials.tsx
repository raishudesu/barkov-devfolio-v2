import { Button } from "@/components/ui/button";
import { sectionsData } from "@/src/data/sections-data";

const Socials = () => {
  return (
    <section className="w-full px-4 py-6 border border-gray-100 rounded-lg">
      <div className="flex flex-col items-start justify-start gap-2">
        <h3 className="text-lg font-bold">Socials</h3>
      </div>
      <div className="mt-6 flex items-center justify-start gap-2">
        {sectionsData.socials.map((social) => (
          <Button key={social.name} asChild>
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              <social.icon />
              {social.name}
            </a>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default Socials;
