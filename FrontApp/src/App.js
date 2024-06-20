import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Join from './Join';
import Chat from './Chat';
import ChatStart from './ChatStart';
import Profile from './Profile';
import ProfileDetail from './ProfileDetail';
import Setting from './Setting';
import './App.css'; // Import the CSS file

import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  return (
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatStart" element={<ChatStart />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/Profile/:profileId' element={<ProfileDetail/>} />
          <Route path='/Setting' element={<Setting/>}/>
        </Routes>
     
    </Router>
    // </GoogleOAuthProvider>
  );
}

export default App;