import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import { Image } from 'react-bootstrap'
import Logo from './Logo'
import CustomerOption from './CustomerOption'


class NewBooking extends Component {
    constructor(props) {
        super(props)

        const token = localStorage.getItem("token")

        let loggedIn = true
        if (token == null) {
            loggedIn = false
        }

        this.state = {
            customerName: localStorage.getItem("userId"),
            carTypeNames: [],
            servicePackNames: [],
            addOnNames: [],
            loggedIn,
            vehicleNumber: '',
            carType: '',
            serviceDate: '',
            packageName: '',
            packageRate: '',
            addOnName: '',
            addOnRate: '',
            total: '',
            paymentStatus: '',
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    getCarType() {
        axios
            .get('http://localhost:9093/carType/getAllActiveCarType', this.state)
            .then(response => {
                this.setState({ carTypeNames: response.data })
                console.log(response.data);
            })
    }

    getServicePackage() {
        axios
            .get('http://localhost:9093/packageType/getAllActivePackageType', this.state)
            .then(response => {
                this.setState({ servicePackNames: response.data })
            })
    }

    getServicePackPrice = e => {
        console.log(this.state.carType + "  " + this.state.packageName)
        axios
            .get('http://localhost:9093/packagePrice/' + this.state.carType + "/" + this.state.packageName, this.state)
            .then(response => {
                console.log(response)
                this.setState({ packageRate: response.data.data.packagePrice })
            })
    }

    getAddOn() {
        axios
            .get('http://localhost:9093/addOn/getAllActiveAddOnType', this.state)
            .then(response => {
                this.setState({ addOnNames: response.data })
            })
    }

    getAddOnPrice = e => {
        axios
            .get('http://localhost:9093/addOnPrice/' + this.state.carType + "/" + this.state.addOnName, this.state)
            .then(response => {
                this.setState({ addOnRate: response.data.data.addOnPrice })
            })
    }

    getTotalPrice = e => {

        this.setState({ total: this.state.packageRate + this.state.addOnRate })
    }


    componentWillMount() {
        this.getCarType();
        this.getServicePackage();
        this.getAddOn();
    }

    submitHandler = e => {
        e.preventDefault()
        axios
            .post('http://localhost:9092/bookingHistory', this.state)
            .then(response => {
                console.log(response)
                console.log("1111" + response.status)
                console.log("2222" + response.data.status)
                alert(response.data.msg)

                if (response.status === '200') {
                    console.log("Fine")
                    return <Redirect to="/customer/bookingHistory" />
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    asClick() {

        console.log("Hi.......vvvvvvvvvv")
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to="/" />
        }
        const loginUserId = localStorage.getItem("userId");
        const total = this.state.packageRate + this.state.addOnRate
        const { vehicleNumber, serviceDate, carType, packageName, packageRate, addOnName, addOnRate, paymentStatus } = this.state

        return (
            <div>
                <CustomerOption />
                <Logo />
                <div className="adminAddUser">


                    <Page title="New Booking  Details">
                        <Helmet>
                            <title>New Booking  Details</title>
                        </Helmet>
                        <form onSubmit={this.submitHandler}>
                            <br></br>
                            <table>

                                <tr>
                                    <td>Vehicle Number </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <input autoComplete="off" type="text" name="vehicleNumber" required="required" value={vehicleNumber} placeholder="Vehicle Number" onChange={this.changeHandler}></input>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Service Date </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <input type="date" name="serviceDate" required="required" value={serviceDate} onChange={this.changeHandler}></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Car Type </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <select value={carType} onChange={(e) => this.setState({ carType: e.target.value })}   >
                                            <option value='0' >Select Car Type</option>
                                            {this.state.carTypeNames.map(carTypeName =>
                                                <option value={carTypeName.carTypeName}>{carTypeName.carTypeName}</option>
                                            )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Package Name </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <select value={packageName} onChange={(e) => this.setState({ packageName: e.target.value })} >
                                            <option value='0'>Select Service</option>
                                            {this.state.servicePackNames.map(servicePackName =>
                                                <option value={servicePackName.packageName}>{servicePackName.packageName}</option>
                                            )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Package Rate </td>
                                    <td className="adminAddUserTable" >:</td>
                                    <td><label onClick={this.getServicePackPrice} value={this.state.packageRate}>&#8377;&nbsp;&nbsp;{this.state.additional} {this.state.packageRate}</label></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>AddOn Name </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <select value={addOnName} onChange={(e) => this.setState({ addOnName: e.target.value })}>
                                            <option value='0'> Select AddOn</option>
                                            {this.state.addOnNames.map(addOn =>
                                                <option value={addOn.addOnName}>{addOn.addOnName}</option>
                                            )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AddOn Rate </td>
                                    <td className="adminAddUserTable" >:</td>
                                    <td><label value={addOnRate} onClick={this.getAddOnPrice}>&#8377;&nbsp;&nbsp;&nbsp;{this.state.addOnRate}</label></td>
                                    <td></td>

                                </tr>
                                <tr>
                                    <td>Total </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td><label value={total} onClick={this.getTotalPrice}>&#8377;&nbsp;&nbsp;&nbsp;{total}</label></td>
                                </tr>
                            </table>
                            <br></br>
                            <div>
                                <button type="submit" className="login login-submit">Submit</button>
                            </div>
                            <br></br>
                            <div>
                                <Link to="/customer/bookingHistory"> Back</Link>
                            </div>
                        </form>
                    </Page>
                </div>
            </div>
        )
    }
}

export default NewBooking