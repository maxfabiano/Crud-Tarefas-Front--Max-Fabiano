import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './pages/Clientes.tsx';
import Home from "./pages/Home";
import Perfil from "./pages/Perfil.tsx";
import Usuarios from "./pages/listaUsuarios.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/clientes/:id" element={<Perfil />} /> {/* Nova rota para perfil */}
            </Routes>
        </Router>
    );
}

export default App;
