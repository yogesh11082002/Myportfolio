"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/layout/Container";
import { Code, Palette, Laptop, Smartphone, CodeXml } from "lucide-react";
import Image from "next/image";

const SimpleAbout = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const skills = [
    { name: "Next.js", icon: <CodeXml className="h-6 w-6 text-purple-500" /> },
    { name: "Firebase", icon: <Code className="h-6 w-6 text-purple-500" /> },
    {
      name: "Tailwind CSS",
      icon: <Palette className="h-6 w-6 text-purple-500" />,
    },
    { name: "Typescript", icon: <Code className="h-6 w-6 text-purple-500" /> },
    {
      name: "Framer Motion",
      icon: <Smartphone className="h-6 w-6 text-purple-500" />,
    },
    { name: "GSAP", icon: <Laptop className="h-6 w-6 text-purple-500" /> },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gray-950"
    >
      {/* Background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900 to-transparent" />

      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            About <span className="text-purple-500">Me</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "80px" } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-purple-500 mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            I'm a passionate web developer and UX designer with expertise in
            building modern, responsive, and interactive web applications.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/yogesh2.jpg"
                alt="Yogesh - About Me"
                fill
                className="object-cover object-center"
              />

              {/* Image border decoration */}
              <div className="absolute -right-4 -bottom-4 w-full h-full border-2 border-purple-600/30 rounded-lg -z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>

            {/* Experience counters */}
            <div className="glass absolute -right-10 -bottom-10 px-6 py-4 rounded-lg bg-gray-800/70 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">2+</p>
              <p className="text-gray-400 text-sm">Years Experience</p>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">
              Web Developer &{" "}
              <span className="text-purple-500">UX Designer</span>
            </h3>
            <p className="text-gray-400">
              I'm passionate about creating exceptional digital experiences that
              combine clean, efficient code with beautiful, intuitive designs.
              With over 2 years of experience, I've worked on a variety of
              projects from responsive websites to interactive web applications.
            </p>
            <p className="text-gray-400">
              My focus is on creating high-performance, user-friendly interfaces
              with smooth animations and responsive layouts that work flawlessly
              across all devices.
            </p>

            {/* Info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
              >
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Frontend Development
                </h4>
                <p className="text-gray-400 text-sm">
                  Building responsive, performant web applications with modern
                  frameworks
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
              >
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  UI/UX Design
                </h4>
                <p className="text-gray-400 text-sm">
                  Creating intuitive, beautiful interfaces with great user
                  experience
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
              >
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Animation & Interaction
                </h4>
                <p className="text-gray-400 text-sm">
                  Adding life to interfaces with smooth, purposeful animations
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
              >
                <h4 className="font-semibold mb-2 flex items-center">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Responsive Design
                </h4>
                <p className="text-gray-400 text-sm">
                  Ensuring perfect experiences across all devices and screen
                  sizes
                </p>
              </motion.div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-md border border-gray-800"
                  >
                    {skill.icon}
                    <span className="text-sm text-gray-300">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default SimpleAbout;
