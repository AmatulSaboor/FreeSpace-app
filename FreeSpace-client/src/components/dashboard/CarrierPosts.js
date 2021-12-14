import React, {useState} from 'react'
import { CardGroup, Card, Form, Button} from 'react-bootstrap';
import DetailModal from './CarrierPostDetailModal';
// import Chat from '../chat/Chat';
import countries from '../../data/listOfCountriesAndCities.json';
import serverURL from '../../configVars';
import '../dashboard/Posts.css'

export const CarrierPosts = ({socket, carrierPosts, currentPostsCarrier, setCarrierPosts}) => {
    console.log(currentPostsCarrier)
    const [weight, setWeight] = useState(0)
    const [departureDate, setDepartureDate] = useState('')
    const [arrivalDate, setArrivalDate] = useState('')
    const [departureCountry, setDepartureCountry] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureCities, setDepartureCities] = useState([]);
    const [arrivalCities, setArrivalCities] = useState([])
    const [postOwnerSocketId, setPostOwnerSocketId] = useState()
    const [isChatting, setIsChatting] = useState(false)
    const [sortBy, setSortBy] = useState('Recent(default)')
    console.log(isChatting)
    console.log(socket)
    function sort(sort, sortName){
        const copySorted = [...carrierPosts];
        copySorted.sort((a, b) => {
            if (a[sort] > b[sort]) return 1;
            else if (a[sort] < b[sort]) return -1;
            else return 0;
        })
        setCarrierPosts(copySorted)
        setSortBy(sortName)
    }
    const handleRecentSort = () => sort('createdAt', 'Recent(default)')
    const handleWeightSort = () => sort('weight', 'Weight')
    const handleDepartureDateSort = () => sort('departureDate', 'Departure Date')
    const handleArrivalDateSort = () => sort('arrivalDate', 'Arrival Date')
    const handleDepartureCitySort = () => sort('departureCity', 'Departure City')
    const handleArrivalCitySort = () => sort('arrivalCity', 'Arrival City')
    const handleSearchReset = () => {
        setWeight(0)
        setDepartureCity('')
        setArrivalCity('')
        setArrivalCities([])
        setDepartureCities([])
        setDepartureCountry('')
        setArrivalCountry('')
        setDepartureDate('');
        setArrivalDate('');
    }
    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(serverURL + "carrier/search",
        {
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({weight, arrivalCity, departureCity, arrivalDate, departureDate}),
            credentials: 'include'
        })
        .then((response) => response.json())
        .then(response => setCarrierPosts(response.filteredPosts))
        .catch(err => console.log(err));
     }
    
