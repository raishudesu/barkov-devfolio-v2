const About = () => {
  return (
    <section className="mb-14">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">
        01 — about
      </p>
      <div className="flex items-start gap-5 mb-4">
        <img
          src="/images/header-img.png"
          alt="Barysh Bacaltos"
          className="size-20 rounded-xl border border-gray-200 object-cover shrink-0"
        />
        <div className="pt-1">
          <h1 className="text-lg font-bold">Barysh Bacaltos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Full Stack Developer \ Aspiring Content Creator
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-500 leading-relaxed">
          I am a full stack developer specializing in building web applications.
          I focus on building solutions with JavaScript, C# and PHP. I work on
          projects that includes modern web and mobile applications, and sharing
          my knowledge through content creation.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          I leverage AI tools to help me build projects faster and efficiently.
          I share my knowledge through content creation, and learn from others.
          I accept small projects as a freelancer, feel free to contact me.
        </p>
      </div>
    </section>
  );
};

export default About;
