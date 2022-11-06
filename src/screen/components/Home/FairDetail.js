import React, {useState} from "react";

// react-bootstrap components
import {

  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  Tabs,
  Tab
} from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';


const ideas =[
  {
    nombre: "Ejemplo idea negocio uno",
    creador: "Nombre a1 a2"
  },
  {
    nombre: "Ejemplo idea negocio dos",
    creador: "Nombre a1 a2"
  },
  {
    nombre: "Ejemplo idea negocio tres",
    creador: "Nombre a1 a2"
  }

]

function FairDetail() {
    const [key, setKey] = useState('reports');
    const navigate = useNavigate();
    const {id} = useParams();

    console.log(id);
    /*  const { id } = props.match.params;
      console.log( id)*/
  return (
    <>
    <Container fluid>
      <Button variant="warning" className="btn-fill btn-rounded" onClick={() => navigate('/home')}>
        <i className="nc-icon nc-stre-left"></i>
          Volver
        </Button>
      <h1><i className="nc-icon nc-grid-45"></i>Feria #</h1>

      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        defaultActiveKey="info"
        >

        <Tab eventKey="fairInfo" title={<span><i className="fas fa-folder"></i> Información de Feria</span>}>
          <div className="jumbotron">

          <Row>
          <Col xl="4" sm="12" md='12'>
            <Card className="card-stats bg-gray">
              <Card.Header className="bg-gray">
                <div className="text-align-center">
                  <div className="roundIcon" >
                    <i className="fas fa-briefcase txt-white"></i>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs="12">
                    <div>
                      <Card.Title as="h2">Nombre de la feria de negocio</Card.Title>
                        <h3 >Descripcion corta...</h3>
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
                  <div className="txt-blue m-2">
                    Creador de la feria
                  </div>
                </Col>
                <Col>
                  <div className="txt-blue m-2" id="NombreCreadorFeria">
                    Douglas Glez
                  </div>
                </Col>
              </Row>

              <Row className="bg-gray btn-rounded p-2 m-2">
                <Col>
                  <div className="txt-blue m-2">
                    Fecha de Inicio
                  </div>
                </Col>
                <Col>
                  <div className="txt-blue m-2" id="FechaInicioFeria">
                    Miercoles 12 Octubre, 2022
                  </div>
                </Col>
              </Row>

              <Row className="bg-gray btn-rounded p-2 m-2">
                <Col>
                  <div className="txt-blue m-2">
                    Fecha de Finalización
                  </div>
                </Col>
                <Col>
                  <div className="txt-blue m-2" id="FechaFinalFeria">
                    Lunes 20 Diciembre, 2022
                  </div>
                </Col>
              </Row>
              <Row className="bg-gray btn-rounded p-2 m-2">
                <Col>
                  <div className="txt-blue m-2">
                    Categoría
                  </div>
                </Col>
                <Col>
                  <div className="txt-blue m-2" id="FechaFinalFeria">
                    Cat01
                  </div>
                </Col>
              </Row>

            </Row>
          </Col>
          </Row>

          <Row>
            <Col xl="8" sm="12" md="12" className="bg-gray btn-rounded p-2 m-2 txt-blue">
              Descripción<br/>
              Lorem Ipsum....
            </Col>
            <Col xl="3" sm="12" md="12" className="bg-gray btn-rounded p-2 m-2 txt-blue">
              Documentos<br/>
              Descargar
            </Col>

          </Row>

          <Button className="btn-rounded dark-blue-bg">
            <i className="fas fa-edit"></i>Editar Información
          </Button>

          </div>


        </Tab>
        <Tab eventKey="businessIdeas" title={<span><i className="fas fa-lightbulb"></i> Ideas de negocios</span>}>
          <Row>
            {
              ideas.map((item,index) =>(
                <Col xl="5" sm="12" md="12" className="bg-gray p-2 m-1 txt-blue" key={index}>
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
                </Col>


              ))
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

                />
                </Form.Group>
              </Col>
            </Row>

            <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
              <Col sm="12" xl="12">
               <Form.Group>
                 <Form.Check
                    reverse
                   type="switch"
                   id="foro"
                   label="Foro"
                   className="txt-blue"

                 />
                 </Form.Group>
               </Col>
             </Row>

             <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
               <Col sm="12" xl="12">
                <Form.Group>
                  <Form.Check
                    reverse
                    type="switch"
                    id="ideas-negocio"
                    label="Ideas de negocios"
                    className="txt-blue"

                  />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="bg-gray btn-rounded p-2 m-1 text-align-center">
                <Col sm="12" xl="12">
                 <Form.Group>
                   <Form.Check
                    reverse
                     type="switch"
                     id="reverse-evaluacion"
                     label="Evaluación"
                     className="txt-blue"
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

    </Container>
    </>

  );

}

export default FairDetail;
