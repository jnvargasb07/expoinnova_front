import React, { Component, useState } from "react";

// react-bootstrap components
import { Card, Container, Row, Col, Modal, Table } from "react-bootstrap";
import AppUtil from "../../../AppUtil/AppUtil.js";
import "moment-timezone";
import { url } from "../services/api";
import crypto from "crypto-js";

class NewProfile extends Component {
  state = {
    user: "",
    form: {
      name: "",
      email: "",
      campus_id: 0,
      professors_users_id: 0,
      password: "",
    },
    formJudge: {
      name: "",
      email: "",
      password: "",
      business_name: "",
    },
    formAdmin: {
      name: "",
      email: "",
      password: "",
      business_name: "",
    },
    show: false,
    showDelete: false,
    showJudge: false,
    showProfessor: false,
    showAdmin: false,
    showCampus: false,
    showCategories: false,
    valid_email: true,
    spinner: false,
    charging: false,
    campuses: "",
    options: [],
    professors: [],
    students: [],
    judges: [],
    categories: [],
    nameProfessor: "",
    campus_id: 0,
    campus_name: "",
    category_name: "",
    add: [],
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
    this.validateEmail(e);
  };

  getInputDataJudge = async (e) => {
    await this.setState({
      formJudge: {
        ...this.state.formJudge,
        [e.target.name]: e.target.value,
      },
    });
    this.validateEmail(e);
  };

  getInputDataOthers = async (e) => {
    await this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  };

