import React, {useState} from 'react'
import { Modal, Button, Card } from 'react-bootstrap';
import '../../configVars'
import '../dashboard/PostDetail.css'
import {useHistory} from "react-router-dom";
import serverURL from '../../configVars';
// import Chat from '../chat/Chat';
// const serverURL = 'https://freespace-server.herokuapp.com/';
// const serverURL = 'http://localhost:9000/'; 

// export default function DetailModal({socket, post}) {
export default function DetailModal({post, setIsChatting, postOwnerSocketId, setPostOwnerSocketId}) {
    const [show, setShow] = useState(false);
    // const [postOwnerSocketId, setPostOwnerSocketId] = useState()
    const handleShow = () => setShow(true);
    const history = useHistory();
    const handleClose = () => setShow(false);
    const handleLiveChat = () => {
        setIsChatting(true)
        handleClose()

    }
    // useEffect(()=>{
    //     fetch(serverURL + `auth/checkOnline/${post.createdBy}`).then(res => res.json())
    //     .then(res => {
    //         console.log(res)
    //         if(res.isOnline){
    //             console.log(res.socketId)
    //             console.log(postOwnerSocketId)
    //             if(postOwnerSocketId===undefined){}
    //                 // setPostOwnerSocketId(res.socketId);
    //         }
    //     })
    //     .catch(err => console.log(err))
    // })
    return (
        <div>
            
            <Button onClick={handleShow} data-toggle="modal"><span className='detail-button'>Details</span></Button> 
            
            <Modal show={show} onHide={handleClose}>
            
                <Modal.Header className='detail-post'>
                
                    <Modal.Title className='modal-detail-class'>
                        <Card.Text className='detail-post-heading'>Posted by <span className='date'>{post.createdBy} on {post.createdAt.slice(0,10)}</span></Card.Text>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='detail-post-body'>
                    <div>
                        <span className='detail-post'>Departure Date: </span><span className='detail-post-answer'>{post.departureDate.slice(0,10)}</span>
                        <br></br><span className='detail-post'>Arrival Date: </span><span  className='detail-post-answer'>{post.arrivalDate.slice(0,10)}</span>
                    </div>
                    <div>
                        <span className='detail-post'>Departure City: </span><span  className='detail-post-answer'>{post.departureCity}</span><br></br><span className='detail-post'>Arrival City: </span><span  className='detail-post-answer'>{post.arrivalCity}</span>
                    </div>
                    <div>
                        <span className='detail-post'>Weight Allowance: </span><span  className='detail-post-answer'>{post.weight} kg(s)</span><br></br><span className='detail-post'>Volume: </span><span  className='detail-post-answer'>{post.volume}</span>
                    </div>
                    <div>
                        <span className='detail-post'>Rates Per kg: </span><span  className='detail-post-answer'>{post.ratesPerKg}</span>
                    </div>
                    <div>
                        <span className='detail-post'>Notes: </span><span  className='detail-post-answer'>{post.comments}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='livechat' onClick={
                        () => {
                            fetch(serverURL + `notification/create/`,
                            {
                                mode: 'cors',
                                method: 'POST',
                                headers: { 'Content-Type':'application/json' },
                                body: JSON.stringify({postId:post._id, recieverName:post.createdBy}),
                                credentials: 'include'
                            })
                            .then( response => response.json())
                            .then (response => {
                                    console.log(response);
                                    handleClose()
                                    history.push('./dashboard')
                            })
                            .catch(err => console.log(err));
                        }
                    }>Interested</Button>
                    <Button className='livechat'variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
               
            </Modal>
            
            {/* {isChatting && <Chat socket={socket} setIsChatting={setIsChatting} postOwnerSocketId={postOwnerSocketId}/>} */}
            {/* {isChatting && <Chat socket={socket} setIsChatting={setIsChatting}/>} */}
        </div>
    )
}
