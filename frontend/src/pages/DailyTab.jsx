import { useEffect, useState } from "react";
import API from "../utils/api";

const DailyTab = () => {
  const [crush, setCrush] = useState(null);

  useEffect(() => {
    API.get("/dating/daily/today")
      .then((res) => setCrush(res.data.assigned || null))
      .catch((err) => console.error(err));
  }, []);

  const handleConfirm = async () => {
    if (!crush) return;
    try {
      await API.post("/dating/daily/confirm", { assignedId: crush._id });
      alert("Crush confirmed! If mutual, you'll be matched 💞");
    } catch (err) {
      console.error(err);
    }
  };

  if (!crush) return <p>No crush assigned today 😢</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Your Daily Crush 💘</h2>
      <div className="flex items-center gap-4">
        <img
          src={crush.profile?.profilePic || "/default-avatar.png"}
          alt="crush"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{crush.name}</p>
          <p className="text-gray-500 text-sm">{crush.college}</p>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg"
      >
        Confirm Crush
      </button>
    </div>
  );
};

export default DailyTab;
