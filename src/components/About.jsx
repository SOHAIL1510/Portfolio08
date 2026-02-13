import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-[#0b0b0b]">
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
          I’m Sohail Khan, a UI/UX Designer and Full Stack Developer passionate about building user-centric, scalable, and modern digital solutions. With experience in real-world projects and internships, I specialize in designing intuitive interfaces and developing responsive web applications using tools like Figma and modern web technologies. I focus on combining design thinking with technical expertise to deliver impactful and efficient products.
        </motion.p>
      </div>
    </section>
  );
}
