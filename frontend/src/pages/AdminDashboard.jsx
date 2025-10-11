import { useState, useEffect } from "react";
import API from "../utils/api"; // axios instance

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [poll, setPoll] = useState(null); // ✅ active poll

  // ===== Event Form =====
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    vibes: "",
    hostedBy: "",
    image: null,
  });

  // ===== Community Form =====
  const [communityForm, setCommunityForm] = useState({
    name: "",
    logo: null,
    description: "",
     category: "General", 
  });

  // ===== Poll Form =====
  const [pollForm, setPollForm] = useState({
    question: "",
    options: ["", ""],
  });

  // ====== FETCH DATA ======
  useEffect(() => {
    fetchEvents();
    fetchCommunities();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await API.get("/communities");
      setCommunities(res.data);
    } catch (err) {
      console.error("Error fetching communities", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchPoll = async () => {
    try {
      const res = await API.get("/polls");
      if (res.data && res.data.expiresAt) {
        const now = new Date();
        const expiry = new Date(res.data.expiresAt);
        if (expiry > now) {
          setPoll(res.data);
        } else {
          setPoll(null);
        }
      } else {
        setPoll(null);
      }
    } catch (err) {
      console.error("Error fetching poll", err);
    }
  };

  // ✅ Auto refresh poll every minute
  useEffect(() => {
    if (activeTab === "polls") {
      fetchPoll();
      const timer = setInterval(fetchPoll, 60000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  // ===== EVENT HANDLERS =====
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(eventForm).forEach((key) => {
        if (eventForm[key]) formData.append(key, eventForm[key]);
      });

      const res = await API.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newEvent = res.data.event;
      setEvents([...events, newEvent]);

      await API.post("/campus-updates", {
        type: "Event",
        title: `📅 ${newEvent.title} on ${new Date(newEvent.date).toDateString()}`,
        referenceId: newEvent._id,
      });

      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        vibes: "",
        hostedBy: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating event", err);
    }
  };

  // ===== COMMUNITY HANDLERS =====
  const handleCommunityChange = (e) => {
    if (e.target.name === "logo") {
      setCommunityForm({ ...communityForm, logo: e.target.files[0] });
    } else {
      setCommunityForm({ ...communityForm, [e.target.name]: e.target.value });
    }
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", communityForm.name);
      formData.append("description", communityForm.description);
       formData.append("category", communityForm.category);
      if (communityForm.logo) formData.append("icon", communityForm.logo);

      const res = await API.post("/communities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newCommunity = res.data;
      setCommunities([...communities, newCommunity]);

      await API.post("/campus-updates", {
        type: "Community",
        title: `🫂 New Community Created: ${newCommunity.name}`,
        referenceId: newCommunity._id,
      });

      setCommunityForm({ name: "", description: "", logo: null, category: "General" });
    } catch (err) {
      console.error("Error creating community", err);
    }
  };

  // ===== POLL HANDLERS =====
  const handlePollChange = (index, value) => {
    const newOptions = [...pollForm.options];
    newOptions[index] = value;
    setPollForm({ ...pollForm, options: newOptions });
  };

  const addOption = () => {
    setPollForm({ ...pollForm, options: [...pollForm.options, ""] });
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredOptions = pollForm.options.filter((opt) => opt.trim() !== "");


      if (filteredOptions.length < 2) {
        alert("Please add at least two options.");
        return;
      }

      const res = await API.post("/polls", {
        question: pollForm.question,
        options: filteredOptions,
      });

      setPoll(res.data);
      setPollForm({ question: "", options: ["", ""] });
    } catch (err) {
      console.error("Error creating poll", err);
    }
  };

  // ===== SIDEBAR =====
  const handleSidebarClick = (tab) => {
    setActiveTab(tab);
    if (tab === "users") fetchUsers();
    if (tab === "polls") fetchPoll();
  };

  // ===== RENDER =====
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer" onClick={() => handleSidebarClick("events")}>
            📅 Events
          </li>
          <li className="cursor-pointer" onClick={() => handleSidebarClick("users")}>
            👥 Users
          </li>
          <li className="cursor-pointer" onClick={() => handleSidebarClick("communities")}>
            🫂 Communities
          </li>
          <li className="cursor-pointer" onClick={() => handleSidebarClick("polls")}>
            🗳️ Polls
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* ===== EVENTS ===== */}
        {activeTab === "events" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
            <form
              onSubmit={handleEventSubmit}
              className="bg-white shadow p-6 rounded-lg mb-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Create Event</h2>
              <input
                type="text"
                name="title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                placeholder="Event Title"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <textarea
                name="description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                placeholder="Event Description"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <input
                type="date"
                name="date"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <input
                type="time"
                name="time"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <input
                type="text"
                name="location"
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                placeholder="Event Location"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <input
                type="text"
                name="vibes"
                value={eventForm.vibes}
                onChange={(e) =>
                  setEventForm({ ...eventForm, [e.target.name]: e.target.value })
                }
                placeholder="Event Vibes"
                className="w-full border p-2 mb-4 rounded"
              />
              <input
                type="text"
                name="hostedBy"
                value={eventForm.hostedBy}
                onChange={(e) =>
                  setEventForm({ ...eventForm, hostedBy: e.target.value })
                }
                placeholder="Hosted By"
                className="w-full border p-2 mb-4 rounded"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setEventForm({ ...eventForm, image: e.target.files[0] })
                }
                className="w-full mb-4"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
              >
                Add Event
              </button>
            </form>

            <div>
              <h2 className="text-xl font-semibold mb-4">All Events</h2>
              {events.length === 0 ? (
                <p>No events yet.</p>
              ) : (
                <ul className="space-y-4">
                  {events.map((event) => (
                    <li key={event._id} className="p-4 border rounded shadow bg-white">
                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <p>{event.description}</p>
                      <p className="text-gray-500">
                        📅 {new Date(event.date).toDateString()} 🕒 {event.time}
                      </p>
                      <p>📍 {event.location}</p>
                      {event.vibes && <p>🎶 Vibes: {event.vibes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <>
            <h1 className="text-3xl font-bold mb-6">All Users</h1>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <ul className="space-y-4">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="p-4 border rounded shadow bg-white flex items-center gap-4"
                  >
                    <img
                      src={
                        user.profile?.profilePic ||
                        `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
                          user.name
                        )}.svg?background=%236b21a8`
                      }
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* ===== COMMUNITIES ===== */}
        {activeTab === "communities" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Manage Communities</h1>
            <form
              onSubmit={handleCommunitySubmit}
              className="bg-white shadow p-6 rounded-lg mb-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Create Community</h2>
              <input
                type="text"
                name="name"
                value={communityForm.name}
                onChange={handleCommunityChange}
                placeholder="Community Name"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              <textarea
                name="description"
                value={communityForm.description}
                onChange={handleCommunityChange}
                placeholder="Community Description"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              {/* ✅ Category Dropdown */}
              <select
                name="category"
                value={communityForm.category}
                onChange={handleCommunityChange}
                className="w-full border p-2 mb-4 rounded bg-white"
              >
                <option value="General">General</option>
                <option value="Tech">Tech</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Academic">Academic</option>
                <option value="Literature">Literature</option>
              </select>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleCommunityChange}
                className="w-full mb-4"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Community
              </button>
            </form>
            <div>
              <h2 className="text-xl font-semibold mb-4">All Communities</h2>
              {communities.length === 0 ? (
                <p>No communities yet.</p>
              ) : (
                <ul className="space-y-4">
                  {communities.map((community) => (
                    <li
                      key={community._id}
                      className="p-4 border rounded shadow bg-white flex items-center gap-4"
                    >
                      <img
                        src={
                          community.icon ||
                          `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
                            community.name
                          )}.svg?background=%23ff69b4&radius=50`
                        }
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="font-bold">{community.name}</span>
                       {community.category && (
                          <p className="text-sm text-gray-500">
                            🏷️ {community.category}
                          </p>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* ===== POLLS ===== */}
        {activeTab === "polls" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Manage Poll</h1>
            <form
              onSubmit={handlePollSubmit}
              className="bg-white shadow p-6 rounded-lg mb-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Create Poll</h2>
              <input
                type="text"
                name="question"
                value={pollForm.question}
                onChange={(e) =>
                  setPollForm({ ...pollForm, question: e.target.value })
                }
                placeholder="Enter poll question"
                className="w-full border p-2 mb-4 rounded"
                required
              />
              {pollForm.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  value={opt}
                  onChange={(e) => handlePollChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full border p-2 mb-2 rounded"
                />
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-blue-600 text-sm mb-4 hover:underline"
              >
                + Add another option
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Create Poll
              </button>
            </form>
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Poll</h2>
              {!poll ? (
                <p>No active poll (expired or none created).</p>
              ) : (
                <div className="bg-white shadow p-4 rounded-lg w-full max-w-lg">
                  <p className="font-bold text-gray-800 mb-2">{poll.question}</p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {poll.options.map((opt, i) => (
                      <li key={i}>{opt.text}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    🕒 Expires at: {new Date(poll.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
