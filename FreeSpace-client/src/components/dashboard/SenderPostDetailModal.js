import React, { useState} from 'react'
import { Modal, Button, Card } from 'react-bootstrap'
// import serverURL from '../../configVars';
// import Chat from '../chat/Chat';
// const serverURL = 'https://freespace-server.herokuapp.com/';
// const serverURL = 'http://localhost:9000/';

// export default function DetailModal({socket, post}) {
export default function DetailModal({post, setIsChatting, postOwnerSocketId, setPostOwnerSocketId}) {
    const [show, setShow] = useState(false);
    // const [postOwnerSocketId, setPostOwnerSocketId] = useState()
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleLiveChat = () => {
        setIsChatting(true)
        handleClose()

    }
    // useEffect(()=>{
    //     fetch(serverURL + `auth/checkOnline/${post.createdBy}`).then(res => res.json())
    //     .then(res => {
    //         console.log(res)
    //     if(res.isOnline){
    //         console.log(res.socketId)
    //         console.log(postOwnerSocketId)
    //         if(postOwnerSocketId===undefined){}
    //             // setPostOwnerSocketId(res.socketId);
    //     }
    //     })
    //     .catch(err => console.log(err))
    // })
    return (
        <div>
            <Button onClick={handleShow} data-toggle="modal"><span className='detail-button'>Details</span></Button> 
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className='detail-post'>
                        <Card.Text>Posted by <span className='date'>{post.createdBy} on {post.createdAt.slice(0,10)}</span></Card.Text>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='detail-post-body'>
                    <div>
                        <span className='detail-post-deputure'>Origin City: </span><span className='detail-post-answer'>{post.originCity}</span><span className='detail-post-deputure'>Destination City: </span><span className='detail-post-answer'>{post.destinationCity}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure'>Expires On: </span><span className='detail-post-answer'>{post.expiresOn.slice(0,10)}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure'>Weight: </span><span className='detail-post-answer'>{post.weight} kg(s)</span><span className='detail-post-deputure'>Volume: </span><span className='detail-post-answer'>{post.volume}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure'>Items: </span><span className='detail-post-answer'>{post.items}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure'>Willing To Pay (per kg): </span><span className='detail-post-answer'>{post.willingToPayPerKg}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure'>Notes: </span><span className='detail-post-answer'>{post.comments}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='livechat' onClick={handleLiveChat}>Live Chat</Button>
                    <Button className='close' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            {/* {isChatting && <Chat socket={socket} setIsChatting={setIsChatting} postOwnerSocketId={postOwnerSocketId}/>} */}
            {/* {isChatting && <Chat socket={socket} setIsChatting={setIsChatting}/>} */}
        </div>
    )
}
