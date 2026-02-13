import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-lg border-b border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center items-center">
        <div className="flex gap-10 relative">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`relative font-medium transition ${
                active === link.id
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              {link.label}

              {active === link.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 -bottom-2 w-full h-[2px] bg-blue-400 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
