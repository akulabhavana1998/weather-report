import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export default function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currAct, setCurrAct] = useState('home');

    useEffect(() => {
        setCurrAct(location.pathname)
    }, [])

    return (
        <div className="left-menu">
            <div
                className={currAct.match('home') ? 'side-btn active1' : "side-btn"}
                onClick={() => {setCurrAct('home'); navigate("/home")}}
            >
                Home
            </div>
            <div
                className={currAct.match('cities') ? 'side-btn active1' : "side-btn"}
                onClick={() => {setCurrAct('cities'); navigate("/cities")}}
            >
                Cities
            </div>
        </div>
    )
}