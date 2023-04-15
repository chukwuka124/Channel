import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Channel, Channels, Homepage, NewChannel, Landingpage } from './pages'


function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <p className='title'>Communication Channel</p>

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
