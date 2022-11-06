import React, { Component, useState } from "react";

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
    form: {
      users_id: 0,
      name: "",
      email: "",
      campus_id: 0,
      professors_users_id: 0,
      password: ""
    },
    show: false,
    showDelete: false,
    showJudge: false,
    showProfessor: false,
    showAdmin: false,
    showCampus: false,
    showCategories: false,
    campuses: "",
    options:[],
    professors:[],
    nameProfessor:"",
    add:[]
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

  getCampusData = () => {

    let url_api = url+"campuses";
    let opt=[];
    AppUtil.getAPI(url_api).then(response => {
      console.log(response);
      if (response.length > 0) {
        response.forEach((campus) => {
          opt.push(<option>{campus.name}</option>)
        })
        this.setState({
          options: opt
        })
      }
    });

  }

  saveProfessor = () => {
    
  //   if(this.state.nameProfessor != ''){
  //     this.state.add.push(<div>{this.state.nameProfessor}</div>);
  //     this.setState({
  //       professors: add
  //     })
  // }

  }

  onChangeCampus = (e) => {
    
  }

  toggleStudent = () => {
    this.getCampusData();
    this.setState({ showStudent: !this.state.showStudent });
  }

  toggleJudge = () => this.setState({ showJudge: !this.state.showJudge });
  toggleProfessor = () => this.setState({ showProfessor: !this.state.showProfessor });
  toggleAdmin = () => this.setState({ showAdmin: !this.state.showAdmin });
  toggleCampus = () => this.setState({ showCampus: !this.state.showCampus });
  toggleCategories = () => this.setState({ showCategories: !this.state.showCategories });

  componentWillMount() {
    this.getUserData();
  }

  render() {

    let { show, showStudent, showJudge, showProfessor, showAdmin, showCampus, showCategories, post, key } = this.state;

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
                    <a onClick={this.toggleStudent}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Estudiante</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12" className="pt-3">
                    <a onClick={this.toggleJudge}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Jurado</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleProfessor}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Profesores</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleAdmin}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Nuevo Administrador</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleCampus}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Sedes</p></div></a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleCategories}><div className="text-center p-1"><p className="new-profile-text text-color-recovery">Categorias</p></div></a>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Modal show={showStudent} onHide={this.toggleStudent} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nuevo Estudiante</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="name" className="text-color-recovery">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="email" className="text-color-recovery">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="campus" className="text-color-recovery">
                        Sede
                      </label>
                      <select
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="campus"
                        name="campus"
                        aria-describedby="campusHelp"
                        onChange={this.onChangeCampus.bind(this)}>
                          <option value="0" selected>Seleccione una sede</option>
                          {this.state.options}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="profesor" className="text-color-recovery">
                        Profesor
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="profesor"
                        name="profesor"
                        aria-describedby="profesorHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="password" className="text-color-recovery">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm input-field"
                        id="password"
                        name="password"
                        aria-describedby="passwordHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveStudent} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Crear Nuevo
              </button>
            </Modal.Footer>
          </Modal>


          <Modal show={showJudge} onHide={this.toggleJudge} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nuevo Jurado</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="name" className="text-color-recovery">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="email" className="text-color-recovery">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="company" className="text-color-recovery">
                        Empresa (Independiente)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="company"
                        name="company"
                        aria-describedby="companyHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="password" className="text-color-recovery">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm input-field"
                        id="password"
                        name="password"
                        aria-describedby="passwordHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveCompany} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Crear Nuevo
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={showProfessor} onHide={this.toggleProfessor} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nuevo Profesor</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
              <Container>
              <Row className="p-1">
                {this.state.professorsAdd}
              </Row>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="nameProfessor" className="text-color-recovery">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="nameProfessor"
                        name="nameProfessor"
                        aria-describedby="nameProfessorHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveProfessor} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Agregar
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={showAdmin} onHide={this.toggleAdmin} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nuevo Administrador</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
            <Container>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="name" className="text-color-recovery">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="name"
                        name="name"
                        aria-describedby="nameHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="email" className="text-color-recovery">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="company" className="text-color-recovery">
                        Sede / Empresa Otros
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="company"
                        name="company"
                        aria-describedby="companyHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={6}>
                    <div className="form-group">
                      <label htmlFor="password" className="text-color-recovery">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm input-field"
                        id="password"
                        name="password"
                        aria-describedby="passwordHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveAdmin} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Agregar
              </button>
            </Modal.Footer>
          </Modal>


          <Modal show={showCampus} onHide={this.toggleCampus} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nueva Sede</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
              <Container>
              <Row className="p-1">
                {this.state.campuses}
              </Row>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="nameCampus" className="text-color-recovery">
                        Nombre de la nueva sede
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="nameCampus"
                        name="nameCampus"
                        aria-describedby="nameCampusHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveCampus} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Agregar
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={showCategories} onHide={this.toggleCategories} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">Nueva Categoría</Modal.Title>
            </Modal.Header>
            <hr></hr>
            <Modal.Body className="show-grid">
              <Container>
              <Row className="p-1">
                {this.state.categories}
              </Row>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label htmlFor="nameCategory" className="text-color-recovery">
                        Nombre Nueva Categoria
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="nameCategory"
                        name="nameCategory"
                        aria-describedby="nameCategoryHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <button size="lg" type="submit" onClick={this.saveCategories} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Agregar
              </button>
            </Modal.Footer>
          </Modal>

        </Container>
      </>



    );
  }
}

export default NewProfile;