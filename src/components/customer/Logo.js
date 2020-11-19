import React, { Component } from 'react'
import { Image } from 'react-bootstrap'
import './admin.css';
import logo from './logo.png'

class Logo extends Component {

    render() {
        return(
            <div>
                 <div className="logoStyle" >
                    <Image   src= {logo} alt="pic" fluid/>
                </div>
            </div>
            )
    }
}
    
export default Logo;







