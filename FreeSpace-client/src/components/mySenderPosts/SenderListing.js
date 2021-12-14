import React, {useEffect, useState} from 'react'
import EditModal from './EditModal'
import AddModal  from './AddModal'
import { CardGroup, Card, Button} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import Pagination from '../pagination/Pagination';
import serverURL from '../../configVars';
import '../mySenderPosts/Senderlisting.css';

export const SenderListing = ({setLoggedInUserEmail, setLoggedInUserName}) => {
    const [isAuth] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const [senderPosts, setSenderPosts] = useState([]);
    const history = useHistory();
    const handleDelete = (id) => {
        setSenderPosts(senderPosts.filter(i => i._id !== id));
    }
    const handleCreate = (post) => {
        const copyPosts = [...senderPosts];
        copyPosts.push(post);
        setSenderPosts(copyPosts)
    }
    const handleEdit = (post) => {

        setSenderPosts(senderPosts.filter( item => {
            if (item._id === post._id){
                item.originCountry = post.originCountry;
                item.originCity = post.originCity;
                item.destinationCity = post.destinationCity;
                item.destinationCountry = post.destinationCountry;
                item.expiresOn = post.expiresOn;
                item.weight = post.weight;
                item.volume = post.volume;
                item.willingToPayPerKg = post.willingToPayPerKg;
                item.items = post.items;
                item.comments = post.comments;
            }
            return item;
        }))
    }
    // get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = senderPosts.slice(indexOfFirstPost,indexOfLastPost);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    useEffect(() => {
        fetch(serverURL + 'auth/session', {
            credentials: 'include'
        })
        .then((res => res.json()))
        .then(res => {console.log(res); 
            if(!res.isAuthenticated){
                return history.push('./login');
            }else{
                setLoggedInUserEmail(res.email)
                setLoggedInUserName(res.username)
                fetch(serverURL + `sender/getListing`, {

                    credentials : 'include'
                })
                .then(data => data.json())
                .then(data => {console.log(data); setSenderPosts(data.senderPostList)})
                .catch(err => console.log(err))
            }
        })
        .catch(err => {console.log(err);
        })
    }, [history, setLoggedInUserName, setLoggedInUserEmail])

    return (
        <div> {isAuth && 
            <div><div className="container-listing">
            <div className="container-xl">
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                                    <nav className='option-listing'>
                                        <ul>
                                            <li className="listing-name">
                                                My Sender Listing
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <AddModal handleCreate={handleCreate} />
                            </div>
                        </div>
                        <CardGroup>
                            {currentPosts.map((post) => {
                                return <Card className="card-view" key={post._id}>
                                    <Card.Body>
                                    <Card.Title className='date'>Posted On <span className='date'> {post.createdAt.slice(0,10)}</span></Card.Title>
                                    <Card.Text>
                                        <div className="Country">
                                            <div className='abc'>
                                            <span className="country">Origin Country: </span>
                                            </div>
                                            <div className='select-form02'>
                                            <span className='answer-detail'>{post.originCountry}</span>
                                            </div>
                                            </div>
                                            <div className="Country">
                                            <div className='abc'>
                                            <span className="country">Destination Country: </span>
                                            </div>
                                            <div className='select-form02'>
                                            <span className='answer-detail'>{post.destinationCountry}</span>
                                            </div>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Origin City: </span>
                                            </div>
                                            <div className='select-form02'>
                                            <span className='answer-detail'>{post.originCity}</span>
                                            </div>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Destination City: </span>
                                            </div> 
                                            <div className='select-form02'>
                                            <span className='answer-detail'>{post.destinationCity}</span>
                                            </div>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Expires On: </span>
                                            </div><span className='answer-detail'>{post.expiresOn.slice(0,10)}</span>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Weight: </span>
                                            </div><span className='answer-detail'>{post.weight}</span>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Volume: </span>
                                            </div>
                                            <span className='answer-detail'>{post.volume}</span>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Items: </span>
                                            </div><span className='answer-detail'>{post.items}</span>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Willing To Pay (per kg): </span>
                                                </div><span className='answer-detail'>{post.willingToPayPerKg}</span>
                                        </div>
                                        <div className="Country">
                                        <div className='abc'>
                                            <span className="country">Notes: </span>
                                            </div>
                                            <span className='answer-detail'>{post.comments}</span>
                                        </div>
                                    </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <EditModal post={post} handleEdit={handleEdit} />
                                        <Button onClick={(e) => {
                                            console.log(post._id);
                                            fetch(serverURL + `sender/delete/${post._id}`)
                                                .then(response => response.json())
                                                .then(response => {
                                                    console.log(response);
                                                    handleDelete(post._id);
                                                })
                                            .catch(err => console.log(err));
                                        }
                                    } className="delete" >Delete</Button>
                                    </Card.Footer>
                                </Card>;
                            })}
                        </CardGroup>
                    </div>
                </div>
                </div>
                <Pagination postsPerPage={postsPerPage} totalPosts={senderPosts.length} paginate={paginate} />
            </div>
        }
        </div>
        
    )
}
