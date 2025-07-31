import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Profile from "./Profile";
export default function Navbars({ user, setUser }) {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedPlan");

        localStorage.removeItem("invites");

        setUser(null);
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    KentKart
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <div className="theme-toggle-wrapper">
                            <label className="theme-toggle">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={() => setDarkMode(!darkMode)}
                                />
                                <span className="slider">
                                    {darkMode ? "⋆⁺₊⋆ ☾" : "𓂃 ☼"}
                                </span>
                            </label>
                        </div>

                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        <NavDropdown title="Biz Kimiz" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/about">
                                Hakkımızda
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/about">
                                Misyon
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/about">
                                Vizyon
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/about">
                                İletişim
                            </NavDropdown.Item>
                        </NavDropdown>
                        {user && (
                            <Nav.Link as={Link} to="/transitmap">
                                Map
                            </Nav.Link>)}
                        <Nav.Link as={Link} to="/pricing">
                            Pricing
                        </Nav.Link>

                        {!user && (
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                        )}
                        {user && (
                            <NavDropdown title="👤" id="profile-nav-dropdown" align="end">
                                <NavDropdown.Item disabled style={{ fontWeight: 'bold', cursor: 'default' }}>
                                    {user.email}
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/profile">
                                    Profil
                                </NavDropdown.Item>
                                <NavDropdown.Divider />


                                <NavDropdown.Item as={Link} to="/ayarlar">Ayarlar</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Çıkış Yap</NavDropdown.Item>
                            </NavDropdown>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
