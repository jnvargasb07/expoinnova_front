import React, {Component} from "react";

// react-bootstrap components
import {

  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Tabs,
  Tab,
  Nav,
  Dropdown
} from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import Moment from 'react-moment';
import 'moment-timezone';
import { url } from "../services/api";

 class Home extends Component {
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

      let url_api = url + "fairs";
    AppUtil.getAPI(url_api, sessionStorage.getItem('token')).then(responseFair => {

      let post = responseFair ? responseFair.data : [];
      this.setState({post});
    });
  }

  setKey = (key) => this.setState({key});

  toggleDelete = () => this.setState({showDelete: !this.state.showDelete});
  toggleShow = () => this.setState({show: !this.state.show})

render() {
  let {show, showDelete, post, key} = this.state;
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="9" sm="12" md="12">
            <h3 className="tituloFerias">Feria de negocios</h3>
          </Col>

          <Col lg="3" sm="12" md="12">
            <Button
              className="btn-fill btn-rounded bg-blue"
              onClick={this.toggleShow}>
                Crear nueva feria
            </Button>
          </Col>
        </Row>

        <Row>
        {
          post?.map((item, i)=>(
            <Col lg="3" sm="6" key={i}>
              <Card className="card-stats" className="folder">
              <Dropdown className="position-absolute right m-1" as={Nav.Item} >
                <Dropdown.Toggle  as={Nav.Link}   variant="default" >
                  <i className="fas fa-ellipsis-v"></i>
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
                          <Card.Title as="h4" className="cardTitle">{item.name}</Card.Title>
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
            <h3 className=" tituloFerias">Nueva Feria de Negocios</h3>
          </Modal.Header>
          <Modal.Body>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => this.setKey(k)}
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
                    type="text">
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
                     type="text">
                    </Form.Control>
                </Form.Group>
                </Col>
                <Col sm="12" xl="6">
                  <label className="txt-darkblue">Fecha de inicio</label>
                   <Form.Group>
                     <Form.Control
                       placeholder="Fecha de inicio"
                       type="date">
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
                      type="date">
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


export default Home;
