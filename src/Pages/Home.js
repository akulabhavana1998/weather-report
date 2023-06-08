import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WeatherService from '../Services/WeatherService';
import StarIcon from '@mui/icons-material/Star';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const Home = () => {

    const [favourites, setFavourites] = useState([]);
    const [reloadFav, setReloadFav] = useState(false);
    let selector = useSelector(val => val.favouriteReducer) || [];
    const [favData, setFavData] = useState([]);
    const [modal, setModal] = useState(false);
    const [cities, setCities] = useState(JSON.parse(localStorage.getItem('cities')) || []);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const [currDropCity, setCurrDropCity] = useState('');

    const getWeathers = async () => {
        let arr = [];
        for (let fav of favourites) {
            if (fav) {
                let data = await WeatherService.getWeather(fav);
                let tempObj = {
                    name: fav,
                    temp_c: data.current.temp_c,
                    temp_f: data.current.temp_f,
                    humidity: data.current.humidity,
                    pressure_mb: data.current.pressure_mb
                };
                arr = [...arr, tempObj];
            }
        }
        setFavData(arr);
    }


    const setToFav = (city) => {
        dispatch({type: 'addFav', city});
        setReloadFav(true);
    }

    useEffect(() => {
        setFavourites(selector);
    }, [])

    useEffect(() => {
        if (reloadFav) {
            setFavourites(selector);
            setReloadFav(false);
        }
    }, [reloadFav]);
    
    useEffect(() => {
        getWeathers();
    }, [favourites])

    return (
        <div className='home-container'>
            <div className='title-container'>
                <h2 className='fav-title'>My Favourite Cities</h2>
                <span className='add-btn' onClick={() => setModal(true)}>Add New City</span>
            </div>
            <div className="grid-container">
                {favData.map((data, i) => (
                    <div key={i}>
                    <div className="card">
                        <div className='card-container'>
                            <div className='icon-div'>
                                <StarIcon style={{float: 'right'}} fontSize='large'></StarIcon>
                            </div>
                            <div>
                                Name: {data.name}
                            </div>
                            <div>
                                Temperature in °C: {data.temp_c}
                            </div>
                            <div>
                                Temperature in °F: {data.temp_f}
                            </div>
                            <div>
                                Humidity: {data.humidity}
                            </div>
                            <div>
                                Pressure in mb: {data.pressure_mb}
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
            <Modal
                size='lg'
                isOpen={modal}
                toggle={() => setModal(!modal)}
            >
                <ModalHeader
                    toggle={() => setModal(!modal)}>
                    Add a favourite city
                </ModalHeader>
                <ModalBody>
                    <div>
                        <label htmlFor='cities'>Select City</label>
                        {
                            <select style={{marginLeft: '10px'}} name='cities'
                                onChange={(event) => setCurrDropCity(event.target.value)}>
                                <option value={''}>--Select--</option>
                                {(cities || []).filter(x => !favourites.includes(x)).map((city, i) => (
                                    <option value={city} key={i}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        }
                        <button className='add-btn' onClick={() => {
                            if (currDropCity) {
                                setToFav(currDropCity)
                            }
                            }}>Add</button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
};
export default Home;