/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

const skills = [
  "UI/UX Design",
  "Figma",
  "HTML",
  "Tailwind CSS",
  "JavaScript",
  "React",
  "Next.js",
  "MongoDB",
  "TypeScript",
  "Node.js",
  "Express.js",
  "Docker",
  "CI/CD (DevOps)",
  "Git & GitHub",
  "REST APIs",
  "Framer Motion",
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-400"
        >
          Skills
        </motion.h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="h-full"
            >
              <TiltCard className="bg-gray-900/80 backdrop-blur-md border border-gray-800 hover:border-blue-400">
                <div className="p-5 text-center font-semibold text-gray-200 hover:text-white select-none">
                  {skill}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
