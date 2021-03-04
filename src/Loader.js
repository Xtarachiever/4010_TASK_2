import React from 'react';
import Loader from "react-loader-spinner";
import './App.css';

function Poader() {
    return(
        <div className="loading">
            <Loader type="Puff" color="#00BFFF" height={50} width={50} timeout={3000}/>
        </div>
    )
}
export default Poader;