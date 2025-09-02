import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CardDetails from "./pages/CardDetails";
import CreateCard from "./pages/CreateCard";
import EditCard from "./pages/EditCard";
import MyCards from "./pages/MyCards";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Profile from "./pages/Profile";
import CRM from "./pages/CRM";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/card/:id" element={<CardDetails />} />
          <Route
            path="/create-card"
            element={
              <ProtectedRoute requireBusiness>
                <CreateCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cards"
            element={
              <ProtectedRoute requireBusiness>
                <MyCards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-card/:id"
            element={
              <ProtectedRoute requireBusiness>
                <EditCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/crm" element={<CRM />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
