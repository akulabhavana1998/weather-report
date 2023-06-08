import React from 'react';
import Home from './Pages/Home';
import Cities from './Pages/Cities';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddcitymodalPage from './Pages/Add city modal Page';
import SideNav from './Components/SideNav';
const App = () => {
  return (

    <BrowserRouter>
      <SideNav></SideNav>
      <div className="bg-container">
        <center>
          <Routes>
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/cities' element={<Cities />} />
          </Routes>
        </center>
      </div>
    </BrowserRouter>
  )
}
export default App;
