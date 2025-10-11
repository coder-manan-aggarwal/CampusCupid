import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityCard = ({ community }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full aspect-square cursor-pointer [perspective:1000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => navigate(`/communities/${community._id}`)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-md border border-gray-200">
          <img
            src={community.icon}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
          rounded-xl shadow-md border border-indigo-400
          bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400
          text-white flex flex-col items-center justify-center p-6"
        >
          <h3 className="text-2xl font-bold mb-3 text-center drop-shadow-lg">
            {community.name}
          </h3>
          <p className="text-lg flex items-center gap-2 opacity-90">
            <Users size={20} /> {community.members?.length || 0} Members
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommunityCard;
