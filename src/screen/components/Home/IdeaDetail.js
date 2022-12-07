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
        ideaInfoEdit:false,
        ideaId:query.get('id'),
        validatedQuestion:false,
        validateEvaluation:false,
        categories:[],
        students:[],
        judges_has_ideas:[],
        judges:[],
        ideaModal: false,
        validatedIdea:false,
        keyideas:'general',
        evaluations:[],
        alert:{
          show:false,
          variant:'success',
          title:"",
          body:""
        }

      }
    }

    getIdeaById = () =>{
      AppUtil.getAPI(`${url}ideas/${this.state.ideaId}`, sessionStorage.getItem('token')).then(response => {
        if (response)
        {

          let ideaInfo = response.data;
          let ideaInfoEdit = {
            name: ideaInfo.name,
            description: ideaInfo.description,
            url_video: ideaInfo.url_video,
            pdf_resume: ideaInfo.pdf_resume,
            professor_users_id: ideaInfo.professor_users_id,
            categories_id: ideaInfo.categories_id,
            campus_id: ideaInfo.campus_id,
            students_id: ideaInfo.students_id,
            fairs_id: ideaInfo.fairs_id,
            evaluations_id: ideaInfo.evaluations_id,
            professor_name:ideaInfo.professor_users.name,
            campus_name:ideaInfo.campuses.name,
            fairs_name:ideaInfo.fairs.name,
            ideas_to_course:""
          };

          this.setState({ideaInfo, ideaInfoEdit })
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
    _fetchJudges = () =>{
      /*AppUtil.getAPI(`${url}judges_has_ideas`, sessionStorage.getItem('token')).then(response => {

        if (response)
        {
          console.log(response.data);
          this.setState({judges_has_ideas:response.data});
        }
      });*/

      AppUtil.getAPI(`${url}judges`, sessionStorage.getItem('token')).then(response => {

        if (response)
        {
          console.log(response.data);
          this.setState({judges:response.data});
        }
      });
    }
    _fetchEvaluations = () => {
      AppUtil.getAPI(`${url}evaluations`, sessionStorage.getItem('token')).then(response => {
        if (response)
        {
          console.log(response);
          this.setState({evaluations:response.data});
        }
      });
    }

    SubmitIdeaSteps = (e) =>
    {

        const form = e.currentTarget;
        console.log(e);
        if (form.checkValidity() === false)
        {
          e.preventDefault();
          e.stopPropagation();
          return ;
        }

        e.preventDefault();
        e.stopPropagation();

        switch (this.state.keyideas)
        {
          case 'general':
            this.setState({keyideas:'materials'});
          break;
          case 'materials':
            this.setState({keyideas:'data_idea'});
          break;
          case 'data_idea':
            let {ideaInfoEdit, ideaInfo} = this.state;
              AppUtil.putAPI(`${url}ideas/${ideaInfo.id}`, ideaInfoEdit).then(response => {
                if (response.success)
                {
                  this.toggleIdea();
                  let alert = {
                    show:true,
                    variant:'success',
                    title:"Idea editada",
                    body:"La idea fue editada correctamente"
                  };
                  this.getIdeaById();
                  this.setState({alert})

                  return ;
                }
                let alert = {
                  show:true,
                  variant:'danger',
                  title:"Error al editar la idea",
                  body:"No se pudo editar la idea, por favor intente más tarde"
                }
                this.setState({alert})
              });
              break;
        }
    }

    toggleIdea = () => this.setState({ideaModal: !this.state.ideaModal});
    componentWillMount()
    {
      this._fetchCoordinators();
      this._fetchEvaluations();
      this.getIdeaById();
      this._fetchCategories();
      this._fetchJudges();
    }

    getInputIdea = async (e) => {

      await this.setState({
        ideaInfoEdit: {
          ...this.state.ideaInfoEdit,
          [e.target.name]: e.target.value,
        },
      });
    };

    getIdeaDataSelect = async (e) => {


      let info = JSON.parse(e.target.value);

      await this.setState({
        ideaInfoEdit: {
          ...this.state.ideaInfoEdit,
          students_id: info.id,
          professor_users_id: info.professor_users.id,
          professor_name:info.professor_users.name,
          campus_id: info.campus_id,
          fairs_id: this.state.id,
          campus_name:info.campuses.name
        },
      });

    };

    render() {
      let {alert, keyideas, ideaInfo, validatedQuestion, validateEvaluation, categories, students, ideaModal, judges, validatedIdea, ideaInfoEdit} = this.state;
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


              <Modal
                show={ideaModal}
                onHide={this.toggleIdea}
                backdrop="static"
                keyboard={false}
                size="lg"

                >
                <Modal.Header closeButton>
                  <h3 className=" tituloFerias">Editar Idea de Negocios</h3>
                </Modal.Header>
                <Modal.Body>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={keyideas}
                  className="mb-3 txt-blue"
                  defaultActiveKey="general"
                  >

                   <Tab eventKey="general" title="General" className="txt-darkblue">
                     <Form validated={validatedIdea} onSubmit={this.SubmitIdeaSteps}>
                      <Row className="m-2">
                        <Col sm="12" xl="12">

                         <Form.Group controlId="validationCustom01">
                          <Form.Label>Coordinador</Form.Label>
                           <Form.Select aria-label="Coordinador" type="text" name="students_id" onChange={this.getIdeaDataSelect} required>
                           <option value="">-- Seleccione una opción --</option>
                            {students?.map((item, key) =>(
                              ideaInfoEdit.students_id === item.id  ?  <option value={JSON.stringify(item)} key={key} defaultValue selected>{item.users.name} ({item.users.email})</option> : <option value={JSON.stringify(item)} key={key}>{item.users.name} ({item.users.email})</option>
                            ))}
                             </Form.Select>
                             <Form.Control.Feedback type="invalid">El Coordinador es requerido</Form.Control.Feedback>
                         </Form.Group>
                         </Col>
                       </Row>
                       <Row className="m-2">
                         <Col sm="12" xl="6">
                           <label className="txt-darkblue">Jurado</label>
                          <Form.Group controlId="validationCustom02">
                            <Form.Select aria-label="Judges" type="text" name="judge_id" onChange={this.getInputIdea} required>
                               <option value="">-- Seleccione una opción --</option>
                              {judges?.map((item, key) =>(
                                 <option value={item.id} key={key}>{item.business_name} </option>
                              ))}
                             </Form.Select>
                             <Form.Control.Feedback type="invalid">El jurado es requerido</Form.Control.Feedback>
                          </Form.Group>
                          </Col>
                          <Col sm="12" xl="6">
                            <label className="txt-darkblue">Ideas al curso</label>
                             <Form.Group controlId="validationCustom03">
                               <Form.Control
                                 placeholder="Ideas al curso"
                                 type="text"
                                 required
                                 name="ideas_to_course"
                                 onChange={this.getInputIdea}
                                 value={ideaInfoEdit ? ideaInfoEdit.ideas_to_course : ""}
                                 >
                               </Form.Control>
                             </Form.Group>
                           </Col>
                        </Row>
                        <Col xl="12" sm="12" md="12" className="text-align-center">
                          <Button className="btn-rounded btn-fill bg-darkblue" type="submit">
                            Siguiente
                          </Button>
                        </Col>
                        </Form>
                   </Tab>
                   <Tab eventKey="materials" title="Materiales">
                   <Form validated={validatedIdea} onSubmit={this.SubmitIdeaSteps}>
                     <Row className="m-2">
                       <Col sm="12" xl="12">
                         <label>Videos (Insertar enlace de video)</label>
                        <Form.Group>
                          <Form.Control
                             placeholder="Video"
                             type="url"
                             name="url_video"
                             onChange={this.getInputIdea}
                             required
                             value={ideaInfoEdit ? ideaInfoEdit.url_video: ""}
                             >
                            </Form.Control>
                        </Form.Group>
                        </Col>
                      </Row>
                      <Row className="m-2">
                        <Col sm="12" xl="12">
                          <label>Presentaciones (Subir documento)</label>
                         <Form.Group>

                           <Form.Control
                              type="file"
                              name="pdf_resume"
                              onChange={this.getInputIdea}
                              required
                              //value={ideaInfoEdit ? ideaInfoEdit.pdf_resume : ""}
                              >
                             </Form.Control>
                         </Form.Group>
                         </Col>
                       </Row>

                       <Row className="m-2">
                         <Col sm="12" xl="12">
                          <Form.Group>
                           <Form.Label>Evaluación</Form.Label>
                            <Form.Select aria-label="Coordinador" type="text" name="evaluations_id" onChange={this.getInputIdea} required>
                            <option value="">-- Seleccione una opción --</option>
                             {this.state.evaluations?.map((item, key) =>(
                               ideaInfoEdit.evaluations_id == item.id ?  <option value={item.id} selected defaultValue key={key}>{item.tittle}</option> :  <option value={item.id} key={key}>{item.tittle}</option>
                             ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">La evaluación es requerido</Form.Control.Feedback>
                          </Form.Group>
                          </Col>
                        </Row>


                       <Row>
                         <Col xl="6" sm="12" md="12" className="text-align-center">
                           <Button className="btn-rounded btn-fill bg-darkblue" onClick={() => this.setState({keyideas:'general'})}>
                             Volver
                           </Button>
                         </Col>
                         <Col xl="6" sm="12" md="12" className="text-align-center">
                           <Button className="btn-rounded btn-fill bg-darkblue" type="submit">
                             Siguiente
                           </Button>
                         </Col>
                       </Row>
                     </Form>
                   </Tab>
                   <Tab eventKey="data_idea" title="Datos de la idea">
                    <Form validated={validatedIdea} onSubmit={this.SubmitIdeaSteps}>
                     <Row className="m-2">
                       <Col sm="12" xl="6">
                         <label>Nombre de la idea</label>
                        <Form.Group>
                          <Form.Control
                             type="text"
                             name="name"
                             onChange={this.getInputIdea}
                             required
                             value={ideaInfoEdit ? ideaInfoEdit.name : ""}
                             >
                            </Form.Control>
                        </Form.Group>
                        </Col>
                        <Col sm="12" xl="6">
                          <label>Nombre del profesor</label>
                         <Form.Group>
                           <Form.Control
                              type="text"
                              name="professor_name"
                              value={ideaInfoEdit ? ideaInfoEdit.professor_name : ""}
                              readOnly
                              required

                              >
                             </Form.Control>
                         </Form.Group>
                         </Col>
                      </Row>
                      <Row className="m-2">
                      <Col sm="12" xl="6">
                        <label>Sede Universitario</label>
                       <Form.Group>
                         <Form.Control
                            type="text"
                            name="university_name"
                            readOnly
                            value={ideaInfoEdit ? ideaInfoEdit.campus_name : ""}
                            required
                            >
                           </Form.Control>
                       </Form.Group>
                       </Col>
                       <Col sm="12" xl="6">
                         <label>Feria que pertenece</label>
                        <Form.Group>
                          <Form.Control
                             type="text"
                             name="fair_name"
                             readOnly
                             value={ideaInfoEdit ? ideaInfoEdit.fairs_name : ""}
                             required
                             >
                            </Form.Control>
                        </Form.Group>
                        </Col>
                      </Row>


                      <Row>
                        <Col sm="12" xl="12">
                        <label className="txt-darkblue">Descripción de la idea</label>
                         <Form.Group>
                           <Form.Control
                              placeholder="Descripción de la idea"
                              as="textarea"
                              style={{ height: '100px' }}
                              name="description"
                              onChange={this.getInputIdea}
                              required
                              value={ideaInfoEdit ? ideaInfoEdit.description : ""}
                              >
                             </Form.Control>
                         </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl="6" sm="12" md="12" className="text-align-center">
                          <Button className="btn-rounded btn-fill bg-darkblue" onClick={() => this.setState({keyideas:'materials'})}>
                            Volver
                          </Button>
                        </Col>
                        <Col xl="6" sm="12" md="12" className="text-align-center">
                          <Button type="submit" className="btn-rounded btn-fill bg-darkblue" type="submit">
                            Guardar
                          </Button>
                        </Col>
                      </Row>
                      </Form>
                   </Tab>

               </Tabs>
                </Modal.Body>
                <Modal.Footer>
                  <div className="text-align-center">
                    <Button className="btn-rounded" variant="light" onClick={this.toggleIdea}>
                      Cerrar
                      </Button>
                  </div>
                </Modal.Footer>
              </Modal>


        </Container>




        </>
      );
    }



}
