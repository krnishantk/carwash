import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import Logo from './Logo'
import AdminOption from './AdminOption'


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
        const editBookingByNumber = (this.props.location.state).editBookingNumber;
        axios
            .get('http://localhost:9092/bookingHistory/' + editBookingByNumber, this.state)
            .then(response => {
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
                    paymentStatus: response.data.data.bookingHistory.paymentStatus,
                    washerName: response.data.data.bookingHistory.washerName,

                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    getCarWasherName() {
        axios
            .get('http://localhost:9091/user/getActiveCarWasher', this.state)
            .then(response => {
                console.log(response)
                this.setState({ washerNames: response.data })
            })
    }

    getTotalPrice = e => {

        this.setState({ total: this.state.packageRate + this.state.addOnRate })
    }

    componentDidMount() {
        this.getBookingDetails();
        this.getCarWasherName();

    }

    submitHandler = e => {
        e.preventDefault()
        axios
            .put('http://localhost:9092/bookingHistory/assignCarWasher', this.state)
            .then(response => {
                alert(response.data.msg)
                if (response.status === 200)
                    this.setState({ assigned: true });
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {

        if (this.state.assigned) {
            return <Redirect to="/admin/bookingHistory" />;
        }
        if (this.state.loggedIn === false) {
            return <Redirect to="/" />
        }
        const loginUserId = localStorage.getItem("userId");
        const { bookingNumber, vehicleNumber, serviceDate, carType, packageName, packageRate, addOnName, addOnRate, total, paymentStatus, washerName } = this.state

        return (
            <div>
                <AdminOption />
                <Logo />

                <div className="adminAddUser">


                    <Page title="Assign Car Washer">
                        <Helmet>
                            <title>Assign Car Washer</title>
                        </Helmet>
                        <form onSubmit={this.submitHandler}>
                            <br></br>
                            <table>
                                <tr>
                                    <td>Order Number </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label >{bookingNumber}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Vehicle Number </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="vehicleNumber">{vehicleNumber}</label>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Service Date </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="serviceDate">{serviceDate}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Car Type </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="carType">{carType}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Package Name </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="packageName">{packageName}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Package Rate </td>
                                    <td className="adminAddUserTable" >:</td>
                                    <td>
                                        <label name="packageRate">&#8377;&nbsp;&nbsp;{packageRate}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AddOn Name </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="addOnName">{addOnName}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>AddOn Rate </td>
                                    <td className="adminAddUserTable" >:</td>
                                    <td><label name="addOnRate">&#8377;&nbsp;&nbsp;{addOnRate}</label></td>

                                </tr>
                                <tr>
                                    <td>Total </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td><label name="total">&#8377;&nbsp;&nbsp;{total}</label></td>
                                </tr>
                                <tr>
                                    <td>Payment Status </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <label name="paymentStatus" >{paymentStatus}</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Car Washer Name </td>
                                    <td className="adminAddUserTable">:</td>
                                    <td>
                                        <select value={washerName} onChange={(e) => this.setState({ washerName: e.target.value })}>
                                            <option value='0'>Select Car Washer</option>
                                            {this.state.washerNames.map(user =>
                                                <option value={user.userId}>{user.userId}</option>
                                            )}
                                        </select>
                                    </td>
                                </tr>
                            </table>
                            <br></br>
                            <div>
                                <button type="submit" className="login login-submit">Submit</button>
                            </div>
                            <br></br>
                            <div>
                                <Link to="/admin/bookingHistory"> Back</Link>
                            </div>
                        </form>
                    </Page>
                </div>
            </div>
        )
    }
}


export default EditBookingHistory