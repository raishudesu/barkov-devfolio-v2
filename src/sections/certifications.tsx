import { sectionsData } from "../data/sections-data";
import CertificationCard from "../sections/components/certification-card";

const Certifications = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        05 — certifications
      </p>
      <div className="flex flex-col gap-3">
        {sectionsData.certifications.map((cert) => (
          <CertificationCard key={cert.title} {...cert} />
        ))}
      </div>
    </section>
  );
};

export default Certifications;
