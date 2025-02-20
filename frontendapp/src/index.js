import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  const [projects, setProjects] = React.useState([]);
  const consultant = "Haroune"; // This could come from login/auth later

  React.useEffect(() => {
    // Fetch projects when component mounts
    const fetchProjects = async () => {
      try {
        // Change to GET request with query parameter
        const response = await fetch(`http://localhost:4000/projects?consultant=${consultant}`);
        if (response.ok) {
          const data = await response.json();
          // Ensure we're setting an array
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Set empty array on error
      }
    };

    fetchProjects();
  }, [consultant]);

  return (
    <div>
      <Header />
      <div className="projects-container">
        {projects.map(project => (
          <Body 
            key={project._id} 
            project={project} 
            consultant={consultant}
          />
        ))}
      </div>
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

function Body({ project, consultant }) {
  const [status, setStatus] = React.useState("stopped");
  const [seconds, setSeconds] = React.useState(0);
  const [timer, setTimer] = React.useState(null);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const handleTimingClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/timing/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultant: consultant,
          project: project.name
        })
      });

      if (response.ok) {
        const newStatus = status === "stopped" ? "started" : "stopped";
        setStatus(newStatus);
        
        if (newStatus === "started") {
          // Start timer - update every second
          const intervalId = setInterval(() => {
            setSeconds(prev => prev + 1);
          }, 1000);
          setTimer(intervalId);
        } else {
          // Stop timer
          if (timer) {
            clearInterval(timer);
            setTimer(null);
          }
        }
      } else {
        console.error('Failed to update timing');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="project-box">
      <img className="project-image" src="https://waz.smartdraw.com/working-smarter/img/how-to-create-a-project-planning-map.svg?bn=15100111939" alt="Project image" />
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="project-info">
        <span>Progress: {project.progress}%</span>
        <span>Status: {project.status}</span>
      </div>
      <div className="button-container">
        <button 
          className="button"
          onClick={handleTimingClick}
        >
          {status === "stopped" ? "Start" : "Stop"}
        </button>
      </div>
      <div className="time-container">
        <span>{formatTime(seconds)}</span>
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
