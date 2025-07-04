import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function Navbars() {
    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    KentKart
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
                        <NavDropdown title="Biz Kimiz" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/about">Hakkımızda</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/mission">Misyon</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/vision">Vizyon</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/contact">İletişim</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navbars;
