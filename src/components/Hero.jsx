import { motion } from "framer-motion";
import myPhoto from "../assets/myphoto1.jpeg"; // change filename if different

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hi, I'm <span className="text-blue-400">Sohail Khan</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Full Stack Devloper & UI/UX Designer. I build modern, responsive
            websites and design clean user experiences.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="px-6 py-3 border border-gray-700 hover:border-blue-400 rounded-xl font-semibold transition"
            >
              Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center relative"
        >
          <div className="w-72 h-72 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-50 absolute"></div>

          <img
            src={myPhoto}
            alt="Sohail Khan"
            className="relative w-72 h-72 rounded-full object-cover scale-[2.2] object-center border-4 border-gray-800 shadow-xl"
          />

        </motion.div>

      </div>
    </section>
  );
}
