import React from 'react';
import { Table, Menu, Icon } from 'semantic-ui-react';
import {Button} from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { get } from 'axios';
import times from 'lodash.times';
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import axios from 'axios'
import Logo from './Logo'
import WasherOption from './WasherOption'

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

  componentDidMount() {
    this.getUsers();
  }

  componentWillReceiveProps({ location = {} }) {
    if (location.pathname === '/users' && location.pathname !== this.props.location.pathname) {
      this.getUsers();
    }
  }

  getUsers() {
    get('http://localhost:9092/bookingHistory/getAll/washer/'+localStorage.getItem("userId"))
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

  bookingOrderAccepted(bookingOrderNumber) {
    axios
        .get('http://localhost:9092/bookingHistory/carWasherAcceptedOrder/'+bookingOrderNumber)
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
        .get('http://localhost:9092/bookingHistory/carWasherRejectedOrder/'+bookingOrderNumber)
        .then( response => {
            alert(response.data.msg)
            this.getUsers();
        })
        .catch(error => {
          console.log(error)
      })
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

    const loginUserId = localStorage.getItem("userId");
    const { bookingHistory, page, totalPages } = this.state;
    const startIndex = page * TOTAL_PER_PAGE;

    return (
      
      <div>

                <WasherOption />
                <Logo />
        
        <div className="userStyle">
      <Page title="Order List">
        <Helmet>
          <title>Order List</title>
        </Helmet>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ScheduleDate</Table.HeaderCell>
              <Table.HeaderCell>Vehicle No</Table.HeaderCell>
              <Table.HeaderCell>CarType</Table.HeaderCell>
              <Table.HeaderCell>PackageName</Table.HeaderCell>
              <Table.HeaderCell>AddOnName</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>PaymentStatus</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookingHistory.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(booking =>
              (<Table.Row key={booking.id}>
                <Table.Cell>{booking.serviceDate}</Table.Cell>
                <Table.Cell>{booking.vehicleNumber}</Table.Cell>
                <Table.Cell>{booking.carType}</Table.Cell>
                <Table.Cell>{booking.packageName}</Table.Cell>
                <Table.Cell>{booking.addOnName}</Table.Cell>
                <Table.Cell>{booking.status}</Table.Cell>
                <Table.Cell>{booking.paymentStatus}</Table.Cell>
                <Table.Cell>  


                {(() => {
                    switch (booking.status) {
                      case "Assigned":   
                        return <div><Button variant="outline-info" size="sm" onClick={() => this.bookingOrderAccepted(booking.bookingNumber)}>Accept</Button>
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
