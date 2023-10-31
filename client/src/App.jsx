import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CreateProposal from './components/manager/CreateProposal';
import Vote from './components/investor/Vote';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Home</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/manager">Manager</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/investor">Investor</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} index /> {/* Display HomePage by default */}
        <Route path="/manager" element={<CreateProposal />} />
        <Route path="/investor" element={<Vote />} />
      </Routes>
    </Router>
  );
}

export default App;
