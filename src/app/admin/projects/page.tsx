"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransitionVariant } from "@/lib/animations";
import Container from "@/components/layout/Container";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "@/lib/cloudinary";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  X,
  ExternalLink,
  Github,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { CloudinaryUploadWidget } from "@/components/ui/CloudinaryUploadWidget";
import { SimpleCloudinaryUpload } from "@/components/ui/SimpleCloudinaryUpload";
import { CloudinaryTest } from "@/components/ui/CloudinaryTest";

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  imagePublicId?: string;
  imageWidth?: number;
  imageHeight?: number;
  liveUrl?: string | null;
  githubUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState("");

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from Firestore
  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!db) {
        throw new Error("Firebase is not initialized");
      }

      const projectsQuery = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTags("");
    setLiveUrl("");
    setGithubUrl("");
    setEditingProject(null);
    setError("");
    setSuccess("");
    setShowModal(false);
    setEditingImageUrl("");
  };

  // Open edit modal with existing project data
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setTags(project.tags.join(", "));
    setLiveUrl(project.liveUrl || "");
    setGithubUrl(project.githubUrl || "");
    setEditingImageUrl(project.image);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!title.trim() || !description.trim() || !category.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editingProject && !editingImageUrl) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Prepare image data from the editingProject state which was updated by the CloudinaryUploadWidget
      const imageData = {
        url: editingImageUrl || editingProject?.image || "",
        publicId: editingProject?.imagePublicId || "",
        width: editingProject?.imageWidth || 0,
        height: editingProject?.imageHeight || 0,
      };

      // Prepare project data
      const projectData = {
        title,
        description,
        category,
        tags: tagArray,
        image: imageData.url,
        imagePublicId: imageData.publicId,
        imageWidth: imageData.width,
        imageHeight: imageData.height,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        updatedAt: new Date().toISOString(),
      };

      // Update or create project
      if (editingProject) {
        // Update existing project
        if (!db) throw new Error("Firebase is not initialized");
        await updateDoc(doc(db, "projects", editingProject.id), projectData);

        // Update local state
        setProjects(
          projects.map((p) =>
            p.id === editingProject.id ? { ...p, ...projectData, id: p.id } : p
          )
        );

        setSuccess("Project updated successfully!");
      } else {
        // Create new project
        const newProjectData = {
          ...projectData,
          createdAt: new Date().toISOString(),
        };

        if (!db) throw new Error("Firebase is not initialized");
        const docRef = await addDoc(collection(db, "projects"), newProjectData);

        // Update local state
        setProjects([...projects, { ...newProjectData, id: docRef.id }]);

        setSuccess("Project created successfully!");
      }

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Error submitting project:", err);
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId: string, project: Project) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setLoading(true);
    try {
      if (!db) throw new Error("Firebase is not initialized");
      await deleteDoc(doc(db, "projects", projectId));

      // Try to delete the image from Cloudinary
      if (project.imagePublicId) {
        try {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicId: project.imagePublicId }),
          });
        } catch (imgErr) {
          console.error("Error deleting image:", imgErr);
          // Continue even if image deletion fails
        }
      }

      // Remove from local state
      setProjects(projects.filter((p) => p.id !== projectId));
      setSuccess("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
      className="min-h-screen bg-gray-950"
    >
      <div className="pt-32 pb-20 px-8">
        <Container>
          {!loading ? (
            <div>
              {/* Header with back button */}
              <div className="flex items-center mb-8">
                <Link
                  href="/admin"
                  className="flex items-center text-gray-400 hover:text-white mr-4 group"
                >
                  <ArrowLeft
                    size={20}
                    className="mr-2 transition-all transform group-hover:-translate-x-1"
                  />
                  <span>Back to Admin</span>
                </Link>
              </div>

              {/* Error and success messages */}
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded mb-6">
                  {success}
                </div>
              )}

              {/* Main content */}
              {showModal ? (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </h2>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowModal(false);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-1"
                          >
                            Project Title*
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium mb-1"
                          >
                            Category*
                          </label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="Web Development">
                              Web Development
                            </option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="tags"
                            className="block text-sm font-medium mb-1"
                          >
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="React, Next.js, TailwindCSS"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="liveUrl"
                            className="block text-sm font-medium mb-1"
                          >
                            Live URL
                          </label>
                          <input
                            type="url"
                            id="liveUrl"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="githubUrl"
                            className="block text-sm font-medium mb-1"
                          >
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            id="githubUrl"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-1"
                          >
                            Description*
                          </label>
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            Featured Image{" "}
                            {!editingImageUrl && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <div className="space-y-2">
                            {editingImageUrl && (
                              <div className="relative h-40 w-full bg-gray-800 overflow-hidden rounded mb-3">
                                <Image
                                  src={editingImageUrl}
                                  alt="Current project image"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingImageUrl("");
                                    }}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                  >
                                    Replace Image
                                  </button>
                                </div>
                              </div>
                            )}

                            {!editingImageUrl && (
                              <div className="space-y-3">
                                <SimpleCloudinaryUpload
                                  onSuccess={(result) => {
                                    setEditingImageUrl(result.secure_url);
                                    // Update the form data with Cloudinary info
                                    setEditingProject((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            image: result.secure_url,
                                            imagePublicId: result.public_id,
                                            imageWidth: result.width,
                                            imageHeight: result.height,
                                          }
                                        : null
                                    );
                                  }}
                                  buttonText="Select & Upload Image"
                                  className="w-full py-3"
                                />
                                <div className="text-xs text-gray-500">
                                  Max file size: 5MB. Recommended dimensions:
                                  1200 × 800 pixels.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            {editingProject ? "Updating..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            {editingProject ? "Update Project" : "Add Project"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Display Cloudinary image details when editing */}
                  {editingProject &&
                    editingProject.imagePublicId &&
                    editingImageUrl && (
                      <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 mt-2">
                        <h4 className="font-medium text-gray-300 mb-1">
                          Image Details
                        </h4>
                        <p
                          className="truncate"
                          title={editingProject.imagePublicId}
                        >
                          Public ID: {editingProject.imagePublicId}
                        </p>
                        {editingProject.imageWidth &&
                          editingProject.imageHeight && (
                            <p>
                              Dimensions: {editingProject.imageWidth} ×{" "}
                              {editingProject.imageHeight}px
                            </p>
                          )}
                      </div>
                    )}
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-6">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-300"
                    >
                      <Plus size={18} />
                      Add New Project
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
                      <p className="text-gray-400 mb-4">No projects found</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-300 mx-auto"
                      >
                        <Plus size={18} />
                        Add Your First Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800"
                        >
                          <div className="relative pb-[56.25%] bg-gray-800">
                            {project.image && (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold text-white truncate">
                                {project.title}
                              </h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEditModal(project)}
                                  className="text-gray-400 hover:text-blue-500"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteProject(project.id, project)
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <span className="inline-block bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-300 mb-2">
                              {project.category}
                            </span>
                            <p className="text-gray-400 mb-2 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="text-xs text-gray-500">
                              {project.createdAt && (
                                <p>
                                  Created:{" "}
                                  {new Date(
                                    project.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              )}
                              {project.imagePublicId && (
                                <p
                                  className="truncate"
                                  title={project.imagePublicId}
                                >
                                  ID: {project.imagePublicId.substring(0, 20)}
                                  ...
                                </p>
                              )}
                              {project.imageWidth && project.imageHeight && (
                                <p>
                                  Dimensions: {project.imageWidth} ×{" "}
                                  {project.imageHeight}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p>Loading projects...</p>
            </div>
          )}

          <div className="mb-6">
           
          </div>
        </Container>
      </div>
    </motion.div>
  );
}
