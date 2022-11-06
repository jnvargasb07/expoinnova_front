import React from "react";
import { Button, Card, Table, Container, Row, Col, Form, Tabs, Tab, Spinner, Modal } from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription, businessIdeas } from "../services/api";
import moment from "moment";
import 'moment/locale/es';
import Toast from '../common/Toast.js';


export default class IdeaDetail extends React.Component {

    constructor(props){
      super(props);
      const { location } = this.props;
      const query = new URLSearchParams(location.search);

      this.state = {
        ideaInfo: false,
        ideaId:query.get('id'),
        validatedQuestion:false,
        validateEvaluation:false,
        categories:[],
        students:[]

      }
    }

    getIdeaById = () =>
    {
      AppUtil.getAPI(`${url}ideas/${this.state.ideaId}`, sessionStorage.getItem('token')).then(response => {
        console.log(response);
        if (response)
        {
          this.setState({ideaInfo:response.data})
        }
      });
    }
    _fetchCategories = () => {
      AppUtil.getAPI(`${url}categories`, sessionStorage.getItem('token')).then(response => {

        let categories = response ? response.data : [];
        this.setState({categories});
      });
    }

    _fetchCoordinators = () =>{
      AppUtil.getAPI(`${url}students`, sessionStorage.getItem('token')).then(response => {

        if (response)
        {
          this.setState({students:response.data});
        }
      });
    }

    componentWillMount()
    {
      this.getIdeaById();
      this._fetchCategories();
    }


    render() {
      let {ideaInfo, validatedQuestion, validateEvaluation, categories, students} = this.state;
      return (
        <>
        <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body}  />

        <Container fluid>

          <Button variant="warning" className="btn-fill btn-rounded" onClick={() => this.props.navigate(-1)}>
            <i className="nc-icon nc-stre-left"></i>
              Volver
          </Button>

            <Row className="p-2">
              <Col xl="8" md="12" sm="12">
                <h4>
                  <div className="text-align-center">
                    <div className="roundIconIntern" >
                      <i style={{'margin-top': '11%'}} className="fas fa-briefcase txt-white-btn"></i>
                    </div>
                  </div>
                  <span className="p-1">{ideaInfo ? ideaInfo.name :'Cargando...'}</span>
                </h4>
              </Col>

              <Col xl="4" md="12" sm="12">
                <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleIdea}>
                  <i className="fas fa-edit"></i>Editar Información
                </Button>
              </Col>
            </Row>
            <hr />

