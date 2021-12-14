import React, { useState} from 'react'
import { Modal, Button, Card } from 'react-bootstrap'
import serverURL from '../../configVars';
import {useHistory} from "react-router-dom";

export default function DetailModal({post}) {
    const [show, setShow] = useState(false);
    const history = useHistory();
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

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
                        <span className='detail-post-deputure bold'>Origin City: </span><span className='detail-post-answer'>{post.originCity}</span><span className='detail-post-deputure bold'>Destination City: </span><span className='detail-post-answer'>{post.destinationCity}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure bold'>Expires On: </span><span className='detail-post-answer'>{post.expiresOn.slice(0,10)}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure bold'>Weight: </span><span className='detail-post-answer'>{post.weight} kg(s)</span><span className='detail-post-deputure bold'>Volume: </span><span className='detail-post-answer'>{post.volume}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure bold'>Items: </span><span className='detail-post-answer'>{post.items}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure bold'>Willing To Pay (per kg): </span><span className='detail-post-answer'>{post.willingToPayPerKg}</span>
                    </div>
                    <div>
                        <span className='detail-post-deputure bold'>Notes: </span><span className='detail-post-answer'>{post.comments}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Card.Text>If you click INTERESTED button, a notification will be sent to the post owner with your email and phone numberthen you will be contacted soon, </Card.Text>
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
                    <Button className='close' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
