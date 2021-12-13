import { Form, Button } from "react-bootstrap";
import {useState} from 'react';
import serverURL from "../../configVars";
import countries from '../../data/listOfCountriesAndCities.json';

// states
const EditForm = ({post, handleClose, handleEdit}) => {
    console.log(post)
    const [departureCountry, setDepartureCountry] = useState(post.departureCountry);
    const [departureCity, setDepartureCity] = useState(post.departureCity);
    const [arrivalCountry, setArrivalCountry] = useState(post.arrivalCountry);
    const [arrivalCity, setArrivalCity] = useState(post.arrivalCity);
    const [departureDate, setDepartureDate] = useState(post.departureDate);
    const [arrivalDate, setArrivalDate] = useState(post.arrivalDate);
    const [weight, setWeight] = useState(post.weight);
    const [volume, setVolume] = useState(post.volume);
    const [ratesPerKg, setRatesPerKg] = useState(post.ratesPerKg);
    const [comments, setComments] = useState(post.comments);
    const [departureCities, setDepartureCities] = useState([]);
    const [arrivalCities, setArrivalCities] = useState([])
// abstracting individual countries
const countryList = Object.keys(countries).map(key => ({
   name: key
}));

// shows origin cities dropdown wrt country
function handleDepartureCountrySelect(e) {
   const countrySel = e.target.value;
   const citiesSel = countrySel !== "" ? countries[countrySel] : "";
   setDepartureCountry(countrySel);
   setDepartureCities(citiesSel);
   setDepartureCity("");
}

// selecting origin city
function handleDepartureCitySelect(e) {
   const citiesSel = e.target.value;
   setDepartureCity(citiesSel);
}

// shows destination cities dropdown wrt country
function handleArrivalCountrySelect(e) {
   const countrySel = e.target.value;
   const citiesSel = countrySel !== "" ? countries[countrySel] : "";
   setArrivalCountry(countrySel);
   setArrivalCities(citiesSel);
   setArrivalCity("");
}

// selecting destination city
function handleArrivalCitySelect(e) {
   const citiesSel = e.target.value;
   setArrivalCity(citiesSel);
}

// fetching data on submit
const handleSubmit = (e) => {
   e.preventDefault();
   fetch(serverURL + "carrier/update",
   {
   mode: 'cors',
   method: 'POST',
   headers: { 'Content-Type':'application/json' },
   body: JSON.stringify({ _id:post._id, departureCountry, departureCity, arrivalCountry, arrivalCity, departureDate, arrivalDate, weight, volume, ratesPerKg, comments}),
   credentials: 'include'
   })
   .then((response) => response.json())
   .then(response => {console.log(response);
      handleEdit(response.editedCarrierPost);
      console.log(handleClose)
      handleClose();
   })
   .catch(err => console.log(err));
}


return (
   <Form onSubmit={handleSubmit}>
      <Form.Group>
         <div>
            <label>Departure Country: <span className="mandatory"> *</span></label>
            <select
               name="Countries"
               onChange={e => handleDepartureCountrySelect(e)}
               value={departureCountry}
               required
            >
               <option value="" disabled>select departure country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         </div>
         <div>
            <label>Departure City: <span className="mandatory"> *</span></label>
            <select
               name="Cities"
               onChange={e => handleDepartureCitySelect(e)}
               value={departureCity}
               required
            >
               <option value="" disabled>select departure city</option>
               {departureCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Arrival Country: <span className="mandatory"> *</span></label>
            <select
               name="Countries"
               onChange={e => handleArrivalCountrySelect(e)}
               value={arrivalCountry}
               required
               >
               <option value="" disabled>select arrival country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         </div>
         <div>
            <label>Arrival City: <span className="mandatory"> *</span></label>
            <select
                  name="Cities"
                  onChange={e => handleArrivalCitySelect(e)}
                  value={arrivalCity}
                  required
               >
               <option value="" disabled>select arrival city</option>
               {arrivalCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
      <div>
            <label>Departure Date: <span className="mandatory"> *</span></label>
            <Form.Control
               type="date"
               placeholder="departure date"
               name="departure"
               value={departureDate}
               onChange = { (e) => setDepartureDate(e.target.value)}
               required
            />
         </div>
      </Form.Group>
      <Form.Group>
      <div>
            <label>Arrival Date: <span className="mandatory"> *</span></label>
            <Form.Control
               type="date"
               placeholder="arrival date"
               name="arrival"
               value={arrivalDate}
               onChange = { (e) => setArrivalDate(e.target.value)}
               required
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Weight: <span className="mandatory"> *</span></label>
            <Form.Control
               type="number"
               placeholder="weight"
               name="weight"
               value={weight}
               onChange = { (e) => setWeight(e.target.value)}
               required
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Volume: <span className="mandatory"> *</span></label>
            <Form.Control
               type="text"
               placeholder="volume"
               name="vloume"
               value={volume}
               onChange = { (e) => setVolume(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Rates Per Kg: </label>
            <Form.Control
               type="text"
               placeholder="estimated rates per kg"
               name="ratesPerKg"
               value={ratesPerKg}
               onChange = { (e) => setRatesPerKg(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Comments: </label>
            <Form.Control
               as="textarea"
               placeholder="any comments...."
               rows={3}
               name="comments"
               value={comments}
               onChange = { (e) => setComments(e.target.value)}
            />
         </div>
      </Form.Group>
      <Button variant="success" type="submit">Edit</Button>
   </Form>
   )
}

export default EditForm;