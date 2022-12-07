import React, { Fragment } from "react";
import Select from 'react-select'
import { Button, Card, Table, Container, Row, Col, Form, Tabs, Tab, Spinner, Modal, ListGroup } from "react-bootstrap";
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription, businessIdeas } from "../services/api";
import moment from "moment";
import 'moment/locale/es';
import Toast from '../common/Toast.js';
import crypto from "crypto-js";
import {ReactComponent as Proyecto} from '../../../assets/SVG/PROYECTO.svg';


//CLASE PARA LOS DETALLES DE LA IDEA
export default class IdeaDetail extends React.Component {

    constructor(props){
      super(props);
      const { location } = this.props;
      const query = new URLSearchParams(location.search);

      this.state = {
        fairId: query.get('fair'),
        processing: true,
        key:'general',
        ideaInfo: false,
        ideaInfoEdit:false,
        ideaId:query.get('id'),
        idUser:0,
        idComment:0,
        editingComment:false,
        validatedQuestionForum:false,
        validateEvaluation:false,
        categories:[],
        students:[],
        judges_has_ideas:[],
        judges:[],
        ideaModal: false,
        validatedIdea:false,
        show:false,
        keyideas:'general',
        showComments:false,
        evaluations:[],
        comments:"",
        role:"",
        alert:{
          show:false,
          variant:'success',
          title:"",
          body:"",
          position:"top-end"
        },
        validatedQuestion:false,
        question:{
          description:"",
          calification_scale:1,
          description_edit:""
        },
        validatedEvaluations:false,
        evaluationsReq:{
          tittle:"",
          categories_id:0
        },
        evaluationsQuestion:[],
        evaluation_judge_questionArray:[],

        auxJudgesIds:[],
        currentJudgesIds:[],//ids de los jueces que estan actualmente
        deletedJudgesIds:[], //id de los jueces que se hayan borrado
        newJudgesIds:[], //ids de los nuevos jueces agregados
        alreadyEvaluated:false,
        idJudge:0,
        evaluationsUpdate:[],
        checked:true,
        loadedQuestion: false
      }

    }
    //funcion para iniciar/parar la ayuda grafica del spinner
    _setProcessing = async (processing) => await this.setState({processing});
    //obtiene datos de la idea
    getIdeaById = () => {
      AppUtil.getAPI(`${url}ideas/${this.state.ideaId}`, sessionStorage.getItem('token')).then(response => {

        if (response)
        {
          let ideaInfo = response.data;

          if (ideaInfo.students == null || ideaInfo.professor_users == null || ideaInfo.campuses == null)
          {
            let alert = {
              show:true,
              variant:'warning',
              title:"Idea incompleta",
              body:"Hay información relacionada a esta idea que fue eliminada o modificada, por favor editar la idea"
            };
            this.setState({alert});
          }



          let ideaInfoEdit = {
            name: ideaInfo.name,
            description: ideaInfo.description,
            url_video: ideaInfo.url_video,
            pdf_resume: ideaInfo.pdf_resume,
            professor_users_id: ideaInfo.professor_users == null ? 0 : ideaInfo.professor_users.id,
            categories_id: ideaInfo.categories.id,
            campus_id: ideaInfo.campuses == null ? 0 : ideaInfo.campuses.campus_id,
            students_id: ideaInfo.students == null ? 0 : ideaInfo.students.id,
            fairs_id: ideaInfo.fairs.id,
            evaluations_id: ideaInfo.evaluations === null ? null : ideaInfo.evaluations.id,
            professor_name:ideaInfo.professor_users == null ? '' : ideaInfo.professor_users.name,
            campus_name: ideaInfo.campuses == null ? '' : ideaInfo.campuses.name,
            fairs_name:ideaInfo.fairs.name,
            ideas_to_course:"",
            judge_id:0
          };

          this.setState({ideaInfo, ideaInfoEdit, comments: response.data.comments, showComments:ideaInfo.fairs.options_comments});
        }
      });
    }

