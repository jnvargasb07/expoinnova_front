import React from "react";
import { Button, Card, Table, Container, Row, Col, Form, Tabs, Tab, Spinner, Modal } from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription, businessIdeas } from "../services/api";
import moment from "moment";
import 'moment/locale/es';
import Toast from '../common/Toast.js';


export default class FairDetail extends React.Component
{
  constructor(props)
  {
    super(props);
    const { location } = this.props;
    const query = new URLSearchParams(location.search);

    this.state = {
        key:'fairInfo',
        id: query.get('id'),
        fairInfo:false,
        ideas:false,
        editModal:false,
        keymodal:'info',
        keyideas:'general',
        ideaModal:false,
        professors:[],
        students:[],
        judges:[],
        categories:[],
        category:false,
        processing: false,
        alert:{
          show:false,
          variant:'success',
          title:"",
          body:""
        },
        idea:{
          name: "",
          description: "",
          url_video: "",
          pdf_resume: "",
          professor_users_id: 0,
          categories_id: 0,
          campus_id: 0,
          students_id: 0,
          fairs_id: 0,
          evaluations_id: 0,
          professor_name:"",
          campus_name:""
        },
        validatedIdea:false,
        evaluations:[]
      }
  }

  setModalKey = (keymodal) => this.setState({keymodal})
  setKey = (key) =>
  {

    this.setState({key});
    switch (key)
    {
      case 'businessIdeas': // obtiene las ideas
        AppUtil.getAPI(`${url}${businessIdeas}`, sessionStorage.getItem('token')).then(response => {

          if (response)
          {
            this.setState({ideas:response.data});
          }
        });

        AppUtil.getAPI(`${url}students`, sessionStorage.getItem('token')).then(response => {

          if (response)
          {
            this.setState({students:response.data});
          }
        });
          AppUtil.getAPI(`${url}judges`, sessionStorage.getItem('token')).then(response => {
            if (response)
            {
              this.setState({judges:response.data});
            }
          });

          AppUtil.getAPI(`${url}evaluations`, sessionStorage.getItem('token')).then(response => {
            if (response)
            {
              console.log(response);
              this.setState({evaluations:response.data});
            }
          });
      break;
    }



  };


  _getFairInfo = () =>
  {
    AppUtil.getAPI(`${url}${fairDescription}${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      if (response)
      {
        this.setState({fairInfo:response.data})
      }
    });
    AppUtil.getAPI(`${url}categorie_by_fair_id/${this.state.id}`, sessionStorage.getItem('token')).then(response => {

      let category = response ? response.data : false;
      //console.log(category, category[0].categories.name); //validar con team a ver si estas Category va a ser una array
      this.setState({category}, () =>{
        AppUtil.getAPI(`${url}categories`, sessionStorage.getItem('token')).then(response => {

          let categories = response ? response.data : [];
          this.setState({categories});
        });
      });
    });







  }
  _getCategories = () =>
  {
    AppUtil.getAPI(`${url}${fairDescription}${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      if (response)
      {
        this.setState({fairInfo:response.data})
      }
    });
  }

  submitEditFair = () =>{
    this.setState({processing: true});
    let {fairInfo, id} = this.state;

    if (fairInfo.name.trim() !== "" && fairInfo.description.trim() !== "" && fairInfo.category.trim() !== "")
    {
        AppUtil.putAPI(`${url}fairs/${id}`, fairInfo).then(response => {
          if (response.success)
          {

            AppUtil.postAPI(`${url}categorie_fair`, {fairs_id: response.data.id, categories_id:fairInfo.category }).then(responseCatFair => {

              if (responseCatFair.success)
              {
                let alert = {
                  show:true,
                  variant:'success',
                  title:"Feria creada",
                  body:"Feria de negocio y categoría creada satisfactoriamente"
                }
                this.setState({alert, processing: false}, () => {
                  this.toggleShow();

                });
              }
              else
              {
                  let alert = {
                    show:true,
                    variant:'warning',
                    title:"Feria creada",
                    body:"Feria de negocio categoría creada satisfactoriamente pero no se pudo asignar la categoría"
                  }
                  this.setState({alert, processing: false}, () => {
                    this.toggleShow();

                  });

              }
            });

            return ;
          }
          let alert = {
            show:true,
            variant:'danger',
            title:"Error al crear la feria",
            body:"No se pudo crear la feria, por favor intente más tarde"
          }
        })
    }
  }

