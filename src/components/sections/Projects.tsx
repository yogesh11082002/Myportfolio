"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { staggerContainerVariant } from "@/lib/animations";
import { ExternalLink, Github, LayoutGrid, LayoutList } from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define Project interface based on the admin panel
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePublicId?: string;
  imageWidth?: number;
  imageHeight?: number;
  category: string;
  tags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const Projects = () => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sectionRef, isInView] = useScrollAnimation<HTMLElement>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        if (!db) {
          throw new Error("Firebase is not initialized");
        }

        // Create a query to get the most recent 4 projects
        const projectsQuery = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(4)
        );

        const snapshot = await getDocs(projectsQuery);
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gray-950"
    >
      {/* Enhanced Background elements */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute top-1/3 right-20 w-44 h-44 bg-blue-900/20 rounded-full filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-gray-900 to-transparent" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Projects
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "80px" } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Here are some of my recent projects. Each project is unique and
            demonstrates different aspects of my skills and expertise.
          </motion.p>
        </div>

        {/* View toggle with improved design */}
        <div className="flex justify-end mb-8">
          <div className="bg-gray-800/50 p-1 rounded-lg flex backdrop-blur-sm border border-gray-700/30 shadow-lg">
            <motion.button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded ${
                viewType === "grid"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="Grid view"
              whileHover={viewType !== "grid" ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutGrid size={18} />
            </motion.button>
            <motion.button
              onClick={() => setViewType("list")}
              className={`p-2 rounded ${
                viewType === "list"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="List view"
              whileHover={viewType !== "list" ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutList size={18} />
            </motion.button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Projects Grid View */}
        {!loading && !error && viewType === "grid" && (
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-400">
                  No projects found. Check back later!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Projects List View */}
        {!loading && !error && viewType === "list" && (
          <motion.div
            variants={staggerContainerVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6"
          >
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">
                  No projects found. Check back later!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* View all projects button with animation */}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/projects"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
              >
                View All Projects
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </Container>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees rotation
    const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees rotation

    // Apply transforms to the card
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  // Reset card transform on mouse leave
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    setHovered(false);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: index * 0.1,
          },
        },
      }}
      className="group"
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-all duration-300 shadow-lg will-change-transform transform-gpu"
        style={{
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glowing effect when hovered */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 opacity-0 transition-opacity duration-500 pointer-events-none ${
            hovered ? "opacity-100" : ""
          }`}
          style={{ transform: "translateZ(0)" }}
        />

        {/* Content wrapper */}
        <div className="z-10 relative">
          {/* Project Image */}
          <div className="relative h-56 overflow-hidden">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <p className="text-gray-400 text-center px-8">
                  No image available
                </p>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Project links that appear on hover */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-xl"
                    aria-label="View live site"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={20} />
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-xl"
                    aria-label="View GitHub repository"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                  </motion.a>
                )}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm mb-5 line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags &&
                project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              {!project.tags ||
                (project.tags.length === 0 && (
                  <span className="text-xs bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                    {project.category}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectListItem = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.5,
            delay: index * 0.1,
          },
        },
      }}
      whileHover={{
        x: 5,
        transition: { duration: 0.2 },
      }}
      className="relative flex flex-col md:flex-row gap-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/30 transition-all duration-300 p-5 group shadow-lg"
    >
      {/* Project Image - Square thumbnail with 3D hover effect */}
      <div className="relative h-48 md:h-36 md:w-36 shrink-0 rounded-lg overflow-hidden shadow-md transform group-hover:translate-y-[-5px] transition-transform duration-300">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <p className="text-gray-400 text-center px-2 text-sm">No image</p>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Project Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-purple-100 group-hover:to-white transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 mb-3">
          {project.tags &&
            project.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 + tagIndex * 0.03 }}
                className="text-xs bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/30 group-hover:border-purple-500/30 transition-colors duration-300"
              >
                {tag}
              </motion.span>
            ))}
          {(!project.tags || project.tags.length === 0) && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/30"
            >
              {project.category}
            </motion.span>
          )}
        </div>

        {/* Project links */}
        <div className="flex gap-4">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={14} className="text-purple-500" /> Live Site
            </motion.a>
          )}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={14} className="text-purple-500" /> Code
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
