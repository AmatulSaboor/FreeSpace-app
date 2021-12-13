// import './EditModal.css';
import { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import EditForm from './EditForm';
import '../mySenderPosts/EditSender.css'


function EditModal({post, handleEdit}){
const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => setShow(false);


return (
<div>
   <Button onClick={handleShow} className="btn btn-success" data-toggle="modal"><span>Edit</span></Button> 
   <Modal className='column' show={show} onHide={handleClose}>
      <div className='space'>
     
      <Modal.Header>
         <Modal.Title>
            Sender Post
         </Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <EditForm post = {post} handleEdit = {handleEdit} handleClose = {handleClose}/>
         <Button  className='cancel-button'variant="secondary" onClick={handleClose}>Cancel</Button>
      </Modal.Body>
      {/* <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      </Modal.Footer> */}
      </div>
   </Modal>
</div>
)
}
export default EditModal;