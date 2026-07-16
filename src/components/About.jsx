/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-[#0b0b0b]/40 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-400"
        >
          About Me
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-6 text-gray-300 text-lg leading-relaxed"
        >
          I’m Sohail Khan, a passionate UI/UX Designer and Full Stack Developer specializing in bridging the gap between design aesthetics and technical implementation. I create user-centric, highly interactive, and scalable digital products that deliver meaningful experiences. With hands-on experience in real-world projects, internships, and building cutting-edge integrations like AI-driven telecalling systems, I enjoy crafting everything from high-fidelity Figma prototypes to responsive frontends and containerized backend architectures.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-4 text-gray-300 text-lg leading-relaxed"
        >
          My approach is rooted in user-first design thinking, combining creative problem-solving with structured coding practices. Whether it is engineering clean APIs in Node.js, managing complex state in React, or crafting smooth animations with Framer Motion, I focus on performance, usability, and modern aesthetics. I am always eager to learn new technologies and collaborate on innovative projects that push the boundaries of the modern web.
        </motion.p>
      </div>
    </section>
  );
}