  componentWillMount()
  {
    this._getFairInfo();
  }


  toggleShow = () => this.setState({editModal: !this.state.editModal});
  toggleIdea = () => this.setState({ideaModal: !this.state.ideaModal});


  getInputData = async (e) => {

    await this.setState({
      fairInfo: {
        ...this.state.fairInfo,
        [e.target.name]: e.target.value,
      },
    });
  };


  _openFileSelector = () =>{

  }

  getInputIdea = async (e) => {

    await this.setState({
      idea: {
        ...this.state.idea,
        [e.target.name]: e.target.value,
      },
    });

  };

  getIdeaDataSelect = async (e) => {

    /*idea:{
      name: "",
      description: "",
      url_video: "",
      pdf_resume: "",
      professor_users_id: 0,
      categories_id: 0,
      campus_id: 0,
      students_id: 0,
      fairs_id: 0,
      evaluations_id: 0
    }*/

    let info = JSON.parse(e.target.value);
  /*  let idea = {
      students_id: info.id,
      professor_users_id: info.professor_users.id,
      professor_name:info.professor_users.name,
      campus_id: info.campus_id,
      fairs_id: this.state.id,
      categories_id: this.state.category[0].id
    }*/

    await this.setState({
      idea: {
        ...this.state.idea,
        students_id: info.id,
        professor_users_id: info.professor_users.id,
        professor_name:info.professor_users.name,
        campus_id: info.campus_id,
        fairs_id: this.state.id,
        categories_id: this.state.category[0].id,
        campus_name:info.campuses.name
      },
    });

  };


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
          let {idea} = this.state;
            AppUtil.postAPI(`${url}ideas`, idea).then(response => {
              if (response.success)
              {
                this.toggleIdea();
                let alert = {
                  show:true,
                  variant:'success',
                  title:"Idea creada",
                  body:"La idea fue agregada correctamente"
                };

                this.setState({alert})
                AppUtil.getAPI(`${url}${businessIdeas}`, sessionStorage.getItem('token')).then(response => {

                  if (response)
                  {
                    this.setState({ideas:response.data});
                  }
                });
                return ;
              }
              let alert = {
                show:true,
                variant:'danger',
                title:"Error al crear la idea",
                body:"No se pudo crear la idea, por favor intente más tarde"
              }
              this.setState({alert})
            });
            break;
      }


  }

  render()
  {

    let {fairInfo, ideas, key, editModal, keymodal, ideaModal, keyideas, categories, processing, alert, category, students, idea, judges, validatedIdea,
      evaluations

    } = this.state;

      return (
          <>
          <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body}  />

          <Container fluid>
            <Button variant="warning" className="btn-fill btn-rounded" onClick={() => this.props.navigate('/home')}>
              <i className="nc-icon nc-stre-left"></i>
                Volver
              </Button>
            <h2><i className="nc-icon nc-grid-45"></i><span className="p-1">{fairInfo ? fairInfo.name : 'Cargando...'}</span></h2>

            <Tabs
              activeKey={key}
              onSelect={(k) => this.setKey(k)}
              className="mb-3"
              defaultActiveKey="info"
              >

              <Tab eventKey="fairInfo" title={<span><i className="fas fa-folder"></i> Información de Feria</span>}>
               <div className="jumbotron">
                  <Row>
                  <Col xl="4" sm="12" md='12'>
                    <Card className="card-stats bg-gray m-1 p-2">
                      <Card.Header className="bg-gray">
                        <div className="text-align-center">
                          <div className="roundIcon" >
                            <i style={{'margin-top': '10%'}} className="fas fa-briefcase txt-white"></i>
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col xs="12">
                            <div>
                              <h4 className="txt-darkblue">{fairInfo ? fairInfo.name : 'Cargando...'}</h4>
                                <h2  className="txt-darkblue">{fairInfo ? fairInfo.description : 'Cargando...'}</h2>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xl="8" sm="12" md="12">
                    <Row>

                      <Row className="bg-gray btn-rounded p-2 m-2">
                        <Col>
                          <div className="txt-darkblue m-2">
                            Fecha de Inicio
                          </div>
                        </Col>
                        <Col>
                          <div className="txt-darkblue m-2" id="FechaInicioFeria">
                            {fairInfo ? moment(fairInfo.star_date).format('MMMM Do YYYY, h:mm:ss a') : 'Cargando...'}
                          </div>
                        </Col>
                      </Row>

                      <Row className="bg-gray btn-rounded p-2 m-2">
                        <Col>
                          <div className="txt-darkblue m-2">
                            Fecha de Finalización
                          </div>
                        </Col>
                        <Col>
                          <div className="txt-darkblue m-2" id="FechaFinalFeria">
                            {fairInfo ? moment(fairInfo.end_date).format('MMMM Do YYYY, h:mm:ss a') : 'Cargando...'}
                          </div>
                        </Col>
                      </Row>
                      <Row className="bg-gray btn-rounded p-2 m-2">
                        <Col>
                          <div className="txt-darkblue m-2">
                            Categoría
                          </div>
                        </Col>
                        <Col>
                          <div className="txt-darkblue m-2" id="FechaFinalFeria">
                          {(category && typeof(category[0]) != 'undefined') ? category[0].categories.name : '' }
                          </div>
                        </Col>
                      </Row>

                    </Row>
                  </Col>
                  </Row>

                  <Row>
                    <Col xl="12" sm="12" md="12" className="bg-gray btn-rounded p-4 m-2 txt-darkblue">
                      Descripción<br/>
                      <p className="p-2"> {fairInfo ? fairInfo.description : 'Cargando...'}</p>
                    </Col>
                    <Col xl="12" sm="12" md="12" className="text-align-center">
                      <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleShow}>
                        <i className="fas fa-edit"></i>Editar Información
                      </Button>
                    </Col>


                  </Row>



                  </div>
              </Tab>
              <Tab eventKey="businessIdeas" title={<span><i className="fas fa-lightbulb"></i> Ideas de negocios</span>}>
                <Row>
                  {
                    ideas ?
                    (ideas?.map((item,index) =>(
                      <Col xl="5" sm="12" md="12" className="bg-gray p-2 m-1 txt-blue" key={index}>
                        <a href={`/home/fairdetail/idea?id=${item.id}`} className="text-decoration-none">
                        <Row>
                          <Col xl="3" sm="2" md="2">
                            <div className="text-align-center">
                              <div className="roundIcon" >
                                <i className="fas fa-briefcase txt-white"></i>
                              </div>
                            </div>
                          </Col>
                          <Col xl="8" sm="10" md="10" className="ms-1">
                            <h4 className="txt-darkblue"><b>{item.name}</b></h4>
                            Descripción:<br/> <p className="txt-darkblue hideDesc">{item.description}</p>
                          </Col>
                        </Row>
                        </a>
                      </Col>
                    ))) : (<div className="text-align-center"><Spinner animation="grow" variant="primary"  /></div>)
                  }
                  </Row>
                  <Col xl="12" sm="12" md="12" className="text-align-center">
                    <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleIdea}>
                      <i className="fas fa-edit"></i>Crear Nueva Idea
                    </Button>
                  </Col>
              </Tab>
              <Tab eventKey="settings" title={<span><i className="fas fa-cog"></i> Configuración</span>}>
                <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
                  <Col sm="12" xl="12">
                   <Form.Group>
                     <Form.Check
                      reverse
                      className="txt-blue"
                      type="switch"
                      id="options_comments"
                      label="Foro de preguntas y respuestas de los diferentes usuarios"
                      checked={fairInfo ? fairInfo.options_comments: false}
                      onChange={this.getInputData}
                     />
                     </Form.Group>
                   </Col>
                 </Row>
                 <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
                   <Col sm="12" xl="12">
                    <Form.Group>
                      <Form.Check
                        reverse
                        className="txt-blue"
                        type="switch"
                        id="date_forum"
                        label="Fechas de respuesta de foro"
                        checked={true}
                        onChange={this.getInputData}
                      />
                      </Form.Group>
                    </Col>
                  </Row>
              </Tab>
              <Tab eventKey="reports" title={<span><i className="fas fa-chart-bar"></i> Reportes</span>}>
                <Row>
                  <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                      <Card.Header>
                        <Card.Title as="h2" className="txt-blue">Por Ideas de negocio</Card.Title>
                      </Card.Header>
                      <Card.Body className="table-full-width table-responsive px-0">
                        <Table className="table-hover table-striped">
                          <thead>
                            <tr>
                              <th className="border-0  txt-blue">Ideas de negocios</th>
                              <th className="border-0 txt-blue">Usuario</th>
                              <th className="border-0 txt-blue">Nombre del jurado</th>
                              <th className="border-0 txt-blue">Categoría</th>
                              <th className="border-0 txt-blue">Evalución total</th>
                            </tr>
                          </thead>
                          <tbody>

                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>


                <Row>
                  <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                      <Card.Header>
                        <Card.Title as="h2" className="txt-blue">Por categoría</Card.Title>
                      </Card.Header>
                      <Card.Body className="table-full-width table-responsive px-0">
                        <Table className="table-hover table-striped">
                          <thead>
                            <tr>
                              <th className="border-0  txt-blue">Categoría</th>
                              <th className="border-0 txt-blue">Usuario</th>
                              <th className="border-0 txt-blue">Nombre del jurado</th>
                              <th className="border-0 txt-blue">Evalución total</th>
                            </tr>
                          </thead>
                          <tbody>

                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                      <Card.Header>
                        <Card.Title as="h2" className="txt-blue">Por jurado</Card.Title>
                      </Card.Header>
                      <Card.Body className="table-full-width table-responsive px-0">
                        <Table className="table-hover table-striped">
                          <thead>
                            <tr>
                              <th className="border-0  txt-blue">Nombre de jurado</th>
                              <th className="border-0 txt-blue">Usuario</th>
                              <th className="border-0 txt-blue">Categoría</th>
                              <th className="border-0 txt-blue">Evalución total</th>
                            </tr>
                          </thead>
                          <tbody>

                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>




              </Tab>
            </Tabs>
            <Modal
              show={editModal}
              onHide={this.toggleShow}
              backdrop="static"
              keyboard={false}
              size="lg"
              >
              <Modal.Header closeButton>
                <h3 className=" tituloFerias">Nueva Feria de Negocios</h3>
              </Modal.Header>
              <Modal.Body>
              <Tabs
                id="controlled-tab-example"
                activeKey={keymodal}
                onSelect={(k) => this.setModalKey(k)}
                className="mb-3 txt-blue"
                defaultActiveKey="info"
                >
               <Tab eventKey="info" title="Información General" className="txt-darkblue">
                <Row className="m-2">
                  <Col sm="12" xl="12">
                    <label>Nombre de la feria de negocios</label>
                     <Form.Group>
                       <Form.Control
                          placeholder="Nombre de la feria de negocios"
                          type="text"
                          value={fairInfo ? fairInfo.name : ""}
                          name="name"
                          onChange={this.getInputData}
                          >
                         </Form.Control>
                     </Form.Group>
                   </Col>

                 </Row>

                 <Row className="m-2">
                   <Col sm="12" xl="6">
                     <label className="txt-darkblue">Categoría</label>
                     <Form.Group>
                       <Form.Select aria-label="Categoría" name="category" onChange={this.getInputData}>
                         <option value="">-- Seleccione una opción --</option>
                        {categories?.map((item, key) =>{
                          if (category && typeof(category[0]) != 'undefined')
                          {
                            return (category[0].categories_id === item.id ? <option value={item.id} defaultValue key={key}>{item.name}</option> : <option value={item.id} key={key}>{item.name}</option>)
                          }
                          else
                          {
                            return (<option value={item.id} key={key}>{item.name}</option>);
                          }

                        }
                            )}
                         </Form.Select>
                     </Form.Group>
                    </Col>
                    <Col sm="12" xl="6">
                      <label className="txt-darkblue">Fecha de inicio</label>
                       <Form.Group>
                         <Form.Control
                           placeholder="Fecha de inicio"
                           type="date"
                           value={fairInfo ? moment(fairInfo.start_date).format('YYYY-MM-DD') : ""}
                           name="start_date"
                           onChange={this.getInputData}
                           >
                         </Form.Control>
                       </Form.Group>
                     </Col>
                  </Row>
                  <Row className="m-2">
                    <Col sm="12" xl="6">
                      <label className="txt-darkblue">Fecha de fin</label>
                     <Form.Group>
                       <Form.Control
                          placeholder="Fecha de fin"
                          type="date"
                          value={fairInfo ? moment(fairInfo.end_date).format('YYYY-MM-DD') : ""}
                          name="end_date"
                          onChange={this.getInputData}
                          >
                         </Form.Control>
                     </Form.Group>
                     </Col>

                   </Row>

                   <Row className="m-2">
                     <Col sm="12" xl="12">
                       <label className="txt-darkblue">Descripción de la feria</label>
                      <Form.Group>
                        <Form.Control
                           placeholder="Descripción de la feria"
                           as="textarea"
                           style={{ height: '100px' }}
                           name="description"
                           value={fairInfo ? fairInfo.description : ""}
                           onChange={this.getInputData}
                           >
                          </Form.Control>
                      </Form.Group>
                      </Col>
                    </Row>

               </Tab>
               <Tab eventKey="config" title="Configuración">
                 <Row>
                   <Col sm="12" xl="12">
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        id="foro-preguntas"
                        label="Foro de preguntas y respuestas de los diferentes usuarios"
                        value={fairInfo ? fairInfo.options_comments : ""}
                        onChange={this.getInputData}
                      />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" xl="12">
                     <Form.Group>
                       <Form.Check
                         type="switch"
                         id="fechas-foro"
                         label="Fechas de respuesta de foro"
                         onChange={this.getInputData}
                       />
                       </Form.Group>
                     </Col>
                   </Row>
               </Tab>
             </Tabs>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-rounded" variant="light" onClick={this.toggleShow}>
                  Cerrar
                </Button>
                {processing ? <Spinner animation="grow" variant="primary"  /> : <Button className="btn-rounded" onClick={this.submitEditFair} className="btn-fill bg-darkblue">Guardar</Button>}
              </Modal.Footer>
            </Modal>

            {/*modal para nueva idea*/}
            <Modal
              show={ideaModal}
              onHide={this.toggleIdea}
              backdrop="static"
              keyboard={false}
              size="lg"

              >
              <Modal.Header closeButton>
                <h3 className=" tituloFerias">Nueva Idea de Negocios</h3>
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
                            <option value={JSON.stringify(item)} key={key}>{item.users.name} ({item.users.email})</option>
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
                           {evaluations?.map((item, key) =>(
                             <option value={item.id} key={key}>{item.tittle}</option>
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
                            value={idea.professor_name ? idea.professor_name : ""}
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
                          value={idea.campus_name ? idea.campus_name : ""}
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
                           value={fairInfo.name}
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
