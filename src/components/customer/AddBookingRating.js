import React, { Component } from 'react'
import { TextArea } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import StarRatingComponent from 'react-star-rating-component'
import Logo from './Logo'
import CustomerOption from './CustomerOption'


class AddBookingRating extends Component {
    constructor(props) {
        super(props)

        const token = localStorage.getItem("token")

        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            customerName:localStorage.getItem("userId"),
            carTypeNames: [],
            servicePackNames: [],
            addOnNames: [],
            washerNames: [],
            bookinNumber:'',
            washerName:'',
            loggedIn,
            vehicleNumber:'',
            carType:'',
            serviceDate:'',
            packageName:'',
            packageRate:'',
            addOnName:'',
            addOnRate:'',
            total:'',
            customerReviews:'',
            customerRatings: 2,
        }
    }


    onStarClick(nextValue, prevValue, name) {
        this.setState({customerRatings: nextValue});
      }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    getBookingDetails() {
        const addBookingRatingByBookingOrder = (this.props.location.state).addBookingRatingByBookingOrder;
        axios
            .get('http://localhost:9092/bookingHistory/'+addBookingRatingByBookingOrder, this.state)
            .then(response => {
                console.log(response)
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
                    customerReviews: response.data.data.bookingHistory.customerReviews,
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.getBookingDetails();
        
    }

    submitHandler = e => {
        e.preventDefault()
        axios
            .put('http://localhost:9092/bookingHistory/addingRatingAndComments/'+this.state.bookingNumber, this.state)
            .then( response => {
                alert(response.data.msg)
                if(response.status == 200)
                    this.setState({ assigned: true });  
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {

        if (this.state.assigned) {
            return <Redirect to ="/customer/bookingHistory" />;
        }
        if(this.state.loggedIn === false){
            return <Redirect to ="/" />
        }
        const loginUserId = localStorage.getItem("userId");
        const {customerRatings , bookingNumber, vehicleNumber, serviceDate, carType, packageName, packageRate, addOnName, addOnRate, total, paymentStatus, washerName, customerReviews } = this.state

        return(
            <div>
                
                <CustomerOption />
                <Logo />
    
            <div className="adminAddUser"> 
            <Page title="Rating And Comments">
        <Helmet>
          <title>Rating And Comments</title>
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
                                <label name="washerName" >{washerName}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>Rating </td>
                            <td className="adminAddUserTable">:</td>
                            <td>
                                <StarRatingComponent 
                                name="customerRatings" 
                                starCount={5}
                                value={customerRatings}
                                onStarClick={this.onStarClick.bind(this)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Reviews </td>
                            <td className="adminAddUserTable">:</td>
                            <td>
                                <TextArea type="text" name="customerReviews" required="required" placeholder="Write Comments" onChange={this.changeHandler}></TextArea>
                            </td>
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


export default AddBookingRating