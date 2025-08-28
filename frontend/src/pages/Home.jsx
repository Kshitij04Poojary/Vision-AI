import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Features List
const features = [
  { text: "Dual Eye Scanning", icon: "👁", description: "Advanced bilateral retinal imaging with high-resolution capture" },
  { text: "AI Disease Detection", icon: "🤖", description: "ML-powered analysis detecting early signs of retinal diseases with 99% accuracy" },
  { text: "Instant Results", icon: "📊", description: "Comprehensive eye health report generated within minutes" },
  { text: "Doctor Appointment", icon: "👨‍⚕", description: "Immediate scheduling with specialists if concerns are detected" },
  { text: "Medical Records", icon: "📋", description: "Secure storage and tracking of all scan results and appointments" },
  { text: "Personalized Treatment Plan", icon: "💊", description: "Customized recommendations based on AI analysis" }
];

// Special Features List
const specialFeatures = [
  {
    title: "Smart Doctor Appointments",
    icon: "🏥",
    description: "AI-powered scheduling system matching you with the right specialist.",
    highlights: ["Instant booking", "Specialist matching", "Emergency priority", "Appointment reminders"]
  },
  {
    title: "Video Consultations",
    icon: "📱",
    description: "Connect with eye care professionals anytime via secure video.",
    highlights: ["HD video", "Screen sharing", "Chat with specialists", "Mobile-friendly"]
  },
  {
    title: "Comprehensive Reports",
    icon: "📊",
    description: "Detailed AI-generated reports with analysis and recommendations.",
    highlights: ["PDF format", "Trend analysis", "Doctor sharing", "Secure encryption"]
  }
];

export default function Home() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: entry.isIntersecting }));
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".scroll-fade").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden flex flex-col">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-screen flex items-center justify-center text-center px-4"
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Welcome to</h1>
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold text-blue-400 mb-6"
          >
            AI Eye Health Scanner
          </motion.div>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Advanced AI-powered retinal disease detection system
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white text-4xl cursor-pointer"
          >
            ↓
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="scroll-fade bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 border border-gray-700"
            >
              <div className="text-4xl mb-4 text-blue-400">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.text}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Us */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">About Us</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto">
          Our system captures images of both left and right eyes, runs an ML analysis, and detects potential diseases. If a condition is identified, a video consultation with a specialist is recommended to provide personalized treatment options.
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-950 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <p className="text-gray-400">We are pioneering AI-powered eye health screening.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@aieyehealth.com</p>
              <p className="text-gray-400">Phone: 9967518066</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="#" className="text-blue-400 mx-2">Privacy Policy</a>
            <a href="#" className="text-blue-400 mx-2">Terms of Service</a>
            <a href="#" className="text-blue-400 mx-2">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}