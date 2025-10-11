// src/pages/EventDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { Calendar, Clock, MapPin, Sparkles, Users, MessageCircle } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams(); // eventId from URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Fetch event details error:", err));
  }, [id]);

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Banner */}
      {event.image && (
        <div className="w-full h-[400px]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-fill"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
        <p className="text-gray-600">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
          <p className="flex items-center gap-2">
            <Calendar size={18}/> {new Date(event.date).toDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={18}/> {event.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={18}/> {event.location}
          </p>
          {event.vibes && (
            <p className="flex items-center gap-2 text-pink-500">
              <Sparkles size={18}/> {event.vibes}
            </p>
          )}
        </div>

        {event.hostedBy && (
          <p className="text-sm text-gray-500">🎤 Hosted by {event.hostedBy}</p>
        )}

        {/* Attendees */}
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Attendees</h2>
          {event.members.length === 0 ? (
            <p className="text-gray-500">No one has joined yet.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {event.members.map((m) => (
                <div key={m._id} className="flex flex-col items-center">
                  <img
                    src={m.profile?.profilePic || "/default-avatar.png"}
                    alt={m.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <p className="text-xs mt-1">{m.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {event.joined ? (
            <button
              onClick={() => (window.location.href = `/lounges/${event.loungeId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              <MessageCircle size={16}/> Go to Lounge
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await API.post(`/events/${event._id}/join`);
                  window.location.reload(); // reload to reflect joined state
                } catch (err) {
                  console.error("Join event error:", err);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
            >
              <Users size={16}/> Join Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
