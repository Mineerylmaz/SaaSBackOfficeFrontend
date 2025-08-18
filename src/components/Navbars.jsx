import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";

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
        localStorage.removeItem("customInputValues");



        localStorage.removeItem("invites");

        setUser(null);
        navigate("/");
    };

    return (
        <Navbar
            expand="lg"
            className="navbar-custom"
        >

            <Container>
                <Navbar.Brand as={Link} to="/" className="brand">
                    <img
                        src="/indir.svg"
                        style={{ height: '40px', marginRight: '10px' }}
                    />

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggler" />
                <Navbar.Collapse id="basic-navbar-nav">


                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">




                            <Nav.Link as={Link} to="/home">
                                Anasayfa
                            </Nav.Link>
                            <NavDropdown title="Biz Kimiz" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => window.location.href = "https://www.kentkart.com/about-us/"}>
                                    Hakkımızda
                                </NavDropdown.Item>

                                <NavDropdown.Item onClick={() => window.location.href = "https://www.kentkart.com/history/"}>
                                    Tarihçemiz
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => window.location.href = "https://www.kentkart.com/quality-policy/"}>
                                    Kalite Politikamız
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => window.location.href = "https://www.kentkart.com/contact-us/"}>
                                    İletişim
                                </NavDropdown.Item>
                            </NavDropdown>

                            {user && !['viewer', 'editor'].includes(user.role) && (
                                <Nav.Link as={Link} to="/pricing">
                                    Planlar
                                </Nav.Link>
                            )}


                            {!user && (
                                <Nav.Link as={Link} to="/login">
                                    Giriş Yap
                                </Nav.Link>
                            )}
                            {user && user.role !== "superadmin" && (
                                <Nav.Link as={Link} to="/ayarlar">
                                    Ayarlar
                                </Nav.Link>
                            )}
                            {user && user.role === "superadmin" && (
                                <Nav.Link as={Link} to="/admin">
                                    Admin Paneli
                                </Nav.Link>
                            )}



                            {user && (
                                <NavDropdown
                                    title={
                                        user.avatar
                                            ? <img src={user.avatar} alt="avatar"
                                                style={{ width: "28px", height: "28px", borderRadius: "50%" }} />
                                            : <FaUserCircle size={28} color="#38bdf8" />
                                    }
                                    id="profile-nav-dropdown"
                                    align="end"
                                >

                                    <NavDropdown.Item disabled style={{ fontWeight: 'bold', cursor: 'default', color: 'white' }}>
                                        {user.email}
                                    </NavDropdown.Item>

                                    {user.role !== "superadmin" && (
                                        <>
                                            <NavDropdown.Item as={Link} to="/profile">
                                                Profil
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />


                                        </>
                                    )}

                                    <NavDropdown.Item onClick={handleLogout}>Çıkış Yap</NavDropdown.Item>
                                </NavDropdown>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
