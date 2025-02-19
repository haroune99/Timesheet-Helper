import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div>
      <Header />
      <Body />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1>TimeSheet Tracker</h1>
    </div>
  );
}

function Body() {
  return (
    <div className="project-box">
      <img className="project-image" src="https://waz.smartdraw.com/working-smarter/img/how-to-create-a-project-planning-map.svg?bn=15100111939" alt="Project image" />
      <h3>Project Name</h3>
      <div className="button-container">
        <button className="button">Start</button>
        <button className="button">Stop</button>
      </div>
      <div className="time-container">
        <span>00:00:00</span>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