    //obtiene las categorias de la feria de esta idea para edicion
    _fetchCategories = () => {
      AppUtil.getAPI(`${url}categorie_by_fair_id/${this.state.fairId}`, sessionStorage.getItem('token')).then(response => {

        let categories = response ? response.data : [], filtered_cat = [];

        for (var i = 0; i < categories.length; i++)
        {
          if (categories[i].categories !== null)
          {
            filtered_cat.push(categories[i])
          }
        }
        this.setState({categories: filtered_cat});
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
      AppUtil.getAPI(`${url}judges_has_ideas_by_fair_id/${this.state.ideaId}`, sessionStorage.getItem('token')).then(response => {
        //estos son los jurados asignados a esta idea
        if (response)
        {

          let judges = response.data, newJudgesHasIdeas = [], currentJudgesIds =[];

          for (var i = 0; i < judges.length; i++)
          {
            currentJudgesIds.push(judges[i].id);
            newJudgesHasIdeas[i] = {value: judges[i].judges_id, label: judges[i].judges == null ? '' : `${judges[i].judges.users.name}`, idTable: judges[i].id  }
          }

          this.setState({judges_has_ideas:newJudgesHasIdeas, currentJudgesIds});
        }
      });

      AppUtil.getAPI(`${url}judges`, sessionStorage.getItem('token')).then(response => {

        if (response)
        {
          let judges = response.data, newJudges = [];
          for (var i = 0; i < judges.length; i++)
          {

            newJudges[i] = {value: judges[i].id, label: `${judges[i].users.name}` }
          }
          this.setState({judges:newJudges});
        }
      });
    }
    _fetchEvaluations = () => {
      AppUtil.getAPI(`${url}evaluations`, sessionStorage.getItem('token')).then(response => {
        if (response)
        {
          this.setState({evaluations:response.data});
        }
      });
    }

    getUser = () => {
      let bytes = crypto.AES.decrypt(
        sessionStorage.getItem("user"),
        "@virtual_cr"
      );
      let data = JSON.parse(bytes.toString(crypto.enc.Utf8));

      this.setState({idUser: data.id, role:data.roles[0].name, idJudge: data.roles[0].id });

    }


    setCommentData = (data) => {
      this.setState({editingComment: true, idComment:data.id, show:!this.state.show});
      this.setState({
        question: {
          description_edit: data.comment
        },
      });
    }

    toggleComment = () => {
      this.setState({
        show:false
      });
    };

    saveEditComment = () => {

      if(this.state.question.description_edit === undefined){
        return;
      }

      let comment = {
        "message":this.state.question.description_edit
      }

      AppUtil.putAPI(`${url}comments/${this.state.idComment}`, comment).then(response => {
        if (response.success)
        {
          this.state.question.description_edit = "";
          this.setState({show:false});
          let alert = {
            show:true,
            variant:'success',
            title:"Comentario editado",
            body:"El comentario fue editado correctamente"
          };
          this.setState({alert});
          AppUtil.reloadPage();
          return ;
        }
        let alert = {
          show:true,
          variant:'danger',
          title:"Error al editar el comentario",
          body:"No se pudo editar el comentario, por favor intente más tarde"
        }
        this.setState({alert})
      });

    }

    SubmitIdeaSteps = (e) =>
    {

        const form = e.currentTarget;

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
              this._setProcessing(true);

              AppUtil.putAPI(`${url}ideas/${ideaInfo.id}`, ideaInfoEdit).then(response => {

                if (response)
                {
                  this.toggleIdea();
                  let alert = {
                    show:true,
                    variant:'success',
                    title:"Idea editada",
                    body:"La idea fue editada correctamente"
                  };

                  this.setState({alert, keyideas:'general'})
                  AppUtil.reloadPage();
                  return ;
                }
                let alert = {
                  show:true,
                  variant:'danger',
                  title:"Error al editar la idea",
                  body:"No se pudo editar la idea, por favor intente más tarde"
                }
                this.setState({alert, keyideas:'general', processing:false})
              });
              //this._setProcessing(false);
              break;
        }
    }

    toggleIdea = () => this.setState({ideaModal: !this.state.ideaModal});
    componentDidMount() {

      this._fetchCategories();
      this._fetchCoordinators();
      this.getIdeaById();
      this._fetchJudges();

      this._fetchEvaluations();



      this._setProcessing(false);
      this.getUser();
    }

    onChangeJudges = (value, action) =>{



      const {ideaId} = this.state;
      let auxJudgesIds = [];
      switch (action.action)
      {
        case 'remove-value':
          let {currentJudgesIds} = this.state; //obtener los que estan ahorita son los ids en la tabla
          if (currentJudgesIds.indexOf(action.removedValue.idTable) >= 0)
          {
            AppUtil.deleteAPI(`${url}judges_has_ideas/${action.removedValue.idTable}`).then(response => { });
          }

        break;

        case 'select-option':
          for (var i = 0; i < value.length; i++) {
            auxJudgesIds.push(value[i].value);
          }

          let send = {
            "judges_id": auxJudgesIds.toString(),
            "ideas_id": ideaId,
            "evaluation": 0
          }
          AppUtil.postAPI(`${url}judges_has_ideas`, send).then(response => { });
        break;
      }
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
    getInputQuestion = async (e) => {

        await this.setState({
          question: {
            ...this.state.question,
            [e.target.name]: e.target.value,
          },
        });
      };
    getInputEvaluation = async (e) => {

          await this.setState({
            evaluationsReq: {
              ...this.state.evaluationsReq,
              [e.target.name]: e.target.value,
            },
          });
        };
    getInputEvaluationQuestion = (e, index ) => { //recibo el event y el indice
      // del 1 al 5 cada uno vale 20 en las opciones
      // ejemlo, escojo 3 = 3*20 = 60 /100 = .6 * por porcentaje que vale la pregunta
      let {evaluation_judge_questionArray} = this.state; // agarro array del state
      /*        evaluations_judge: 0,
              evaluations_percentage: 0*/

      let evaluations_percentage = ((parseInt(e.target.value) * 20) / 100 * evaluation_judge_questionArray[index].porcentaje_total)

      evaluation_judge_questionArray[index].evaluations_judge = parseInt(e.target.value);
      evaluation_judge_questionArray[index].evaluations_percentage = evaluations_percentage;// agregado division entre 5 para calculo del reporte
      this.setState({ evaluation_judge_questionArray });

      };
      //rgba(209, 212, 219, 0.16)
    SubmitQuestion = async () => {

        await this._setProcessing(true);

        if(this.state.question.description == "")
        {
          let alert = {
            show:true,
            variant:'warning',
            title:"El comentario es requerido",
            body:"El comentario es requerido"
          };
          await this._setProcessing(false);
          this.setState({alert})
          return;
        }

          let question = {
            "commentable_type":"App\\Models\\Idea",
            "commentable_id": this.state.ideaId,
            "message":this.state.question.description
          }

          AppUtil.postAPI(`${url}comments`, question).then(response => {

            if (response.success)
            {
              this.state.question.description = "";
              this.getIdeaById();
              let alert = {
                show:true,
                variant:'success',
                title:"Comentario enviado",
                body:"Comentario enviado correctamente"
              };

              this.setState({alert});
              AppUtil.reloadPage();

              return ;
            }
            let alert = {
              show:true,
              variant:'danger',
              title:"Error al enviar el comentario",
              body:"No se pudo enviar el comentario, por favor intente más tarde"
            }
            this.setState({alert})
          });
          //this._setProcessing(false);
      }
    setLetter = (name) => {
        return name.charAt(0).toUpperCase();
      }
    SubmitEvaluations = (e) =>
      {

          const form = e.currentTarget;

          if (form.checkValidity() === false)
          {
            e.preventDefault();
            e.stopPropagation();
            return ;
          }

          e.preventDefault();
          e.stopPropagation();
          let {evaluation_judge_questionArray} =  this.state;
          this._setProcessing(true);
          console.log(evaluation_judge_questionArray)


          for (var i = 0; i < evaluation_judge_questionArray.length; i++)
          {

            AppUtil.postAPI(`${url}evaluation_judge_questions`, evaluation_judge_questionArray[i]).then(response => {

              if (response.success)
              {

                let alert = {
                  show:true,
                  variant:'success',
                  title:"Evaluación agregada",
                  body:"La evaluación fue creada correctamente",
                  position:"bottom-end"
                };

                this.setState({alert, processing: false, alreadyEvaluated: true});
                //AppUtil.reloadPage();
              }
              else
              {
                let alert = {
                  show:true,
                  variant:'danger',
                  title:"Error al crear la evaluación",
                  body:"No se pudo crear la evaluación, por favor intente más tarde",
                  position:"bottom-end"
                }
                  this.setState({alert, processing: false})
              }


            })
          }

        //  this._setProcessing(false);
      }


      changeTab= (key) =>
      {
        switch (key)
        {
          case 'evaluations':
            this._setProcessing(true);
            this.getEvaluationsForIdea();

            this.setState({key});
          break;
          default:
            this.setState({key});
          break;
        }
      }


      getEvaluationsForIdea = () =>{  //obtiene las preguntas de la evaluacion asignada a la idea

        AppUtil.getAPI(`${url}evaluationQuestion_by_evaluation_id/${this.state.ideaInfo.evaluations.id}`, sessionStorage.getItem('token')).then(response => {

          if (response)
          {
            let evaluationsQuestion = response.data, evaluation_judge_questionArray = [];
            let judge_id = sessionStorage.getItem('student_id'), evaluations_id = this.state.ideaInfo.evaluations.id;; // this.state.idUser,
            let evaluationsUpdate = [];
            console.log(evaluationsQuestion);
            for (var i = 0; i < evaluationsQuestion.length; i++)
            {
              evaluation_judge_questionArray[i] = {
                judges_id: judge_id ,
                evaluations_id: evaluations_id,
                questions_id: evaluationsQuestion[i].questions_id ,
                evaluations_judge: 0,
                evaluations_percentage: 0,
                porcentaje_total: evaluationsQuestion[i].question_evaluation,
                ideas_id:parseInt(this.state.ideaId),
              }
              evaluationsUpdate[`${evaluationsQuestion[i].questions_id}`] = 0;
            }


            this.getEvaluationSubmitedByJudge();
            this.setState({evaluationsQuestion, evaluation_judge_questionArray, evaluationsUpdate});
          }
        });


      }


      getEvaluationSubmitedByJudge = () => {

        const idJudge = sessionStorage.getItem('student_id');
          AppUtil.getAPI(`${url}evaluation_judge_by_evaluations_id/${this.state.ideaId}/${idJudge}/${this.state.ideaInfo.evaluations.id}`, sessionStorage.getItem('token')).then(response => {

            if (response.success && response.data.length > 0)
            {
              let data = [], dataResponse  = response.data;
              let { evaluationsUpdate } = this.state;

              for (let i = 0; i < dataResponse.length; i++)
              {
                evaluationsUpdate[`${dataResponse[i].questions_id}`] = dataResponse[i].evaluations_judge;
                //data[i] = dataResponse[i].evaluations_judge;
                //console.log(dataResponse[i], dataResponse[i].evaluations_judge);
                /*evaluation_judge_questionArray.map(item => {
                  if(dataResponse[i].questions_id === item.questions_id)
                  {
                    item.evaluations_judge = dataResponse[i].evaluations_judge
                    item.evaluations_percentage = dataResponse[i].evaluations_percentage
                  }
                  return item;
                } )*/
              }
             // console.log(data);
             // console.log(evaluation_judge_questionArray);

              this.setState({alreadyEvaluated:true, evaluationsUpdate, loadedQuestion: true, processing:false});
              return
            }
              this.setState({alreadyEvaluated:false, loadedQuestion: true, processing:false});

          })

      }

      onUploadFileChange = ({ target }) =>
      {
        if (target.files < 1 || !target.validity.valid)
        {
          return
        }
       AppUtil.fileToBase64(target.files[0], (err, result) => {

           if (result)
           {
            this.setState({
               ideaInfoEdit: {
                 ...this.state.ideaInfoEdit,
                    pdf_resume: result,
               },
             });
           }
       })
   }


    render() {
      let {show, processing, alert, keyideas, ideaInfo, categories, students, ideaModal, validatedIdea, ideaInfoEdit, judges_has_ideas, key, alreadyEvaluated, evaluationsUpdate} = this.state;
      return (
        <>
        <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body} position={alert.position} />

        <Container fluid>

          <Button variant="warning" className="btn-fill btn-rounded" onClick={() => this.props.navigate(-1)}>
            <i className="nc-icon nc-stre-left"></i>
              Volver
          </Button>

            <Row className="p-2">
              <Col xl="8" md="12" sm="12">
                <h4 className="d-flex align-items-baseline">
                  <div className="text-align-center">
                    <Proyecto width="70" height="70" />
                  </div>
                  &nbsp;
                  <span className="p-1">{ideaInfo ? ideaInfo.name :'Cargando...'}</span>
                </h4>
              </Col>
              {ideaInfo && (this.state.role === "SuperAdmin" || this.state.role === "Admin") && (
              <Col className="text-center" xl="4" md="12" sm="12">
                <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleIdea}>
                  <i className="fas fa-edit"></i>Editar Información
                </Button>
              </Col>
              )}

            </Row>
            <hr />
            <Tabs
              activeKey={key}
              onSelect={(key) => this.changeTab(key)}
              className="mb-3"
              defaultActiveKey="info"
              >
              <Tab eventKey="general" title={<span><i className="fas fa-cog"></i> General</span>}>
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
                  {ideaInfo.students !== null && (
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                      {ideaInfo ? ideaInfo.students.users.name : 'Cargando...'}
                    </div>
                    )}
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
                      <ListGroup>
                      {judges_has_ideas.length > 0 ? (  judges_has_ideas.map(item => <ListGroup.Item className="bg-gray">{item.label}</ListGroup.Item>) ) : 'Cargando...'}
                      </ListGroup>
                    </div>
                  </Col>
                </Row>

                <Row>
                <Col xl="12" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Categoría
                    </div>
                  </Col>
                  <Col>
                    <div className="txt-darkblue m-2" id="FechaInicioFeria">
                        {ideaInfo ? (ideaInfo.categories === null ? "" :ideaInfo.categories.name) : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
                </Row>

              </Col>

            </Row>

            <h4  className="txt-blue">Materiales</h4>
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
                    {
                      ideaInfo && ideaInfo.pdf_resume != "" ? <a href={ideaInfo ? ideaInfo.pdf_resume: '#'} download={ideaInfo ? `${ideaInfo.name}.pdf` : 'PDF IDEA.pdf'} className="txt-darkblue">Ver Documento</a> :<span>No disponible</span>
                    }

                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <h4 className="txt-blue">Datos de la idea</h4>

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
                      {ideaInfo ? (ideaInfo.professor_users == null ? 'No disponible':  ideaInfo.professor_users.name) : 'Cargando...'}
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
                      {ideaInfo ? ideaInfo.campuses == null ? 'No disponible' : ideaInfo.campuses.name : 'Cargando...'}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl="6" sm="12" md="12">
                <Row className="bg-gray btn-rounded p-2 m-2">
                  <Col>
                    <div className="txt-darkblue m-2">
                      Nombre de la feria
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
              </Tab>
              <Tab eventKey="question" title={<span><i className="fas fa-question"></i> Comentarios</span>}>
              {this.state.showComments && (
                <div className="well">
              {this.state.comments != "" && (
                <div>
                  <div className="p-2">
                    <p className="text-secondary">{this.state.comments.length} comentario(s)</p>
                  </div>
                    <div className="blue-comment p-3">
                      {this.state.comments.map((item, index) => (
                        <Fragment>
                          <Col xl="12" sm="12" md="12" className="d-flex align-items-baseline p-2">
                            <h4 className="circle text-white">{this.setLetter(item.commenter.name)}</h4>
                            <h5>{item.commenter.name}</h5>
                            <span className="left-pad text-secondary">{moment(item.created_at).format('dddd LT')}</span>
                            {this.state.idUser === item.commenter.id && (
                              <a className="left-pad text-secondary edit" onClick={() => this.setCommentData(item)}><small>editar</small></a>
                            )}
                          </Col>
                          <Col xl="9" sm="9" md="9">
                            <h5 className="align-name-comment">{item.comment}</h5>
                          </Col>
                          {index != this.state.comments.length - 1 && (
                          <hr className="text-secondary"></hr>
                          )}
                        </Fragment>
                      ))}
                    </div>
                </div>
              )}

              {this.state.comments == "" && (
                <div className="text-center">
                  <i className="fa fa-comments h3 txt-blue" aria-hidden="true"></i>
                  <p>Haz el primer comentario</p>
                </div>
              )}

                <Form>
                   <Form.Group>
                     <Form.Label className="txt-darkblue">Escribe tu comentario aquí</Form.Label>
                     <Form.Control
                        placeholder="Escribe un comentario..."
                        as="textarea"
                        style={{ height: '100px' }}
                        name="description"
                        id="description"
                        onChange={this.getInputQuestion}
                        required
                        value={this.state.question.description}
                        >
                       </Form.Control>
                   </Form.Group>
                   <div className="d-flex justify-content-center">
                   <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.SubmitQuestion} disabled={processing}>
                     {processing ? <div className="lds-dual-ring"></div>: 'Publicar comentario'}
                   </Button>
                   </div>
                </Form>

                </div>
                )}
                {!this.state.showComments && (
                <div className="text-center">
                  <i className="fa fa-comments h3 txt-blue" aria-hidden="true"></i>
                  <p>Esta idea no tiene los comentarios activos</p>
              </div>
                )}
              </Tab>


                {(this.state.role === "SuperAdmin" || this.state.role === "Admin" || this.state.role === "Judges") && (
                <Tab eventKey="evaluations" title={<span><i className="fas fa-check"></i> Evaluaciones</span>} disabled={this.state.ideaInfo.evaluations == null ? true : false}>
                <div className="well">
                 <h4 className="txt-blue">Evaluaciones</h4>
                  <Form validated={this.state.validatedEvaluations} onSubmit={this.SubmitEvaluations}>
                  <Row>
                    <Col xl="12" sm="12" md="12">
                    <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th>Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.loadedQuestion ? this.state.evaluationsQuestion.map((item, index)=>{

                        return(


                          <tr>
                            <td>{item.questions ? item.questions.description : ''}</td>
                            <td>
                            <Form.Check
                               inline
                               label="1"
                               name={`evaluations_judge_${item.id}`}
                               type='radio'
                               id={`inline-${item.id}-1`}
                               className="QuestionCalification"
                               onChange={(e)=> this.getInputEvaluationQuestion(e, index)}
                               required
                               value={1}

                               defaultChecked={evaluationsUpdate[`${item.questions_id}`] == 1 ? true : false}
                             />
                             <Form.Check
                                inline
                                label="2"
                                name={`evaluations_judge_${item.id}`}
                                type='radio'
                                id={`inline-${item.id}-2`}
                                className="QuestionCalification"
                                required
                                onChange={(e)=> this.getInputEvaluationQuestion(e, index)}
                                value={2}
                                defaultChecked={evaluationsUpdate[`${item.questions_id}`] == 2 ? true : false}
                              />
                              <Form.Check
                                 inline
                                 required
                                 label="3"
                                 name={`evaluations_judge_${item.id}`}
                                 type='radio'
                                 id={`inline-${item.id}-3`}
                                 className="QuestionCalification"
                                 onChange={(e)=> this.getInputEvaluationQuestion(e, index)}
                                 value={3}
                                 defaultChecked={evaluationsUpdate[`${item.questions_id}`] == 3 ? true : false}
                               />
                               <Form.Check
                                  inline
                                  label="4"
                                  required
                                  name={`evaluations_judge_${item.id}`}
                                  type='radio'
                                  id={`inline-${item.id}-4`}
                                  className="QuestionCalification"
                                  onChange={(e)=> this.getInputEvaluationQuestion(e, index)}
                                  value={4}
                                  defaultChecked={evaluationsUpdate[`${item.questions_id}`] == 4 ? true : false}
                                />
                                <Form.Check
                                   inline
                                   label="5"
                                   required
                                   name={`evaluations_judge_${item.id}`}
                                   type='radio'
                                   id={`inline-${item.id}-5`}
                                   className="QuestionCalification"
                                   onChange={(e)=> this.getInputEvaluationQuestion(e, index)}
                                   value={5}
                                   defaultChecked={evaluationsUpdate[`${item.questions_id}`] == 5 ? true : false}
                                 />
                                 </td>

                          </tr>



                      )} ) : <div className="lds-dual-ring-2"></div>
                    }
                    </tbody>
                    </Table>
                    </Col>
                  </Row>
                   <div className="d-flex justify-content-center">
                    <Button className="btn-rounded btn-fill bg-darkblue" type="submit" disabled={processing}>
                    {processing ? <div className="lds-dual-ring"></div>: (alreadyEvaluated ? 'Modificar evaluación enviada': 'Enviar')}
                      </Button>
                    </div>
                  </Form>
                </div>





                </Tab>
                )}


              </Tabs>

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

                         <Col sm="12" xl="12">
                           <label className="txt-darkblue">Categoría</label>
                           <Form.Group>
                             <Form.Select aria-label="Categoría" name="categories_id" onChange={this.getInputIdea} required>
                               <option value="">-- Seleccione una opción --</option>
                              {categories?.map((item, key) =>(ideaInfoEdit.categories_id == item.categories_id ?  <option selected value={item.categories_id} key={key} defaultValue>{item.categories.name}</option> : <option value={item.categories_id} key={key}>{item.categories.name}</option>))}
                               </Form.Select>
                           </Form.Group>
                          </Col>

                       </Row>
                       <Row className="m-2">
                         <Col sm="12" xl="12">
                           <label className="txt-darkblue">Jurado</label>
                          <Form.Group controlId="validationCustom02">


                             <Select
                               isMulti
                               options={this.state.judges}
                               onChange={this.onChangeJudges}
                               name="judges_id"
                               defaultValue={this.state.judges_has_ideas}
                                />

                             <Form.Control.Feedback type="invalid">El jurado es requerido</Form.Control.Feedback>
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
                              onChange={this.onUploadFileChange}

                              accept="application/pdf"
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
                        <label>Sede Universitaria</label>
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
                         <label>Nombre de la feria</label>
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
                          <Button type="submit" className="btn-rounded btn-fill bg-darkblue" disabled={processing}>
                            {processing ? <div className="lds-dual-ring"></div>: 'Guardar'}
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

        <Modal show={show} onHide={()=> this.toggleComment()}>
                <Modal.Header closeButton>
                  <Modal.Title className="txt-blue">Editar comentario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-align-center">
                <Form.Group>
                     <Form.Control
                        placeholder="Editar comentario..."
                        as="textarea"
                        style={{ height: '100px' }}
                        name="description_edit"
                        id="description_edit"
                        onChange={this.getInputQuestion}
                        required
                        defaultValue={this.state.question.description_edit}
                        >
                       </Form.Control>
                   </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  {processing ? <div className="roundIcon"><div className="lds-dual-ring-2"></div></div>: (<button size="lg" onClick={this.saveEditComment} className="bg-blue p-2 btn-rounded txt-white-btn">
                    Editar comentario
                  </button>)}
                </Modal.Footer>
              </Modal>




        </>
      );
    }

}
