import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import logo from './logo.png';
import axios from 'axios'

class Login extends Component {
	constructor(props) {
		super(props)
		const token = localStorage.getItem("token")
		let loggedIn = true
		this.state = {
			userId: '',
			password: '',
			loggedIn
		}
	}

	focusInput() {

	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	submitHandler = e => {
		e.preventDefault()
		axios
			.post('http://localhost:9091/user/login', this.state)
			.then(response => {
				if (response.data.msg === 'Login Successfully') {
					this.setState({
						loggedIn: true
					})
					console.log(response.data.data.userId)
					localStorage.setItem("token", "asgkgfaksafasjdfajfajfg")
					localStorage.setItem("userId", response.data.data.userId)
					if (response.data.data.role === 'Admin') {
						this.setState({ isAdmin: true });
					} else if (response.data.data.role === 'Customer') {
						this.setState({ isCustomer: true });
					} else if (response.data.data.role === 'Washer') {
						this.setState({ isWasher: true });
					}
				} else {
					alert(response.data.msg)
				}
			})
	}
	render() {
		if (this.state.isAdmin) {
			return <Redirect to="/admin/bookingHistory" />;
		} else if (this.state.isCustomer) {
			return <Redirect to="/customer/bookingHistory" />;
		} else if (this.state.isWasher) {
			return <Redirect to="/washer/bookingHistory" />;
		}
		return (
			<div>
				<h2>On Demand Car Wash Service</h2>
				<img src={logo} alt="Logo" />;
				<form onSubmit={this.submitHandler}>
					<input type="userId" name="userId" placeholder="Your UserId"
						required="required" value={this.props.userId} onChange={this.changeHandler} autocomplete="off" />
					<input type="password" name="password"
						placeholder="Your Password" required="required" value={this.props.userId} onChange={this.changeHandler} />
					<button type="submit" >Login</button>
				</form>
				<p>Not a member yet? <a href="signup">Join Now!</a></p>
			</div>
		)
	}
}

export default Login