            <h4 className="txt-blue">General</h4>
            <Row className="p-2 m-2">
              <Col xl="12" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Coordinador
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? ideaInfo.students.users.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>


                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Jurado
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? '' : 'Cargando...'}
                    </div>
                  </Col>
                </Row>

                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Ideas al concurso
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? '' : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>

            </Row>

            <h4>Materiales</h4>
            <Row className="p-2 m-2">
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Video
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      <a href={ideaInfo ? ideaInfo.url_video: '#'} target="_blank" className="txt-darkblue">Ver Video</a>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Presentación
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      <a href="#" target="_blank" className="txt-darkblue">Ver Documento</a>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <h4>Datos de la idea</h4>

            <Row className="p-2 m-2">
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Nombre de la idea
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? ideaInfo.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Descripción de la idea
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                        {ideaInfo ? ideaInfo.description : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="p-2 m-2">
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Nombre del profesor
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? ideaInfo.professor_users.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Categoría
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                        {ideaInfo ? ideaInfo.categories.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="p-2 m-2">
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Sede Universitaria
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? ideaInfo.campuses.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Feria que pertenece
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                        {ideaInfo ? ideaInfo.fairs.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <h4 className="txt-blue">Preguntas</h4>
            <hr />
            <span className="txt-darkblue"># Preguntas</span>
            <Row>

            <Col xl="2" sm="2" md="2">
                <div className="text-align-center">
                  <Button className="btn-rounded" onClick={() => console.log('test')}>
                    X
                  </Button>
                </div>
            </Col>

              <Col xl="3" sm="10" md="10">
                <div className="text-align-center">
                  <div className="roundIcon">
                    <b className="txt-white">M</b>
                  </div>
                </div>
              </Col>

              <Col xl="7" sm="12" md="12">
                <span className="txt-darkblue">Nombre Apellido Apellido </span>
                <br/>
                <p className="txt-darkblue">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet</p>
              </Col>
            </Row>
            <hr />
             <Form validated={validatedQuestion} onSubmit={this.SubmitIdeaSteps}>
                <Form.Group>
                  <Form.Label className="txt-darkblue">Escribe tu pregunta aquí</Form.Label>
                  <Form.Control
                     placeholder="Descripción de la idea"
                     as="textarea"
                     style={{ height: '100px' }}
                     name="question"
                     onChange={this.getInputIdea}
                     required
                     >
                    </Form.Control>
                </Form.Group>
                <Button className="btn-rounded btn-fill bg-darkblue" type="submit">
                  Enviar
                </Button>
             </Form>

             <h4 className="txt-blue">Evaluación</h4>
             <hr />
             <span className="txt-darkblue"># Preguntas</span>
             <Row>

             <Col xl="2" sm="2" md="2">
                 <div className="text-align-center">
                   <Button className="btn-rounded" onClick={() => console.log('test')}>
                     X
                   </Button>
                 </div>
             </Col>

               <Col xl="3" sm="10" md="10">
                 <div className="text-align-center">
                   <div className="roundIcon">
                     <b className="txt-white">M</b>
                   </div>
                 </div>
               </Col>

               <Col xl="7" sm="12" md="12">
                 <span className="txt-darkblue">Nombre Apellido Apellido </span>
                 <br/>
                 <p className="txt-darkblue">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet</p>
               </Col>
             </Row>
             <hr />
              <Form validated={validateEvaluation} onSubmit={this.SubmitIdeaSteps}>
                <Row>
                  <Col xl="6" sm="12" md="12">
                  <Form.Group>
                   <Form.Label className="txt-darkblue">Categoría</Form.Label>
                    <Form.Select aria-label="Categoría" name="category" onChange={this.getInputData} required>
                      <option value="">-- Seleccione una opción --</option>
                     {categories?.map((item, key) => (<option value={item.id} key={key}>{item.name}</option>) )}
                      </Form.Select>
                  </Form.Group>
                  </Col>

                  <Col xl="6" sm="12" md="12">
                     <Form.Group>
                     <Form.Label className="txt-darkblue">Título de la evaluación</Form.Label>
                       <Form.Control
                         placeholder="Título de la evaluación"
                         type="text"
                         name="start_date"
                         required
                         onChange={this.getInputData}
                         >
                       </Form.Control>
                     </Form.Group>
                  </Col>
                </Row>


                <Row>
                  <Col xl="6" sm="12" md="12">
                  <Form.Group>
                   <Form.Label className="txt-darkblue">Porcentaje de puntuación</Form.Label>
                     <Form.Control
                       placeholder="Título de la evaluación"
                       type="text"
                       name="start_date"
                       required
                       onChange={this.getInputData}
                       >
                     </Form.Control>
                  </Form.Group>
                  </Col>

                  <Col xl="6" sm="12" md="12">
                     <Form.Group>
                     <Form.Label className="txt-darkblue">Estrellas</Form.Label>
                       <Form.Control
                         placeholder="Título de la evaluación"
                         type="text"
                         name="start_date"
                         required
                         onChange={this.getInputData}
                         >
                       </Form.Control>
                     </Form.Group>
                  </Col>
                </Row>


                <Row>
                  <Col xl="12" sm="12" md="12">
                   <Form.Group>
                     <Form.Label className="txt-darkblue">Descripción</Form.Label>
                     <Form.Control
                        placeholder="Descripción"
                        as="textarea"
                        style={{ height: '100px' }}
                        name="question"
                        onChange={this.getInputIdea}
                        required
                        >
                       </Form.Control>
                      </Form.Group>
                   </Col>
                 </Row>
                 <Button className="btn-rounded btn-fill bg-darkblue" type="submit">
                   Enviar
                 </Button>
              </Form>


        </Container>




        </>
      );
    }



}
