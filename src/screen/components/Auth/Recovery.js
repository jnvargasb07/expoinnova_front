import React from "react";

import axios from "axios";
import { url } from "../services/api";

class Recovery extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    form: {
      email: "",
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
        ...this.setState.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  //se maneja la recuperacion de contraseña
  recovery = () => {
      if(this.state.form.email !== ""){
        this.setState({
            nextPage:true,
            error:false,
            errorMsg:""
        })
      }else{
        this.setState({
            error:true,
            errorMsg:"Debe llenar el campo de correo electrónico"
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
                    Al correo electrónico {this.state.form.email} se envió la <br />
                    información para la recuperación de su cuenta.
                  </p>
                </div>
                <a
                  type="submit"
                  id="action-btn"
                  className="btn btn-primary btn-block col-md-12"
                  href="/"
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
