import React, {useState} from 'react'
import { CardGroup, Card, Form, Button} from 'react-bootstrap';
import DetailModal from './SenderPostDetailModal';
import Chat from '../chat/Chat';
import countries from '../../data/listOfCountriesAndCities.json';
import serverURL from '../../configVars';
import '../dashboard/Posts.css'

export const SenderPosts = ({socket, senderPosts, currentPostsSender, setSenderPosts}) => {
    const [expiresOn, setExpiresOn] = useState()
    const [weight, setWeight] = useState(0)
    const [originCountry, setOriginCountry] = useState('');
    const [originCity, setOriginCity] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [originCities, setOriginCities] = useState([]);
    const [destinationCities, setDestinationCities] = useState([])
    const [postOwnerSocketId, setPostOwnerSocketId] = useState()
    const [isChatting, setIsChatting] = useState(false)
    const [sortBy, setSortBy] = useState('Recent(defualt)')
    function sort(sort, sortName){
        const copySorted = [...senderPosts];
        copySorted.sort((a, b) => {
            if (a[sort] > b[sort]) return 1;
            else if (a[sort] < b[sort]) return -1;
            else return 0;
        })
        setSenderPosts(copySorted)
        setSortBy(sortName)
    }
    const handleRecentSort = () => sort('createdAt', 'Recent(default)')
    const handleWeightSort = () => sort('weight', 'Weight')
    const handleExpiryDateSort = () => sort('expiresOn', 'Expiry Date')
    const handleOriginCitySort = () => sort('originCity', 'Origin City')
    const handleDestinationCitySort = () => sort('destinationCity', 'Destination City')
    const handleSearchReset = () => {
        setExpiresOn('')
        setWeight(0)
        setOriginCity('')
        setDestinationCity('')
        setDestinationCities([])
        setOriginCities([])
        setOriginCountry('')
        setDestinationCountry('')
    }
    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(serverURL + "sender/search",
        {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({expiresOn, weight, destinationCity, originCity}),
            credentials: 'include'
        })
        .then((response) => response.json())
        .then(response => setSenderPosts(response.filteredPosts))
        .catch(err => console.log(err));
     }
    
// abstracting individual countries
const countryList = Object.keys(countries).map(key => ({
    name: key
 }));
 
 // shows origin cities dropdown wrt country
 function handleOriginCountrySelect(e) {
    const countrySel = e.target.value;
    const citiesSel = countrySel !== "" ? countries[countrySel] : "";
    setOriginCountry(countrySel);
    setOriginCities(citiesSel);
    setOriginCity("");
 }
 
 // selecting origin city
 function handleOriginCitySelect(e) {
    const citiesSel = e.target.value;
    setOriginCity(citiesSel);
 }
 
 // shows destination cities dropdown wrt country
 function handleDestinationCountrySelect(e) {
    const countrySel = e.target.value;
    const citiesSel = countrySel !== "" ? countries[countrySel] : "";
    setDestinationCountry(countrySel);
    setDestinationCities(citiesSel);
    setDestinationCity("");
 }
 
 // selecting destination city
 function handleDestinationCitySelect(e) {
    const citiesSel = e.target.value;
    setDestinationCity(citiesSel);
 }
    return (
        <div>
            <Form className='form-post' onSubmit ={handleSubmit}>
            <div className='heading-carrier'>
            <span className='heading-filter'>Filters</span>
            </div>
                <div className='colum-o1'>
                <div className='filter-column'>
                <Form.Group className="filter-mode" controlId="byExpiresOn">
                    <Form.Label>Send By:</Form.Label>
                    <input className='input-form' value= {expiresOn} type="date" name="expiresOn" placeholder="select expiry date" onChange={ e => setExpiresOn(e.target.value)}></input>
                </Form.Group>
                <Form.Group className="filter-mode" controlId="byWeight">
                    <Form.Label>Weight:</Form.Label>
                    <input className='input-form' value={weight} type="number"  min="0" placeholder="select weight" name="weight" onChange={e=>setWeight(e.target.value)}></input>
                </Form.Group>
                </div>
                <div className='colum-2'>
                    <div className='city-carrier'>
                <Form.Group>
                    <Form.Label className='cityandcountry'>Origin City</Form.Label>
                    <select className='departure'
                        name="Countries"
                        onChange={e => handleOriginCountrySelect(e)}
                        value={originCountry}
                    >
                        <option value="" disabled>select origin country</option>
                        {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
                    </select>
                    <select className='departure'
                        name="Cities"
                        onChange={e => handleOriginCitySelect(e)}
                        value={originCity}
                    >
                        <option value="" disabled>select origin city</option>
                        {originCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
                    </select>
                </Form.Group>
                <Form.Group>
                    <Form.Label className='cityandcountry'>Destination City</Form.Label>
                    <select className='departure'
                        name="Countries"
                        onChange={e => handleDestinationCountrySelect(e)}
                        value={destinationCountry}
                        >
                        <option value="" disabled>select destination country</option>
                        {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
                    </select>
                    <select className='departure'
                        name="Cities"
                        onChange={e => handleDestinationCitySelect(e)}
                        value={destinationCity}
                        >
                        <option value="" disabled>select destination city</option>
                        {destinationCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
                    </select>
                </Form.Group>
                </div>
                </div>
                
                <Button className='reset' variant="dark" onClick={handleSearchReset}>Reset</Button>
                <Button className='search' variant="primary" type="submit">Search</Button>
                </div>
            </Form>
            
            <div className='heading-carrier'>
            <span className='heading-filter'>Sort</span>
            </div>
           <div className='section-02'>
           
            <div className='sort-by'>
                <button className='sortSelection' onClick={handleRecentSort}>recent(default)</button>
                <button className='sortSelection' onClick={handleWeightSort}>by weight</button>
                <button className='sortSelection' onClick={handleExpiryDateSort}>by expiry date</button>
                <button className='sortSelection' onClick={handleOriginCitySort}>by origin city</button>
                <button className='sortSelection' onClick={handleDestinationCitySort}>by destination city</button>
                </div>
            </div>
            
            <Card.Text className='heading-recently-sort-by'>Sorted By {sortBy}</Card.Text>
            <CardGroup>
                {currentPostsSender.map((post) => { 
                return <div className='nothing'><Card className ='card-carrier' key ={post._id}>
                        <Card.Body>
                        <Card.Title>Posted by <span className='date'>{post.createdBy}</span></Card.Title>
                        <Card.Text>
                            <div><span className='italic'>{post.createdBy}</span> wants to send <span className='bold'><br></br>{post.weight}</span>kg(s) <br></br>stuff from <span className='bold'>{post.originCity}, {post.originCountry}</span><br></br> to <span className='bold'>{post.destinationCity}, {post.destinationCountry}</span><br></br> before <span className='italic'>{post.expiresOn.slice(0,10)}</span></div>
                        </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <span className="text-muted">Posted On {post.createdAt.slice(0,10)}</span>
                            {/* <div><DetailModal post={post} socket={socket}/></div> */}
                            <div><DetailModal post={post} setIsChatting={setIsChatting} setPostOwnerSocketId={setPostOwnerSocketId} postOwnerSocketId={postOwnerSocketId}/></div>
                        </Card.Footer>
                    </Card>
                    </div>
                })}
               
            </CardGroup>
            
            {isChatting && <Chat socket={socket} setIsChatting={setIsChatting} postOwnerSocketId={postOwnerSocketId} />}
        </div>
    )
}
