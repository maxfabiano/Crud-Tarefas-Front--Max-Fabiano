import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './pages/Clientes.tsx';
import Home from "./pages/Home";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    );
}

export default App;
