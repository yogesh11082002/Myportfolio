"use client";

import { motion } from "framer-motion";
import { pageTransitionVariant } from "@/lib/animations";
import TextReveal from "@/components/animations/TextReveal";
import Container from "@/components/layout/Container";
import SimpleAbout from "@/components/sections/SimpleAbout";

export default function AboutPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
    >
      {/* Hero Section for About Page */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gray-950">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
      
      </section>

      {/* About Section Component */}
      <SimpleAbout />

      {/* Experience Section */}
      <section className="py-24 relative overflow-hidden bg-gray-900">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-950 to-transparent" />
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              My <span className="text-purple-500">Experience</span>
            </h2>
            <div className="h-1 w-20 bg-purple-500 mx-auto mb-8"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              My professional journey and the skills I've acquired along the
              way.
            </p>
          </div>

          <div className="space-y-12 max-w-3xl mx-auto">
            {/* Timeline items */}
            <div className="relative pl-10 border-l-2 border-purple-600">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-purple-600"></div>
              <div className="bg-gray-800/50 rounded-lg p-6 card-hover">
                <span className="text-purple-500 font-semibold">
                  2022 - Present
                </span>
                <h3 className="text-xl font-bold mt-1 mb-2">
                  Senior Web Developer
                </h3>
                <p className="text-gray-400 mb-3">Company Name</p>
                <p className="text-gray-400">
                  Led the development of multiple web applications using Next.js
                  and Firebase. Implemented responsive designs and captivating
                  animations to enhance user experiences.
                </p>
              </div>
            </div>

            <div className="relative pl-10 border-l-2 border-purple-600">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-purple-600"></div>
              <div className="bg-gray-800/50 rounded-lg p-6 card-hover">
                <span className="text-purple-500 font-semibold">
                  2020 - 2022
                </span>
                <h3 className="text-xl font-bold mt-1 mb-2">
                  Frontend Developer
                </h3>
                <p className="text-gray-400 mb-3">Company Name</p>
                <p className="text-gray-400">
                  Developed and maintained client-facing websites using React,
                  Tailwind CSS, and GSAP. Collaborated with designers to
                  implement visually appealing and functional interfaces.
                </p>
              </div>
            </div>

            <div className="relative pl-10 border-l-2 border-purple-600">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-purple-600"></div>
              <div className="bg-gray-800/50 rounded-lg p-6 card-hover">
                <span className="text-purple-500 font-semibold">
                  2018 - 2020
                </span>
                <h3 className="text-xl font-bold mt-1 mb-2">UI/UX Designer</h3>
                <p className="text-gray-400 mb-3">Company Name</p>
                <p className="text-gray-400">
                  Designed user interfaces for various web and mobile
                  applications. Created wireframes, prototypes, and conducted
                  user testing to ensure optimal user experience.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  );
}
