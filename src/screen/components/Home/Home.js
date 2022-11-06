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

import moment from "moment";
import 'moment/locale/es';

import { url, fairDescription } from "../services/api";

 class Home extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      show: false,
      showDelete:false,
      post:[],
      key:'info',
      form:{
        name:"",
        description:"",
        category:"",
        start_date:"",
        end_date:"",
        options_comments:false
      }
    }
  }

  getInputData = async (e) => {
    console.log(e);
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };


  componentWillMount()
  {


    AppUtil.getAPI(`${url}fairs`, sessionStorage.getItem('token')).then(responseFair => {

      let post = responseFair ? responseFair.data : [];
      this.setState({post});
    });
  }

  setKey = (key) => this.setState({key});

  toggleDelete = () => this.setState({showDelete: !this.state.showDelete});
  toggleShow = () => this.setState({show: !this.state.show})


  submitFair = () =>{
    let {form} = this.state;
    let validate = /^(?!\s*$)[a-zA-Z.+\s'-]+$/
  /*  name:"",
    description:"",
    category:"",
    start_date:"",
    end_date:"",
    options_comments:false*/

    console.log('name', validate.test(form.name));
        console.log('desc', validate.test(form.description));
        console.log('category',validate.test(form.category));
        console.log('start_date',validate.test(form.start_date));
        console.log('end_date',validate.test(form.end_date));
    if (validate.test(form.name) && validate.test(form.description) && validate.test(form.category))
    {
        AppUtil.postAPI(`${url}${fairDescription}`, form).then(response => {
          console.log(response);

        })
        return ;
    }

    console.log("llene los campos no sea estupido");

  }

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
                <a className="text-decoration-none" href={`/home/fairdetail/${item.id}?id=${item.id}`}>

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
                      Fecha de inicio: {moment(item.star_date).fromNow()}
                      <br />
                      Fecha de finalización: {moment(item.end_date).toNow()}

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
                    type="text"
                    onChange={this.getInputData}
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
                     onChange={this.getInputData}
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
                    name="options_comments"
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
                     name="forum_dates"
                   />
                   </Form.Group>
                 </Col>
               </Row>
           </Tab>
         </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" className="btn-rounded" onClick={this.toggleShow}>
              Cerrar
            </Button>
            <Button variant="primary" className="btn-fill btn-rounded" onClick={this.submitFair}>Guardar</Button>
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
