import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class WasherOption extends Component {

    render() {
        return(
            <div>
                 <div class="sidebar-fixed position-fixed">
                    <a class="logo-wrapper waves-effect">
                    <h4>Washer</h4>
                    <h5>Hi, {localStorage.getItem("userId")}</h5>
                    </a>
                <div class="list-group list-group-flush">
                 <ul>
                <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/washer/profile">Profile</Link></li>
                <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/washer/bookingHistory">Order</Link></li>
                <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/logout">Logout</Link></li>
                </ul>
                </div>
            </div>
            </div>
            )
    }
}
    
export default WasherOption;