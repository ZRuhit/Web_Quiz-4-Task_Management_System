import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import TaskForm from './pages/TaskForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
        <Route exact path="/admin-login" component={AdminLogin} />
        <Route exact path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/create-task" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;