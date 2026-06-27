import CertificationCard from "@/src/sections/components/certification-card";
import { sectionsData } from "@/src/data/sections-data";

const Certifications = () => {
  return (
    <section className="w-full px-4 py-6 border border-gray-100 rounded-lg">
      <div className="flex flex-col items-start justify-start gap-2">
        <h3 className="text-lg font-bold">Certifications</h3>
      </div>
      <div className="mt-6 grid gap-2 w-full">
        {sectionsData.certifications.map((certification) => (
          <CertificationCard key={certification.title} {...certification} />
        ))}
      </div>
    </section>
  );
};

export default Certifications;
