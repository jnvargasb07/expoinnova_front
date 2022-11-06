import React from "react";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { url } from "../services/api";

class Recovery extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    form: {
      email: "",
      verification_code: ""
    },
    error: false,
    errorMsg: "",
    nextPage: false,
  };

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

  //se maneja la recuperacion de contraseña
  recovery = () => {
      if(this.state.form.email !== ""){

        let url_api = url + "request-password";
        axios
        .post(url_api, this.state.form)
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              nextPage:true,
              error:false,
              errorMsg:""
          })
          } else {
            this.setState({
              error: true,
              errorMsg: "Usuario o contraseña incorrectos",
            });
          }
        })
        .catch((error) => {
          this.setState({
            error: true,
            errorMsg: "Ha ocurrido un problema favor intentelo nuevamente",
          });
        });
      }else{
        this.setState({
            error:true,
            errorMsg:"Debe llenar el campo de correo electrónico"
        })
      }
  };

  //se verifica que el código de verificación sea valido
  verifyCode = () => {
    if(this.state.form.code !== ""){
      let url_api = url + "validate-code";
      axios
      .post(url_api, this.state.form)
      .then((response) => {
        if (response.data.data) {
          sessionStorage.setItem('code', this.state.form.verification_code);
          window.location.href = "/change-password";
        } else {
          this.setState({
            error: true,
            errorMsg: "Código de verificación incorrecto",
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMsg: "Ha ocurrido un problema favor intentelo nuevamente",
        });
      });
    }else{
      this.setState({
          error:true,
          errorMsg:"El campo de código de verificación es requerido"
      })
    }
};

  render() {
    return (
      <div className="global-container m-0 vh-100 row justify-content-center align-items-center">
        <div className="card login-form box">
          <div className="card-body">
            <h3 className="card-title text-center">Restablecer Contraseña</h3>
            {this.state.nextPage === false && (
              <div>
                <div>
                  <p className="text-center">
                    Para restablecer su contraseña introduzca su correo
                    electrónico
                  </p>
                </div>
                {this.state.error === true &&
                    <div class="alert alert-danger" role="alert">
                      {this.state.errorMsg}
                    </div>
                  }
                <div className="card-text">
                  {/* <div className="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password.</div> */}
                  <form onSubmit={this.preventSubmit}>
                    <div className="form-group">
                      <label for="exampleInputEmail1">
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
                    <button
                      type="submit"
                      id="action-btn"
                      className="btn btn-primary btn-block col-md-12"
                      onClick={this.recovery}
                    >
                      Continuar
                    </button>
                  </form>
                </div>
              </div>
            )}
            {this.state.nextPage === true && (
              <div>
                <div>
                  <p className="text-center">
                    Para cambiar tu contraseña ingresa el código de verificación enviado a {this.state.form.email}
                  </p>
                </div>
                {this.state.error === true &&
                    <div class="alert alert-danger" role="alert">
                      {this.state.errorMsg}
                    </div>
                  }
                <div className="form-group">
                      <label for="exampleInputEmail1">
                        Código de verificación
                      </label>
                      <input
                        type="verification_code"
                        className="form-control form-control-sm"
                        id="verification_code"
                        name="verification_code"
                        aria-describedby="codeHelp"
                        placeholder="Ingresa el código"
                        onChange={this.getInputData.bind(this)}
                      />
                    </div>
                <a
                  type="submit"
                  id="action-btn"
                  className="btn btn-primary btn-block col-md-12"
                  onClick={this.verifyCode}
                >
                  Continuar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Recovery;
