import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Navbars({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedPlan");
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
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        {!user && (
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/transitmap">
                            Map
                        </Nav.Link>
                        <Nav.Link as={Link} to="/pricing">
                            Pricing
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
                            <NavDropdown title="Profil" id="profile-nav-dropdown">
                                <NavDropdown.Item disabled style={{ fontWeight: 'bold', cursor: 'default' }}>
                                    {user.email}
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
