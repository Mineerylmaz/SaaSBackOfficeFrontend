import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbars({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);          // önce state'i güncelle
        navigate('/home');      // sonra yönlendir
    };


    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand as={Link} to="/">KentKart</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
                        <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
                        <NavDropdown title="Biz Kimiz" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/about">Hakkımızda</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/about">Misyon</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/about">Vizyon</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/about">İletişim</NavDropdown.Item>
                        </NavDropdown>
                        {user && (
                            <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                Çıkış Yap
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
