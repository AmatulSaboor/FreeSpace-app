import React, {useEffect, useState} from 'react'
import EditModal from './EditModal'
import AddModal  from './AddModal'
import { CardGroup, Card, Button} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import Pagination from '../pagination/Pagination';
import serverURL from '../../configVars';
import { Link } from 'react-router-dom';
import '../mySenderPosts/Senderlisting.css';



export const CarrierListing = ({setLoggedInUserEmail, setLoggedInUserName}) => {
    const [isAuth] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2);
    const [carrierPosts, setCarrierPosts] = useState([]);
    const history = useHistory();
    const handleDelete = (id) => {
        console.log(`handle delete`);
        setCarrierPosts(carrierPosts.filter(i => i._id !== id));
    }
    const handleCreate = (post) => {
        console.log(`handle create`);
        const copyPosts = [...carrierPosts];
        copyPosts.push(post);
        setCarrierPosts(copyPosts)
    }
    const handleEdit = (post) => {
        console.log(`handle edit`);

        setCarrierPosts(carrierPosts.filter( item => {
            if (item._id === post._id){
                item.departureCountry = post.departureCountry;
                item.departureCity = post.departureCity;
                item.arrivalCity = post.arrivalCity;
                item.arrivalCountry = post.arrivalCountry;
                item.departureDate = post.departureDate;
                item.arrivalDate = post.arrivalDate;
                item.weight = post.weight;
                item.volume = post.volume;
                item.ratesPerKg = post.ratesPerKg;
                item.comments = post.comments;
            }
            return item;
        }))
    }

    // get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = carrierPosts.slice(indexOfFirstPost,indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
//   setIsAuth(useAuthentication());
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
                fetch(serverURL + `carrier/getListing`, {
            
                    credentials : 'include'
                })
                .then(data => data.json())
                .then(data => {console.log(data); setCarrierPosts(data.carrierPostList)})
                .catch(err => console.log(err))
            }
        })
        .catch(err => {console.log(err);
        })

        
    }, [history, setLoggedInUserName, setLoggedInUserEmail])

    return (
        <div> {isAuth && 
            <div className="container-listing">
            <div className="container-xl">
                <div className="table-responsive">
                    <div className="table-wrapper">
                        <div className="table-title">
                            <div className="row">
                            <nav className='option-listing'>
                                        <ul>
                                            <li className="listing-name">
                                                My Carrier Listing
                                            </li>
                                        </ul>
                                    </nav>
                                    </div>
                                <AddModal handleCreate = {handleCreate}/>
                            </div>
                        </div>
                        <CardGroup>
                            {currentPosts.map((post) => { 
                            return <Card className="card-view" key ={post._id}>
                                    <Card.Body>
                                    <Card.Title className='date'>Posted On <span className='date'> {post.createdAt.slice(0,10)}</span></Card.Title>
                                    <Card.Text>
                                        <div className="Country">
                                            <span className="country">Departure Country: </span><span>{post.departureCountry}</span>
                                       
                                            <span className="country">{post.destinationCountry}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Departure City: </span>
                                           
                                            <span className='answer-detail'>{post.departureCity}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Arrival Country: </span><span>{post.arrivalCountry}</span>
                                           
                                            <span>{post.destinationCountry}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Arrival City: </span><span className='answer-detail'>{post.arrivalCity}</span><span>{post.destinationCity}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Departure Date: </span><span className='answer-detail'>{post.departureDate.slice(0,10)}</span>
                                        </div>
                                        <div>
                                            <span className="Country">Arrival Date: </span><span className='answer-detail'>{post.arrivalDate.slice(0,10)}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Weight: </span><span className='answer-detail'>{post.weight}</span>
                                            </div>
                                        <div className="Country">    
                                            <span className="country">Volume: </span><span className='answer-detail'>{post.volume}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Rates (per kg): </span><span className='answer-detail'>{post.ratesPerKg}</span>
                                        </div>
                                        <div className="Country">
                                            <span className="country">Notes: </span><span className='answer-detail'>{post.comments}</span>
                                        </div>
                                    </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <EditModal post = {post} handleEdit = {handleEdit}/>
                                        <Button onClick={
                                        (e)=>{
                                            console.log(post._id);
                                            fetch(serverURL + `carrier/delete/${post._id}`)
                                            .then( response => response.json())
                                            .then (response => {
                                                    console.log(response);
                                                    handleDelete(post._id)
                                                })
                                            .catch(err => console.log(err));
                                        }
                                    } className="delete" >Delete</Button>
                                    </Card.Footer>
                                </Card>
                            })}
                        </CardGroup>
                        {/* <table className="table table-striped table-hover">
                            
                            {currentPosts.map((senderPost) => 
                                <tr key={senderPost._id}>
                                    <td >{senderPost.originCountry}</td>
                                    <td>{senderPost.originCity}</td>
                                    <td>{senderPost.destinationCountry}</td>
                                    <td>{senderPost.destinationCity}</td>
                                    <td>{senderPost.expiresOn}</td>
                                    <td>{senderPost.volume}</td>
                                    <td>{senderPost.volume}</td>
                                    <td>{senderPost.willingToPayPerKg}</td>
                                    <td>{senderPost.items}</td>
                                    <td>{senderPost.comments}</td>
                                    <td>
                                        <EditModal post = {senderPost} handleEdit = {handleEdit}/>
                                    </td>
                                    <td><button onClick={
                                        (e)=>{
                                            console.log(senderPost._id);
                                            fetch(serverURL + `sender/delete/${senderPost._id}`)
                                            .then( response => response.json())
                                            .then (response => {
                                                    console.log(response);
                                                    handleDelete(senderPost._id)
                                                })
                                            .catch(err => console.log(err));
                                        }
                                    } className="delete" ><i className="material-icons" title="Delete">&#xE872;</i></button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table> */}
                    </div>
                </div>  
                <Pagination postsPerPage = {postsPerPage} totalPosts = {carrierPosts.length} paginate = {paginate}/>  
            </div>
            // </div>
        }
        </div>
        
    )
}

