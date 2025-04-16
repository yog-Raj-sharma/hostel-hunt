import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage'; 
import SignUpPage from './components/SignUpPage';
import YourProfile from './components/YourProfile';
import { PageStateProvider } from './contexts/PageStateContext';

function App() {
  return (
    <Router>
      <PageStateProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/navbar" element={<NavBar />} />
          <Route path="/profile" element={<YourProfile />} />
        </Routes>
      </PageStateProvider>
    </Router>
  );
}

export default App;
