import React, {Component} from "react";

import axios from "axios";
import { url } from "../services/api";
import logo from "../../../assets/img/logo.png";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        password: "",
        password_confirmation:"",
        verification_code:""
      },
      error: false,
      errorMsg: "",
      color: ""
    };
  }



  //previene que recargue pagina
  //cuando se da boton iniciar sesion
  preventSubmit(e) {
    e.preventDefault();
  }

  //se obtiene la info de los inputs
  getInputData = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  setSessionData = async () => {
    await this.setState({
      form: {
        ...this.state.form,
        verification_code: sessionStorage.getItem('code')
      },
    });
  };


  //se maneja la recuperacion de contraseña
  changePassword = () => {

      if(this.state.form.email !== "" &&
      this.state.form.password !== "" &&
      this.state.form.password_confirmation !== ""){

        if(this.state.form.password !== this.state.form.password_confirmation){
          this.setState({
            error: true,
            errorMsg: "Las contraseñas no coinciden",
          });
          return;
        }

        let send = {
          email: this.state.form.email,
          password: this.state.form.password,
          password_confirmation:this.state.form.password_confirmation,
          verification_code:sessionStorage.getItem('code')
        }

        //this.setSessionData();
      let url_api = url + "confirm-change-password";
      axios
      .post(url_api, send)
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          setTimeout(() => {
            this.setState({
              error: true,
              errorMsg: "Cambio de contraseña exitoso",
              color:"alert alert-success"
            });
            sessionStorage.removeItem('code');
          }, "4000");
          window.location.href = "/";
        } else {
          this.setState({
            error: true,
            errorMsg: response.data.message,
            color:"alert alert-danger"
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMsg: "Ha ocurrido un problema favor intentelo nuevamente",
          color:"alert alert-danger"
        });
      });

      }else{
        this.setState({
            error:true,
            errorMsg:"Todos los campos son requeridos",
            color:"alert alert-danger"
        })
      }

  };

  render() {
    return (
      <div className="global-container m-0 vh-100 row justify-content-center align-items-center">
        <div className="card login-form box">
          <div className="card-body">
          <div className="text-center m-5">
              <img src={logo} alt="Logo"/>
            </div>
            <h3 className="card-title text-center blue-text-login h4">Cambiar Contraseña</h3>
            <div>
                  <small className="text-color-recovery">
                    La contraseña debe tener al menos 8 caracteres
                  </small >
                </div>
              <div>
                <div>
                </div>
                  {this.state.error === true &&
                    <div class={this.state.color} role="alert">
                      {this.state.errorMsg}
                    </div>
                  }
                <div className="card-text">
                  {/* <div className="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password.</div> */}
                  <form onSubmit={this.preventSubmit}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="text-color-recovery">
                        Direccion de correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder="nombre@ejemplo.com"
                        onChange={this.getInputData.bind(this)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="text-color-recovery">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm input-field"
                        id="password"
                        name="password"
                        aria-describedby="passwordHelp"
                        placeholder="*********"
                        onChange={this.getInputData.bind(this)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="text-color-recovery">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-sm input-field"
                        id="password_confirmation"
                        name="password_confirmation"
                        aria-describedby="confirm_passwordHelp"
                        placeholder="*********"
                        onChange={this.getInputData.bind(this)}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        id="action-btn"
                        className="btn btn-primary btn-block col-md-12 background-button-recovery w-100"
                        onClick={this.changePassword}
                      >
                        Continuar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
