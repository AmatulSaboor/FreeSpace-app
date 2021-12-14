import {Form, Button} from "react-bootstrap";
import {useState} from 'react';
import serverURL from "../../configVars";
import countries from '../../data/listOfCountriesAndCities.json';
import '../mySenderPosts/EditSender.css'

// states
const AddForm = ({handleClose, handleCreate}) => {
const [originCountry, setOriginCountry] = useState('');
const [originCity, setOriginCity] = useState('');
const [destinationCountry, setDestinationCountry] = useState('');
const [destinationCity, setDestinationCity] = useState('');
const [expiresOn, setExpiresOn] = useState();
const [weight, setWeight] = useState();
const [volume, setVolume] = useState();
const [willingToPayPerKg, setWillingToPayPerKg] = useState();
const [items, setItems] = useState('');
const [comments, setComments] = useState();
const [originCities, setOriginCities] = useState([]);
const [destinationCities, setDestinationCities] = useState([]);
const [validationError, setValidationError] = useState(null)


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

// fetching data on submit
const handleSubmit = (e) => {
   e.preventDefault();
   if(weight <= 0) {
      setValidationError(`Weight can't be less than or equal to zero kg`)
      return;
   }
   if(willingToPayPerKg <= 0) {
      setValidationError(`Willing to pay per kg can't be set less than or equal to zero kg`)
      return;
   }
   if(weight > 30) {
      setValidationError(`Weight can't be greater than 30kgs`)
      return;
   }
   const today = new Date();
   const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
   if (expiresOn < date) {
      setValidationError(`Expires on can't be before the current date`)
      return;
   }
   fetch(serverURL + "sender/create",
   {
   mode: 'cors',
   method: 'POST',
   headers: { 'Content-Type':'application/json' },
   body: JSON.stringify({ originCountry, originCity, destinationCountry, destinationCity, expiresOn, weight, volume, willingToPayPerKg, items, comments}),
   credentials: 'include'
   })
   .then((response) => response.json())
   .then(response => {console.log(response);
      handleCreate(response.senderPost);
      handleClose();
   })
   .catch(err => console.log(err));
}


return (
   <Form onSubmit={handleSubmit}>
      {validationError && <div className='validationError m-4'>{validationError}</div>}
      <Form.Group>
         <div>
            <label className="form-label">Origin Country: <span className="mandatory"> *</span></label>
            <select
             className="select-form"
               name="Countries"
               onChange={e => handleOriginCountrySelect(e)}
               value={originCountry}
               required
            >
               <option value="" disabled>select origin country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         </div>
         <div>
            <label className="form-label">Origin City: <span className="mandatory"> *</span></label>
            <select
            className="select-form"
               name="Cities"
               onChange={e => handleOriginCitySelect(e)}
               value={originCity}
               required
            >
               <option value="" disabled>select origin city</option>
               {originCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Destination Country: <span className="mandatory"> *</span></label>
            <select
            className="select-form"
               name="Countries"
               onChange={e => handleDestinationCountrySelect(e)}
               value={destinationCountry}
               required
               >
               <option value="" disabled>select destination country</option>
               {countryList.map((country, key) => (<option key={key} value={country.name}>{country.name}</option>))}
            </select>
         <div>
         </div>
            <label className="form-label">Destination City: <span className="mandatory"> *</span></label>
            <select
             className="select-form"
                  name="Cities"
                  onChange={e => handleDestinationCitySelect(e)}
                  value={destinationCity}
                  required
               >
               <option value="" disabled>select destination city</option>
               {destinationCities.map((city, key) => (<option key={key} value={city}>{city}</option>))}
            </select>
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Expires On: <span className="mandatory"> *</span></label>
            <Form.Control
               type="date"
               className="select-form"
               placeholder="expires on date"
               name="expiresOn"
               onChange = { (e) => setExpiresOn(e.target.value)}
               required
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Weight: <span className="mandatory"> *</span></label>
            <Form.Control
               type="number"
               className="select-form"
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
            <label className="form-label">Volume: <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="text"
               placeholder="volume"
               name="vloume"
               onChange = { (e) => setVolume(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Willing to Pay (per kg): <span className="mandatory"> *</span></label>
            <Form.Control
            className="select-form"
               type="text"
               placeholder="estimated amount to pay per kg"
               name="willingToPayPerKg"
               onChange = { (e) => setWillingToPayPerKg(e.target.value)}
               min="0"
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Items: </label>
            <Form.Control
            className="select-form"
               as="textarea"
               placeholder="list the items you want to send...."
               rows={2}
               name="items"
               onChange = { (e) => setItems(e.target.value)}
            />
         </div>
      </Form.Group>
      <Form.Group>
         <div>
            <label className="form-label">Comments: </label>
            <Form.Control
               as="textarea"className="select-form"
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