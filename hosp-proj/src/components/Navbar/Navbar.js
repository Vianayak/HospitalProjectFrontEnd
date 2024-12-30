import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyNavbar.css';

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
            <Navbar bg="white" variant="light" expand="lg" className="sticky-navbar">
             
                    <Navbar.Brand href="#">
                        <img
                            src="/Assets/Images/jaya.jpg"
                            alt="Jaya Hospitals Logo"
                            className="navbar-logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto" id="exe">
                            <Nav.Link href="#home">About Us</Nav.Link>
                            <Nav.Link href="#features">Our Doctors</Nav.Link>
                            <NavDropdown
                                title={
                                    <span
                                        className={`dropdown-title ${
                                            showDropdown === 'speciality' ? 'active' : ''
                                        }`}
                                    >
                                        Speciality
                                    </span>
                                }
                                id="speciality-dropdown"
                                show={showDropdown === 'speciality'}
                                onMouseEnter={() => handleMouseEnter('speciality')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <NavDropdown.Item href="#action/3.1">General Medicine</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">ENT</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <span
                                        className={`dropdown-title ${
                                            showDropdown === 'patient-info' ? 'active' : ''
                                        }`}
                                    >
                                        Patient Info
                                    </span>
                                }
                                id="patient-info-dropdown"
                                show={showDropdown === 'patient-info'}
                                onMouseEnter={() => handleMouseEnter('patient-info')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <NavDropdown.Item href="#action/3.1">Blog</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">News</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown
                                title={
                                    <span
                                        className={`dropdown-title ${
                                            showDropdown === 'hospitals' ? 'active' : ''
                                        }`}
                                    >
                                        Hospitals
                                    </span>
                                }
                                id="hospitals-dropdown"
                                show={showDropdown === 'hospitals'}
                                onMouseEnter={() => handleMouseEnter('hospitals')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <NavDropdown.Item href="#action/3.1">Jubilee Hills</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Kukatpally</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Miyapur</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
               
            </Navbar>
        </header>
    );
}

export default MyNavbar;
