import {Toast, ToastContainer} from "react-bootstrap";

const CustomToast = (props) => {

return (
  <ToastContainer position='top-end' className="p-3">
       <Toast onClose={props.onClose} show={props.show} delay={3000} autohide bg={props.variant} >
         <Toast.Header>
           <strong className="me-auto">{props.title}</strong>
         </Toast.Header>
         <Toast.Body>{props.body}</Toast.Body>
       </Toast>
    </ToastContainer>
);
}

export default CustomToast;
