import React, { Component } from 'react'
import './admin.css';
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import Logo from './Logo'
import CustomerOption from './CustomerOption'

class Profile extends Component {

    constructor(props) {
        super(props);
        const token = localStorage.getItem("token")

        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            loggedIn,
            tableData:{
                id:'',
                userId:'',
                email: '',
                firstName: '',
                lastName: '',
                phone:'',
                password:'',
                role:'',
                city:'',
            },
        }
      }

    componentDidMount(){
        axios
            .get('http://localhost:9091/user/'+localStorage.getItem("userId"), this.state)
            .then(response => {
                this.setState({tableData: response.data.data.userId})
            })
            .catch(error => {
                console.log(error)
            })
        }


    render() {

        if(this.state.loggedIn === false){
            return <Redirect to ="/" />
        }
        const userId = localStorage.getItem("userId");
        const { tableData } = this.state
        return(
            <div>
                <CustomerOption />
                <Logo />
    <div className="ProfileStyle">
                 <table className='ProfileTable'>
                     <tbody><h1>Profile Page</h1></tbody><br></br><br></br>
                   <h4><tr>
                       <td className='ProfileTableRow'>UserId  </td><td >:</td>
                       <td>{tableData.userId}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>FirstName  </td><td>:</td>
                       <td>{tableData.firstName}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>Lastname  </td><td>:</td>
                       <td>{tableData.lastName}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>E Mail  </td><td>:</td>
                       <td>{tableData.email}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>Phone  </td><td>:</td>
                       <td>{tableData.phone}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>Role  </td><td>:</td>
                       <td>{tableData.role}</td>
                   </tr>
                   <tr>
                       <td className='ProfileTableRow'>City  </td><td>:</td>
                       <td>{tableData.city}</td>
                   </tr></h4>
               </table>
            </div>
            </div>
        )
    }
}

export default Profile;
