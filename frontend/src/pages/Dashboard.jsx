import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

// ✅ Flip Card Component
const FlipCard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer perspective"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <AnimatePresence initial={false}>
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-white rounded-xl shadow-md flex items-center justify-center backface-hidden overflow-hidden border border-gray-200"
          >
            {front}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md flex flex-col items-center justify-center backface-hidden border border-gray-200 p-3 text-center"
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ✅ Event Card
// ✅ Event Card (Full image + countdown)
// ✅ Event Card (Full image + countdown with days/hours/mins/secs)
const EventCard = ({ event, onOpen }) => {
  const [timeStatus, setTimeStatus] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const now = new Date();
      const diff = eventDate - now;

      if (diff <= 0 && diff > -3 * 60 * 60 * 1000) {
        // Event is currently live
        setTimeStatus("🎉 Event is Live Now!");
      } else if (diff < -3 * 60 * 60 * 1000) {
        // Event ended 3+ hours ago
        setTimeStatus("⌛ Event Ended");
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formatted = [
          days > 0 ? `${days}d` : null,
          hours > 0 ? `${hours}h` : null,
          minutes > 0 ? `${minutes}m` : null,
          seconds >= 0 ? `${seconds}s` : null,
        ]
          .filter(Boolean)
          .join(" ");

        setTimeStatus(`Starts in ${formatted}`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000); // update every second for live countdown
    return () => clearInterval(timer);
  }, [event.date, event.time]);

  return (
    <FlipCard
      front={
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <img
            src={event.image || "/default-event.jpg"}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 rounded-xl" />
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="text-lg font-semibold drop-shadow-md">
              {event.title}
            </h3>
            <p className="text-xs opacity-90">{new Date(event.date).toDateString()}</p>
          </div>
        </div>
      }
      back={
        <div className="p-4 text-center flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
          <p
            className={`text-sm font-medium ${
              timeStatus.includes("Live")
                ? "text-green-600"
                : timeStatus.includes("Ended")
                ? "text-red-500"
                : "text-gray-700"
            }`}
          >
            {timeStatus}
          </p>
          <button
            onClick={() => onOpen(event)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            View Details
          </button>
        </div>
      }
    />
  );
};



// ✅ Community Card
const CommunityCard = ({ c, onView }) => (
  <FlipCard
    front={
      <div className="p-3 flex flex-col items-center justify-center">
        {c.icon ? (
          <img
            src={c.icon}
            alt={c.name}
            className="w-14 h-14 rounded-full object-cover border mb-2"
          />
        ) : (
          <div className="text-3xl mb-2">👥</div>
        )}
        <h3 className="text-sm font-semibold">{c.name}</h3>
      </div>
    }
    back={
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-base font-semibold text-gray-800">{c.name}</h3>
        <p className="text-xs text-gray-600 mb-2">
          {c.members?.length || 0} members
        </p>
        <button
          onClick={() => onView(c._id)}
          className="mt-1 border border-indigo-500 text-indigo-600 text-xs px-3 py-1 rounded-lg hover:bg-indigo-50 transition"
        >
          View Details
        </button>
      </div>
    }
  />
);

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Explorer");

  const navigate = useNavigate();

  // ✅ Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // ✅ Helper for poll timer
  const getTimeLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${mins}m left`;
  };

  // ✅ Fetch all dashboard data
  useEffect(() => {
    const storedUser = localStorage.getItem("campusCupidUser");
if (storedUser) {
  try {
    const userObj = JSON.parse(storedUser);
    setUserName(
      userObj.name ||
      userObj.username ||
      userObj.profile?.name ||
      "Explorer"
    );
  } catch {
    setUserName("Explorer");
  }
}


    const fetchAll = async () => {
      try {
        const [postsRes, eventsRes, commRes, pollRes] = await Promise.all([
          API.get("/explore"),
          API.get("/events"),
          API.get("/communities"),
          API.get("/polls"),
        ]);
        setPosts(postsRes.data.slice(0, 3));
        setEvents(eventsRes.data.slice(0, 3));
        setCommunities(commRes.data.slice(0, 4));
        setPoll(pollRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ✅ Handle vote action
  const handleVote = async (optionIndex) => {
  try {
    const { data } = await API.post("/polls/vote", { pollId: poll._id, optionIndex });
    setVoted(true);
    setPoll(data);
  } catch (err) {
    if (err.response?.data?.message === "You have already voted in this poll") {
      alert("You have already voted in this poll!");
      setVoted(true);
    } else {
      console.error("Vote error:", err);
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-6">
          {/* ✅ Greeting */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()},{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold tracking-wide">
                  {userName}
                </span>{" "}
                👋
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Here’s what’s happening around campus today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* ✅ Trending Posts */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Trending Posts
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">No posts yet</p>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <h3 className="font-semibold">{p.author?.name || "User"}</h3>
                    <p className="text-sm text-gray-700">{p.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Upcoming Events */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {events.map((e) => (
                <EventCard
                  key={e._id}
                  event={e}
                  onOpen={(ev) => navigate(`/events/${ev._id}`)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ✅ RIGHT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Spotlight */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              🌟 Today's Spotlight
            </h3>
            <p className="text-gray-500 text-sm text-center">
              No spotlight yet
            </p>
          </div>

          {/* Top Communities */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              🏆 Top Communities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {communities.map((c) => (
                <CommunityCard
                  key={c._id}
                  c={c}
                  onView={(id) => navigate(`/communities/${id}`)}
                />
              ))}
            </div>
          </div>

          {/* Poll */}
          {/* 🗳️ Campus Poll */}
<div className="bg-white p-4 rounded-xl shadow">
  <h3 className="text-sm font-semibold mb-2 text-gray-700">
    🗳️ Campus Poll
  </h3>

  {!poll ? (
    <p className="text-gray-500 text-sm">No active poll</p>
  ) : (
    <div>
      <p className="font-semibold mb-2">{poll.question}</p>

      {/* ✅ Show Results if user has voted, else show buttons */}
      {poll.votedBy?.includes(localStorage.getItem("userId")) || voted ? (
        <div>
          {poll.options.map((opt, i) => {
            const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
            const percent =
              totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(1) : 0;

            return (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{opt.text}</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 mt-3 text-center">
            ✅ You have already voted
          </p>
          <p className="text-xs text-gray-400 text-center">
            ⏳ {getTimeLeft(poll.expiresAt)}
          </p>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            {poll.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleVote(i)}
                className="block w-full text-left bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg text-sm transition"
              >
                {opt.text}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            ⏳ {getTimeLeft(poll.expiresAt)}
          </p>
        </div>
      )}
    </div>
  )}
</div>

        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
