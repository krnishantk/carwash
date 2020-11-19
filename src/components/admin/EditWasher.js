import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import Logo from './Logo'
import AdminOption from './AdminOption'



class EditWasher extends Component {
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
            city:'',
            isActive:null,
        }

    }

    onRadioChange = (e) => {
        console.log(e.target.checked)
        this.setState({[e.target.name]: e.target.checked})
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    componentDidMount(){
        const editUserId = (this.props.location.state).editId;
        axios
            .get('http://localhost:9091/user/'+editUserId, this.state)
            .then(response => {
                this.setState({
                    userId: response.data.data.userId.userId,
                    firstName: response.data.data.userId.firstName,
                    lastName: response.data.data.userId.lastName,
                    email: response.data.data.userId.email,
                    phone: response.data.data.userId.phone,
                    city: response.data.data.userId.city,
                    isActive: response.data.data.userId.isActive,

                })
            })
            .catch(error => {
                console.log(error)
            })
        }

        _handleRadio(event) {
            const isActive = event.currentTarget.value === 'true' ? true: false;
            console.log('handle', isActive);
            this.setState({ isActive });
        }

        submitHandler = e => {
            e.preventDefault()
            axios
                .put('http://localhost:9091/user', this.state)
                .then(response => {  
                   alert(response.data.msg);
                   if(response.status === 200)
                    this.setState({ updated: true });  
                   
                })
        }
    


    render() {

        if (this.state.updated) {
            return <Redirect to ="/admin/user" />;
        }

        if(this.state.loggedIn === false){
            return <Redirect to ="/" />
        }
        const { firstName, lastName, email, phone, userId, city } = this.state

        return(
            <div>
                 <AdminOption />
               <Logo />

        <div className="adminAddUser"> 
        <Page title="Edit User">
        <Helmet>
          <title>Edit User</title>
        </Helmet>
                <form onSubmit={this.submitHandler}>
                    <br></br>
                    <table>
                        <tr>
                            <td>User Id </td>
                            <td className="adminAddUserTable">:</td>
                            <td><label name="userId">{userId}</label></td>
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

export default EditWasher