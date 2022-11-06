import React from "react";

import axios from "axios";
import { url } from "../services/api";
import { logo } from "../../../assets/img/logo.png";

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    form: {
      email: "",
      password: "",
    },
    error: false,
    errorMsg: "",
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

  //se maneja la autenticacion del usuario
  login = () => {
    if (this.state.form.email !== "" && this.state.form.password !== "") {
      let url_api = url + "login";
      console.log(this.state.form);
      axios
        .post(url_api, this.state.form)
        .then((response) => {
          console.log(response.data.user);
          if (response.status == 200) {
            //se guarda el usuario en session
            sessionStorage.setItem('token', response.data.access_token);
            sessionStorage.setItem('user', response.data.user);
            //se redirecciona a main
            // this.props.history.push("/admin");
            window.location.href = "/home";
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
    }
  };

  render() {
    return (
      <div className="global-container m-0 vh-100 row justify-content-center align-items-center">
        <div className="card login-form box">
          <div className="card-body">
            <img src={logo}></img>
            <h3 className="card-title text-center">
              Iniciar Sesión en ExpoInnova
            </h3>
            {this.state.error === true && (
              <div class="alert alert-danger" role="alert">
                {this.state.errorMsg}
              </div>
            )}
            <div className="card-text">
              {/* <div className="alert alert-danger alert-dismissible fade show" role="alert">Incorrect username or password.</div> */}
              <form onSubmit={this.preventSubmit}>
                <div className="form-group">
                  <label for="exampleInputEmail1">
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
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    placeholder="***********"
                    onChange={this.getInputData}
                  />
                </div>
                <button
                  type="submit"
                  id="action-btn"
                  className="btn btn-primary btn-block col-md-12"
                  onClick={this.login}
                >
                  Iniciar Sesión
                </button>

                <div className="sign-up">
                  ¿Olvido su contraseña? <a href="/recovery">Recuperar</a>
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
