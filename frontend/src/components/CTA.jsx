import React from "react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-pink-50/30 font-sans">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            Start Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Dating Journey</span>
            <br />
            with CampusCupid Today
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Join thousands of students across campus already making new friends and meaningful connections.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="inline-block px-8 py-4 rounded-full text-white font-bold tracking-wide bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Join Now & Find Your Match →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

