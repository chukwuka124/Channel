import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Channel, Channels, Homepage, NewChannel, Landingpage } from './pages'
import { useUser } from './hooks'
import { Logout } from './components';
import { useEffect, useState } from 'react';

function App() {
  const user = useUser()
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    if (!user) setCurrentUser(undefined)
    else setCurrentUser(user)
  }, [user])

  return (
    <BrowserRouter>
      <div className="container">
        <p className='title'>Communication Channel</p>
        {currentUser &&
          <div className="userInfo">
            <p>Hi {currentUser.name},</p>
            <Logout />
          </div>
        }


        <Routes>
          <Route exact path="/" element={<Landingpage />} />
          <Route exact path="/home" element={<Homepage />} />
          <Route path="/allChannels" element={<Channels />} />
          <Route path="/newChannel" element={<NewChannel />} />
          <Route path="/channel/:id" element={<Channel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
