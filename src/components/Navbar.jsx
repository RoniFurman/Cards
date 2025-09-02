import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Form,
  Button,
  Container,
  NavDropdown,
} from "react-bootstrap";
import {
  FaSun,
  FaMoon,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isBusiness, isAdmin, logout } = useAuth();
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <BootstrapNavbar bg={theme} variant={theme} expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Business Cards
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            {isAuthenticated() && (
              <Nav.Link as={Link} to="/favorites">
                Favorites
              </Nav.Link>
            )}
            {isBusiness() && (
              <>
                <Nav.Link as={Link} to="/my-cards">
                  My Cards
                </Nav.Link>
                <Nav.Link as={Link} to="/create-card">
                  Create Card
                </Nav.Link>
              </>
            )}
            {isAdmin() && (
              <Nav.Link as={Link} to="/crm">
                CRM
              </Nav.Link>
            )}
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search cards..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-primary" type="submit">
              <FaSearch />
            </Button>
          </Form>

          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {isAuthenticated() ? (
              <NavDropdown
                title={
                  <span>
                    <FaUser className="me-1" />
                    {user.firstName}
                  </span>
                }
                id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  <FaUserCog className="me-2" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  as={Link}
                  to="/login">
                  Login
                </Button>
                <Button variant="primary" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
