"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageTransitionVariant } from "@/lib/animations";
import Container from "@/components/layout/Container";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Inbox,
  FolderKanban,
  Home,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

// Types
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: any;
  read: boolean;
}

// Admin sidebar navigation items
const sidebarItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/admin" },
  { name: "Messages", icon: <Inbox size={18} />, path: "/admin/messages" },
  {
    name: "Projects",
    icon: <FolderKanban size={18} />,
    path: "/admin/projects",
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [projectCount, setProjectCount] = useState(0);

  // Check if user is already authenticated in session storage
  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchContactMessages();
      fetchProjectCount();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuthenticated", "true");
        fetchContactMessages();
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
  };

  const fetchContactMessages = async () => {
    setLoading(true);
    try {
      console.log("Attempting to fetch contact messages from Firestore");

      if (!db) {
        console.error("Firebase is not initialized");
        setContactMessages([]);
        setError("Firebase is not properly initialized");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "contacts"));
      const messages: ContactMessage[] = [];

      console.log(`Found ${querySnapshot.size} messages`);

      querySnapshot.forEach((doc) => {
        console.log("Document data:", doc.id, doc.data());
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ContactMessage);
      });

      // Sort messages by timestamp (newest first)
      messages.sort((a, b) => {
        // Handle missing timestamp
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;

        try {
          return b.timestamp.toDate() - a.timestamp.toDate();
        } catch (e) {
          console.error("Error sorting timestamps:", e);
          return 0;
        }
      });

      setContactMessages(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      setError("Failed to load contact messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectCount = async () => {
    try {
      if (!db) {
        console.error("Firebase is not initialized");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjectCount(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching project count:", error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      if (!db) return;

      await updateDoc(doc(db, "contacts", messageId), {
        read: true,
      });

      // Update local state
      setContactMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
      );

      console.log(`Message ${messageId} marked as read`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Admin Sidebar Component
  const Sidebar = () => (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 p-4 fixed left-0 top-0 pt-24">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
            Menu
          </h3>
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    activeSection === item.name.toLowerCase()
                      ? "bg-purple-900/40 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
            Account
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Dashboard Section - Overview
  const Dashboard = () => (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Messages Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Inbox className="text-purple-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold mb-1">
                {contactMessages.length}
              </p>
              <p className="text-sm text-gray-400">Total Messages</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">
                {contactMessages.filter((msg) => !msg.read).length}
              </p>
              <p className="text-sm text-gray-400">Unread</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection("messages")}
            className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            View All Messages
          </button>
        </div>

        {/* Projects Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FolderKanban className="text-purple-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Projects</h2>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">{projectCount}</p>
            <p className="text-sm text-gray-400">Total Projects</p>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setActiveSection("projects")}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
            >
              View Projects
            </button>
            <Link
              href="/admin/projects"
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
            >
              <PlusCircle size={14} className="mr-1" />
              Add New
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Messages Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Messages</h2>
          <button
            onClick={() => setActiveSection("messages")}
            className="text-purple-500 hover:text-purple-400 text-sm font-medium transition-colors"
          >
            View All
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          {contactMessages.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No messages yet</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {contactMessages.slice(0, 5).map((message) => (
                  <tr key={message.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {message.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {message.subject || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                      {formatDate(message.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {message.read ? (
                        <span className="text-gray-400">Read</span>
                      ) : (
                        <span className="text-purple-500 font-medium">
                          Unread
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  // Messages Section - Contact Messages
  const Messages = () => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Contact Messages</h1>
          {contactMessages.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {contactMessages.filter((msg) => !msg.read).length} unread of{" "}
              {contactMessages.length} total messages
            </p>
          )}
        </div>
        <button
          onClick={() => fetchContactMessages()}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition duration-300"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : contactMessages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No contact messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {contactMessages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-800/50 ${
                      !message.read ? "bg-gray-800/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {message.read ? (
                          <span className="text-gray-400">Read</span>
                        ) : (
                          <span className="text-purple-500 font-medium flex items-center">
                            <span className="bg-purple-500 h-2 w-2 rounded-full inline-block mr-1"></span>
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{message.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{message.subject || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {formatDate(message.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm max-w-xs truncate">
                        {message.message}
                      </div>
                      <details
                        className="mt-1"
                        onToggle={(e) => {
                          // Mark as read when details are opened
                          if (
                            (e.target as HTMLDetailsElement).open &&
                            !message.read
                          ) {
                            markAsRead(message.id);
                          }
                        }}
                      >
                        <summary className="text-xs text-purple-500 cursor-pointer">
                          Read more
                        </summary>
                        <p className="text-sm mt-2 text-gray-300 p-2 bg-gray-800/50 rounded">
                          {message.message}
                        </p>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Main Admin UI Render
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariant}
      className="min-h-screen bg-gray-950"
    >
      {!isAuthenticated ? (
        <section className="pt-32 pb-20">
          <Container>
            <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg border border-gray-800">
              <h1 className="text-2xl font-bold mb-6 text-center">
                Admin Login
              </h1>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </Container>
        </section>
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="ml-64 flex-1 pt-32 pb-20 px-8">
            {activeSection === "dashboard" && <Dashboard />}
            {activeSection === "messages" && <Messages />}
            {activeSection === "projects" && (
              <div className="flex justify-center items-center">
                <Link
                  href="/admin/projects"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg flex items-center"
                >
                  <span className="mr-2">Go to Projects Management</span>
                  <FolderKanban size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
