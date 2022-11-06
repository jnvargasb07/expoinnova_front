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
import axios from "axios";

class Profile extends Component {

  state = {
    user: "",
    nameUser: "",
    edit: true,
    form:{
      id:"",
      name:"",
      email:"",
      password:""
    },
    error: false,
    errorMsg: "",
    color: ""
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
    this.state.form.name = this.user.name;
    this.state.form.email = this.user.email;
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

  updateData = () => {
    this.setState({
      edit:false
    })      
  };

  saveData = () => {

    let url_api = url+"users";
    let id = this.user.id;
    let user = {
      name:this.state.form.name,
      email:this.state.form.email,
      // password:this.state.form.password
    }

    AppUtil.putAPI(url_api+'/'+id, user).then(response => {
      console.log(response);
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
                <div className="p-3">
                  <div className="form-group d-flex align-items-baseline p-1">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="text-color-recovery w-25"
                    >
                      NOMBRE COMPLETO
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="name"
                      name="name"
                      aria-describedby="emailHelp"
                      placeholder="Nombre completo"
                      onChange={this.getInputData}
                      defaultValue={this.user.name}
                      disabled={this.state.edit}
                    />
                  </div>
                  <div className="form-group d-flex align-items-baseline p-1">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="text-color-recovery w-25"
                    >
                      Direccion de correo electronico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      aria-describedby="emailHelp"
                      placeholder="nombre@ejemplo.com"
                      onChange={this.getInputData}
                      defaultValue={this.user.email}
                      disabled={this.state.edit}
                    />
                  </div>
                  <div className="form-group d-flex align-items-baseline p-1">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="text-color-recovery w-25"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      id="password"
                      name="password"
                      aria-describedby="emailHelp"
                      placeholder="***********"
                      onChange={this.getInputData}
                      disabled={this.state.edit}
                    />
                  </div>
                </div>
                <div className="text-center p-2">
                  {this.state.edit === true && 
                    <button
                      variant="none"
                      size="lg"
                      onClick={this.updateData}
                      className="bg-darkblue btn-lg btn-rounded txt-white-btn"
                    >
                      Editar Información
                      
                    </button>
                  }

                  {this.state.edit === false && 
                    <button
                      variant="none"
                      size="lg"
                      onClick={this.saveData}
                      className="bg-darkblue btn-lg btn-rounded txt-white-btn"
                    >
                      Guardar Información
                    </button>
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Profile;
