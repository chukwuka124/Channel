import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Channel, Channels, Homepage, NewChannel, Landingpage } from './pages'

function App() {
  return (
    <div className="container">
      <p className='title'>Communication Channel</p>

      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Landingpage />} />
          <Route exact path="/home" element={<Homepage />} />
          <Route path="/allChannels" element={<Channels />} />
          <Route path="/newChannel" element={<NewChannel />} />
          <Route path="/channel/:id" element={<Channel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
