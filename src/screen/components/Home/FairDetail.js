import React from "react";
import { Button, Card, Table, Container, Row, Col, Form, Tabs, Tab, Spinner, Modal } from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription, businessIdeas } from "../services/api";
import moment from "moment";
import 'moment/locale/es';

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
        ideas:[{nombre: ' idea 01', creador: 'Dios', id:1}],
        editModal:false,
        keymodal:'info',

      }
  }

  setModalKey = (keymodal) => this.setState({keymodal})
  setKey = (key) =>
  {

    this.setState({key});
    /*switch (key)
    {
      case 'businessIdeas':
        AppUtil.getAPI(`${url}${businessIdeas}`, sessionStorage.getItem('token')).then(response => {
          console.log(response);
          if (response)
          {
            this.setState({ideas:response.data});
          }
        });
      break;
    }*/



  };

  componentWillMount()
  {
    AppUtil.getAPI(`${url}${fairDescription}${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      if (response)
      {
        this.setState({fairInfo:response.data})
      }
    });
  }


  toggleShow = () => this.setState({editModal: !this.state.editModal})

  render()
  {

    let {fairInfo, ideas, key, editModal, keymodal} = this.state;

      return (
          <>
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
                        <a href={`/home/fairdetail/idea/${item.id}`}>
                        <Row>
                          <Col xl="3" sm="2" md="2">
                            <div className="text-align-center">
                              <div className="roundIcon" >
                                <i className="fas fa-briefcase txt-white"></i>
                              </div>
                            </div>
                          </Col>
                          <Col xl="8" sm="10" md="10" className="ms-1">
                            <h3><b>{item.nombre}</b></h3>
                            <p><i className="fas fa-user"></i>{item.creador}</p>
                          </Col>
                        </Row>
                        </a>
                      </Col>
                    ))) : (<div className="text-align-center"><Spinner animation="grow" variant="primary"  /></div>)
                  }
                  </Row>
              </Tab>
              <Tab eventKey="settings" title={<span><i className="fas fa-cog"></i> Configuración</span>}>
                <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
                  <Col sm="12" xl="12">
                   <Form.Group>
                     <Form.Check
                      reverse
                      className="txt-blue"
                      type="switch"
                      id="foro-preguntas"
                      label="Foro de preguntas y respuestas de los diferentes usuarios"
                      checked={fairInfo ? fairInfo.options_comments: false}
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
                        id="fechas-foro"
                        label="Fechas de respuesta de foro"
                        checked={true}
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
                        >
                       </Form.Control>
                   </Form.Group>
                   </Col>

                 </Row>

                 <Row className="m-2">
                   <Col sm="12" xl="6">
                     <label className="txt-darkblue">Categoría</label>
                    <Form.Group>
                      <Form.Control
                         placeholder="Categoría"
                         type="text"
                         value={""}
                         name="category"
                         >
                        </Form.Control>
                    </Form.Group>
                    </Col>
                    <Col sm="12" xl="6">
                      <label className="txt-darkblue">Fecha de inicio</label>
                       <Form.Group>
                         <Form.Control
                           placeholder="Fecha de inicio"
                           type="date"
                           value={fairInfo ? fairInfo.start_date : ""}
                           name="start_date"
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
                          value={fairInfo ? fairInfo.end_date : ""}
                          name="end_date"
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
                       />
                       </Form.Group>
                     </Col>
                   </Row>
               </Tab>
             </Tabs>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn-rounded" variant="light" onClick={this.setModalKey}>
                  Cerrar
                </Button>
                <Button className="btn-rounded" className="btn-fill bg-darkblue">Guardar</Button>
              </Modal.Footer>
            </Modal>

          </Container>
          </>


      );
  }
}
