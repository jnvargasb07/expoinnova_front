import React, {Fragment} from "react";
import Select from 'react-select'
//import makeAnimated from 'react-select/animated';
import {ReactComponent as Triquitracatelas} from '../../../assets/SVG/INTERNO PROYECTO.svg';
import {ReactComponent as Proyecto} from '../../../assets/SVG/PROYECTO.svg';

import { Button, Card, Container, Row, Col, Form, Tabs, Tab, Modal, Dropdown, Nav } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import AppUtil from '../../../AppUtil/AppUtil.js';
import { url, fairDescription } from "../services/api";
import moment from "moment";
import 'moment/locale/es';
import Toast from '../common/Toast.js';
import AccordionTable from '../common/AccordionTable.js';
import crypto from "crypto-js";
import { TableToExcelReact } from "table-to-excel-react";
import * as XLSX from 'xlsx';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
//import { ToolkitContextType } from 'react-bootstrap-table2-toolkit';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
const { ExportCSVButton } = CSVExport;



//Clase de los detalles de la feria
export default class FairDetail extends React.Component
{
  constructor(props)
  {
    super(props);

    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    this.tableRef = React.createRef();
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
        role:"",
        user:"",
        options_comments:false,
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
          campus_name:"",
          judge_id:""
        },
        validatedIdea:false,
        evaluations:[],
        showDelete:false,
        ideaBusiness:[],
        ideasJudge:[],
        ideasCategories:[],
        ideasExportFull:[],
        judgesIDs:[],
        category_name:"",
        showActionCat:false,
        catEdit:"",
        actionCat:'',
        catId:0,
        catIdAux:0,
        msj_error:"",
        list_ideas:[],
        keysToDraw:[]
      }
  }

  //esto permite el movimiento entre los tabs de editar la feria
  setModalKey = (keymodal) => this.setState({keymodal})

  //esta funcion permite cambiar entre los tabs
  setKey = (key) =>
  {

    this.setState({key});
    switch (key)
    {
      case 'businessIdeas': // obtiene las ideas
      if (this.state.categories.length == 0)
      {
        this.setKey('fairInfo');
        let alert = {
          show:true,
          variant:'warning',
          title:"Debe de ingresar categorías",
          body:"Debe de ingresar categorías antes de crear Ideas"
        }
        this.setState({alert});

      }
        this._fetchIdeas();
        this.getCategoriesData()
        AppUtil.getAPI(`${url}students`, sessionStorage.getItem('token')).then(response => {

          if (response)
          {
            this.setState({students:response.data});
          }
        });
          AppUtil.getAPI(`${url}judges`, sessionStorage.getItem('token')).then(response => {
            if (response)
            {
              let judges = response.data, newJudges = [];
              for (var i = 0; i < judges.length; i++) {

                newJudges[i] = {value: judges[i].id, label: `${judges[i].users.name}` }
              }
              this.setState({judges:newJudges});
            }
          });

          AppUtil.getAPI(`${url}evaluations`, sessionStorage.getItem('token')).then(response => {
            if (response)
            {

              this.setState({evaluations:response.data});
            }
          });
      break;

      case 'reports':
        this._getReports();
      break;

      case 'categories':
        this.getCategoriesData();
      break;
    }
  };

    //se obtiene el usuario
    getUserData = async () => {
      let bytes = crypto.AES.decrypt(
        sessionStorage.getItem("user"),
        "@virtual_cr"
      );
      this.user = JSON.parse(bytes.toString(crypto.enc.Utf8));
      this.setState({role:this.user.roles[0].name})
    };

//obtiene datos de la feria
  _getFairInfo = () =>
  {
    AppUtil.getAPI(`${url}${fairDescription}${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      if (response)
      {

        this.setState({fairInfo:response.data});
      }
    });

  }
  //obtiene las categorias
  _getCategories = () =>
  {
    AppUtil.getAPI(`${url}${fairDescription}${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      if (response)
      {
        this.setState({fairInfo:response.data})
      }
    });
  }
  //envia el formulario de edicion de la feria
  submitEditFair = (e) =>{

    const formulario = e.currentTarget;
    if (formulario.checkValidity() === false)
    {
      e.preventDefault();
      e.stopPropagation();
      return ;
    }

    e.preventDefault();
    e.stopPropagation();


    this._setProcessing( true);
    let {fairInfo, id} = this.state;

    if (moment(fairInfo.star_date).isAfter(fairInfo.end_date))
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

        AppUtil.putAPI(`${url}fairs/${id}`, fairInfo).then(response => {
          if (response.success)
          {

            let alert = {
              show:true,
              variant:'success',
              title:"Feria editada",
              body:"Feria de negocio editada satisfactoriamente"
            }
            this.setState({alert})
            this._setProcessing(false)
            AppUtil.reloadPage();
            return ;
          }
          let alert = {
            show:true,
            variant:'danger',
            title:"Error al crear la feria",
            body:"No se pudo crear la feria, por favor intente más tarde"
          }
          this._setProcessing(false);
          this.setState({alert});
        })

  }

