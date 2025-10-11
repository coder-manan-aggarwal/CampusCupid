import React from "react";
import { motion } from "framer-motion";

// SVG Icon components to replace the react-icons library
const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-8 h-8" fill="currentColor">
    <path d="M320 32c-17.7 0-32 14.3-32 32V192h112c17.7 0 32-14.3 32-32s-14.3-32-32-32H320V64c0-17.7-14.3-32-32-32zM216 96c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32V96zM592 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h16v32c0 77.4-44.2 144.7-109.3 178.2c-15.1 7.7-31.5 13.9-48.7 18.2V320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H416V192h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H416V96c0-53-43-96-96-96H224c-53 0-96 43-96 96v64H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v64H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v98.2c-17.2-4.3-33.6-10.5-48.7-18.2C44.2 384.7 0 317.4 0 240V208h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H0V128C0 57.3 57.3 0 128 0H480c70.7 0 128 57.3 128 128v48c0 17.7-14.3 32-32 32s-32-14.3-32-32V160h-16zm-396.4 288a256 256 0 1 0 392.8 0A256 256 0 1 0 195.6 416z"/>
  </svg>
);

const CommentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
    <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 146.3-74.4c28.7 12.1 60.5 18.4 93.7 18.4c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.5-78.1-13.1c-6.2-2.1-12.8-2.5-18.9-.9C154.5 388.5 125.8 400 96 400c-2.6 0-5.2-.2-7.9-.6C112.9 375.4 128 349.5 128 320c0-12.2-2.9-24.1-8.4-35.1c-5.1-10.2-4.6-22.1 1.4-31.8c27.5-44.5 68.3-73.1 115-73.1c114.9 0 208 78.8 208 176s-93.1 176-208 176z"/>
  </svg>
);

const MapMarkerAltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-8 h-8" fill="currentColor">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 256c35.346 0 64-28.654 64-64s-28.654-64-64-64-64 28.654-64 64 28.654 64 64 64z"/>
  </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
    </svg>
);

const features = [
  { icon: <GraduationCapIcon />, title: "Verified Students Only", desc: "Connect safely with real, verified students from your campus." },
  { icon: <CommentsIcon />, title: "Secure DMs & Group Chats", desc: "Slide into DMs or create group chats for your class or club." },
  { icon: <MapMarkerAltIcon />, title: "Find What's Happening", desc: "Anonymously post or find out what's trending on campus." },
  { icon: <HeartIcon />, title: "Connect on a Vibe", desc: "Our algorithm connects you based on shared interests and classes." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white font-sans">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Why You'll <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Love It</span>
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Designed for campus life and meaningful connections.
          </p>
        </motion.div>

        <motion.div 
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((f, i) => (
            <motion.div key={i} 
                className="relative p-8 border border-gray-200 rounded-2xl text-center flex flex-col items-center shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                variants={itemVariants}
            >
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg">
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {f.icon}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-base text-gray-600">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
