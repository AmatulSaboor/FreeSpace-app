// import './AddModal.css';
import { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import AddForm from './AddForm';
import '../mySenderPosts/EditSender.css'

function AddModal({handleCreate}){
const [show, setShow] = useState(false);
const handleShow = () => setShow(true);
const handleClose = () => setShow(false);

return (
 <div className='sebder-create-button'>
   <Button className="button-create" onClick={handleShow} data-toggle="modal"><span className="button-create">Create Sender Post</span></Button> 
   <Modal show={show} onHide={handleClose}>
      <Modal.Header>
         <Modal.Title  className='edit-sender-post-heading'>
            Sender Post
         </Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <AddForm handleCreate = {handleCreate} handleClose = {handleClose}/>
      </Modal.Body>
      <Modal.Footer>
         <Button variant="secondary" onClick={handleClose}>
         Cancel
         </Button>
      </Modal.Footer>
   </Modal>
</div>
)
}
export default AddModal;