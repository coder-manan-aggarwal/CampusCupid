import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Calendar, Heart, MessageCircle, User,Users } from "lucide-react";
import logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Dating", href: "/dating", icon: Heart },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Communities", href: "/communities", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-56 h-full p-4 flex flex-col">
      {/* ✅ Logo + App Name */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <img src={logo} alt="CampusCupid" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text tracking-tight">
          CampusCupid
        </h1>
      </div>

      {/* ✅ Nav Links */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