  //se obtiene la lista de sedes
  getCampusData = () => {
    let url_api = url + "campuses";
    AppUtil.getAPI(url_api).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          options: response.data,
          charging: true
        });
      }
    });
  };

  //se obtiene la lista de categorias
  getCategoriesData = () => {
    let url_api = url + "categories";
    AppUtil.getAPI(url_api).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          categories: response.data,
          charging: true
        });
      }
    });
  };

  //se obtiene la lista de profesores
  getProfessorData = () => {
    let url_api = url + "professor_users";
    AppUtil.getAPI(url_api).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          professors: response.data,
          charging: true
        });
      }
    });
  };

  //se obtiene la lista de estudiantes
  getStudentsData = () => {

    let url_api = url + "students";
    AppUtil.getAPI(url_api).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          students: response.data,
          charging: true
        });
      }
    });
  };

  //se obtiene la lista de estudiantes
  getJudgesData = () => {
    let url_api = url + "judges";
    AppUtil.getAPI(url_api).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          judges: response.data,
          charging: true
        });
      }
    });
  };

  //se limpian los campos de los inputs
  clearFields = () => {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("campus_id").value = 0;
    document.getElementById("professors_users_id").value = 0;
    document.getElementById("business_name").value = "";
    document.getElementById("nameProfessor").value = "";
    document.getElementById("campus_name").value = "";
    document.getElementById("category_name").value = "";
  };

  //se guarda el estudiante
  saveStudent = () => {
    if (
      this.state.form.name == "" ||
      this.state.form.email == "" ||
      this.state.form.password == "" ||
      this.state.form.campus_id == 0 ||
      this.state.form.professors_users_id == 0
    ) {
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        color: "alert alert-danger",
      });
      setTimeout(() => {
        this.setState({
          error: false,
          errorMsg: "",
          color: "",
          spinner: false,
        });
      }, "2000");
      return;
    }
    if (!this.validatePassword(this.state.form.password)) {
      return;
    }
    this.setState({
      spinner: true,
    });
    let url_api = url + "students";
    AppUtil.postAPI(url_api, this.state.form).then((response) => {
      console.log(response);
      if (response.success) {
        this.setState({
          error: true,
          errorMsg: "El estudiante se guardo exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
        this.clearFields();
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al guardar el estudiante",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      }
    });
  };

  //se guarda el jurado
  saveJudge = () => {
    if (
      this.state.formJudge.name == "" ||
      this.state.formJudge.email == "" ||
      this.state.formJudge.business_name == "" ||
      this.state.formJudge.password == ""
    ) {
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        color: "alert alert-danger",
      });
      setTimeout(() => {
        this.setState({
          error: false,
          errorMsg: "",
          color: "",
          spinner: false,
        });
      }, "2000");
      return;
    }
    if (!this.validatePassword(this.state.form.password)) {
      return;
    }
    this.setState({
      spinner: true,
    });
    let url_api = url + "judges";
    AppUtil.postAPI(url_api, this.state.formJudge).then((response) => {
      if (response.success) {
        this.setState({
          error: true,
          errorMsg: "El jurado se guardo exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al guardar el jurado",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      }
    });
  };

  //se guarda el profesor
  saveProfessor = () => {
    let url_api = url + "professor_users";
    let professor_data = "";
    if (this.state.nameProfessor != "" && this.state.campus_id != "") {
      professor_data = {
        campus_id: this.state.campus_id,
        name: this.state.nameProfessor,
      };
    } else {
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        color: "alert alert-danger",
        spinner: false,
      });
      return;
    }
    this.setState({
      spinner: true,
    });
    AppUtil.postAPI(url_api, professor_data).then((response) => {
      if (response.success) {
        this.getProfessorData();
        this.setState({
          error: true,
          errorMsg: "El profesor se guardo exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al guardar el profesor",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      }
    });
    this.setState({
      error: false,
    });
  };

  //se guarda el campus
  saveCampus = () => {
    let url_api = url + "campuses";
    let campuses_data = "";
    if (this.state.campus_name != "") {
      campuses_data = {
        name: this.state.campus_name,
      };
    } else {
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        color: "alert alert-danger",
        spinner: false,
      });
      return;
    }
    this.setState({
      spinner: true,
    });
    AppUtil.postAPI(url_api, campuses_data).then((response) => {
      if (response.success) {
        this.getCampusData();
        this.setState({
          error: true,
          errorMsg: "La sede se guardo exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al guardar la sede",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      }
    });
    this.setState({
      error: false,
    });
  };

  //se guarda la categoria
  saveCategories = () => {
    let url_api = url + "categories";
    let categories_data = "";
    if (this.state.category_name != "") {
      categories_data = {
        name: this.state.category_name,
      };
    } else {
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        color: "alert alert-danger",
      });
      return;
    }
    this.setState({
      spinner: true,
    });
    AppUtil.postAPI(url_api, categories_data).then((response) => {
      if (response.success) {
        this.getCategoriesData();
        this.setState({
          error: true,
          errorMsg: "La categoría se guardo exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al guardar la categoría",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
            spinner: false,
          });
        }, "2000");
      }
    });
    this.setState({
      error: false,
    });
  };

  //elimina el profesor seleccionado
  deleteProfessor = (id) => {
    let url_api = url + "professor_users/" + id;
    AppUtil.deleteAPI(url_api).then((response) => {
      if (response.success) {
        this.getProfessorData();
        this.setState({
          error: true,
          errorMsg: "El profesor se elimino exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al eliminar el profesor",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      }
    });
  };

  //elimina el campus seleccionado
  deleteCampus = (id) => {
    let url_api = url + "campuses/" + id;
    AppUtil.deleteAPI(url_api).then((response) => {
      if (response.success) {
        this.getCampusData();
        this.setState({
          error: true,
          errorMsg: "La sede se elimino exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al eliminar la sede",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      }
    });
  };

  //elimina la categoria seleccionado
  deleteCategory = (id) => {
    let url_api = url + "categories/" + id;
    AppUtil.deleteAPI(url_api).then((response) => {
      if (response.success) {
        this.getCategoriesData();
        this.setState({
          error: true,
          errorMsg: "La categoría se elimino exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al eliminar la categoría",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      }
    });
  };

  //elimina el estudiante seleccionado
  deleteStudent = (id) => {
    let url_api = url + "students/" + id;
    AppUtil.deleteAPI(url_api).then((response) => {
      if (response.success) {
        this.getStudentsData();
        this.setState({
          error: true,
          errorMsg: "El estudiante se elimino exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al eliminar el estudiante",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      }
    });
  };

  //elimina el estudiante seleccionado
  deleteJudge = (id) => {
    let url_api = url + "judges/" + id;
    AppUtil.deleteAPI(url_api).then((response) => {
      if (response.success) {
        this.getJudgesData();
        this.setState({
          error: true,
          errorMsg: "El jurado se elimino exitosamente",
          color: "alert alert-success",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      } else {
        this.setState({
          error: true,
          errorMsg: "Hubo un problema al eliminar el jurado",
          color: "alert alert-danger",
        });
        setTimeout(() => {
          this.setState({
            error: false,
            errorMsg: "",
            color: "",
          });
        }, "2000");
      }
    });
  };

  validateEmail = (e) => {
    if (e.target.type === "email") {
      let isValidEmail =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!isValidEmail.test(e.target.value)) {
        this.setState({
          valid_email: false,
        });
      } else {
        this.setState({
          valid_email: true,
        });
      }
      return;
    }
  };

  validatePassword = (pass) => {
    if (pass.length < 8) {
      this.setState({
        error: true,
        errorMsg: "La contraseña debe tener mínimo 8 caracteres",
        color: "alert alert-danger",
      });
      setTimeout(() => {
        this.setState({
          error: false,
          errorMsg: "",
          color: "",
        });
      }, "4000");
      return false;
    }
    return true;
  };

  toggleStudent = () => {
    this.setState({
      showStudent: !this.state.showStudent,
      error: false,
      valid_email: true,
      charging: false
    });
    this.getStudentsData();
  };
  toggleJudge = () => {
    this.setState({
      showJudge: !this.state.showJudge,
      error: false,
      valid_email: true,
      charging: false
    });
    this.getJudgesData();
  };
  toggleProfessor = () => {
    this.setState({
      showProfessor: !this.state.showProfessor,
      error: false,
      valid_email: true,
      charging: false
    });
  };
  toggleAdmin = () => {
    this.setState({
      showAdmin: !this.state.showAdmin,
      error: false,
      valid_email: true,
      charging: false
    });
  };
  toggleCampus = () => {
    this.setState({
      showCampus: !this.state.showCampus,
      error: false,
      valid_email: true,
      charging: false
    });
  };
  toggleCategories = () => {
    this.setState({
      showCategories: !this.state.showCategories,
      error: false,
      valid_email: true,
      charging: false
    });
    this.getCategoriesData();
  };

  componentWillMount() {
    this.getUserData();
    this.getProfessorData();
    this.getCampusData();
  }

  render() {
    let {
      show,
      showStudent,
      showJudge,
      showProfessor,
      showAdmin,
      showCampus,
      showCategories,
      post,
      key,
    } = this.state;

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
                    <a onClick={this.toggleStudent}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Nuevo Estudiante
                        </p>
                      </div>
                    </a>
                  </Col>
                  <Col lg="6" sm="6" xs="12" className="pt-3">
                    <a onClick={this.toggleJudge}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Nuevo Jurado
                        </p>
                      </div>
                    </a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleProfessor}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Profesores
                        </p>
                      </div>
                    </a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleAdmin}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Nuevo Administrador
                        </p>
                      </div>
                    </a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleCampus}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Sedes
                        </p>
                      </div>
                    </a>
                  </Col>
                  <Col lg="6" sm="6" xs="12">
                    <a onClick={this.toggleCategories}>
                      <div className="text-center p-1">
                        <p className="new-profile-text text-color-recovery">
                          Categorias
                        </p>
                      </div>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Modal show={showStudent} onHide={this.toggleStudent} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nuevo Estudiante
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              {this.state.error === true && (
                <div className={this.state.color} role="alert">
                  {this.state.errorMsg}
                </div>
              )}
              <Container>
                <Row className="p-1">
                  <p>Otros estudiantes</p>
                  {this.state.charging && 
                  <Table hover>
                    <tbody>
                      {this.state.students.map((student) => (
                        <tr>
                          <td className="txt-blue">{student.users.name}</td>
                          <td className="text-center">
                            <a
                              onClick={() => this.deleteStudent(student.id)}
                              className="txt-blue decoration-none"
                            >
                              Eliminar X
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  }
                  {!this.state.charging && 
                    <div className="d-flex justify-content-center"><div class="lds-dual-ring-2"></div></div>
                  }
                </Row>
                <Row className="p-1">
                  <Col xs={12} md={12} xl={12}>
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
                  <Col xs={12} md={12} xl={6}>
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
                      {!this.state.valid_email && (
                        <small className="text-danger">
                          Correo electrónico no valido
                        </small>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label
                        htmlFor="campus_id"
                        className="text-color-recovery"
                      >
                        Sede
                      </label>
                      <select
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="campus_id"
                        name="campus_id"
                        aria-describedby="campus_idHelp"
                        onChange={this.getInputData}
                      >
                        <option value="0" selected>
                          Seleccione una sede
                        </option>
                        {this.state.options.map((option) => (
                          <option value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label
                        htmlFor="professors_users_id"
                        className="text-color-recovery"
                      >
                        Profesor
                      </label>
                      <select
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="professors_users_id"
                        name="professors_users_id"
                        aria-describedby="professors_users_idHelp"
                        onChange={this.getInputData}
                      >
                        <option value="0" selected>
                          Seleccione un profesor
                        </option>
                        {this.state.professors.map((option) => (
                          <option value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  <Col xs={12} md={12} xl={6}>
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
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveStudent}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showJudge} onHide={this.toggleJudge} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nuevo Jurado
              </Modal.Title>
            </Modal.Header>
            {this.state.error === true && (
              <div className={this.state.color} role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <p>Otros jurados</p>
                  {this.state.charging && 
                  <Table hover>
                    <tbody>
                      {this.state.judges.map((judge) => (
                        <tr>
                          <td className="txt-blue">{judge.users.name}</td>
                          <td className="text-center">
                            <a
                              onClick={() => this.deleteJudge(judge.id)}
                              className="txt-blue decoration-none"
                            >
                              Eliminar X
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  }
                  {!this.state.charging && 
                    <div className="d-flex justify-content-center"><div class="lds-dual-ring-2"></div></div>
                  }
                </Row>
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
                        onChange={this.getInputDataJudge}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={12} xl={6}>
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
                        onChange={this.getInputDataJudge}
                      />
                      {!this.state.valid_email && (
                        <small className="text-danger">
                          Correo electrónico no valido
                        </small>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label
                        htmlFor="business_name"
                        className="text-color-recovery"
                      >
                        Empresa (Independiente)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="business_name"
                        name="business_name"
                        aria-describedby="business_nameHelp"
                        onChange={this.getInputDataJudge}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={12} xl={6}>
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
                        onChange={this.getInputDataJudge}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveJudge}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showProfessor} onHide={this.toggleProfessor} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nuevo Profesor
              </Modal.Title>
            </Modal.Header>
            {this.state.error === true && (
              <div className={this.state.color} role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <p>Otros profesores</p>
                  {this.state.charging && 
                  <Table hover>
                    <tbody>
                      {this.state.professors.map((professor) => (
                        <tr>
                          <td className="txt-blue">{professor.name}</td>
                          <td className="text-center">
                            <a
                              onClick={() => this.deleteProfessor(professor.id)}
                              className="txt-blue decoration-none"
                            >
                              Eliminar X
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  }
                  {!this.state.charging && 
                    <div className="d-flex justify-content-center"><div class="lds-dual-ring-2"></div></div>
                  }
                </Row>
                <hr></hr>
                <Row className="p-1">
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label
                        htmlFor="nameProfessor"
                        className="text-color-recovery"
                      >
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="nameProfessor"
                        name="nameProfessor"
                        aria-describedby="nameProfessorHelp"
                        onChange={this.getInputDataOthers}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label
                        htmlFor="campus_id"
                        className="text-color-recovery"
                      >
                        Sede
                      </label>
                      <select
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="campus_id"
                        name="campus_id"
                        aria-describedby="campus_idHelp"
                        onChange={this.getInputDataOthers}
                      >
                        <option value="0" selected>
                          Seleccione una sede
                        </option>
                        {this.state.options.map((option) => (
                          <option value={option.id}>{option.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveProfessor}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showAdmin} onHide={this.toggleAdmin} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nuevo Administrador
              </Modal.Title>
            </Modal.Header>
            {this.state.error === true && (
              <div className={this.state.color} role="alert">
                {this.state.errorMsg}
              </div>
            )}
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
                  <Col xs={12} md={12} xl={6}>
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
                  <Col xs={12} md={12} xl={6}>
                    <div className="form-group">
                      <label htmlFor="company" className="text-color-recovery">
                        Sede / Empresa Otros
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="company_admin"
                        name="company_admin"
                        aria-describedby="companyHelp"
                        onChange={this.getInputData}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="p-1">
                  <Col xs={12} md={12} xl={6}>
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
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveAdmin}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showCampus} onHide={this.toggleCampus} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nueva Sede
              </Modal.Title>
            </Modal.Header>
            {this.state.error === true && (
              <div className={this.state.color} role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <p>Otras sedes</p>
                  {this.state.charging && 
                  <Table hover>
                    <tbody>
                      {this.state.options.map((option) => (
                        <tr>
                          <td className="text-blue">{option.name}</td>
                          <td className="text-center">
                            <a
                              onClick={() => this.deleteCampus(option.id)}
                              className="txt-blue decoration-none"
                            >
                              Eliminar X
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  }
                  {!this.state.charging && 
                    <div className="d-flex justify-content-center"><div class="lds-dual-ring-2"></div></div>
                  }
                </Row>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label
                        htmlFor="campus_name"
                        className="text-color-recovery"
                      >
                        Nombre de la nueva sede
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="campus_name"
                        name="campus_name"
                        aria-describedby="campus_nameHelp"
                        onChange={this.getInputDataOthers}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveCampus}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>

          <Modal show={showCategories} onHide={this.toggleCategories} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue text-center">
                Nueva Categoría
              </Modal.Title>
            </Modal.Header>
            {this.state.error === true && (
              <div className={this.state.color} role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <Modal.Body className="show-grid">
              <Container>
                <Row className="p-1">
                  <p>Otras categorias</p>
                  {this.state.charging && 
                  <Table hover>
                    <tbody>
                      {this.state.categories.map((category) => (
                        <tr>
                          <td className="text-blue">{category.name}</td>
                          <td className="text-center">
                            <a
                              onClick={() => this.deleteCategory(category.id)}
                              className="txt-blue decoration-none"
                            >
                              Eliminar X
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  }
                  {!this.state.charging && 
                    <div className="d-flex justify-content-center"><div class="lds-dual-ring-2"></div></div>
                  }
                </Row>
                <Row className="p-1">
                  <Col xs={12} md={12}>
                    <div className="form-group">
                      <label
                        htmlFor="category_name"
                        className="text-color-recovery"
                      >
                        Nombre Nueva Categoria
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm input-field"
                        id="category_name"
                        name="category_name"
                        aria-describedby="category_nameHelp"
                        onChange={this.getInputDataOthers}
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              {!this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  onClick={this.saveCategories}
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  Crear Nuevo
                </button>
              )}
              {this.state.spinner && (
                <button
                  size="lg"
                  type="submit"
                  className="bg-blue btn-lg btn-rounded txt-white-btn"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              )}
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}

export default NewProfile;
