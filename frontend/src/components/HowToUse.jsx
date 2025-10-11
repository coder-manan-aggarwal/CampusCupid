import React from "react";
import { motion } from "framer-motion";

// SVG Icon components to replace the react-icons library
const UserGraduateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-8 h-8" fill="currentColor">
    <path d="M320 32c-17.7 0-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32zM160 128c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm320 0c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM48 320c0-35.3 28.7-64 64-64h1.9c2.6-1.4 5.2-2.7 7.9-3.9c-2.3-11.4-3.8-23.2-3.8-35.4c0-53 43-96 96-96s96 43 96 96c0 12.1-1.5 23.9-3.8 35.4c2.7 1.2 5.3 2.5 7.9 3.9H480c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H112c-35.3 0-64-28.7-64-64v-32zm544 0v32c0 17.7-14.3 32-32 32H528c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32H144c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h-2.1c-17.7 0-32-14.3-32-32v-32c0-17.7-14.3-32-32-32s-32 14.3-32 32v32c0 53 43 96 96 96h352c53 0 96-43 96-96v-32c0-17.7-14.3-32-32-32s-32 14.3-32 32z"/>
  </svg>
);

const PenFancyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5l-48.4-48.4c-25-25-65.5-25-90.5 0zM311.9 86.6L425.4 199.9 152.4 472.9 39.1 360.2 311.9 86.6zM2.9 494.4c-3.8 13.4 8.2 25.4 21.6 21.6l123.5-35.3-109-109L2.9 494.4z"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144-144 64.5-144 144 64.5 144 144 144z"/>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
  </svg>
);

// The data for the steps, using the new SVG components
const steps = [
  {
    icon: <UserGraduateIcon />,
    title: "Sign Up Fast",
    desc: "Just use your college email. We'll verify you're a real student, keeping things safe and legit.",
  },
  {
    icon: <PenFancyIcon />,
    title: "Vibe Your Profile",
    desc: "Drop a killer bio, your top interests, and some fire photos. Show 'em who you are.",
  },
  {
    icon: <SearchIcon />,
    title: "Explore the Scene",
    desc: "Scope out campus posts, find events, and check out other student profiles. See what's up.",
  },
  {
    icon: <HeartIcon />,
    title: "Make Your Move",
    desc: "Send a friend request or shoot your shot with an 'Ask Out' request. Slide into those DMs.",
  },
];

// Animation variants for the container and the items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // This will make each child animate one after the other
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HowToUse() {
  return (
    <section id="howto" className="py-20 bg-pink-50/30 font-sans">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            How It <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Four simple steps to find your campus connection.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative p-0.5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group bg-white hover:bg-gradient-to-br from-pink-400 to-purple-500"
              variants={itemVariants}
            >
              <div className="relative bg-white h-full w-full rounded-[15px] p-8 text-left flex flex-col items-start overflow-hidden">
                <div className="absolute top-4 right-6 text-7xl font-extrabold text-gray-100 z-0">
                  0{idx + 1}
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-base text-gray-600">{step.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

