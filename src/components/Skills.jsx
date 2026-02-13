import { motion } from "framer-motion";

const skills = [
  "UI/UX Design",
  "Figma",
  "HTML",
  "Tailwind CSS",
  "JavaScript",
  "React",
  "Next.js",
  "MongoDB",
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
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
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center hover:border-blue-400 hover:scale-105 transition"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
