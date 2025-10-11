import { useEffect, useState } from "react";
import API from "../utils/api";
import EventCard from "../components/EventCard";

const Events = ({ searchQuery }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Use searchQuery from Layout
  const filteredEvents = events.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const desc = event.description?.toLowerCase() || "";
    return (
      title.includes(searchQuery.toLowerCase()) ||
      desc.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No matching events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
