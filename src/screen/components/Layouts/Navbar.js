
import React, {useState} from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button, Form , InputGroup} from "react-bootstrap";
import crypto from "crypto-js";
import routes from "../../../routes.js";

function Header() {
  const [user, setUser] = useState("");
  const location = useLocation();
  let bytes = crypto.AES.decrypt(
    sessionStorage.getItem("user"),
    "@virtual_cr"
  );
  let data = JSON.parse(bytes.toString(crypto.enc.Utf8));
  let letter = data.name.charAt(0).toUpperCase();
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Inicio";
  };

  const profile = () => {
    window.location.href = "/home/profile";
  }

  const logOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.setItem('closed', true);
    window.location.href = "/";
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">

          <Nav className="ml-auto d-flex align-items-baseline" navbar>
            <Nav.Item>
            <Nav.Link
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <InputGroup className="inputSearch">
               <i className="nc-icon nc-zoom-split p-1"></i>
                <Form.Control
                  placeholder="Buscar..."
                  type="text"
                  className="inputSearch"

                  >
                  </Form.Control>
                </InputGroup>
                </Nav.Link>
            </Nav.Item>

            <Nav.Item>

              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  data-toggle="dropdown"
                  variant="default"

                >
                  <h3 className="txt-blue"><i className="fas fa-bell"></i></h3>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Notification 1
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#"
                onClick={(e) => e.preventDefault()}
              >
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  data-toggle="dropdown"
                  variant="default"
                  className="m-0"
                >
                  <span className="letter-login">{letter}</span>
                  <span className="ml-1 txt-blue">{data.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={profile}
                >
                  Cuenta
                </Dropdown.Item>
                <Dropdown.Item
                  href="#"
                  onClick={logOut}
                >
                  Cerrar Sesión
                </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>
            </Nav.Item>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
