import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import { Image } from 'react-bootstrap'
import Logo from './Logo'
import CustomerOption from './CustomerOption'


class EditBookingHistory extends Component {
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
            washerNames: [],
            bookinNumber: '',
            washerName: '',
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

    getBookingDetails() {
        const editBookingByNumber = (this.props.location.state).editBookingByNumber;
        axios
            .get('http://localhost:9092/bookingHistory/' + editBookingByNumber, this.state)
            .then(response => {
                console.log(response.data.data.bookingHistory.bookingNumber)
                this.setState({
                    bookingNumber: response.data.data.bookingHistory.bookingNumber,
                    vehicleNumber: response.data.data.bookingHistory.vehicleNumber,
                    serviceDate: response.data.data.bookingHistory.serviceDate,
                    carType: response.data.data.bookingHistory.carType,
                    packageName: response.data.data.bookingHistory.packageName,
                    packageRate: response.data.data.bookingHistory.packageRate,
                    addOnName: response.data.data.bookingHistory.addOnName,
                    addOnRate: response.data.data.bookingHistory.addOnRate,
                    total: response.data.data.bookingHistory.total,

                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    getCarType() {
        axios
            .get('http://localhost:9093/carType/getAllActiveCarType', this.state)
            .then(response => {
                this.setState({ carTypeNames: response.data })
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
                this.setState({ packageRate: response.data.data.ServicePackPrice })
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
                this.setState({ addOnRate: response.data.data.AddOnPrice })
            })
    }

    getTotalPrice = e => {

        this.setState({ total: this.state.packageRate + this.state.addOnRate })
    }



    componentDidMount() {
        this.getBookingDetails();
        this.getCarType();
        this.getServicePackage();
        this.getAddOn();
        this.getServicePackPrice();

    }

    submitHandler = e => {
        e.preventDefault()
        console.log("bbbbbb  " + this.state.bookingNumber)
        axios
            .put('http://localhost:9092/bookingHistory/new/' + this.state.bookingNumber, this.state)
            .then(response => {
                alert(response.data.msg)
                if (response.status == 200)
                    this.setState({ assigned: true });
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {

        if (this.state.assigned) {
            return <Redirect to="/customer/bookingHistory" />;
        }
        if (this.state.loggedIn === false) {
            return <Redirect to="/" />
        }
        const loginUserId = localStorage.getItem("userId");
        const { bookingNumber, vehicleNumber, serviceDate, carType, packageName, packageRate, addOnName, addOnRate, total, paymentStatus, washerName } = this.state

        return (
            <div>
                <CustomerOption />
                <Logo />
                <div className="adminAddUser">


                    <Page title="Assign Car Washer">
                        <Helmet>
                            <title>Edit Booking</title>
                        </Helmet>
                        <form onSubmit={this.submitHandler}>
                            <br></br>
                            <table>
                                <tr>
                                    <td>Vehicle Number </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <input type="text" name="vehicleNumber" required="required" value={vehicleNumber} placeholder="Vehicle Number" onChange={this.changeHandler}></input>
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
                                        <select value={carType} onChange={(e) => this.setState({ carType: e.target.value })}>
                                            <option value='0'>Select Car Type</option>
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
                                        <select value={packageName} onChange={(e) => this.setState({ packageName: e.target.value })}>
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
                                    <td><label onClick={this.getServicePackPrice} value={packageRate}> &nbsp;&nbsp;&nbsp;&nbsp;{this.state.additional} {this.state.packageRate}</label></td>
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
                                    <td><label value={addOnRate} onClick={this.getAddOnPrice}> &nbsp;&nbsp;&nbsp;&nbsp;{this.state.addOnRate}</label></td>
                                    <td></td>

                                </tr>
                                <tr>
                                    <td>Total </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td><label value={total} onClick={this.getTotalPrice}> &nbsp;&nbsp;&nbsp;&nbsp; {this.state.total}</label></td>
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


export default EditBookingHistory