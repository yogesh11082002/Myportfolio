"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="col-span-1 md:col-span-1"
          >
            <Link href="/" className="text-white font-bold text-xl md:text-2xl">
              <span className="text-purple-500">Yogesh</span>
              <span className="text-white">.dev</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Crafting digital experiences with code and creativity.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-purple-500 transition-colors">
                Web Development
              </li>
              <li className="text-gray-400 hover:text-purple-500 transition-colors">
                UI/UX Design
              </li>
              <li className="text-gray-400 hover:text-purple-500 transition-colors">
                Frontend Development
              </li>
              <li className="text-gray-400 hover:text-purple-500 transition-colors">
                Responsive Design
              </li>
              <li className="text-gray-400 hover:text-purple-500 transition-colors">
                Mobile-First Approach
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
            <p className="text-gray-400 mb-4">
              Want to work together? Feel free to reach out!
            </p>
            <Link
              href="/contact"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition-colors inline-block"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex space-x-6 mb-6 md:mb-0"
          >
            <motion.a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              variants={fadeInUp}
            >
              <Github size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              variants={fadeInUp}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              variants={fadeInUp}
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a
              href="mailto:your.email@example.com"
              className="text-gray-400 hover:text-white transition-colors"
              variants={fadeInUp}
            >
              <Mail size={20} />
            </motion.a>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} Yogesh. All rights reserved.
          </motion.p>

          <motion.button
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white transition-colors mt-6 md:mt-0"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
