import React, {Component} from "react";

import axios from "axios";
import { url } from "../services/api";
import logo from "../../../assets/img/logo.png";
import crypto from "crypto-js";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        password: "",
      },
      error: false,
      errorMsg: "",
      charging:false
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

  //se maneja la autenticacion del usuario
  login = () => {
    
    if (this.state.form.email !== "" && this.state.form.password !== "") {
      this.setState({
        charging: true
      });
      let url_api = url + "login";
      console.log(this.state.form);
      axios
        .post(url_api, this.state.form)
        .then((response) => {
          console.log(response.data.user);
          if (response.status === 200) {
            console.log(response.data.user)
            //se guarda el usuario en session
            //y se encripta la informacion del usuario
            let user = crypto.AES.encrypt(JSON.stringify(response.data.user), "@virtual_cr").toString();
            sessionStorage.setItem('token', response.data.access_token);
            sessionStorage.setItem('user', user);
            //se redirecciona a main
            // this.props.history.push("/admin");
            window.location.href = "/home/";
          } else {
            this.setState({
              error: true,
              errorMsg: "Usuario o contraseña incorrectos",
              charging:false
            });
          }
        })
        .catch((error) => {
          this.setState({
            error: true,
            errorMsg: "Ha ocurrido un problema favor intentelo nuevamente",
            charging:false
          });
        });
    }else{
      this.setState({
        error: true,
        errorMsg: "Todos los campos son requeridos",
        charging:false
      });
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
            <h4 className="card-title text-center blue-text-login">
              Iniciar sesión en ExpoInnova
            </h4>
            <br></br>
            <hr className="hr-login"></hr>
            {this.state.error === true && (
              <div className="alert alert-danger" role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <div className="card-text">
              {/* <div className="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password.</div> */}
              <form onSubmit={this.preventSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1" className="text-color-recovery">
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
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1" className="text-color-recovery">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    placeholder="***********"
                    onChange={this.getInputData}
                  />
                </div>
                <div className="d-flex justify-content-center">
                {!this.state.charging &&
                  <button
                    type="submit"
                    id="action-btn"
                    className="btn btn-primary btn-block blue-button-login col-sm-12 col-md-12 col-xs-12 w-100"
                    onClick={this.login}
                  >
                    Iniciar Sesión
                  </button>
                }
                {this.state.charging &&
                    <button
                    type="submit"
                    id="action-btn"
                    className="btn btn-primary btn-block blue-button-login col-sm-12 col-md-12 col-xs-12 w-100"
                  >
                    <div class="lds-dual-ring"></div>
                  </button>
                }
                </div>
                <div className="sign-up">
                  ¿Olvido su contraseña? <a href="/recovery" className="blue-text-login">Recuperar</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
