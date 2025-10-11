import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 bg-gradient-to-b from-pink-50 via-white to-white">
      {/* Main container with vertical layout and centered items */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12">
        
        {/* Top Content (Heading & CTA) */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center" // Center all text content
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Campus Match
            </span>{" "}
            Today ❤️
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Step into a world where friendships turn into something special.
            CampusCupid connects you with like-minded students across your college.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <button className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform">
              Start Your Journey
            </button>
          </div>
        </motion.div>

        {/* Bottom Content (Video) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl" // Control the video's max width
        >
          <div className="rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform">
            <video
              className="w-full h-auto rounded-2xl" // Video takes full width of its container
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="src/assets/introVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;