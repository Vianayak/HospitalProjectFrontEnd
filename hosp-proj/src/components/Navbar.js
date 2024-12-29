import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyNavbar() {
   
    const [showDropdown, setShowDropdown] = useState('');

  
    const handleMouseEnter = (dropdown) => {
        setShowDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        setShowDropdown('');
    };

    return (
        <header>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">LIVE</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">About Us</Nav.Link>
                            <Nav.Link href="#features">Our Doctors</Nav.Link>

                           
                            <NavDropdown
                                title="Speciality"
                                id="speciality-dropdown"
                                show={showDropdown === 'speciality'}
                                onMouseEnter={() => handleMouseEnter('speciality')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>

                          
                            <NavDropdown
                                title="Patient Info"
                                id="patient-info-dropdown"
                                show={showDropdown === 'patient-info'}
                                onMouseEnter={() => handleMouseEnter('patient-info')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something else here</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>

                          
                            <NavDropdown
                                title="Hospitals"
                                id="hospitals-dropdown"
                                show={showDropdown === 'hospitals'}
                                onMouseEnter={() => handleMouseEnter('hospitals')}
                                onMouseLeave={handleMouseLeave}
                            >
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
