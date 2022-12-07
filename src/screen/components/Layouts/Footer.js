import React, { Component } from "react";
import { Container } from "react-bootstrap";
// Footer de la aplicacion
class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>

            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              UCR Campus virtual
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
