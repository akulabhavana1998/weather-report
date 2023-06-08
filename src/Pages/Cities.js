import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import weatherService from '../Services/WeatherService';

function Cities() {
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState("");
    const [currWeather, setCurrWeather] = useState({});
    const [favorite, setFavorite] = useState(null);
    const[fav, setFav] = useState([]);
    const [currCity,setCurrCity] = useState('');
    const fav1 = useSelector(state => state.favouriteReducer);
    const dispatch = useDispatch();
    const [token, setToken] = useState('');
    const [states, setStates] = useState([]);
    const [stateCities, setStateCities] = useState([]);
    const [cities, setCities] = useState([]);

    async function getWeatherData(city) {
        setCurrCity(city);
        setFavorite(fav1.includes(city));
        try {
            let weather = await weatherService.getWeather(city);
            setCurrWeather(weather);
        } catch (err) {
            alert('Unable to get the weather data for the city ' + city);
        }
    }
    const CityCard = ({city}) => {
        return (
            <div onClick={() => getWeatherData(city)} className="card">
                <span className="text">{city}</span>
            </div>
        )
    }

    const getStates = async () => {
        try {
            let token = await weatherService.getAuthToken('nithish.fourns@gmail.com', 'aWqx8_iJkM9eP5JULCXM8Te-A9BKoW1a6SA8Um9PNPX0Q1xLMhaGzBhyhhd-xJQBuGk');
            token = token && token.auth_token;
            if (token) {
                setToken(token);
                let states = await weatherService.getStates(token);
                states = states.map(x => x.state_name);
                states.unshift('');
                setStates(states);
            }
        } catch(err) {
            console.error(err);
        }
    }

    const getCities = async (state) => {
        try {
            const sCities = await weatherService.getCities(state, token);
            setStateCities(sCities);
        } catch (err) {
            console.error(err);
        }

    }

    const weatherFields = [
        {
            field: 'temp_c',
            label: 'Temperature in °C'
        },
        {
            field: 'temp_f',
            label: 'Temperature in °F'
        },
        {
            field: 'humidity',
            label: 'Humidity'
        },
        {
            field: 'pressure_mb',
            label: 'Pressure in mb'
        }
    ];

    const cityFields = [
        {
            field: 'lat',
            label: 'Latitude'
        },
        {
            field: 'lon',
            label: 'Longitude'
        },
        {
            field: 'region',
            label: 'State'
        },
        {
            field: 'country',
            label: 'Country'
        }
    ];

    const addCity = (city) => {
        if(cities.includes(city)){
            alert('City already added');
            return;
        }
        let new_cities = [...cities,city]
        setCities([...cities,city]);
        localStorage.setItem('cities',JSON.stringify(new_cities));
        alert('City Added')
    }

    const getMatch = (item) => {
        let regex = new RegExp(`${search}`, 'i');
        return regex.test(item.city_name);
    }
    useEffect(() => {
        setFav(fav1);
        getStates();
        let localCities = JSON.parse(localStorage.getItem('cities')) || [];
        setCities([...localCities]);
    }, []);

    useEffect(()=>{
        if(favorite !== null){
            dispatch({type: favorite ? 'addFav' : 'removeFav', city: currCity || ''});
        }
    },[favorite]);

    useEffect(() => {
        if (modal) {
            setStateCities([]);
            setSearch('');
        }
    }, [modal]);

    const handleStarClick = () =>{
        if (currCity) {
            setFavorite(!favorite);
        }
    }
    return (
        <div className='city-page'>
            <div className='list-card cities-list'>
                <div style={{alignItems: 'center', justifyContent: 'space-between', display: 'flex'}}>
                    <span style={{marginLeft: '5px'}}>Cities</span>
                    <button className='btn'
                        style={{
                            backgroundColor: "ActiveBorder",
                            color: "white",
                            justifyContent: 'center',
                            float: 'right',
                            marginTop: '5px',
                            marginRight: '5px'
                        }}
                        onClick={() => setModal(true)}>
                        +
                    </button>
                </div>
                <div className='divider'></div>
                {
                    cities.length ? cities.map((city, index) => {
                        return <CityCard key={index} city={city}></CityCard>
                    }) : (<> Please add city</>)
                }
            </div>
            <div className='list-card'>
                <div style={{alignItems: 'center', justifyContent: 'space-between', display: 'flex'}}>
                    <span style={{marginLeft: '5px'}}>{currWeather?.location?.name || 'City'}</span>
                    {
                        favorite ? 
                        <StarIcon onClick={() => handleStarClick()} fontSize='large'></StarIcon> :
                    <StarBorderIcon onClick={() => handleStarClick()} fontSize='large'></StarBorderIcon>
                    }   

                </div>
                <div className='divider'></div>
                {
                    Object.keys(currWeather).length ?
                    <>
                        <span className='text'
                            style={{marginTop: '10px'}}
                        >Weather Details</span>
                        <table>
                            <tbody>
                                {weatherFields.map((f, i) => 
                                    (
                                        <tr key={i}>
                                            <td>{f.label}</td>
                                            <td>{currWeather?.current[f.field]}</td>
                                        </tr>
                                    )
                                    )}
                            </tbody>
                        </table>
                    </>
                    : <>Please select city to view the weather information.</>
                }

                {
                    Object.keys(currWeather).length ?
                    <>
                    <span className='text'
                        style={{marginTop: '10px'}}
                    >Location Details</span>
                    <table>
                        <tbody>
                            {cityFields.map((f, i) => 
                                (
                                    <tr key={i}>
                                        <td>{f.label}</td>
                                        <td>{currWeather?.location[f.field]}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    </>
                    : <></>
                }
            </div>
      
            <Modal
                size='lg'
                isOpen={modal}
                toggle={() => setModal(!modal)}

            >
                <ModalHeader
                    toggle={() => setModal(!modal)}>
                    Add a city
                </ModalHeader>
                <ModalBody>
                    <form>
                        <input type="text"
                            style={{padding: '10px', margin: '10px'}}
                            placeholder='Search cities' value={search} onChange={(e) => setSearch(e.target.value)} />
                        <br/>
                        <label htmlFor='states'>Select State</label>
                        {
                            <select style={{marginLeft: '10px'}} name='states'
                                onChange={(event) => getCities(event.target.value)}>
                                {(states || []).map((state, i) => (
                                    <option value={state} key={i}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        }
                        {stateCities.filter(item => getMatch(item)).slice(0,10).map((item, index) => {
                            return <div key={index} onClick={()=>addCity(item.city_name)} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
                                {item.city_name}
                            <button className='btn'
                            style={{
                                justifyContent: 'center',
                                float: 'right',
                                marginBottom:'5px',
                                marginRight: '5px'
                            }}
                        onClick={() => setModal(true)}>
                        +
                    </button>
                            </div>
                        })}


                    </form>
                </ModalBody>
            </Modal>

        </div>
    )
}
export default Cities;