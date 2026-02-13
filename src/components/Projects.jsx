import { motion } from "framer-motion";

const projects = [
  {
    title: "SkillShare Hub",
    desc: "SkillShare Hub is a peer-learning platform that connects learners and mentors, enabling skill sharing through interactive profiles, collaboration, and seamless learning experiences.",
    github: "https://github.com/SOHAIL1510/Peer-Learning-app",
    live: "https://peer-learning-app.vercel.app/",
  },
  {
    title: "Dockerized Application Deployment",
    desc: "A Docker-based project that containerizes an application to ensure fast deployment, consistent environments, and smooth scalability across different systems.",
    github: "https://github.com/SOHAIL1510/node-devops-cicd-demo",
    live: "https://hub.docker.com/repository/docker/sohail8/devops-node-app/general",
  },
  {
    title: "Learning App Mobile Design",
    desc: "A clean and engaging Figma-based UI/UX design for a learning app, focused on intuitive navigation and an improved user learning experience.",
    github: "https://github.com/SOHAIL1510/DECEPTICONS",
    live: "https://www.figma.com/proto/TtrrPDrsUIx4AkIXOuH8we/Learning-Mobile-App?t=wG6JUeH9b6P2IIrd-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&node-id=9-3233&starting-point-node-id=0%3A813",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-[#0b0b0b]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-400"
        >
          Projects
        </motion.h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-400 transition"
            >
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="mt-3 text-gray-400">{project.desc}</p>

            <div className="mt-5 flex gap-4">
            <a
            href={project.github}
            target="_blank"
            className="text-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-400 transition"
            >
                GitHub
            </a>

            <a
            href={project.live}
            target="_blank"
            className="text-sm px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
            >
                Live Demo
            </a>
        </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
