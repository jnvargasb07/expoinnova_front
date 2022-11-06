import React, { Component } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Tabs,
  Tab,
  Dropdown,
} from "react-bootstrap";
import AppUtil from "../../../AppUtil/AppUtil.js";
import "moment-timezone";
import { url } from "../services/api";
import crypto from "crypto-js";

class NewProfile extends Component {

  state = {
    user: "",
    nameUser: "",
  };

  constructor(props) {
    super(props);
  }

  //se obtiene el usuario
  getUserData = async () => {
    let bytes = crypto.AES.decrypt(
      sessionStorage.getItem("user"),
      "@virtual_cr"
    );
    this.user = JSON.parse(bytes.toString(crypto.enc.Utf8));
    this.nameUser = this.user.name.charAt(0).toUpperCase();
  };

  //se obtiene la info de los inputs
  getInputData = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  componentWillMount() {
    this.getUserData();
  }

  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col lg="12" sm="12">
              <Card className="card-stats">
                <div className="text-center d-flex justify-content-center background-profile">
                  <h1 className="letter-profile-user radius-letter text-white">
                    {this.nameUser}
                  </h1>
                </div>
                <div className="background-profile p-0">
                  <h2 className="text-center text-white p-0 m-0">
                    {this.user.name}
                  </h2>
                  <br></br>
                </div>
                <Row className="m-5">
                  <Col lg="6" sm="6" xs="12" className="pt-3">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Estudiante</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12" className="pt-3">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Jurado</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Profesores</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Administrador</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Sedes</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Categorias</p></div></a>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default NewProfile;