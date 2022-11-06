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
  Dropdown,
  Spinner
} from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import Toast from '../common/Toast.js';

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
      post:false,
      key:'info',
      categories:[],
      processing:false,
      form:{
        name:"",
        description:"",
        category:"",
        start_date:"",
        end_date:"",
        options_comments:false
      },
      alert:{
        show:false,
        variant:'success',
        title:"",
        body:""
      },
      id:0
    }
  }

  getInputData = async (e) => {

    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };


  _loadFairs = () =>
  {
    AppUtil.getAPI(`${url}fairs`, sessionStorage.getItem('token')).then(responseFair => {

      let post = responseFair ? responseFair.data : [];
      this.setState({post});
    });
    //categories

    AppUtil.getAPI(`${url}categories`, sessionStorage.getItem('token')).then(responseFair => {

      let categories = responseFair ? responseFair.data : [];
      this.setState({categories});
    });


  }

  componentWillMount() { this._loadFairs(); }

  setKey = (key) => this.setState({key});

  toggleDelete = (id = 0) => this.setState({showDelete: !this.state.showDelete, id});
  toggleShow = () => this.setState({show: !this.state.show})

  deleteFair = () =>{
    let {id} = this.state;

    if (id > 0)
    {
      this.setState({processing: true})
      AppUtil.deleteAPI(`${url}fairs/${id}`).then(response => {

        if (response.success)
        {
            let alert = {
              show:true,
              variant:'success',
              title:"Feria eliminada",
              body:"Feria de negocio eliminada satisfactoriamente"
            }
            this.setState({alert, processing: false}, () => {
              this.toggleDelete(0);
              this._loadFairs();
            });
            return ;
        }

        let alert = {
          show:true,
          variant:'warning',
          title:"Feria no eliminada",
          body:"La feria no se pudo eliminar, por favor intente más tarde"
        }
        this.setState({alert, processing: false});

      })
    }

  }
  submitFair = () =>{
    this.setState({processing: true});
    let {form} = this.state;

    if (form.name.trim() !== "" && form.description.trim() !== "" && form.category.trim() !== "")
    {
        AppUtil.postAPI(`${url}fairs`, form).then(response => {
          if (response.success)
          {

            AppUtil.postAPI(`${url}categorie_fair`, {fairs_id: response.data.id, categories_id:form.category }).then(responseCatFair => {

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
                  this._loadFairs();
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
                    this._loadFairs();
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

render() {
  let {show, showDelete, post, key, alert, categories, processing} = this.state;
  return (
    <>
    <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body}  />

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
          post ?
          (post?.map((item, i)=>(
            <Col lg="3" sm="6" key={i}>
              <Card className="card-stats" className="folder">
              <Dropdown className="position-absolute right m-1" as={Nav.Item} >
                <Dropdown.Toggle  as={Nav.Link}   variant="default" >
                  <i className="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href={`/home/fairdetail/${item.id}?id=${item.id}`}><i className="fas fa-edit"></i>Editar</Dropdown.Item>
                  <Dropdown.Item href="#"><i className="fas fa-copy"></i>Duplicar</Dropdown.Item>
                  <Dropdown.Item onClick={()=>this.toggleDelete(item.id)} className="text-danger"><i className="fas fa-trash"></i>Eliminar</Dropdown.Item>
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
          ))) : (<div className="text-align-center"><Spinner animation="grow" variant="primary"  /></div>)
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
                  <Form.Select aria-label="Categoría" name="category" onChange={this.getInputData}>
                    <option value="">-- Seleccione una opción --</option>
                   {categories?.map((item) =>(
                     <option value={item.id}>{item.name}</option>
                   ))}
                    </Form.Select>
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
            {processing ? <Spinner animation="grow" variant="primary"  /> : <Button variant="primary" className="btn-fill btn-rounded" onClick={this.submitFair}>Guardar</Button>}
          </Modal.Footer>
        </Modal>

        <Modal show={showDelete} onHide={()=> this.toggleDelete(0)}>
            <Modal.Header closeButton>
              <Modal.Title className="txt-blue">Eliminar</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-align-center">¿Desea eliminar esta feria de negocios?</Modal.Body>
            <Modal.Footer>
              <button variant="none" size="lg" onClick={()=> this.toggleDelete(0)} className="bg-darkblue btn-lg btn-rounded txt-white-btn">
                Cancelar
              </button>
              {processing ? <Spinner animation="grow" variant="primary"  />: (<button size="lg" onClick={this.deleteFair} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Eliminar
              </button>)}
            </Modal.Footer>
          </Modal>


      </Container>
    </>
  );
  }
}


export default Home;
