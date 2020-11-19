import React from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom'
import { Button, Image, NavLink } from 'react-bootstrap'
import { get } from 'axios';
import axios from 'axios'
import times from 'lodash.times';
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import StarRatingComponent from 'react-star-rating-component'
import Logo from './Logo'
import CustomerOption from './CustomerOption'

const TOTAL_PER_PAGE = 10;

class BookingHistory extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token")

    let loggedIn = true
    if (token == null) {
      loggedIn = false
    }

    this.state = {
      loggedIn,
      bookingData: [],
      page: 0,
      totalPages: 0,
    };
    this.incrementPage = this.incrementPage.bind(this);
    this.decrementPage = this.decrementPage.bind(this);
    this.setPage = this.setPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  componentWillReceiveProps({ location = {} }) {
    if (location.pathname === '/users' && location.pathname !== this.props.location.pathname) {
      this.getUsers();
    }
  }

  getUsers() {
    get('http://localhost:9092/bookingHistory/getAll/customer/' + localStorage.getItem("userId"))
      .then(({ data }) => {
        console.log(data);
        const { bookingData } = data;
        const totalPages = Math.ceil(8 / TOTAL_PER_PAGE);

        this.setState({
          bookingData: data,
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
    const { bookingData } = this.state;

    this.setState({
      bookingData: bookingData.filter(u => u.id !== userId),
    });
  }

  submitHandler = e => {
    e.preventDefault()
    axios
        .get('https://secure.telr.com/gateway/process_framed.html?o=79260F6EF2C0A771233C57C6AA9330F924284E5E79BBD74E48DA5BAD2D02BD63')
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

  render() {

    if (this.state.loggedIn === false) {
      return <Redirect to="/" />
    }

    const loginUserId = localStorage.getItem("userId");
    const { bookingData, page, totalPages } = this.state;
    const startIndex = page * TOTAL_PER_PAGE;

    return (

      <div>
        <CustomerOption />
        <Logo />
        <div className="userStyle">
          <Page title="Booking History">
            <Helmet>
              <title>Booking History</title>
            </Helmet>

            <Table celled striped >
              <Table.Header >
                <Table.Row className="tableHeader">
                <Table.HeaderCell >Booking No</Table.HeaderCell>
                  <Table.HeaderCell >ServiceDate</Table.HeaderCell>
                  <Table.HeaderCell>Vehicle No</Table.HeaderCell>
                  <Table.HeaderCell>CarType</Table.HeaderCell>
                  <Table.HeaderCell>WasherName</Table.HeaderCell>
                  <Table.HeaderCell>PackageName</Table.HeaderCell>
                  <Table.HeaderCell>PackageRate</Table.HeaderCell>
                  <Table.HeaderCell>AddOnName</Table.HeaderCell>
                  <Table.HeaderCell>AddOnRate</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>PaymentStatus</Table.HeaderCell>
                  <Table.HeaderCell>Ratings </Table.HeaderCell>
                  <Table.HeaderCell>Reviews</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body className="tableBody">
                {bookingData.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(booking =>
                  (<Table.Row key={booking.id}>
                    <Table.Cell>{booking.bookingNumber}</Table.Cell>
                    <Table.Cell>{booking.serviceDate}</Table.Cell>
                    <Table.Cell>{booking.vehicleNumber}</Table.Cell>
                    <Table.Cell>{booking.carType}</Table.Cell>
                    <Table.Cell>{booking.washerName}</Table.Cell>
                    <Table.Cell>{booking.packageName}</Table.Cell>
                    <Table.Cell>{booking.packageRate}</Table.Cell>
                    <Table.Cell>{booking.addOnName}</Table.Cell>
                    <Table.Cell>{booking.addOnRate}</Table.Cell>
                    <Table.Cell>{booking.total}</Table.Cell>
                    <Table.Cell>{booking.status}</Table.Cell>
                    <Table.Cell>
                      {(() => {
                        switch (booking.paymentStatus) {
                          case "Pending":
                            return (<form onSubmit={this.submitHandler}>
                              <Button variant="outline-info">Pay</Button>
                            </form>)
                          case "Success":
                          return (booking.paymentStatus)
                          case "Failed":
                          return (booking.paymentStatus)
                        }
                      })()}
                    </Table.Cell>
                    <Table.Cell>

                      {(() => {
                        if (booking.customerRatings > 0)
                          return <StarRatingComponent
                            className="ratings"
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
                            return <Button variant="outline-info"><Link to={{
                              pathname: '/customer/editBookingHistory',
                              state: {
                                editBookingByNumber: (booking.bookingNumber)
                              }
                            }}> Edit
                        </Link></Button>
                          case "Completed":
                            return <Button variant="outline-info"><Link to={{
                              pathname: '/customer/addBookingRating',
                              state: {
                                addBookingRatingByBookingOrder: (booking.bookingNumber)
                              }
                            }}> Rating
                        </Link></Button>
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
            <Link to="/customer/newBooking"> car wash booking</Link>
          </Page>
        </div>
      </div>
    );
  }
}

export default BookingHistory;
