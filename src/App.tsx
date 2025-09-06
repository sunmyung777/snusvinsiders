import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Speakers from './components/Speakers';
import Events from './components/Events';
import Partners from './components/Partners';
import Registration from './components/Registration';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Speakers />
      <Events />
      <Partners />
      <Registration />
      <Footer />
    </div>
  );
}

export default App;