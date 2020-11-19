import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import Logo from './Logo'
import AdminOption from './AdminOption'


class AddWasher extends Component {
    constructor(props) {
        super(props)
        const token = localStorage.getItem("token")

        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            loggedIn,
            firstName:'',
            lastName:'',
            email:'',
            phone:'',
            userId:'',
            password:'12345',
            role:'Washer',
            city:''
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = e => {
        e.preventDefault()
        console.log(this.state)
        axios
            .post('http://localhost:9091/user', this.state)
            .then( response => {
                console.log(response.status)
                alert(response.data.msg)
                if (response.status == 200) {
                        this.setState({ success: true });
                } 
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {

        if(this.state.loggedIn === false){
            return <Redirect to ="/" />
        }
        const loginUserId = localStorage.getItem("userId");
        const { firstName, lastName, email, phone, userId, password, role, city } = this.state

        return(
            <div>
                <AdminOption />
               <Logo />

            <div className="adminAddUser"> 
            <Page title="Add New Washer">
                <Helmet>
                <title>Add New Washer</title>
                </Helmet>
                <form onSubmit={this.submitHandler}>
                    <br></br>
                    <table>
                        <tr>
                            <td>User Id </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" name="userId" placeholder="UserId" value={userId} onChange={this.changeHandler} /></td>
                        </tr>
                        <tr>
                            <td>First Name </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" classname="input-form" name="firstName" placeholder="First Name" value={firstName} onChange={this.changeHandler} /></td>
                        </tr>
                        <tr>
                            <td>Last Name </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" classname="input-form" name="lastName" placeholder="Last Name" value={lastName} onChange={this.changeHandler} /></td>
                        </tr>
                        <tr>
                            <td>Email Id </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" name="email" placeholder="Email Id" value={email} onChange={this.changeHandler} /></td>
                        </tr>
                        <tr>
                            <td>Phone </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" name="phone" placeholder="Phone Number" value={phone} onChange={this.changeHandler} />   </td>
                        </tr>
                        <tr>
                            <td>City </td>
                            <td className="adminAddUserTable">:</td>
                            <td><input type="text" required="required" name="city" placeholder="City Name" value={city} onChange={this.changeHandler} /></td>
                        </tr>
                    </table>
                    <br></br>
                    <div>
                        <button type="submit" className="login login-submit">Submit</button>
                    </div>
                    <br></br>
                    <div>
                        <Link to="/admin/user"> Back</Link>
                    </div>
                </form>
            </Page>
            </div>
            </div>
        )
    }
}

export default AddWasher