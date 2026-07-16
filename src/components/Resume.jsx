/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

// Change this to your Google Drive share link (Anyone with link can view) for instant mobile previewing
const RESUME_URL = "https://drive.google.com/file/d/1RFYOZq3oKIsrZzIjYjpkoiwfGbNKrYCz/view?usp=drive_link";

export default function Resume() {
  const education = [
    {
      degree: "Bachelor of Engineering",
      institution: "International Institute of Information Technology, Pune ",
      duration: "2022 - 2026",
      desc: "Specializing in Software Engineering, database systems, web architectures, and UI/UX design principles. Building a solid foundation in software engineering and front-end/back-end frameworks.",
    },
    {
      degree: "Higher Secondary Education (Class XII)",
      institution: "Shri Mahavir Jr College,Lasalgaon",
      duration: "2020 - 2022",
      desc: "Focused on Science, Physics, Mathematics, and Computer Science. Gained early experience in algorithms and basic object-oriented programming.",
    },
  ];

  const experience = [

    {
      role: "UI/UX Designer & Web Developer",
      company: "Freelance & Internships",
      duration: "feb 2024 - May 2024",
      desc: "Designing high-fidelity prototypes and user flows in Figma. Translating visual assets into clean, efficient, and responsive web components using React, Tailwind CSS, and Framer Motion.",
    },
  ];

  return (
    <section id="resume" className="py-20 px-6 bg-[#0b0b0b]/40 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-400"
        >
          Resume
        </motion.h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          {/* Work Experience Timeline */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-2">Experience</h3>
            <div className="relative border-l border-gray-800 pl-6 ml-2 flex flex-col gap-8">
              {experience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-950 shadow-md"></span>
                  <span className="text-xs font-semibold text-blue-400 font-mono bg-blue-500/10 px-2.5 py-1 rounded-full">{exp.duration}</span>
                  <h4 className="text-xl font-bold text-white mt-2">{exp.role}</h4>
                  <p className="text-sm text-gray-400 font-semibold">{exp.company}</p>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-2">Education</h3>
            <div className="relative border-l border-gray-800 pl-6 ml-2 flex flex-col gap-8">
              {education.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 border-4 border-gray-950 shadow-md"></span>
                  <span className="text-xs font-semibold text-purple-400 font-mono bg-purple-500/10 px-2.5 py-1 rounded-full">{edu.duration}</span>
                  <h4 className="text-xl font-bold text-white mt-2">{edu.degree}</h4>
                  <p className="text-sm text-gray-400 font-semibold">{edu.institution}</p>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">{edu.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Button / Call to Action wrapped in TiltCard */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <TiltCard className="bg-gray-900/60 border border-gray-800 backdrop-blur-md p-8 rounded-3xl">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-12 h-12 text-blue-400 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-white">Looking for the full resume?</h3>
              <p className="mt-2 text-gray-400 text-sm max-w-md leading-relaxed">
                Click below to view or download my comprehensive PDF resume detailing my qualifications, projects, and work history.
              </p>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition duration-300 shadow-md shadow-blue-500/20 hover:scale-105 inline-block text-center cursor-pointer"
              >
                View PDF Resume
              </a>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
