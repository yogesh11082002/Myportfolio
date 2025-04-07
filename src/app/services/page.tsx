"use client";

import { motion } from "framer-motion";
import {
  pageTransitionVariant,
  fadeUpVariant,
  staggerContainerVariant,
} from "@/lib/animations";
import Container from "@/components/layout/Container";
import { Code, Globe, Palette, Smartphone, Gauge, Zap } from "lucide-react";

// Services data
const services = [
  {
    icon: <Code className="h-10 w-10 text-purple-500" />,
    title: "Web Development",
    description:
      "Building modern, responsive websites and web applications with the latest technologies and best practices. I create clean, efficient code that's easy to maintain and scale.",
    features: [
      "Custom website development",
      "Web application development",
      "E-commerce solutions",
      "API development and integration",
      "Content management systems",
    ],
  },
  {
    icon: <Palette className="h-10 w-10 text-purple-500" />,
    title: "UI/UX Design",
    description:
      "Creating intuitive, user-friendly interfaces with a focus on user experience. I design visually appealing interfaces that are easy to navigate and engage users.",
    features: [
      "User interface design",
      "User experience optimization",
      "Wireframing and prototyping",
      "Interactive design",
      "Design systems",
    ],
  },
  {
    icon: <Smartphone className="h-10 w-10 text-purple-500" />,
    title: "Responsive Design",
    description:
      "Developing websites and applications that work seamlessly across all devices, from desktop to mobile. I ensure your site looks great and functions perfectly no matter the screen size.",
    features: [
      "Mobile-first approach",
      "Cross-device compatibility",
      "Adaptive layouts",
      "Touch-friendly interfaces",
      "Performance optimization",
    ],
  },
  {
    icon: <Gauge className="h-10 w-10 text-purple-500" />,
    title: "Performance Optimization",
    description:
      "Improving website speed and performance to provide a better user experience. Fast-loading websites convert better and rank higher in search results.",
    features: [
      "Page speed optimization",
      "Code optimization",
      "Asset optimization",
      "Caching strategies",
      "Performance monitoring",
    ],
  },
  {
    icon: <Globe className="h-10 w-10 text-purple-500" />,
    title: "SEO Integration",
    description:
      "Implementing search engine optimization best practices to improve visibility and rankings. I help your website get found by the right audience.",
    features: [
      "On-page SEO optimization",
      "Technical SEO",
      "SEO-friendly content structure",
      "Performance optimization for SEO",
      "Structured data markup",
    ],
  },
  {
    icon: <Zap className="h-10 w-10 text-purple-500" />,
    title: "Animation & Interaction",
    description:
      "Adding life to your website with stunning animations and interactive elements. I create smooth, purposeful animations that enhance user experience without sacrificing performance.",
    features: [
      "UI animations and transitions",
      "Scroll-triggered animations",
      "Interactive user interfaces",
      "Micro-interactions",
      "3D effects and parallax",
    ],
  },
];

export default function ServicesPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
    >
      {/* Hero Section for Services Page */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gray-950">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
        <Container className="relative z-10">
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-8">
            My Services
          </h1>
          <div className="w-16 h-1 bg-purple-600 mx-auto mb-8"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-gray-400 max-w-3xl mx-auto mb-12"
          >
            I offer a range of services to help businesses and individuals
            establish a strong online presence. From web development to design
            and optimization, I provide end-to-end solutions tailored to your
            needs.
          </motion.p>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-900">
        <Container>
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeUpVariant}
                custom={index}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 h-full flex flex-col hover:border-purple-500/50 transition-all duration-300 card-hover"
              >
                <div className="bg-gray-900/60 p-4 rounded-full w-fit mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  {service.description}
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-purple-500 mb-3">
                    What I offer:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-gray-400 text-sm flex items-start"
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to work together?
            </h2>
            <p className="text-gray-400 mb-8">
              Let's discuss your project and how I can help you achieve your
              goals. I'm available for freelance work and would love to hear
              from you.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Get In Touch
            </motion.a>
          </div>
        </Container>
      </section>
    </motion.div>
  );
}
