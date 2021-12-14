import React from 'react'
import { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import { Tabs, Tab, Spinner} from 'react-bootstrap';
import {CarrierPosts} from './CarrierPosts';
import {SenderPosts} from './SenderPosts';
import Pagination from '../pagination/Pagination';
import '../dashboard/Dashboard.css'
import '../menu/Menu'
import serverURL from '../../configVars';
import '../sideBar/SideBar'

export const Dashboard = ({setLoggedInUserEmail, setLoggedInUserName}) => {
    
    const [carrierPosts, setCarrierPosts] = useState([])
    const [senderPosts, setSenderPosts] = useState([])
    const [spinner, setSpinner] = useState(true)
    const [currentPageSender, setCurrentPageSender] = useState(1);
    const [senderPostsPerPage] = useState(12);
    const [currentPageCarrier, setCurrentPageCarrier] = useState(1);
    const [carrierPostsPerPage] = useState(12);

    // get sender current posts
    const indexOfLastSenderPost = currentPageSender * senderPostsPerPage;
    const indexOfFirstSenderPost = indexOfLastSenderPost - senderPostsPerPage;
    const currentPostsSender = senderPosts.slice(indexOfFirstSenderPost,indexOfLastSenderPost);
    const paginateSender = (pageNumber) => setCurrentPageSender(pageNumber);
    // get carrier current posts
    const indexOfLastCarrierPost = currentPageCarrier * carrierPostsPerPage;
    const indexOfFirstCarrierPost = indexOfLastCarrierPost - carrierPostsPerPage;
    const currentPostsCarrier = carrierPosts.slice(indexOfFirstCarrierPost,indexOfLastCarrierPost);
    const paginateCarrier = (pageNumber) => setCurrentPageCarrier(pageNumber);
    const history = useHistory();
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
            }
        })
        .catch(err => {console.log(err);
        })
    }, [history, setLoggedInUserEmail, setLoggedInUserName])
    useEffect(() => {
        fetch(serverURL + 'carrier/getAllListing')
        .then(res => res.json())
        .then(res => {setCarrierPosts(res.carrierPostList); setSpinner(false)})
        .catch(err => console.log(err))
        fetch(serverURL + 'sender/getAllListing')
        .then(res => res.json())
        .then(res => {setSenderPosts(res.senderPostList); setSpinner(false)})
        .catch(err => console.log(err))
    },
    []
    )
    // const handleCreate = (post) => {
    //     console.log(`handle create`);
    //     const copyPosts = [...CarrierPosts];
    //     copyPosts.push(post);
    //     setCarrierPosts(copyPosts)
    // }
    
    return (
        <div className='dahboard'>
            {spinner && 
            <Spinner animation="border" role="status">
            </Spinner>}
            <Tabs  defaultActiveKey="carrier" id="uncontrolled-tab-example" className="mb-3">
                <Tab id="hover-post" className="posts flex-column" eventKey="carrier" title="Carrier Posts">
                    <CarrierPosts currentPostsCarrier = {currentPostsCarrier} carrierPosts={carrierPosts} setCarrierPosts = {setCarrierPosts} />
                    <Pagination postsPerPage = {carrierPostsPerPage} totalPosts = {carrierPosts.length} paginate = {paginateCarrier} />
                </Tab>
                <Tab id="hover-post" className="posts flex-column" eventKey="sender" title="Sender Posts">
                    <SenderPosts className='sender-dashboard' currentPostsSender = {currentPostsSender} senderPosts={senderPosts} setSenderPosts={setSenderPosts} />
                    <Pagination postsPerPage = {senderPostsPerPage} totalPosts = {senderPosts.length} paginate = {paginateSender} />
                </Tab>
                </Tabs>  
            <div className="divider">
            </div>
        </div>
    )
    
}
