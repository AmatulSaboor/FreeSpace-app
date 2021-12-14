import React from 'react'
import { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import serverURL from '../../configVars';
import { CardGroup, Card, Button} from 'react-bootstrap';

export const Notification = ({setLoggedInUserEmail, setLoggedInUserName}) => {
    const history = useHistory();
    const [notificationsList, setNotificationsList] = useState([])
    const handleDelete = (id) => {
        console.log(`handle delete`);
        setNotificationsList(notificationsList.filter(i => i._id !== id));
    }
    const handleEdit = (notification) => {
        console.log(`handle edit`);

        setNotificationsList(notificationsList.filter( item => {
            if (item._id === notification._id){
                item.isRead = true;
            }
            return item;
        }))
    }
    useEffect(() => {
        fetch(serverURL + 'auth/session', {
            credentials: 'include'
        })
        .then((res => res.json()))
        .then(res => {console.log(res); 
            if(!res.isAuthenticated){
                return history.push('./login');
            }
            else{
                setLoggedInUserEmail(res.email)
                setLoggedInUserName(res.username)
                fetch(serverURL + 'notification/getListing', {
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(res => {console.log(res)
                    setNotificationsList(res.NotificationList)})
                .catch(err => console.log(err))
            }
        })
        .catch(err => {console.log(err);
        })
    }, [history, setLoggedInUserEmail, setLoggedInUserName])
    return (
        <CardGroup>
                {notificationsList.map((notification) => { 
                return <div className='nothing'><Card className ='card-carrier' key ={notification._id}>
                        <Card.Body>
                        <Card.Title>Posted by <span className='date'>{notification.senderName}</span></Card.Title>
                        {notification.isRead && <Card.Title>Read <span className='date'></span></Card.Title>}
                        {!notification.isRead && <Card.Title>Mark isRead <span className='date'></span></Card.Title>}
                        {/* <Card.Text>
                            <div><span className='italic'>{post.createdBy}</span> wants to send <span className='bold'><br></br>{post.weight}</span>kg(s) <br></br>stuff from <span className='bold'>{post.originCity}, {post.originCountry}</span><br></br> to <span className='bold'>{post.destinationCity}, {post.destinationCountry}</span><br></br> before <span className='italic'>{post.expiresOn.slice(0,10)}</span></div>
                        </Card.Text> */}
                        </Card.Body>
                        <Card.Footer>
                            <span className="text-muted">Posted On {notification.createdAt.slice(0,10)}</span>
                            {!notification.isRead && <Button onClick={
                                () => {
                                    fetch(serverURL + `notification/markRead/`,
                                    {
                                        mode: 'cors',
                                        method: 'POST',
                                        headers: { 'Content-Type':'application/json' },
                                        body: JSON.stringify({_id:notification._id}),
                                        credentials: 'include'
                                    })
                                    .then( response => response.json())
                                    .then (response => {
                                            console.log(response);
                                            handleEdit(response.editedNotification);
                                    })
                                    .catch(err => console.log(err));
                                }
                            }>Mark As Read</Button>}
                            <Button onClick={
                                () => {
                                    fetch(serverURL + `notification/delete/${notification._id}`)
                                    .then( response => response.json())
                                    .then (response => {
                                            console.log(response);
                                            handleDelete(notification._id);
                                    })
                                    .catch(err => console.log(err));
                                }
                            }>Delete</Button>
                        </Card.Footer>
                    </Card>
                    </div>
                })}
        </CardGroup>
    )
}