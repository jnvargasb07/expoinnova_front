import React, {Component, Fragment} from "react";
// react-bootstrap components
import { Button,  Card, Container,  Row, Col,  Form,  Modal,  Tabs,  Tab,  Nav,  Dropdown} from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import Toast from '../common/Toast.js';
import {ReactComponent as Path} from '../../../assets/SVG/INFORMACION DE FERIA.svg';
import moment from "moment";
import 'moment/locale/es';
import crypto from "crypto-js";
import { renderToStaticMarkup } from 'react-dom/server';

import { url, fairDescription } from "../services/api";
const svgString = encodeURIComponent(renderToStaticMarkup(<Path />));
// pantalla de inicio HOME cuando se inicia sesion
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
      role:"",
      form:{
        name:"",
        description:"",
        category:"1",
        start_date:moment().format('YYYY-MM-DD'),
        end_date:"",
        options_comments:false
      },
      alert:{
        show:false,
        variant:'success',
        title:"",
        body:""
      },
      id:0,
      showRequirements:false,
      validatedFair:false
    }
  }

  getInputData = async (e) => {


      if(e.target.name === "options_comments"){
        console.log( e.target.checked);
        await this.setState({
          form: {
            ...this.state.form,
            [e.target.name]: e.target.checked,
          },
        });
      }else{
        await this.setState({
          form: {
            ...this.state.form,
            [e.target.name]: e.target.value,
          },
        });
      }
  };

      //se obtiene el usuario
      getUserData = async () => {
        let bytes = crypto.AES.decrypt(
          sessionStorage.getItem("user"),
          "@virtual_cr"
        );
        this.user = JSON.parse(bytes.toString(crypto.enc.Utf8));

        this.setState({
          role: this.user.roles[0].name,
        });
      };

      //obtiene las ferias
  _loadFairs = () =>
  {
    AppUtil.getAPI(`${url}fairbyuser`, sessionStorage.getItem('token')).then(responseFair => {

      let post = responseFair ? responseFair.data : [];

      this.setState({post});
    });

  }

  componentDidMount() {
    this._loadFairs();
    this.getUserData();
  }

  setKey = (key) => this.setState({key});
  //muestra/oculta el modal de eliminar y crear ferias
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
  submitFair = (e) => {

    const formulario = e.currentTarget;
    if (formulario.checkValidity() === false)
    {
      e.preventDefault();
      e.stopPropagation();
      return ;
    }

    e.preventDefault();
    e.stopPropagation();
      let {form, post} = this.state;
    for (var i = 0; i < post.length; i++)
    {
      if (post[i].name != null)
      {
        if (form.name === post[i].name)
        {

          let alert = {
            show:true,
            variant:'warning',
            title:"No se puede crear la feria",
            body:"No se puede crear una feria que ya existe"
          };
          this.setState({alert});

          return ;
          break;
        }
      }
    }

    this.setState({processing: true});




    if (moment(form.star_date).isAfter(form.end_date))
    {
      let alert = {
        show:true,
        variant:'warning',
        title:"Fechas incorrectas",
        body:"La fecha de inicio no puede ser después que la fecha de fin"
      }
      this.setState({alert, processing:false});
        return ;
    }



    if (form.name.trim() !== "" && form.description.trim() !== "" && form.category.trim() !== "")
    {
      console.log(form);
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
                    variant:'success',
                    title:"Feria creada",
                    body:"Feria de negocio y categoría creada satisfactoriamente"
                  }
                  //la alerta es igual, porque la feria no importa si tiene una categoria, pq tiene una por defecto
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
              this.setState({processing: false, alert});
        })
    }
  }


toggleRequirements = () => this.setState({showRequirements: !this.state.showRequirements});

