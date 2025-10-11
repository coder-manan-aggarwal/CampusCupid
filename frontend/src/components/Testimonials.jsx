import React from "react";
import { motion } from "framer-motion";

// New testimonials, relevant to a college dating app, now with image URLs
const testimonials = [
  {
    name: "Aisha Kapoor",
    handle: "@aishak",
    text: "Finally, an app where I can find people from my own campus! It feels so much safer and the events feature is a game-changer.",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Rohan Desai",
    handle: "@rohandesai",
    text: "Honestly, I just signed up to find a study partner for my stats class, but I ended up meeting someone amazing. 10/10.",
    imageUrl: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    name: "Priya Sharma",
    handle: "@priyasharma",
    text: "It's way less awkward than other dating apps because you already have your college in common. Great conversation starter!",
    imageUrl: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    name: "Vikram Singh",
    handle: "@viksingh",
    text: "Met some cool people for pickup basketball through the campus posts. It's more than just a dating app.",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Neha Reddy",
    handle: "@nehareddy",
    text: "I love that it's verified students only. Makes me feel comfortable and the connections feel more genuine.",
    imageUrl: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    name: "Siddharth Jain",
    handle: "@sidjain",
    text: "Found my girlfriend on here. We were in the same chemistry lab and had no idea! Thanks, CampusCupid.",
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    name: "Meera Iyer",
    handle: "@meeraiyer",
    text: "Super intuitive and easy to use. The profile prompts are actually fun to fill out.",
    imageUrl: "https://randomuser.me/api/portraits/women/47.jpg"
  },
  {
    name: "Aditya Kumar",
    handle: "@adityak",
    text: "Great for first-years who want to meet new people outside of their dorm. Highly recommend.",
    imageUrl: "https://randomuser.me/api/portraits/men/47.jpg"
  },
];

// Component for a single testimonial card
const TestimonialCard = ({ name, handle, text, imageUrl }) => (
  <div className="flex-shrink-0 w-80 md:w-96 mx-4 py-4">
    <div className="bg-pink-50/60 border border-pink-200/70 p-6 rounded-2xl h-full text-left flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={imageUrl} 
          alt={`Profile of ${name}`} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{handle}</p>
        </div>
      </div>
      <p className="text-gray-600 flex-grow">“{text}”</p>
    </div>
  </div>
);

export default function Testimonials() {
  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  // We duplicate the testimonials in each row to create a seamless, infinite scrolling loop
  const duplicatedFirstRow = [...firstRow, ...firstRow];
  const duplicatedSecondRow = [...secondRow, ...secondRow];

  return (
    <>
      <style>
        {`
          @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
          }
          .group:hover .animate-scroll-left,
          .group:hover .animate-scroll-right {
            animation-play-state: paused;
          }
        `}
      </style>
      <section id="testimonials" className="py-24 bg-white font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              Straight from the <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              See what they're saying about us.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 flex flex-col gap-8">
          {/* Top Row: Scrolls right to left */}
          <div className="group relative w-full overflow-hidden">
            <div className="flex animate-scroll-left">
              {duplicatedFirstRow.map((t, i) => (
                <TestimonialCard key={`top-${i}`} {...t} />
              ))}
            </div>
          </div>
          {/* Bottom Row: Scrolls left to right */}
          <div className="group relative w-full overflow-hidden">
            <div className="flex animate-scroll-right">
              {duplicatedSecondRow.map((t, i) => (
                <TestimonialCard key={`bottom-${i}`} {...t} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


