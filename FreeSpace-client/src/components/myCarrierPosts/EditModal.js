// import './EditModal.css';
import { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import EditForm from './EditForm';



function EditModal({post, handleEdit}){
const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => setShow(false);


return (
<div>
   <Button onClick={handleShow} className="btn btn-success" data-toggle="modal"><span>Edit</span></Button> 
   <Modal show={show} onHide={handleClose}>
      <Modal.Header>
         <Modal.Title>
            Carrier Post
         </Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <EditForm post = {post} handleEdit = {handleEdit} handleClose = {handleClose}/>
      </Modal.Body>
      <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
   </Modal>
</div>
)
}
export default EditModal;