render() {

  let {show, showDelete, post, key, alert, processing, showRequirements, validatedFair} = this.state;
  return (
    <>
    <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body}  />

      <Container fluid>
      <hr className="hr-home"></hr>
        <Row>
          <Col lg="9" sm="12" md="12">
            <h3 className="tituloFerias">Ferias ideas de negocios</h3>
          </Col>

          <Col lg="3" sm="12" md="12" className="text-center d-flex justify-content-center align-items-baseline">
          {(this.state.role === "SuperAdmin" || this.state.role === "Admin") && (
            <Fragment>

            <Button
              className="btn-fill btn-rounded bg-blue"
              onClick={this.toggleShow}>
                Crear nueva feria
            </Button>
            </Fragment>
            )}
          </Col>
        </Row>

        <Row>
        {
          post ?
          (post?.map((item, i)=>(
            <Col lg="3" sm="6" key={i}>


              <Card className="folder" style={{ backgroundImage: `url("data:image/svg+xml,${svgString}")`, backgroundRepeat:'no-repeat', backgroundColor:'transparent'}}>
                {(this.state.role === "SuperAdmin" || this.state.role === "Admin") && (
              <Dropdown className="position-absolute right m-1 bottom60" as={Nav.Item} >
                <Dropdown.Toggle  as={Nav.Link}   variant="default" >

                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item className="txt-blue" href={`/home/fairdetail/?id=${item.id}`}><i className="fas fa-eye r-10"></i>Ver Feria</Dropdown.Item>

                  {/*this.state.role === "SuperAdmin" || this.state.role === "Admin" && (
                    <Dropdown.Item onClick={()=>this.toggleDelete(item.id)} className="text-danger"><i className="fas fa-trash r-10"></i>Eliminar</Dropdown.Item>
                  )*/}
                </Dropdown.Menu>
              </Dropdown>
              )}

                <a className="text-decoration-none AnchorPath" href={`/home/fairdetail?id=${item.id}`}>

                  <Card.Body>
                    <Row>
                      <Col xs="12">
                        <div>
                          <Card.Title as="h4" className="cardTitle" >{item.name}</Card.Title>
                            <p className="card-category cardDescription">{item.description}</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>

                    <hr></hr>
                    <div className="stats">
                      Fecha de inicio: {moment(item.star_date).format('DD/MM/YYYY')}
                      <br />
                      Fecha de finalización: {moment(item.end_date).format('DD/MM/YYYY')}

                    </div>

                  </a>
                  </Card>

            </Col>
          ))) : (<div className=" text-align-center"><div className="lds-dual-ring-2"></div></div>)
        }
        </Row>
        <Modal
          show={show}
          onHide={this.toggleShow}
          backdrop="static"
          keyboard={false}
          size="lg"
          className="max-z-index"
          >
          <Form validated={validatedFair} onSubmit={this.submitFair}>

          <Modal.Header closeButton>
            <h3 className=" tituloFerias">Nueva Feria de Ideas de Negocios</h3>
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
                        required
                        maxLength={200}
                        >
                       </Form.Control>
                   </Form.Group>
                   </Col>

                 </Row>

                 <Row className="m-2">

                    <Col sm="12" xl="6">
                      <label className="txt-darkblue">Fecha de inicio</label>
                       <Form.Group>
                         <Form.Control
                           placeholder="Fecha de inicio"
                           readOnly
                           type="date"
                           name="start_date"
                           onChange={this.getInputData}
                           defaultValue={moment().format('YYYY-MM-DD')}
                           required
                           >
                         </Form.Control>
                       </Form.Group>
                     </Col>

                    <Col sm="12" xl="6">
                      <label className="txt-darkblue">Fecha de fin</label>
                     <Form.Group>
                       <Form.Control
                          placeholder="Fecha de fin"
                          type="date"
                          name="end_date"
                          onChange={this.getInputData}
                          required
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
                           required
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
                        id="options_comments"
                        label="Foro de preguntas y respuestas de los diferentes usuarios"
                        name="options_comments"
                        onChange={this.getInputData}


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
            {processing ? <div className="lds-dual-ring-2"></div> : <Button variant="primary" className="btn-fill btn-rounded" type="submit">Guardar</Button>}
          </Modal.Footer>
          </Form>
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
              {processing ? <div className="lds-dual-ring-2"></div>: (<button size="lg" onClick={this.deleteFair} className="bg-blue btn-lg btn-rounded txt-white-btn">
                Eliminar
              </button>)}
            </Modal.Footer>
          </Modal>


      </Container>


      <Modal show={showRequirements} onHide={()=> this.toggleRequirements}>
                <Modal.Header closeButton>
                  <Modal.Title className="txt-blue">Requerimientos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-left">Sint quis ad veniam consequat minim culpa commodo ipsum non anim Lorem est id occaecat. Elit tempor cupidatat ullamco ullamco laborum deserunt anim tempor qui eu adipisicing voluptate. Irure culpa minim elit officia sint culpa minim do aute exercitation.</Modal.Body>
                <Modal.Footer className="justify-content-center">
                  <button variant="none" size="lg" onClick={()=> this.toggleRequirements} className="bg-darkblue btn-lg btn-rounded txt-white-btn">
                    Cerrar
                  </button>
                </Modal.Footer>
              </Modal>
    </>
  );
  }
}


export default Home;
