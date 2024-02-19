// React
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';
// Main page
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
// Auth Page
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// Dashboard
import Dashboard from './components/dashboard/Dashboard';
// Profile
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profile from './components/profile/Profile';
import Profiles from './components/profiles/Profiles';
// Alerts
import Alert from './components/layout/Alert';
// Auth
import setAuthToken from './utils/setAuthToken';
import { loadUser, cookies } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';
// Style
import './App.css';

if (cookies.get('access_token')) {
  setAuthToken(cookies.get('access_token'));
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    // Connects React app to Redux
    <Provider store={store}>
      <Router>
        {/*Group elements */}
        <Fragment>
          {/* Navigation */}
          <Navbar />
          {/* Wrap in container for padding */}
          <section className='container'>
            <Alert />
            {/* Wrap other routes in a Switch */}
            <Routes>
              {/* Entry route */}
              <Route path='/' element={<Landing/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/profile/:id' element={<Profile/>} />
              <Route path='/profiles' element={<Profiles/>} />
              <Route path='/dashboard' element={<PrivateRoute component={Dashboard} />} />
              <Route path='/create-profile' element={<PrivateRoute component={CreateProfile}/>} />
              <Route path='/edit-profile' element={<PrivateRoute component={EditProfile}/>} />
              <Route path='/add-experience' element={<PrivateRoute component={AddExperience}/>} />
              <Route path='/add-education' element={<PrivateRoute component={AddEducation}/>} />
            </Routes>
          </section>
          <Footer></Footer>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
