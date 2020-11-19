import React from 'react';
import { Table, Menu, Icon} from 'semantic-ui-react';
import {Button} from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'
import { get } from 'axios';
import times from 'lodash.times';
import { Helmet } from 'react-helmet';
import Page from './Page';
import './admin.css';
import axios from 'axios'
import Logo from './Logo'
import AdminOption from './AdminOption'

const TOTAL_PER_PAGE = 10;

class Customers extends React.Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token")

        let loggedIn = true
        if(token == null){
            loggedIn = false
        }

        this.state = {
            loggedIn,
      users: [],
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

  
  getUserEnableDisable(userId){
    axios
    .put('http://localhost:9091/user/activeInActive/'+userId, this.state)
    .then( response => {
        alert(response.data.msg) 
        this.getUsers()
    })
    .catch(error => {
        console.log(error)
    })
  }

  getUsers() {
    get('http://localhost:9091/user/getCustomer')
      .then(({ data }) => {
          console.log(data)
        const { users } = data;
        const totalPages = Math.ceil(8 / TOTAL_PER_PAGE);

        this.setState({
          users: data,
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
    const { users } = this.state;

    this.setState({
      users: users.filter(u => u.id !== userId),
    });
  }

  render() {

    if(this.state.loggedIn === false){
      return <Redirect to ="/" />
  }
    const userId = localStorage.getItem("userId");
    const { users, page, totalPages } = this.state;
    const startIndex = page * TOTAL_PER_PAGE;

    return (
      <div>

              <AdminOption />
               <Logo />

        <div className="userStyle">
      <Page title="Customer List">
        <Helmet>
          <title>Customer List</title>
        </Helmet>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>UserId</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.slice(startIndex, startIndex + TOTAL_PER_PAGE).map(user =>
              (<Table.Row key={user.id}>
                <Table.Cell>{user.userId}</Table.Cell>
                <Table.Cell>{user.firstName} {user.lastName}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                
                {(() => {
                      switch (''+user.isActive) {
                        case "true":   return "Yes"
                        case "false":  return "No"
                      }
                })()}
                
                </Table.Cell>
                <Table.Cell>{user.city}</Table.Cell>
                <Table.Cell>  


                {(() => {
                    switch (''+user.isActive) {
                      case "true":   
                        return <div>
                        <Button variant="outline-suucess"><Link to={{
                          pathname:'/admin/editCustomer',
                          state: {
                            editId: (user.userId)
                          }
                        }}> Edit 
                        </Link></Button> 
                        <Button variant="outline-danger" onClick={() => this.getUserEnableDisable(user.userId)}>InActive</Button>
                        </div>
                      case "false":  
                        return <Button variant="outline-info" onClick={() => this.getUserEnableDisable(user.userId)}>Active</Button>
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

export default Customers;
