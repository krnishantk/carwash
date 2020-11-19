import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Login from './components/login/Login';
import Logout from './components/login/Logout';
import SignUpForm from './components/login/SignUpForm';
import './App.css';
import AdminProfile from './components/admin/Profile';
import AdminBookingHistory from './components/admin/BookingHistory';
import AdminEditBookingHistory from './components/admin/EditBookingHistory';
import AdminWashers from './components/admin/Washers';
import AdminCustomers from './components/admin/Customers';
import AdminAddWasher from './components/admin/AddWasher';
import AdminEditCustomer from './components/admin/EditCustomer';
import AdminEditWasher from './components/admin/EditWasher';
import CustomerBookingHistory from './components/customer/BookingHistory';
import CustomerNewBooking from './components/customer/NewBooking';
import CustomerEditBooking from './components/customer/EditBookingHistory'
import CustomerProfile from './components/customer/Profile';
import AddBookingRating from './components/customer/AddBookingRating';
import WasherProfile from './components/washer/Profile';
import WasherOrder from './components/washer/BookingHistory';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/signUp" exact component={SignUpForm} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/admin/profile" exact component={AdminProfile} />
          <Route path="/admin/bookingHistory" exact component={AdminBookingHistory} />
          <Route path="/admin/editBookingHistory" exact component={AdminEditBookingHistory} />
          <Route path="/admin/user" exact component={AdminWashers} />
          <Route path="/admin/customer" exact component={AdminCustomers} />
          <Route path="/admin/addWasher" exact component={AdminAddWasher} />
          <Route path="/admin/editCustomer" exact component={AdminEditCustomer} />
          <Route path="/admin/editUser" exact component={AdminEditWasher} />
          <Route path="/customer/bookingHistory" exact component={CustomerBookingHistory} />
          <Route path="/customer/newBooking" exact component={CustomerNewBooking} />
          <Route path="/customer/editBookingHistory" exact component={CustomerEditBooking} />
          <Route path="/customer/profile" exact component={CustomerProfile} />
          <Route path="/customer/addBookingRating" exact component={AddBookingRating} />
          <Route path="/washer/bookingHistory" exact component={WasherOrder} />
          <Route path="/washer/profile" exact component={WasherProfile} />
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