//carga la info al inicio
  componentDidMount()
  {
    this._getFairInfo();
    this.getUserData();
    this.getCategoriesData();
  }

  // funciones para mostrar/ocultar los modales
  toggleShow = () => this.setState({editModal: !this.state.editModal});
  toggleIdea = () => this.setState({ideaModal: !this.state.ideaModal});
  toggleDelete = (id = 0) => this.setState({showDelete: !this.state.showDelete, id});

  //obtiene la info de los inputs para los input de la feria
  getInputData = async (e) => {

    if(e.target.name === "options_comments"){

      await this.setState({
        fairInfo: {
          ...this.state.fairInfo,
          [e.target.name]: e.target.checked,
        },
      });

    }else{
      await this.setState({
        fairInfo: {
          ...this.state.fairInfo,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  //obtiene info de los inputs para crear la idea
  getInputIdea = async (e) => {
    await this.setState({
      idea: {
        ...this.state.idea,
        [e.target.name]: e.target.value,
      },
    });

  };

//obtiene los inputs para las categorias
  getInputDataOthers = (e) => {
     this.setState({
        category_name: e.target.value,

    });

  };

//obtiene info de inputs para editar la categoria
  editCategory = (e) => {
     this.setState({
        catEdit: e.target.value,

    });

  };

  // esta funcion llena la info del tercer tab de ideas al seleccionar un estudiante
  getIdeaDataSelect = async (e) => {


    let info = JSON.parse(e.target.value);

    await this.setState({
      idea: {
        ...this.state.idea,
        students_id: info.id,
        professor_users_id: info.professor_users.id,
        professor_name:info.professor_users.name,
        campus_id: info.campus_id,
        fairs_id: this.state.id,
        campus_name:info.campuses.name
      },
    });

  };


//obtiene la informacion de las ideas
  _fetchIdeas = () => {

    let rest_url = "";
    let student = sessionStorage.getItem('student_id');
    switch (this.user.roles[0].name)
    {
      case 'Students': // obtiene las ideas
        rest_url = `ideasBystudent/${this.state.id}/${student}`;
      break;
      case 'Judges':
        rest_url = `ideas_by_judges_id/${this.state.id}/${student}`;
      break;
      default:
        rest_url = `ideas_by_fair_id/${this.state.id}`;
    }

    AppUtil.getAPI(`${url}`+rest_url, sessionStorage.getItem('token')).then(response => {

      if (response)
      {

        this.setState({ideas:response.data});
      }
    });

  }


  //envia las ideas para crearlas
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

      let {idea, ideas} = this.state;

    for (var i = 0; i < ideas.length; i++)
    {
      if (ideas[i].name != null)
      {
        if (idea.name === ideas[i].name)
        {

          let alert = {
            show:true,
            variant:'warning',
            title:"No se puede crear la idea",
            body:"No se puede crear una idea que ya existe"
          };
          this.setState({alert});

          return ;
          break;
        }
      }
    }

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
            this._setProcessing(true);
            AppUtil.postAPI(`${url}ideas`, idea).then(response => {
              if (response.success && response.data != "")
              {

                this.judgeHasIdea(response.data.id, idea.judge_id /*this.state.idea.judge_id */);
                this.toggleIdea();
                let alert = {
                  show:true,
                  variant:'success',
                  title:"Idea creada",
                  body:"La idea fue agregada correctamente"
                };
              //  this._fetchIdeas();
                this.setState({alert, keyideas:'general'});
                this._setProcessing(true);
                this.setState({processing: false})
                AppUtil.reloadPage();
                return ;
              }
              let alert = {
                show:true,
                variant:'danger',
                title:"Error al crear la idea",
                body:"No se pudo crear la idea, por favor intente más tarde"
              }
              this.setState({alert, processing: false})
              //this._setProcessing(true);
            });
            break;
      }
  }

  //asigna las ideas a los jurados seleccionados
  judgeHasIdea = (id_idea, data) => {

    let send = {
      "judges_id": data.toString(),//[]
      "ideas_id": id_idea,
      "evaluation": 0
    }


    AppUtil.postAPI(`${url}judges_has_ideas`, send).then(response => {
    });
  }

    //elimina la idea
    deleteFair = () =>{
      let {id} = this.state;

      if (id > 0)
      {
        this._setProcessing(true);

        AppUtil.deleteAPI(`${url}ideas/${id}`).then(response => {

          if (response.success)
          {
            if (response.message == "Idea no se puede eliminar mientras tenga un juez ligado")
            {
              let alert = {
                show:true,
                variant:'warning',
                title:"No se puede eliminar",
                body:"La idea de negocio no se puede eliminar ya que posee jueces o evaluaciones asignadas",
                  position:"bottom-end"
              }
              this.setState({alert, processing: false});
              return ;
            }
              let alert = {
                show:true,
                variant:'success',
                title:"Idea de negocio eliminada",
                body:"Idea de negocio eliminada satisfactoriamente",
                  position:"bottom-end"
              }
              this.setState({alert, processing: false});
              this._setProcessing(false);
              //AppUtil.reloadPage();
              // this.toggleDelete();
              // this._fetchIdeas();

              return ;
          }

          let alert = {
            show:true,
            variant:'warning',
            title:"Idea no eliminada",
            body:"La idea de negocio no se pudo eliminar, por favor intente más tarde",
              position:"bottom-end"
          }

          this.setState({alert, processing: false});

        })
      }
    }

    //subir lel archivo en b64 al server
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
            idea: {
              ...this.state.idea,
              pdf_resume: result,
            },
          });
          //setFile(result)
          //setFileName(target.files[0])
        }
    })
}

  //obtiene los reportes
  _getReports = async () =>{
    //report by idea
    //
      let cookedData = [];

      let ideaBusiness = await  AppUtil.getAPI(`${url}ideas-business/${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      let ideaBusiness = response ? response.data : [];

      this.setState({ideaBusiness});
    });

      //report by judge
      let ideasJudge = await AppUtil.getAPI(`${url}ideas-judge/${this.state.id}`, sessionStorage.getItem('token')).then(response => {
      let ideasJudge = response ? response.data : [], cookedData = [];
      for (var i = 0; i < ideasJudge.length; i++)
      {
        cookedData.push(ideasJudge[i].judge);
      }
      this.setState({ideasJudge:cookedData});
    });



    //report by categories
AppUtil.getAPI(`${url}ideas-categories/${this.state.id}`, sessionStorage.getItem('token')).then(response => {
    let ideasCategories = response ? response : [];
    let keysToDraw = Object.keys( ideasCategories );


    this.setState({keysToDraw, ideasCategories});
  });


    //by export full

    AppUtil.getAPI(`${url}evaluacion_general/${this.state.id}`, sessionStorage.getItem('token')).then(response => {
    let ideasExportFull = response ? response.data : [];

    this.setState({ideasExportFull: ideasExportFull});
    });




  }

  downloadExcel = () => {
    let {ideaBusiness,ideasJudge, ideasCategories, fairInfo, keysToDraw, ideasExportFull } = this.state;

      let workbook = XLSX.utils.book_new();

      let worksheet = XLSX.utils.json_to_sheet(ideaBusiness);
      worksheet.A1.v = 'Nombre';
      worksheet.B1.v = 'Nombre de Idea';
      worksheet.C1.v = 'Nota';
      worksheet.D1.v = 'Cantidad Ideas Asignadas';
      worksheet.E1.v = 'Cantidad Ideas Evaluadas';

      let newJSONCategories = [];
      for (var i = 0; i < keysToDraw.length; i++)
      {

        for (var j = 0; j < ideasCategories[keysToDraw[i]].length; j++)
        {
          let objOrder = {
            name_category: ideasCategories[keysToDraw[i]][j].name_category,
            student: ideasCategories[keysToDraw[i]][j].student,
            campus: ideasCategories[keysToDraw[i]][j].campus,
            professor: ideasCategories[keysToDraw[i]][j].professor,
            name_idea: ideasCategories[keysToDraw[i]][j].name_idea,
            evaluation_get: ideasCategories[keysToDraw[i]][j].evaluation_get,
            evaluation_total: ideasCategories[keysToDraw[i]][j].evaluation_total,
            nota: ideasCategories[keysToDraw[i]][j].nota,

          }
          //newJSONCategories.push(ideasCategories[keysToDraw[i]][j]);
          newJSONCategories.push(objOrder);
        }
      }



      let worksheet2 = XLSX.utils.json_to_sheet( newJSONCategories ) ;

          worksheet2.A1.v = 'Nombre de Categoría';
          worksheet2.B1.v = 'Estudiante';
          worksheet2.C1.v = 'Campus';
          worksheet2.D1.v = 'Profesor';
          worksheet2.E1.v = 'Nombre de Idea';
          worksheet2.F1.v = 'Evaluación obtenida';
          worksheet2.G1.v = 'Total de Evaluaciones';
          worksheet2.H1.v = 'Nota';



      let worksheet3 = XLSX.utils.json_to_sheet(ideasJudge);
      worksheet3.A1.v = 'Nombre de Jurado';
      worksheet3.B1.v = 'Ideas asignadas';
      worksheet3.C1.v = 'Ideas evaluadas';

  //    let worksheet4 = XLSX.utils.json_to_sheet( ideasExportFull );

      XLSX.utils.book_append_sheet(workbook, worksheet, "Ranking nota general");
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Ranking por categoría");
      XLSX.utils.book_append_sheet(workbook, worksheet3, "Ranking por jurado");




      for (var i = 0; i < ideasExportFull.length; i++)
      {
        let finalArray = [], ideas = ideasExportFull[i].ideas, questionsArray = ideasExportFull[i].questions, scalesPerQuestion ={NombreProyecto: ''} ;
        questionsArray.map((question) => {scalesPerQuestion[question.question] = question.scale })
        for (var j = 0; j < ideas.length; j++)
        {
          //let evaluaciones = ideas[j].evaluacion;
          let jueces = ideas[j].jueses;
          let firstRow = { NombreProyecto: ideas[j].idea };
          let evaluaciones ={}, promedioRow = {NombreProyecto:`Promedio` }, NotaObt = {NombreProyecto:`Nota obtenida` };
          evaluaciones = jueces[0].evaluations; //setear las evaluaciones
          evaluaciones.map(evaluacion => (firstRow[evaluacion.question] = `${scalesPerQuestion[evaluacion.question]}%` ) ); //ciclo para cargar el header
          firstRow.Total = "100%";
          finalArray.push(firstRow);


          jueces.map(juez => { //recorrer a los jueces por sus calificaciones
            let row = { NombreProyecto: juez.judge_name  };

            let evaluacionesAux = juez.evaluations;


            evaluacionesAux.map(evaluacion => ( row[evaluacion.question] = evaluacion.evaluations_judge )); // recorre los resultados de las preguntas para acomodarlos en la tabla
            finalArray.push(row);
            evaluacionesAux.map(evaluacion => ( promedioRow[evaluacion.question] = 0 ) ); // se setea el promedio en cero para despues cargarlo (para que no de NaN)
            evaluacionesAux.map(evaluacion => { NotaObt[evaluacion.question] = scalesPerQuestion[evaluacion.question]; } ); // se setea la nota obtenida en lo que vale la nota para despues cargar la info
            return finalArray;
          });
          let totalNotaObt = 0, evaluationsQuestionPerJudge = 0;;
          //evaluaciones.map(evaluacion => { promedioRow[evaluacion.question] += (evaluacion.evaluations_judge / evaluaciones.length); console.log(evaluacion.evaluations_judge,evaluaciones.length ); } ); // se asigna el promedio a un question ID
          jueces.map(juez => {
            let evaluacionesAux = juez.evaluations;

            evaluacionesAux.map(evaluacion => { promedioRow[evaluacion.question] += (evaluacion.evaluations_judge); } ); // se asigna el promedio a un question ID
            evaluationsQuestionPerJudge += 1;
          })
          evaluaciones.map(evaluacion => { promedioRow[evaluacion.question] = promedioRow[evaluacion.question] / evaluationsQuestionPerJudge ; } ); // se asigna el promedio a un question ID

          evaluaciones.map(evaluacion => { NotaObt[evaluacion.question] = parseFloat(NotaObt[evaluacion.question]) * parseFloat(promedioRow[evaluacion.question]) / 5 ; totalNotaObt += NotaObt[evaluacion.question] ; } ); //hacer el calculo con el promedio
         // finalArray.push(promedioRow);
          console.log(promedioRow);
          // Parseo a 2 decimales
          evaluaciones.map(evaluacion => { promedioRow[evaluacion.question] = Math.floor(promedioRow[evaluacion.question] * 100) / 100 ; } ); // se asigna el promedio a un question ID
          finalArray.push(promedioRow);
          evaluaciones.map(evaluacion => { NotaObt[evaluacion.question] = Math.floor(NotaObt[evaluacion.question] * 100) / 100; } ); //hacer el calculo con el promedio
         
          NotaObt.Total = Math.floor(totalNotaObt * 100) / 100;
          finalArray.push(NotaObt);

        }
          let worksheet4 = XLSX.utils.json_to_sheet( finalArray );
          XLSX.utils.book_append_sheet(workbook, worksheet4, ideasExportFull[i].category);
      }
    XLSX.writeFile(workbook, `Reporte de Feria ${fairInfo.name}.xlsx`);
  };

  //obtiene las categorias de esta feria
  getCategoriesData = () => {
    AppUtil.getAPI(`${url}categorie_by_fair_id/${this.state.id}`).then((response) => {


      let dataArray = response.data, categories = [];


      for (var i = 0; i < dataArray.length; i++)
      {
        if (dataArray[i].categories_id !== 1)
        {
          categories.push(dataArray[i]);
        }

      }


      if (response.data.length > 0)
      {
        this.setState({
          categories,
          processing: false
        });
      }
    });
  };


  //crear la categoria
  saveCategories = () => {

    this._setProcessing(true);
    let {category_name, categories} = this.state;

    for (var i = 0; i < categories.length; i++)
    {
      if (categories[i].categories != null)
      {
        if (category_name === categories[i].categories.name)
        {

          let alert = {
            show:true,
            variant:'warning',
            title:"Categoría ya existe",
            body:"El nombre de la categoría ya existe"
          };
          this.setState({alert, processing: false});

          return ;
          break;
        }
      }
    }


    if (category_name === "")
    {
      let alert = {
        show:true,
        variant:'warning',
        title:"Categoría requerida",
        body:"El nombre de la categoría es requerida"
      };
      this.setState({alert, processing: false});
      return ;
    }

    AppUtil.postAPI(`${url}categories`, {name: category_name}).then((response) => {
      if (response.success)
      {
        AppUtil.postAPI(`${url}categorie_fair`, {fairs_id: this.state.id, categories_id: response.data.id}).then(category => {
          if (category.success)
          {
            let alert = {
              show:true,
              variant:'success',
              title:"Categoría creada y asignada a la feria",
              body:"La categoría fue creada y asignada a esta feria exitosamente"
            };
            this.setState({alert, processing: false});
            return ;
          }
          let alert = {
            show:true,
            variant:'warning',
            title:"Categoría creada pero no asignada",
            body:"La categoría fue creada pero no se pudo asignar a esta feria"
          };
          this.setState({alert, processing: false});
        });
        this.getCategoriesData();
      }
      else {
        let alert = {
          show:true,
          variant:'danger',
          title:"Categoría no creada",
          body:"La categoría no se pudo crear, por favor intente más tarde"
        };
        this.setState({alert, processing: false});
      }
    });

  }

  //formateo de la fecha
  _formatDate = (date) => (moment(date).format('MMMM Do YYYY, h:mm:ss a'));

  // percibe los cambios de dropdown para juegos
  onChange =(value) => {

    let judgesIDs =[];

    for (var i = 0; i < value.length; i++)
    {
      judgesIDs[i] = value[i].value;
    }

    //value = orderOptions(value);

    this.setState({
      idea: {
        ...this.state.idea,
        judge_id: judgesIDs,
      },
    });
    //this.setState({ judgesIDs });
 }

 //funcion para setear el procesando
   _setProcessing = (processing) => this.setState({processing});

   // esta fiuncion muestra los modales de editar/eliminar las categorias
   _toggleCat = (id = 0, action = '', row = false) =>
   {
    this.setState({msj_error: ""});
    this.setState({list_ideas: []});
     switch (action)
     {
       case 'edit':
       AppUtil.getAPI(`${url}categories/${id}`).then(response => {

         if (response.success)
         {
           this.setState({showActionCat: !this.state.showActionCat, catEdit: response.data.name, actionCat: action, catId:id});
           return ;
         }
       });
       break;

       case 'delete':
        this.setState({showActionCat: !this.state.showActionCat, actionCat:action, catId:id, catIdAux: row.id});
        break;
      default:
        this.setState({showActionCat: false, catId:0});
      break;
     }

   }

//envio del modal de categorias cuando se edita/elimina
submitModalCat =(action) =>{

  switch (action)
  {
    case 'edit':

      let {catId, catEdit, categories} = this.state;
    for (var i = 0; i < categories.length; i++)
    {
      if (categories[i].categories != null)
      {
        if (catEdit === categories[i].categories.name)
        {

          let alert = {
            show:true,
            variant:'warning',
            title:"Categoría ya existe",
            body:"El nombre de la categoría ya existe"
          };
          this.setState({alert, processing: false});

          return ;
          break;
        }
      }
    }

      if (this.state.catEdit === "")
      {
        let alert = {
          show:true,
          variant:'warning',
          title:"Categoría requerida",
          body:"El nombre de la categoría es requerida"
        };
        this.setState({alert, processing: false});
        return ;
      }
      this.setState({processing: true});


      AppUtil.putAPI(`${url}categories/${this.state.catId}`, {name: catEdit}).then(response => {
          if (response.success)
          {
            let alert = {
              show:true,
              variant:'success',
              title:"Categoría editada",
              body:"La categoría fue editada exitosamente"
            };
            this.setState({alert, processing: false});
            this.getCategoriesData()
            this._toggleCat();
            return ;
          }

          let alert = {
            show:true,
            variant:'danger',
            title:"No se pudo editar la categoría",
            body:"La categoría no pudo ser editada exitosamente"
          };
          this.setState({alert, processing: false});
          this._toggleCat();
          return ;
      })
    break;
    case 'delete':

      this.setState({msj_error: ""});
      this.setState({list_ideas: []});
      AppUtil.getAPI(`${url}category-exist/${this.state.catId}/${this.state.id}`).then(response => {

        if (response.success)
        {
          if(response.data.ideas.length > 0){
          this.setState({msj_error: "Esta categoría posee una idea asociada y no puede ser eliminada"});
          this.setState({list_ideas: response.data.ideas});
        }else{
          this.setState({processing: true});
          AppUtil.deleteAPI(`${url}categorie_fair/${this.state.catIdAux}`).then(response => {

            if(response.message == "categoria feria no se puede eliminar, esta ligado a una evaluacion")
            {
              let alert = {
                show:true,
                variant:'warning',
                title:"No se puede eliminar categoría",
                body:response.message
              };
              this.setState({alert, processing: false});
              this._toggleCat();
              return;
            }

            AppUtil.deleteAPI(`${url}categories/${this.state.catId}`).then(response => {
              this.setState({processing: false});
          if (response.success)
          {
            let alert = {
              show:true,
              variant:'success',
              title:"Categoría eliminada",
              body:"La categoría se elimino exitosamente"
            };
            this.setState({alert});
            this._toggleCat();
            this.getCategoriesData();
            return ;
          }

          let alert = {
            show:true,
            variant:'danger',
            title:"No se elimino la categoría",
            body:"La categoría no se pudo eliminar exitosamente"
          };
          this.setState({alert});
          this._toggleCat();
          return
            })



          });
        }
        }
      });

    break;
  }

}



// Funciones de renderizado las funciones de eliminar/editar de la tabla categorias
   renderDelete = (cell, row, rowIndex, formatExtraData) => {

       return (
         <a onClick={() => this._toggleCat(cell, 'delete', row)} className="txt-blue decoration-none">
          <i className="fas fa-trash"></i>  Eliminar
         </a>
       );



   }

   renderEdit = (cell, row, rowIndex, formatExtraData) => {
       return (
         <a onClick={() => this._toggleCat(cell, 'edit')} className="txt-blue decoration-none">
          <i className="fas fa-edit"></i> Editar
         </a>
       );

   }


  render()
  {
    let {fairInfo, ideas, key, editModal, keymodal, ideaModal, keyideas, categories, processing, alert, category, students, idea, judges, validatedIdea,
      evaluations

    } = this.state;

    const columnsCategories= [
      {dataField: 'categories.name', text:'Nombre', formatter:this.renderOptionEdit  },
      {dataField: 'categories_id', text:'Editar',  formatter: this.renderEdit  },
      {dataField: 'categories_id', text:'Eliminar',  formatter: this.renderDelete  }
    ];
    const columnsIdeas = [
      {dataField: 'name_idea', text:'Nombre de la Idea' },
      {dataField: 'name', text:'Coordinador'  },
      {dataField: 'evaluation_get', text:'Evaluaciones Recibida'},
      {dataField: 'evaluation_total', text:'Evaluaciones Esperadas' },
      {dataField: 'nota', text:'Nota' },
    ]

    const columnsJudge = [
      {dataField: 'name', text:'Nombre de Jurado'  },
      {dataField: 'cant_ideas', text:'Ideas Asignadas' },
      {dataField: 'idea_sin_evaluar', text:'Ideas Evaluadas' }
    ];

//{"name_category":"Ciencia","student":"Percival","campus":"Universidad de Costa Rica","professor":"Proferor Julio","name_idea":"El poder SA","nota":"19","evaluation_get":3,"evaluation_total":1},{"name_category":"Ciencia","student":"Percival","campus":"Universidad de Costa Rica","professor":"Proferor Julio","name_idea":"Idea poder SA 2","nota":"13","evaluation_get":2,"evaluation_total":0}
    const columnsCategorie = [
      {dataField: 'name_category', text:'Nombre de Categoría' },
      {dataField: 'student', text:'Estudiante' },
      {dataField: 'campus', text:'Campus' },
      {dataField: 'professor', text:'Profesor' },
      {dataField: 'name_idea', text:'Nombre de Idea' },
      {dataField: 'evaluation_get', text:'Evaluaciones Recibidas' },
      {dataField: 'evaluation_total', text:'Evaluaciones Esperadas' },
      {dataField: 'nota', text:'Nota' },
    ];

    const columnsFull = [
      {dataField: 'id', text:'ID'  },
      {dataField: 'idea_name', text:'Nombre de la Idea'  },
      {dataField: 'category_name', text:'Categoría' },
      {dataField: 'judge_name', text:'Nombre Jurado' },
      {dataField: 'evaluation', text:'Evaluación' },
    ];

    /*      id: `${i+1}`,
          idea_name: ideasExportFull[keys[i]][j].idea_name,
          category_name: ideasExportFull[keys[i]][j].category_name,
          judge_name: ideasExportFull[keys[i]][j].judges[0].judge.users.name,
          evaluation: ideasExportFull[keys[i]][j].judges[0].evaluation,*/

      return (
          <>
          <Toast onClose={()=> this.setState({alert:{show:false}} )} variant={alert.variant} show={alert.show} title={alert.title} body={alert.body} position={alert.position}  />

          <Container fluid>
            <Button variant="warning" className="btn-fill btn-rounded" onClick={() => this.props.navigate('/home')}>
              <i className="nc-icon nc-stre-left"></i>
                Volver
              </Button>
            <h2><Triquitracatelas /> <span className="p-1 txt-blue">{fairInfo ? fairInfo.name : 'Cargando...'}</span></h2>

            <Tabs
              activeKey={key}
              onSelect={(k) => this.setKey(k)}
              className="mb-3"
              defaultActiveKey="info"
              >

              <Tab className="txt-blue" eventKey="fairInfo" title={<span><i className="fas fa-folder"></i> Información de Feria</span>}>
               <div className="jumbotron">
                  <Row>
                  <Col xl="4" sm="12" md='12'>
                    <Card className="card-stats bg-gray m-1 p-2">
                      <Card.Header className="bg-gray">
                        <div className="text-align-center">
                          <Proyecto />
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col xs="12">
                            <div>
                              <h3 className="txt-darkblue">{fairInfo ? fairInfo.name : 'Cargando...'}</h3>
                                <h4  className="txt-darkblue">{fairInfo ? fairInfo.description : 'Cargando...'}</h4>
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
                            {fairInfo ? moment(fairInfo.star_date).format('DD/MM/YYYY') : 'Cargando...'}
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
                            {fairInfo ? moment(fairInfo.end_date).format('DD/MM/YYYY') : 'Cargando...'}
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
                    {fairInfo && (this.state.role === "SuperAdmin" || this.state.role === "Admin") && (
                      <Col xl="12" sm="12" md="12" className="text-align-center">
                        <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleShow}>
                          <i className="fas fa-edit"></i>Editar Información
                        </Button>
                      </Col>
                    )}

                  </Row>



                  </div>
              </Tab>

              <Tab className="txt-blue" eventKey="businessIdeas" title={<span><i className="fas fa-lightbulb"></i> Ideas de negocios</span>}>
                <Row>
                  {
                    ideas ?
                    (ideas?.map((item,index) =>(
                      <Col xl="5" sm="12" md="12" className="bg-gray p-2 m-1 txt-blue" key={index}>
                      {(this.state.role === "SuperAdmin" || this.state.role === "Admin")  && (
                          <Dropdown className="left-action-btn" as={Nav.Item} >
                            <Dropdown.Toggle  as={Nav.Link}   variant="default" >
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item className="txt-blue" href={`/home/fairdetail/idea?id=${item.id}&fair=${this.state.id}`}><i className="fas fa-eye r-10"></i>Ver Idea</Dropdown.Item>
                              <Dropdown.Item onClick={()=>this.toggleDelete(item.id)} className="text-danger"><i className="fas fa-trash r-10"></i>Eliminar</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}

                        <a href={`/home/fairdetail/idea?id=${item.id}&fair=${this.state.id}`} className="text-decoration-none">
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
                            <span className="txt-blue">Descripción:</span><br/> <p className="txt-darkblue hideDesc">{item.description}</p>
                          </Col>

                        </Row>
                        </a>
                      </Col>
                    ))) : (<div className="text-align-center"><div className="lds-dual-ring-2"></div></div>)
                  }
                  </Row>
                  {this.state.role === "SuperAdmin" && (
                  <Col xl="12" sm="12" md="12" className="text-align-center">
                    <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleIdea}>
                      <i className="fas fa-edit"></i>Crear Nueva Idea
                    </Button>
                  </Col>
                  )}
                  {this.state.role === "Admin" && (
                  <Col xl="12" sm="12" md="12" className="text-align-center">
                    <Button className="btn-rounded btn-fill bg-darkblue" onClick={this.toggleIdea}>
                      <i className="fas fa-edit"></i>Crear Nueva Idea
                    </Button>
                  </Col>
                  )}
              </Tab>

              {(this.state.role === "SuperAdmin" || this.state.role === "Admin")  && (
              <Tab className="txt-blue" eventKey="reports" title={<span><i className="fas fa-chart-bar"></i> Reportes</span>}>
                <Row>
                  <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                      <Card.Header>
                        <Card.Title as="h2" className="txt-blue">Ranking nota general</Card.Title>
                      </Card.Header>
                      <Card.Body className="table-full-width table-responsive px-0">
                        <BootstrapTable  id="table-to-xls" keyField='id' data={   this.state.ideaBusiness } columns={ columnsIdeas } pagination={ paginationFactory({sizePerPage: 5}) } />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>


                <Row>
                  <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                      <Card.Header>
                        <Card.Title as="h2" className="txt-blue">Ranking por categoría</Card.Title>
                      </Card.Header>
                      <Card.Body className="table-full-width table-responsive px-0">
                        <Accordion defaultActiveKey="0">
                        {
                          this.state.keysToDraw?.map((item, index) => {
                           return <AccordionTable eventKey={index} Title={item} data={this.state.ideasCategories[item]} columns={columnsCategorie}  />
                          })
                        }
                        </Accordion>



                        {/*<BootstrapTable id="table-to-xls" keyField='id' data={   this.state.ideasCategories } columns={ columnsCategorie } pagination={ paginationFactory({sizePerPage: 5}) } /> */}
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
                        <BootstrapTable  id="table-to-xls" keyField='id' data={   this.state.ideasJudge } columns={ columnsJudge } pagination={ paginationFactory({sizePerPage: 5}) } />

                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <button className="bg-darkblue btn-lg btn-rounded txt-white-btn" onClick={()=> this.downloadExcel()}>Descargar Reporte</button>



                </Row>




              </Tab>
              )}

              {(this.state.role === "SuperAdmin" || this.state.role === "Admin") && (
                <Tab className="txt-blue" eventKey="categories" title={<span><i className="fas fa-tags"></i> Categorías</span>}>
                <Fragment>
                  <Row className="p-1">
                    <h2>Categorías</h2>
                    {this.state.processing ? (<div className="d-flex justify-content-center"><div className="lds-dual-ring-2"></div></div>) :  <BootstrapTable keyField='id' data={this.state.categories} columns={ columnsCategories } pagination={ paginationFactory({sizePerPage: 5}) } /> }

                  </Row>
                  <Row className="p-1">
                    <Col xs={12} md={12}>
                      <div className="form-group">
                        <label
                          htmlFor="category_name"
                          className="text-color-recovery"
                        >
                          Nombre Nueva Categoria
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm input-field"
                          id="category_name"
                          name="category_name"
                          aria-describedby="category_nameHelp"
                          onChange={this.getInputDataOthers }
                          value={this.state.category_name ? this.state.category_name : ""}
                        />
                      </div>
                    </Col>
                  </Row>

                </Fragment>
                <div className="text-align-center">
                  <button
                    size="lg"
                    type="submit"
                    onClick={this.saveCategories}
                    className="bg-blue btn-lg btn-rounded txt-white-btn"
                  >
                    Crear Nuevo
                  </button>
                </div>

                </Tab>

              )}

            </Tabs>
            <Modal
              show={editModal}
              onHide={this.toggleShow}
              backdrop="static"
              keyboard={false}
              size="lg"
              >
              <Form validated={this.statevalidatedFair} onSubmit={this.submitEditFair}>
              <Modal.Header closeButton>
                <h3 className=" tituloFerias">Editar Feria de Negocios</h3>
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
                           type="date"
                           value={fairInfo ? moment(fairInfo.star_date).format('YYYY-MM-DD') : ""}
                           name="start_date"
                           onChange={this.getInputData}
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
                          value={fairInfo ? moment(fairInfo.end_date).format('YYYY-MM-DD') : ""}
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
                           name="description"
                           value={fairInfo ? fairInfo.description : ""}
                           onChange={this.getInputData}
                           required
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
                        name="options_comments"
                        label="Foro de preguntas y respuestas de los diferentes usuarios"
                        value={fairInfo ? fairInfo.options_comments : ""}
                        onChange={this.getInputData}
                        defaultChecked={fairInfo.options_comments}
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
                {processing ? <div className="lds-dual-ring-2"></div> : <Button type="submit" className="btn-fill bg-darkblue btn-rounded">Guardar</Button>}
              </Modal.Footer>
              </Form>
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
                       <Col sm="12" xl="12">
                         <label className="txt-darkblue">Categoría</label>
                         <Form.Group>
                           <Form.Select aria-label="Categoría" name="categories_id" onChange={this.getInputIdea} required>
                             <option value="">-- Seleccione una opción --</option>
                            {categories?.map((item, key) => (<option value={item.categories_id} key={key}>{item.categories == null ? '': item.categories.name }</option>) )}
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
                            onChange={this.onChange}
                             />
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
                           maxLength={200}
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
                            required
                            accept="application/pdf"
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
                           maxLength={200}
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
                      <label>Sede Universitaria</label>
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
                       <label>Nombre de la feria</label>
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

            {/*Delete IDEA MODAL*/}
            <Modal show={this.state.showDelete} onHide={()=> this.toggleDelete(0)}>
                <Modal.Header closeButton>
                  <Modal.Title className="txt-blue">Eliminar</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-align-center">¿Desea eliminar esta idea de negocios?</Modal.Body>
                <Modal.Footer>
                  <button variant="none" size="lg" onClick={()=> this.toggleDelete(0)} className="bg-darkblue btn-lg btn-rounded txt-white-btn">
                    Cancelar
                  </button>
                  {processing ? <div className=""><div className="lds-dual-ring"></div></div>: (<button size="lg" onClick={this.deleteFair} className="bg-blue btn-lg btn-rounded txt-white-btn">
                    Eliminar
                  </button>)}
                </Modal.Footer>
              </Modal>

              {/*Acciones de la categoria*/}
              <Modal
                show={this.state.showActionCat}
                onHide={()=> this._toggleCat(0)}
                backdrop="static"
                keyboard={false}
                size="lg"
                >
                <Modal.Header closeButton>
                  <h3 className="tituloFerias">{this.state.actionCat === 'edit' ? 'Editar': 'Borrar'} Categoría</h3>
                </Modal.Header>
                <Modal.Body>
                {
                  this.state.actionCat === 'edit' ?
                  <Row className="p-1">
                    <Col xs={12} md={12}>
                      <div className="form-group">
                        <label
                          htmlFor="category_name"
                          className="text-color-recovery"
                        >
                          Nombre Categoría
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm input-field"
                          id="category_name"
                          name="category_name"
                          aria-describedby="category_nameHelp"
                          onChange={this.editCategory }
                          value={this.state.catEdit ? this.state.catEdit : ""}
                        />
                      </div>
                    </Col>
                  </Row>:
                  <h4>¿Desea borrar esta categoría?</h4>


                }
                  <div>
                    <h5 className="text-danger">{this.state.msj_error}</h5>
                    {this.state.list_ideas.length > 0 ?
                      <div>
                        <h5>Lista de ideas asociadas:</h5>
                        <ul>
                        {this.state.list_ideas?.map((item, key) => (<li key={key}>{item.name}</li>) )}
                        </ul>
                      </div>
                    :""}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="btn-rounded" variant="light" onClick={()=> this._toggleCat(0)}>
                    Cerrar
                  </Button>
                  {processing ? <div className="lds-dual-ring-2"></div> : <Button onClick={()=> this.submitModalCat(this.state.actionCat)} className="btn-fill bg-darkblue btn-rounded" disabled={this.state.msj_error != "" ? true:false}>{this.state.actionCat === 'edit' ? 'Editar': 'Borrar'}</Button>}
                </Modal.Footer>

              </Modal>


          </Container>
          </>


      );
  }
}
