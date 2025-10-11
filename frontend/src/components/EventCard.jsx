// src/components/EventCard.jsx
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, Users, MessageCircle } from "lucide-react";

const EventCard = ({ event, onJoin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => (window.location.href = `/events/${event._id}`)}
      className="cursor-pointer bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition"
    >
      {/* Banner */}
      {event.image && (
        <div className="w-full aspect-[16/9]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
        

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={16} /> {new Date(event.date).toDateString()}
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock size={16} /> {event.time}
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin size={16} /> {event.location}
        </div>
        {event.vibes && (
          <div className="flex items-center gap-2 text-pink-500 text-sm font-medium">
            <Sparkles size={16} /> {event.vibes}
          </div>
        )}
        {event.hostedBy && (
          <p className="text-xs text-gray-500">🎤 Hosted by {event.hostedBy}</p>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          {event.joined ? (
            // ✅ Already joined → only show Go to Lounge
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/lounges/${event.loungeId}`;
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              <MessageCircle size={16} /> Go to Lounge
            </button>
          ) : (
            // ❌ Not joined → show Join Event
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoin?.(event._id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
            >
              <Users size={16} /> Join Event
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
