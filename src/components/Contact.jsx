import { motion } from "framer-motion";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      .then(
        () => {
          alert("Message sent successfully ✅");
          form.current.reset();
        },
        (error) => {
          alert("Failed to send message ❌");
          console.log(error.text);
        }
      );
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-400"
        >
          Contact
        </motion.h2>

        <motion.form
          ref={form}
          onSubmit={sendEmail}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-10 max-w-xl flex flex-col gap-4"
        >
          <input
            type="text"
            name="from_name"
            placeholder="Your Name"
            required
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-400"
          />

          <input
            type="email"
            name="from_email"
            placeholder="Your Email"
            required
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-400"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            className="p-4 rounded-xl bg-gray-900 border border-gray-800 focus:outline-none focus:border-blue-400"
          ></textarea>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
}
