import React from "react";

// react-bootstrap components
import {

  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Modal,
  Tabs,
  Tab,
  Dropdown
} from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import Moment from 'react-moment';
import 'moment-timezone';


export default class Home extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      show: false,
      showDelete:false,
      post:[],
      key:'info'
    }
  }


  componentWillMount()
  {
    console.log("PINGA");
    AppUtil.getAPI('fairs', sessionStorage.getItem('token')).then(responseFair => {
      console.log(responseFair);
      this.setState({post: responseFair.data});

    });
  }

  setKey = (key) => this.setState({key});

  toggleDelete = () => this.setState({showDelete: !this.state.showDelete});


render() {
  let {show, showDelete, post, key} = this.state;
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="6" sm="12">
            <h1>Feria de negocios</h1>
          </Col>

          <Col lg="6" sm="12">
            <Button
              className="btn-fill"
              variant="primary"
              onClick={this.toggleShow}>
                Crear nueva feria
            </Button>
          </Col>
        </Row>

        <Row>
        {
          post.map((item, i)=>(
            <Col lg="3" sm="6" key={i}>
              <Card className="card-stats">
              <Dropdown className="position-absolute right m-1"  >
                <Dropdown.Toggle className="btn-fill  btn-rounded" variant="light">
                  <i className="nc-icon nc-settings-gear-64"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href={`#/${item.id}`}><i className="fas fa-edit"></i>Editar</Dropdown.Item>
                  <Dropdown.Item href="#/action-2"><i className="fas fa-copy"></i>Duplicar</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={this.toggleDelete} className="text-danger"><i className="fas fa-trash"></i>Eliminar</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
                <a className="text-decoration-none" href={`/home/fairdetail/${item.id}`}>

                  <Card.Body>
                    <Row>
                      <Col xs="12">
                        <div>
                          <Card.Title as="h4">{item.name}</Card.Title>
                            <p className="card-category">{item.description}</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                      Fecha de inicio: <Moment fromNow>{item.star_date}</Moment>
                      <br />
                      Fecha de finalización: <Moment toNow>{item.end_date}</Moment>

                    </div>
                  </Card.Footer>
                  </a>
              </Card>
            </Col>
          ))
        }
        </Row>
        <Modal
          show={show}
          onHide={this.toggleShow}
          backdrop="static"
          keyboard={false}
          size="lg"

          >
          <Modal.Header closeButton>
            <Modal.Title><h2 className="text-align-center">Nueva Feria de Negocios</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => this.setKey(k)}
            className="mb-3"
            defaultActiveKey="info"
            >
           <Tab eventKey="info" title="Información General">
            <Row>
              <Col sm="12" xl="6">
                <label>Nombre de la feria de negocios</label>
               <Form.Group>
                 <Form.Control
                    placeholder="Nombre de la feria de negocios"
                    type="text">
                   </Form.Control>
               </Form.Group>
               </Col>
               <Col sm="12" xl="6">
                 <label>Creador de la feria</label>
                  <Form.Group>
                    <Form.Control
                      placeholder="Creador de la feria"
                      type="text">
                    </Form.Control>
                  </Form.Group>
                </Col>
             </Row>

             <Row>
               <Col sm="12" xl="6">
                 <label>Categoría</label>
                <Form.Group>
                  <Form.Control
                     placeholder="Categoría"
                     type="text">
                    </Form.Control>
                </Form.Group>
                </Col>
                <Col sm="12" xl="6">
                  <label>Fecha de inicio</label>
                   <Form.Group>
                     <Form.Control
                       placeholder="Fecha de inicio"
                       type="text">
                     </Form.Control>
                   </Form.Group>
                 </Col>
              </Row>
              <Row>
                <Col sm="12" xl="6">
                  <label>Fecha de fin</label>
                 <Form.Group>
                   <Form.Control
                      placeholder="Fecha de fin"
                      type="text">
                     </Form.Control>
                 </Form.Group>
                 </Col>
                 <Col sm="12" xl="6">
                   <label>Archivo</label>
                    <Form.Group>
                      <Form.Control
                        placeholder="Archivo"
                        type="text">
                      </Form.Control>
                    </Form.Group>
                  </Col>
               </Row>

               <Row>
                 <Col sm="12" xl="12">
                   <label>Descripción de la feria</label>
                  <Form.Group>
                    <Form.Control
                       placeholder="Descripción de la feria"
                       type="text">
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

               <Row>
                 <Col sm="12" xl="12">
                  <Form.Group>
                    <Form.Check
                      type="switch"
                      id="foro"
                      label="Foro"
                    />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12" xl="12">
                   <Form.Group>
                     <Form.Check
                       type="switch"
                       id="ideas-negocio"
                       label="Ideas de negocios"
                     />
                     </Form.Group>
                   </Col>
                 </Row>
                 <Row>
                   <Col sm="12" xl="12">
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        id="evaluacion"
                        label="Evaluación"
                      />
                      </Form.Group>
                    </Col>
                  </Row>

           </Tab>
         </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={this.toggleShow}>
              Cerrar
            </Button>
            <Button variant="success" className="btn-fill">Guardar</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDelete} onHide={this.toggleDelete}>
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue">Eliminar</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-align-center">¿Desea eliminar esta feria de negocios?</Modal.Body>
            <Modal.Footer>
              <button variant="none" size="lg" onClick={this.toggleDelete} className="bg-darkblue btn-lg btn-rounded txt-white-btn">
                Cancelar
              </button>
              <button size="lg" onClick={this.toggleDelete} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Eliminar
              </button>
            </Modal.Footer>
          </Modal>


      </Container>
    </>
  );
  }
}
