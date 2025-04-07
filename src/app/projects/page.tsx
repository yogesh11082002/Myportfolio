"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransitionVariant } from "@/lib/animations";
import TextReveal from "@/components/animations/TextReveal";
import Container from "@/components/layout/Container";
import { Filter, LayoutGrid, LayoutList, Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  timestamp: any;
}

export default function ProjectsPage() {
  // State for projects and loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for filtering and viewing options
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // State for categories and tags
  const [allCategories, setAllCategories] = useState<string[]>(["All"]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (!db) {
          throw new Error("Firebase is not initialized");
        }

        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsList: Project[] = [];

        querySnapshot.forEach((doc) => {
          projectsList.push({
            id: doc.id,
            ...doc.data(),
          } as Project);
        });

        // Sort by timestamp (newest first)
        projectsList.sort((a, b) => {
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;

          try {
            return b.timestamp.toDate() - a.timestamp.toDate();
          } catch (e) {
            console.error("Error sorting timestamps:", e);
            return 0;
          }
        });

        setProjects(projectsList);

        // Extract unique categories and tags
        const categories = [...new Set(projectsList.map((p) => p.category))];
        setAllCategories(["All", ...categories]);

        const tags = [...new Set(projectsList.flatMap((p) => p.tags))];
        setAllTags(tags);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on category, tags, and search query
  const filteredProjects = projects.filter((project) => {
    // Category filter
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => project.tags && project.tags.includes(tag));

    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTags && matchesSearch;
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
    >
      {/* Hero Section for Projects Page */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gray-950">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl opacity-30" />
        <Container className="relative z-10">
          <TextReveal
            text="My Projects"
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
            Explore my latest projects. Each one represents a unique challenge
            and showcases different aspects of my skills and expertise in web
            development and design.
          </motion.p>
        </Container>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gray-900">
        <Container>
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                  </button>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white w-full md:w-64"
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-gray-400">
                    {filteredProjects.length} projects found
                  </div>

                  <div className="bg-gray-800 p-1 rounded-md flex">
                    <button
                      onClick={() => setViewType("grid")}
                      className={`p-2 rounded ${
                        viewType === "grid"
                          ? "bg-gray-700 text-white"
                          : "text-gray-400"
                      }`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewType("list")}
                      className={`p-2 rounded ${
                        viewType === "list"
                          ? "bg-gray-700 text-white"
                          : "text-gray-400"
                      }`}
                    >
                      <LayoutList size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-medium mb-4">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-md ${
                            selectedCategory === category
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          } transition-colors`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-medium mb-4">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            selectedTags.includes(tag)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          } transition-colors`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Grid or List */}
              {filteredProjects.length > 0 ? (
                <div
                  className={
                    viewType === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "flex flex-col gap-6"
                  }
                >
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 ${
                        viewType === "list" ? "flex flex-col md:flex-row" : ""
                      }`}
                    >
                      <div
                        className={`relative h-48 overflow-hidden bg-gray-900 ${
                          viewType === "list" ? "md:w-1/3" : ""
                        }`}
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div
                        className={`p-6 ${
                          viewType === "list" ? "md:w-2/3" : ""
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags &&
                            project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <p className="text-gray-400 mb-6">
                          {project.description}
                        </p>
                        <div className="flex gap-4">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                            >
                              Source Code
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg mb-4">
                    No projects match your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedTags([]);
                      setSearchQuery("");
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </motion.div>
  );
}
