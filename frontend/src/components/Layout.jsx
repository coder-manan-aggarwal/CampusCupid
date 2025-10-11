import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Layout({ children, navbarVariant }) {
  const [searchQuery, setSearchQuery] = useState(""); // ✅ shared search

  // ✅ Clone the page content and inject searchQuery as a prop
  const contentWithProps = children
    ? { ...children, props: { ...children.props, searchQuery } }
    : null;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-56 border-r border-gray-200 shadow-md bg-white z-30">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="flex flex-col flex-1 ml-56 min-h-screen">
        <div className="sticky top-0 z-20">
          <TopNavbar variant={navbarVariant} onSearch={setSearchQuery} />
        </div>

        {/* Main content (auto-receives searchQuery) */}
        <main className="flex-1 overflow-y-auto px-6 pb-6">
          {contentWithProps}
        </main>
      </div>
    </div>
  );
}
