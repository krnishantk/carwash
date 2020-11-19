import React from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { get } from 'axios';
import times from 'lodash.times';
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import axios from 'axios'
import { Button } from 'react-bootstrap'
import StarRatingComponent from 'react-star-rating-component'
import Logo from './Logo'
import AdminOption from './AdminOption'

const TOTAL_PER_PAGE = 10;

class BookingHistory extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token")

        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            loggedIn,
      bookingHistory: [],
      page: 0,
      totalPages: 0,
    };
    this.incrementPage = this.incrementPage.bind(this);
    this.decrementPage = this.decrementPage.bind(this);
    this.setPage = this.setPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }


  
  bookingOrderCompleted(bookingOrderNumber) {
    axios
        .get('http://localhost:9092/bookingHistory/bookingOrderCompleted/'+bookingOrderNumber)
        .then( response => {
          alert(response.data.msg)
          this.getUsers();
        })
        .catch(error => {
          console.log(error)
      })

  }

  bookingOrderRejected(bookingOrderNumber) {
    axios
        .get('http://localhost:9092/bookingHistory/bookingOrderRejected/'+bookingOrderNumber)
        .then( response => {
            alert(response.data.msg)
            this.getUsers();
        })
        .catch(error => {
          console.log(error)
      })
  }


  componentDidMount() {
    this.getUsers();
  }

  componentWillReceiveProps({ location = {} }) {
    if (location.pathname === '/bookingHistory' && location.pathname !== this.props.location.pathname) {
      this.getUsers();
    }
  }

  getUsers() {
    get('http://localhost:9092/bookingHistory/getAll')
      .then(({ data }) => {
        const { bookingHistory } = data;
        const totalPages = Math.ceil(8 / TOTAL_PER_PAGE);

        this.setState({
          bookingHistory: data,
          page: 0,
          totalPages,
        });
      });
  }

  setPage(page) {
    return () => {
      this.setState({ page });
    };
  }

  decrementPage() {
    const { page } = this.state;

    this.setState({ page: page - 1 });
  }

  incrementPage() {
    const { page } = this.state;

    this.setState({ page: page + 1 });
  }

  handleDelete(userId) {
    const { bookingHistory } = this.state;

    this.setState({
      bookingHistory: bookingHistory.filter(u => u.id !== userId),
    });
  }

  render() {

    if(this.state.loggedIn === false){
      return <Redirect to ="/" />
  }

    const { bookingHistory, page, totalPages } = this.state;
    const startIndex = page * TOTAL_PER_PAGE;

    return (
      
      <div>

              <AdminOption />
               <Logo />

        <div className="userStyle">
      <Page title="Booking History">
        <Helmet>
          <title>Booking History</title>
        </Helmet>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Booking No.</Table.HeaderCell>
              <Table.HeaderCell>ServiceDate</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Vehicle No</Table.HeaderCell>
              <Table.HeaderCell>CarType</Table.HeaderCell>
              <Table.HeaderCell>Package</Table.HeaderCell>
              <Table.HeaderCell>Rate</Table.HeaderCell>
              <Table.HeaderCell>AddOn</Table.HeaderCell>
              <Table.HeaderCell>Rate</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Washer</Table.HeaderCell>
              <Table.HeaderCell>PaymentStatus</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Customer Ratings</Table.HeaderCell>
              <Table.HeaderCell>Customer Reviews</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookingHistory.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(booking =>
              (<Table.Row key={booking.id}>
                <Table.Cell>{booking.bookingNumber}</Table.Cell>
                <Table.Cell>{booking.serviceDate}</Table.Cell>
                <Table.Cell>{booking.customerName}</Table.Cell>
                <Table.Cell>{booking.vehicleNumber}</Table.Cell>
                <Table.Cell>{booking.carType}</Table.Cell>
                <Table.Cell>{booking.packageName}</Table.Cell>
                <Table.Cell>&#8377;&nbsp;&nbsp;{booking.packageRate}</Table.Cell>
                <Table.Cell>{booking.addOnName}</Table.Cell>
                <Table.Cell>
                {(() => {
                    switch (booking.addOnRate) {
                      case  booking.addOnRate > 0:
                        return <div>&#8377;&nbsp;&nbsp;{booking.addOnRate}</div>
                      }
                    })()}  
                </Table.Cell>
                <Table.Cell>&#8377;&nbsp;&nbsp;{booking.total}</Table.Cell>
                <Table.Cell>{booking.washerName}</Table.Cell>
                <Table.Cell>{booking.paymentStatus}</Table.Cell>
                <Table.Cell>{booking.status}</Table.Cell>
                <Table.Cell>

                {(() => {
                  if(booking.customerRatings > 0)
                  return <StarRatingComponent 
                  name="customerRatings" 
                  starCount={5}
                  value={booking.customerRatings}
                /> 
                  
                })()}

                </Table.Cell>
                <Table.Cell> {booking.customerReviews}  </Table.Cell>
                <Table.Cell>


                {(() => {
                    switch (booking.status) {
                      case "New":   
                        return <div>
                          <Button variant="outline-info" size="sm"><Link to={{
                      pathname:'/admin/editBookingHistory',
                      state: {
                        editBookingNumber: (booking.bookingNumber)
                      }
                    }}> Assign 
                    </Link></Button> 
                          <Button variant="outline-danger" size="sm" onClick={() => this.bookingOrderRejected(booking.bookingNumber)}>Reject</Button>
                        </div>
                        case "Assigned":   
                        return <div>
                          <Button variant="outline-danger" size="sm" onClick={() => this.bookingOrderRejected(booking.bookingNumber)}>Reject</Button>
                        </div>
                        case "InProcess":   
                        return <div>
                        <Button variant="outline-danger" size="sm" onClick={() => this.bookingOrderCompleted(booking.bookingNumber)}>Completed</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => this.bookingOrderRejected(booking.bookingNumber)}>Reject</Button>
                        </div>
                    }
                })()}
                    </Table.Cell>
              </Table.Row>),
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={6}>
                <Menu floated="right" pagination>
                  {page !== 0 && <Menu.Item as="a" icon onClick={this.decrementPage}>
                    <Icon name="left chevron" />
                  </Menu.Item>}
                  {times(totalPages, n =>
                    (<Menu.Item as="a" key={n} active={n === page} onClick={this.setPage(n)}>
                      {n + 1}
                    </Menu.Item>),
                  )}
                  {page !== (totalPages - 1) && <Menu.Item as="a" icon onClick={this.incrementPage}>
                    <Icon name="right chevron" />
                  </Menu.Item>}
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Page>
      </div>
      </div>
    );
  }
}

export default BookingHistory;
