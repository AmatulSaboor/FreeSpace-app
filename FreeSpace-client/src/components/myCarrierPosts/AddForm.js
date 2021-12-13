import { Form, Button } from "react-bootstrap";
import {useState} from 'react';
import countries from '../../data/listOfCountriesAndCities.json';
import serverURL from "../../configVars";

// states
const AddForm = ({handleClose, handleCreate}) => {
const [departureDate, setDepartureDate] = useState('');
const [arrivalDate, setArrivalDate] = useState('');
const [departureCountry, setDepartureCountry] = useState('');
const [departureCity, setDepartureCity] = useState('');
const [arrivalCountry, setArrivalCountry] = useState('');
const [arrivalCity, setArrivalCity] = useState('');
const [weight, setWeight] = useState();
const [volume, setVolume] = useState();
const [ratesPerKg, setRatesPerKg] = useState();
const [comments, setComments] = useState();
const [arrivalCities, setArrivalCities] = useState([]);
const [departureCities, setDepartureCities] = useState([])
const [validationError, setValidationError] = useState(null)
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
   if (departureDate > arrivalDate){
      setValidationError(`Departure date can't be eariler than arrival date`)
      return;
   }
   const today = new Date();
   const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
   if (departureDate < date) {
      setValidationError(`Departure date can't be before the current date`)
      return;
   }
   if(weight <= 0) {
      setValidationError(`Weight can't be less than or equal to zero kg`)
      return;
   }
   if(weight > 30) {
      setValidationError(`Weight can't be greater than 30kgs`)
      return;
   }
   console.log(departureDate);
   fetch(serverURL + "carrier/create",
   {
   mode: 'cors',
   method: 'POST',
   headers: { 'Content-Type':'application/json' },
   body: JSON.stringify({ departureCountry, departureCity, arrivalCountry, arrivalCity, weight, volume, ratesPerKg, arrivalDate, departureDate, comments}),
   credentials: 'include'
   })
   .then((response) => response.json())
   .then(response => {console.log(response);
      handleCreate(response.carrierPost);
      handleClose();
   })
   .catch(err => console.log(err));
}

return (
   <Form onSubmit={handleSubmit}>
      {validationError && <div className='validationError m-4'>{validationError}</div>}
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
         <div>
         </div>
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
               name="departure date"
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
               name="arrival date"
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
               onChange = { (e) => setWeight(e.target.value)}
               required
               min="0"
               max="30"
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
               onChange = { (e) => setVolume(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Rates (per kg)<span className="mandatory"> *</span>: </label>
            <Form.Control
               type="text"
               placeholder="estimated rates per kg"
               name="ratePerKg"
               onChange = { (e) => setRatesPerKg(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label>Comments: </label>
            <Form.Control
               as="textarea"
               placeholder="any comments....."
               rows={3}
               name="comments"
               onChange = { (e) => setComments(e.target.value)}
            />
         </div>
      </Form.Group>
      <Button variant="success" type="submit">Add</Button>
   </Form>
   )
}
export default AddForm;