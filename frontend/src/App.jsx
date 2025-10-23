import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowToUse from "./components/HowToUse";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DatingPage from "./pages/DatingPage";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import ExplorePage from "./pages/ExplorePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Events from "./pages/Events";
import LoungeChat from "./pages/LoungeChat";
import PrivateChat from "./pages/PrivateChat";
import MessagesPage from "./pages/MessagesPage";
import EventDetails from "./pages/EventDetails";
import Layout from "./components/Layout";  // ✅ central Layout
import UserProfile from "./pages/UserProfile";
import CommunityDetails from "./pages/CommunityDetails";
import CommunityPage from "./pages/CommunityPage";
export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* --- Landing Page Route (no sidebar) --- */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main className="pt-20">
                <div id="home">
                  <Hero />
                </div>
                <div id="how-it-works">
                  <HowToUse />
                </div>
                <div id="features">
                  <Features />
                </div>
                <div id="cta">
                  <CTA />
                </div>
                <div id="testimonials">
                  <Testimonials />
                </div>
                <div id="contact">
                  <Footer />
                </div>
              </main>
            </>
          }
        />

        {/* --- Auth Pages (no sidebar) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* --- Pages WITH Sidebar via Layout --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout navbarVariant="dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout navbarVariant="profile">
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <Layout navbarVariant="explore">
              <ExplorePage />
            </Layout>
          }
        />

        <Route
          path="/messages"
          element={
            <Layout navbarVariant="messages">
              <MessagesPage />
            </Layout>
          }
        />
       
        <Route
          path="/events"
          element={
            <Layout navbarVariant="events">
              <Events />
            </Layout>
          }
        />

        <Route
          path="/events/:id"
          element={
            <Layout navbarVariant="events">
              <EventDetails />
            </Layout>
          }
        />

        <Route
          path="/lounges/:id"
          element={
            <ProtectedRoute>
              
                <LoungeChat />
           
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:matchId"
          element={
            <ProtectedRoute>
              
                <PrivateChat />
              
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              
                <AdminDashboard />
              
            </AdminRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        

  <Route path="/communities/:id" element={<CommunityDetails />} />
   <Route path="/communities" element={<CommunityPage />} />
        {/* --- Dating Page (no sidebar) --- */}
        <Route
          path="/dating"
          element={
            <ProtectedRoute>
              <DatingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
