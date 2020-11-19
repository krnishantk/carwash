import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import logo from './logo.png';
import './login.css';

class SignUpForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            userId: '',
            password: '',
            role: 'Customer',
            city: ''
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = e => {
        e.preventDefault()
        console.log(this.state)
        axios
            .post('http://localhost:9091/user', this.state)
            .then(response => {
                console.log(response.status)
                alert(response.data.msg)
                if (response.status === 200) {
                    this.setState({ success: true });
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        if (this.state.success) {
            return <Redirect to =  "/" />;
          }
        const { firstName, lastName, email, phone, userId, password, city } = this.state
        return (
            <div>
                <h2>On Demand Car Wash Service</h2>
                <img src={logo} alt="Logo" />;
                <h4>SIGN UP</h4>
                <form onSubmit={this.submitHandler}>
                    <table class='signUpForm'>
                        <tr>
                            <td>
                                <input type="text" required="required" classname="input-form" name="firstName" placeholder="First Name" value={firstName} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                            <td>
                                <input type="text" required="required" classname="input-form" name="lastName" placeholder="Last Name" value={lastName} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                        </tr> <tr>
                            <td>
                                <input type="text" required="required" name="userId" placeholder="UserId" value={userId} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                            <td>
                                <input type="password" required="required" name="password" placeholder="Password" value={password} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                        </tr> <tr>
                            <td>
                                <input type="text" required="required" name="email" placeholder="Email Id" value={email} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                            <td>
                                <input type="text" required="required" name="phone" placeholder="Phone Number" value={phone} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="text" required="required" name="city" placeholder="City Name" value={city} onChange={this.changeHandler} autocomplete="off" />
                            </td>
                        </tr>
                    </table>
                    <br></br>
                    <div>
                        <button type="submit" className="login login-submit">Submit</button>
                    </div>
                </form>
                <div className="login-help">
                    <br></br>
                    • <a href="/">Already a member ?</a>
                </div>
            </div>

        )
    }
}

export default SignUpForm