// abstracting individual countries
const countryList = Object.keys(countries).map(key => ({
    name: key
 }));
 
 // shows departure cities dropdown wrt country
 function handleDepartureCountrySelect(e) {
    const countrySel = e.target.value;
    const citiesSel = countrySel !== "" ? countries[countrySel] : "";
    setDepartureCountry(countrySel);
    setDepartureCities(citiesSel);
    setDepartureCity("");
 }
 
 // selecting departure city
 function handleDepartureCitySelect(e) {
    const citiesSel = e.target.value;
    setDepartureCity(citiesSel);
 }
 
 // shows arrival cities dropdown wrt country
 function handleArrivalCountrySelect(e) {
    const countrySel = e.target.value;
    const citiesSel = countrySel !== "" ? countries[countrySel] : "";
    setArrivalCountry(countrySel);
    setArrivalCities(citiesSel);
    setArrivalCity("");
 }
 
 // selecting arrival city
 function handleArrivalCitySelect(e) {
    const citiesSel = e.target.value;
    setArrivalCity(citiesSel);
 }
    return (
        <div>
            <Form className='form-post' onSubmit={handleSubmit}>
                <div className='heading-carrier'>
            <span className='heading-filter'>Filters</span>
            </div>
            <div className='colum-o1'>
                <div className='car-padding'>
                
                <div className='filter-column'>
                <Form.Group className="filter-mode" controlId="byExpiresOn">
                    <div>
                    <Form.Label>Depart After:</Form.Label>
                    </div>
                    <div>
                    <input className='input-form' value= {departureDate} type="date" name="departureDate" placeholder="select departure date" onChange={ e => setDepartureDate(e.target.value)}></input>
                    </div>
                </Form.Group>
                <Form.Group className="filter-mode" controlId="byExpiresOn">
                    <Form.Label>Arrive Before:</Form.Label>
                    <input className='input-form'value= {arrivalDate} type="date" name="arrivalDate" placeholder="select arrival date" onChange={ e => setArrivalDate(e.target.value)}></input>
                </Form.Group>
                <Form.Group className="filter-mode" controlId="byWeight">
                    <Form.Label>Weight:</Form.Label>
                    <input className='input-form' value={weight} type="number" min="0" placeholder="select weight" name="weight" onChange={e=>setWeight(e.target.value)}></input>
                </Form.Group>
                
                
                   
                <Form.Group>
                   
                    <Form.Label className='cityandcountry'>Departure City</Form.Label>
                    <div class="two-selection">
                    <select className='departure'
                        name="Countries"
                        onChange={e => handleDepartureCountrySelect(e)}
                        value={departureCountry}
                    >
                        <option className='departure' value="" disabled>Select departure country</option>
                        {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
                    </select>
                    <select className='departure'
                        name="Cities"
                        onChange={e => handleDepartureCitySelect(e)}
                        value={departureCity}
                    >
                        <option  className='departure' value="" disabled>select departure city</option>
                        {departureCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
                    </select>
                    </div> 
                </Form.Group>
                
                <Form.Group className='arrival-post'>
                
                    <Form.Label>Arrival City</Form.Label>
                    <div class="two-selection">
                    <select className='departure'
                        name="Countries"
                        onChange={e => handleArrivalCountrySelect(e)}
                        value={arrivalCountry}
                        >
                        <option  className='departure' value="" disabled>select arrival country</option>
                        {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
                    </select>
                    <select className='departure'
                        name="Cities"
                        onChange={e => handleArrivalCitySelect(e)}
                        value={arrivalCity}
                        >
                        <option  className='departure' value="" disabled>select arrival city</option>
                        {arrivalCities.map((city, i) => (<option key={i} value={city}>{city}</option>))}
                    </select>
                    
                 </div>   
                </Form.Group>
                </div> 
                
                
                <Button className='reset' variant="dark" onClick={handleSearchReset}>Reset</Button>
                <Button  className='Search'variant="primary"  type="submit">Search</Button>
                </div>
                </div>
            
            </Form>
            <div className='heading-carrier'>
            <span className='heading-filter'>Sort</span>
            </div>
           <div className='section-02'>
           
            <div className='sort-by'>
               
                <button  className='sortSelection' onClick={handleRecentSort}>recent(default)</button>
                <button className='sortSelection' onClick={handleWeightSort}>by weight</button>
                <button className='sortSelection' onClick={handleDepartureDateSort}>by departure date</button>
                <button className='sortSelection' onClick={handleArrivalDateSort}>by arrival date</button>
                <button className='sortSelection' onClick={handleDepartureCitySort}>by departure city</button>
                <button className='sortSelection' onClick={handleArrivalCitySort}>by arrival city</button>
            </div>
            </div>
            <Card.Text className='heading-recently-sort-by'>Sorted By {sortBy}</Card.Text>
            {currentPostsCarrier && <CardGroup>
                {currentPostsCarrier.map((post) => { 
                return <div className='nothing'><Card className ='card-carrier' key ={post._id}>
                    
                        <Card.Body>
                        <Card.Title>Posted by <span className='date'>{post.createdBy}</span></Card.Title>
                        <Card.Text>
                            <div><span className='italic'>{post.createdBy}</span> is departuring on <span className='italic'>{post.departureDate.slice(0,10)}</span>
                            <br></br> from <span className='bold'>{post.departureCity}, {post.departureCountry}</span> <br></br>and arriving <span className='bold'>{post.arrivalCity}, {post.arrivalCountry}</span> 
                            <br></br>on <span className='italic'> {post.arrivalDate.slice(0,10)}</span><br></br> and can carry <span className='bold'>{post.weight}</span> kg(s)</div>
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
            </CardGroup>}
            {/* {isChatting && <Chat socket={socket} setIsChatting={setIsChatting} postOwnerSocketId={postOwnerSocketId} />} */}
        </div>
    )
}
