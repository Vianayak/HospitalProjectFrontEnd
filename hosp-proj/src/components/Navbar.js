import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function MyNavbar() {
    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">LIVE</Navbar.Brand> {/* Brand logo link */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Toggle button for mobile view */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            {/* Basic Nav Links */}
                            <Nav.Link href="#home">About Us</Nav.Link>
                            <Nav.Link href="#features">Our doctors</Nav.Link>
                            
                            {/* Dropdown Menu */}
                            <NavDropdown title="Speciality" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Patient Info" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Hospitals" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default MyNavbar;
