"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { fadeUpVariant, staggerContainerVariant } from "@/lib/animations";
import { gsap } from "gsap";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import { ArrowDownCircle, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate background gradient
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    if (bgRef.current) {
      tl.to(bgRef.current, {
        background:
          "radial-gradient(circle at 10% 50%, rgba(76, 29, 149, 0.3) 0%, rgba(0, 0, 0, 0) 50%)",
        duration: 8,
      })
        .to(bgRef.current, {
          background:
            "radial-gradient(circle at 90% 70%, rgba(147, 51, 234, 0.3) 0%, rgba(0, 0, 0, 0) 50%)",
          duration: 8,
        })
        .to(bgRef.current, {
          background:
            "radial-gradient(circle at 50% 20%, rgba(76, 29, 149, 0.3) 0%, rgba(0, 0, 0, 0) 50%)",
          duration: 8,
        });
    }

    // Add parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        gsap.to(heroRef.current.querySelector(".hero-content"), {
          y: scrollPosition * 0.2,
          duration: 0.5,
          ease: "power1.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Animated background */}
      <div ref={bgRef} className="absolute inset-0 bg-gray-950 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[80%] rounded-full blur-[120px] bg-purple-900/20 animate-blob" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[120px] bg-indigo-900/20 animate-blob animation-delay-2000" />
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] rounded-full blur-[120px] bg-violet-900/20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero content */}
      <Container>
        <div className="hero-content relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariant}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left column - Text content */}
            <div className="order-2 lg:order-1">
              <motion.h2
                variants={fadeUpVariant}
                custom={0}
                className="text-sm md:text-base font-medium text-purple-500 mb-4"
              >
                Hello! I am Yogesh 👋
              </motion.h2>

              <motion.h1
                variants={fadeUpVariant}
                custom={1}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className="block">Web Developer</span>
                <span className="block text-purple-500">& UX Designer</span>
              </motion.h1>

              <motion.div
                variants={fadeUpVariant}
                custom={2}
                className="text-lg md:text-xl text-gray-400 mb-6"
              >
                I specialize in creating{" "}
                <span className="text-white">
                  <Typewriter
                    options={{
                      strings: [
                        "modern web applications",
                        "responsive designs",
                        "interactive experiences",
                        "creative animations",
                      ],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </span>
              </motion.div>

              <motion.p
                variants={fadeUpVariant}
                custom={3}
                className="text-gray-400 mb-8"
              >
                Crafting digital experiences with Next.js, Firebase, beautiful
                animations, and responsive designs that make an impact.
              </motion.p>

              <motion.div
                variants={fadeUpVariant}
                custom={4}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/projects"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium transition-all transform hover:-translate-y-1"
                >
                  View My Work
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border border-purple-600 text-purple-500 hover:text-white hover:bg-purple-600 px-8 py-3 rounded-md font-medium transition-all transform hover:-translate-y-1"
                >
                  Contact Me
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUpVariant}
                custom={5}
                className="flex items-center gap-6 mt-10"
              >
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </motion.div>
            </div>

            {/* Right column - Profile image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative w-full h-[380px] md:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-gray-900/30 backdrop-blur-sm border border-purple-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Add your profile image */}
                  <Image
                    src="/yogesh.jpg"
                    alt="Yogesh - Web Developer & UX Designer"
                    fill
                    priority
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl border-2 border-purple-600/30 -z-10" />
              <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full border-2 border-purple-600/30 -z-10" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <p className="text-gray-400 text-sm mb-2">Scroll Down</p>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <ArrowDownCircle className="text-purple-500" size={24} />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;
