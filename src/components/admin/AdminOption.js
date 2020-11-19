import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class AdminOption extends Component {

    render() {
        return(
            <div>
                 <div class="sidebar-fixed position-fixed">
                    <a class="logo-wrapper waves-effect">
                    <h4>Admin</h4>
                    <h5>Hi, {localStorage.getItem("userId")}</h5>
                    </a>
                    <div class="list-group list-group-flush">
                    <ul>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/admin/profile">Profile</Link></li>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/admin/bookingHistory">Booking History</Link></li>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/admin/user">Add Washer</Link></li>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/admin/customer">Customer List</Link></li>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/admin/carDetails">Car Types</Link></li>
                        <li class="list-group-item list-group-item-action waves-effect"><i class="fas fa-table mr-3"></i><Link to="/logout">Logout</Link></li>
                    </ul>
                    </div>
	            </div>
            </div>
            )
    }
}
    
export default AdminOption;