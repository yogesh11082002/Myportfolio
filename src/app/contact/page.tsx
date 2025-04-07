"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransitionVariant, fadeUpVariant } from "@/lib/animations";
import TextReveal from "@/components/animations/TextReveal";
import Container from "@/components/layout/Container";
import { submitContactForm, isValidEmail } from "@/lib/contact";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from "lucide-react";

export default function ContactPage() {
  // Track if Firebase is properly configured
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);

  // Check Firebase configuration when the component mounts
  useEffect(() => {
    const checkFirebaseConfig = async () => {
      try {
        // Check if the environment variable for API key is set
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!apiKey || apiKey === "your-api-key") {
          setIsFirebaseConfigured(false);
        }
      } catch (error) {
        console.error("Error checking Firebase config:", error);
        setIsFirebaseConfigured(false);
      }
    };

    checkFirebaseConfig();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name) {
      setSubmitError("Please enter your name.");
      return;
    }

    if (!formData.email) {
      setSubmitError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (!formData.message) {
      setSubmitError("Please enter your message.");
      return;
    }

    // Check if Firebase is properly configured
    if (!isFirebaseConfigured) {
      setSubmitError(
        "Contact form is not properly configured. Please set up Firebase environment variables."
      );
      return;
    }

    // Reset states
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError("");

    try {
      // Submit to Firebase using our helper function
      await submitContactForm(formData);

      // Success response
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        "There was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
    >
      {/* Hero Section for Contact Page */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gray-950">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
        <Container className="relative z-10">
          <TextReveal
            text="Get In Touch"
            element="h1"
            className="text-center text-4xl md:text-5xl font-bold mb-8"
            direction="up"
            staggerChildren={0.05}
            threshold={0.5}
            once={true}
          />
          <div className="w-16 h-1 bg-purple-600 mx-auto mb-8"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Have a project in mind or want to discuss a potential collaboration?
            I'd love to hear from you. Fill out the form below or reach out
            directly through any of the provided contact methods.
          </motion.p>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <motion.h2
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                custom={0}
                className="text-2xl font-bold mb-8"
              >
                Contact Information
              </motion.h2>

              <div className="space-y-6 mb-12">
                <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gray-800 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">
                      <a
                        href="mailto:your.email@example.com"
                        className="hover:text-purple-500 transition-colors"
                      >
                        your.email@example.com
                      </a>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gray-800 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-400">
                      <a
                        href="tel:+91XXXXXXXXXX"
                        className="hover:text-purple-500 transition-colors"
                      >
                        +91 XXXX XXX XXX
                      </a>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gray-800 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-400">Your City, Country</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <h3 className="font-semibold mb-4">Connect with me</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-400 hover:text-white transition-all"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-400 hover:text-white transition-all"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-400 hover:text-white transition-all"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                animate="visible"
                custom={5}
                className="mt-12"
              >
                <h3 className="font-semibold mb-4">Availability</h3>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 mb-3">
                    I'm currently available for freelance work and new
                    opportunities. My typical response time is within 24 hours.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-sm">
                      Available for work
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <h2 className="text-2xl font-bold mb-8">Send Me a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                    required
                  ></textarea>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-400 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.75 12.75L10 15.25L16.25 8.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span>Your message has been sent successfully!</span>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 9V14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M12 21.41H5.94C2.47 21.41 1.02 18.93 2.7 15.9L5.82 10.28L8.76 5.00003C10.54 1.79003 13.46 1.79003 15.24 5.00003L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M11.995 17H12.005"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-all flex items-center justify-center disabled:bg-purple-800 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </motion.div>
  );
}
