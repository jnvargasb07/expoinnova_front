import React from "react";
import { Button, Card, Table, Container, Row, Col, Form, Tabs, Tab, Spinner, Modal } from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription, businessIdeas } from "../services/api";
import moment from "moment";
import 'moment/locale/es';



export default class IdeaDetail extends React.Component {

    constructor(props){
      super(props);
      this.state = {

      }
    }


    render() {
      return (
        <>
        <Container fluid>

          <h3 className="txt-blue"><i className="nc-icon nc-grid-45"></i><span className="p-1">Nombre Feria</span></h3>
          <Button variant="warning" className="btn-fill btn-rounded" onClick={() => this.props.navigate('/home/fairdetail')}>
            <i className="nc-icon nc-stre-left"></i>
              Volver
            </Button>
            <Row>
            <h4>
              <div className="text-align-center">
                <div className="roundIconIntern" >
                  <i style={{'margin-top': '11%'}} className="fas fa-briefcase txt-white-btn"></i>
                </div>
              </div>
              <span className="p-1">Idea 1</span>
            </h4>
            </Row>



        </Container>




        </>
      );
    }



}
