import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyNavbar.css';
import SearchBar from '../SearchBar/SearchBar';

function MyNavbar({ scrollToHealthNews }) {
    const [showDropdown, setShowDropdown] = useState('');
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = (dropdown) => {
        setShowDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        setShowDropdown('');
    };

    const handleNavigation = (path) => {
        sessionStorage.setItem("validNavigation", "true");
        navigate(path);
        setExpanded(false);
    };

    return (
        <header>
            <Navbar bg="white" variant="light" expand="lg" className="sticky-navbar" expanded={expanded}>
                <Navbar.Brand>
                    <Link to="/techSpryn" className="navbar-logo-link" onClick={() => handleNavigation('/techSpryn')}>
                        <img
                            src="/Assets/Images/TechSprynLogo.png"
                            alt="TechSpryn Logo"
                            className="navbar-logo"
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto" id="exe">
                        <Nav.Link as={Link} to="/" onClick={() => handleNavigation('/')}>About Us</Nav.Link>
                        <Nav.Link as={Link} to="/book-appointments-page" onClick={() => handleNavigation('/book-appointments-page')}>Our Doctors</Nav.Link>
                        <NavDropdown
                            title={<span className={`dropdown-title ${showDropdown === 'speciality' ? 'active' : ''}`}>Speciality</span>}
                            id="speciality-dropdown"
                            show={showDropdown === 'speciality'}
                            onMouseEnter={() => handleMouseEnter('speciality')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <NavDropdown.Item as={Link} to="/general-medicine" onClick={() => handleNavigation('/general-medicine')}>General Medicine</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/ent" onClick={() => handleNavigation('/ent')}>ENT</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown
                            title={<span className={`dropdown-title ${showDropdown === 'patient-info' ? 'active' : ''}`}>Patient Info</span>}
                            id="patient-info-dropdown"
                            show={showDropdown === 'patient-info'}
                            onMouseEnter={() => handleMouseEnter('patient-info')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <NavDropdown.Item as={Link} to="/blog" onClick={() => handleNavigation('/blog')}>Blog</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => { scrollToHealthNews(); handleNavigation('#'); }}>
                                News
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown
                            title={<span className={`dropdown-title ${showDropdown === 'hospitals' ? 'active' : ''}`}>Hospitals</span>}
                            id="hospitals-dropdown"
                            show={showDropdown === 'hospitals'}
                            onMouseEnter={() => handleMouseEnter('hospitals')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <NavDropdown.Item as={Link} to="/jubilee-hills" onClick={() => handleNavigation('/jubilee-hills')}>Jubilee Hills</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/kukatpally" onClick={() => handleNavigation('/kukatpally')}>Kukatpally</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/miyapur" onClick={() => handleNavigation('/miyapur')}>Miyapur</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <div className="search-bar-container">
                    <SearchBar />
                </div>
                <div className="login-button1">
                    <Link to="/login" onClick={() => handleNavigation('/login')}>
                        <button>Log In</button>
                    </Link>
                </div>
            </Navbar>
        </header>
    );
}

export default MyNavbar;
