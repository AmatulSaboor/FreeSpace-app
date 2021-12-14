import { Form, Button } from "react-bootstrap";
import {useEffect, useState} from 'react';
import serverURL from "../../configVars";
import countries from '../../data/listOfCountriesAndCities.json';

// states
const EditForm = ({post, handleClose, handleEdit}) => {
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
      const [validationError, setValidationError] = useState(null)

   // abstracting individual countries
   const countryList = Object.keys(countries).map(key => ({
      name: key
   }));

   useEffect(()=> {
      setDepartureCities(countries[post.departureCountry]);
      setArrivalCities(countries[post.arrivalCountry]);
   }, [post.departureCountry, post.arrivalCountry])

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
         {validationError && <div className='validationError m-4'>{validationError}</div>}
         <Form.Group>
            <div>
               <label className="form-label">Departure Country: <span className="mandatory"> *</span></label>
               <select
               className="select-form"
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
               <label className="form-label">Departure City: <span className="mandatory"> *</span></label>
               <select
               className="select-form"
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
               <label className="form-label">Arrival Country: <span className="mandatory"> *</span></label>
               <select
               className="select-form"
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
               <label className="form-label">Arrival City: <span className="mandatory"> *</span></label>
               <select
               className="select-form"
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
               <label className="form-label">Departure Date: <span className="mandatory"> *</span></label>
               <Form.Control
               className="select-form"
                  type="date"
                  placeholder="departure date"
                  name="departure"
                  value={new Date(departureDate).toISOString().slice(0,10)}
                  onChange = { (e) => setDepartureDate(e.target.value)}
                  required
               />
            </div>
         </Form.Group>
         <Form.Group>
         <div>
               <label className="form-label">Arrival Date: <span className="mandatory"> *</span></label>
               <Form.Control
               className="select-form"
                  type="date"
                  placeholder="arrival date"
                  name="arrival"
                  value={new Date(arrivalDate).toISOString().slice(0,10)}
                  onChange = { (e) => setArrivalDate(e.target.value)}
                  required
               />
            </div>
         </Form.Group>
         <Form.Group>
            <div>
               <label className="form-label">Weight: <span className="mandatory"> *</span></label>
               <Form.Control
               className="select-form"
                  type="number"
                  placeholder="weight"
                  name="weight"
                  value={weight}
                  onChange = { (e) => setWeight(e.target.value)}
                  required
                  min="0"
                  max="30"
               />
            </div>
         </Form.Group>
         <Form.Group>
            <div>
               <label className="form-label">Volume: <span className="mandatory"> *</span></label>
               <Form.Control
               className="select-form"
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
               <label className="form-label">Rates Per Kg: </label>
               <Form.Control
               className="select-form"
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
               <label className="form-label">Comments: </label>
               <Form.Control
               className="select-form"
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