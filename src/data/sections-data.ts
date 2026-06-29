import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import PopChainLogo from "../assets/projects/popchain_logo.png";
import RentaLogo from "../assets/projects/renta-logo.svg";
import FundrLogo from "../assets/projects/fundr-logo.svg";
import ParkSULogo from "../assets/projects/parksu.svg";

export const sectionsData = {
  frontend: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Expo Go",
  ],
  backend: [
    "Node.js",
    "Laravel",
    "ASP.NET Core",
    "Express.js",
    "PostgreSQL",
    "MySQL",
    "Firebase",
    "Supabase",
    "MongoDB",
    "JWT",
    "REST",
  ],
  developerTools: [
    "Git",
    "GitHub",
    "Insomnia",
    "VS Code",
    "Cursor AI",
    "Figma",
    "Canva",
    "Obsidian",
  ],
  projects: [
    {
      title: "PopChain",
      description:
        "PopChain lets you prove you were there. Scan, mint, collect. Your attendance, secured forever on the blockchain",
      link: "https://popchain.vercel.app/",
      techStack: ["NextJS", "Sui Blockchain", "Tusky", "Supabase"],
      imageLink: PopChainLogo,
    },
    {
      title: "Renta",
      description:
        "The simplest way to rent vehicles. Owners list their cars, renters book instantly, and QR codes make pickup seamless. No paperwork, no hassle.",
      link: "https://renta-prod.vercel.app/",
      techStack: ["NextJS", "ASP.NET Core", "AWS"],
      imageLink: RentaLogo,
    },
    {
      title: "Fundr Business Support Services",
      description:
        "A Platform to provide financial information and transparency to Fundr Clients.",
      link: "https://fundrph.org/",
      techStack: ["NextJS", "Supabase"],
      imageLink: FundrLogo,
    },
    {
      title: "ParkSU",
      description:
        "A Realtime Parking Monitoring System with Data Analytics and Visualization for Palawan State University campus.",
      link: "https://parksu.vercel.app/",
      techStack: ["NextJS", "Supabase"],
      imageLink: ParkSULogo,
    },
  ],
  experience: [
    {
      title: "Full Stack Web and Mobile Developer",
      company: "Zerobstacle Technologies",
      isCurrent: true,
      dateStart: "2025",
      dateEnd: "Present",
    },
    {
      title: "Freelance Developer",
      company: "Freelance",
      isCurrent: true,
      dateStart: "2025",
      dateEnd: "Present",
    },

    {
      title: "BS Information Technology",
      company: "Palawan State University",
      isCurrent: false,
      dateStart: "2021",
      dateEnd: "2025",
    },
  ],
  certifications: [
    {
      title: "Sui Builder Program",
      description: "Sui Builder Program by YGG Pilipinas",
      imageLink: "/images/sui-cert.png",
    },
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/raishudesu",
      icon: GithubLogo,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/baryshbacaltos/",
      icon: LinkedinLogo,
    },
  ],
};
