import { api } from '../services/api';
import 'animate.css';
import Sidebar from '../components/Sidebar';
import ClienteProfile from '../components/ClienteProfile'; // Importe o novo componente
import { useNavigate, useParams } from 'react-router-dom'; // Importe useParams
import { Cliente, CreateClienteFormData, FilterClienteQueryParams } from '../Interfaces/cliente.interface';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify'; // Importar toast (certifique-se de ter 'react-toastify' instalado)
import 'react-toastify/dist/ReactToastify.css'; // Estilos do toast

export default function Perfil() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [filterParams] = useState<FilterClienteQueryParams>({});
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null); // Novo estado para o cliente selecionado

    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>(); // Use useParams para obter o ID da URL

    // Efeito para carregar o cliente específico se o ID estiver na URL
    useEffect(() => {
        if(localStorage.getItem('role') == 'ADMIN'){
            navigate('/usuarios');
        }
        if (id) {
            fetchClienteById(Number(id));
        } else {
            setSelectedCliente(null); // Limpa o cliente selecionado se não houver ID na URL
            fetchClientes(); // Carrega a lista se não estiver visualizando um perfil
        }
    }, [id, navigate]); // Depende do ID da URL e do navigate

    // Efeito para filtrar a lista localmente
    useEffect(() => {
        if (!id) { // Só filtra se não estiver em modo de visualização de perfil
            filterClientesLocalmente();
        }
    }, [clientes, filterParams, id]);

    const fetchClientes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            toast.error('Você não está autenticado.');
            return;
        }

        try {
            const response = await api.get('/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            toast.error('Erro ao buscar clientes.');
        }
    };

    const fetchClienteById = async (clienteId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            toast.error('Você não está autenticado.');
            return;
        }

        try {
            const response = await api.get(`/clientes/${clienteId}`);
            setSelectedCliente(response.data);
        } catch (error) {
            console.error(`Erro ao buscar cliente com ID ${clienteId}:`, error);
            toast.error('Cliente não encontrado ou erro ao buscar.');
            navigate('/clientes'); // Volta para a lista se não encontrar
        }
    };

    const filterClientesLocalmente = () => {
        let tempClientes = [...clientes];

        if (filterParams.Codigo) {
            tempClientes = tempClientes.filter(cliente =>
                cliente.Codigo.toLowerCase().includes(filterParams.Codigo!.toLowerCase())
            );
        }
        if (filterParams.Nome) {
            tempClientes = tempClientes.filter(cliente =>
                cliente.Nome.toLowerCase().includes(filterParams.Nome!.toLowerCase())
            );
        }
        if (filterParams.Cidade) {
            tempClientes = tempClientes.filter(cliente =>
                cliente.Cidade.toLowerCase().includes(filterParams.Cidade!.toLowerCase())
            );
        }
        if (filterParams.CEP !== undefined && filterParams.CEP !== null) {
            tempClientes = tempClientes.filter(cliente =>
                cliente.CEP === filterParams.CEP
            );
        }
        setFilteredClientes(tempClientes);
    };

    async function addCliente(clienteData: CreateClienteFormData) {
        try {
            const response = await api.post('/clientes', clienteData);
            setClientes(prevClientes => [...prevClientes, response.data]);
            toast.success('Cliente adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            toast.error('Erro ao adicionar cliente.');
        }
    }

    async function deleteCliente(clienteId: number) {
        if (!window.confirm('Tem certeza que deseja excluir este Cliente?')) {
            return;
        }
        try {
            await api.delete(`/clientes/${clienteId}`);
            setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== clienteId));
            // Se estiver no perfil do cliente que foi deletado, navega de volta para a lista
            if (selectedCliente && selectedCliente.id === clienteId) {
                navigate('/clientes');
            }
            toast.success('Cliente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir Cliente:', error);
            toast.error('Erro ao excluir Cliente.');
        }
    }

    async function editCliente(clienteId: number, currentData: Cliente) {
        // Exemplo: Usar um modal ou formulário mais sofisticado para edição
        // Por enquanto, mantendo o prompt para simplicidade, mas o ideal seria um modal.
        const newNome = prompt('Novo Nome:', currentData.Nome);
        const newCidade = prompt('Nova Cidade:', currentData.Cidade);
        const newLimiteCredito = prompt('Novo Limite de Crédito:', currentData.LimiteCredito.toString());

        if (newNome === null || newCidade === null || newLimiteCredito === null) {
            return; // Usuário cancelou
        }

        const updateData: Partial<CreateClienteFormData> = {
            Nome: newNome,
            Cidade: newCidade,
            LimiteCredito: parseFloat(newLimiteCredito),
        };

        try {
            const response = await api.put(`/clientes/${clienteId}`, updateData);
            // Atualiza a lista de clientes
            setClientes(prevClientes =>
                prevClientes.map(cliente => (cliente.id === clienteId ? { ...cliente, ...response.data } : cliente))
            );
            // Atualiza o cliente selecionado se for o caso
            if (selectedCliente && selectedCliente.id === clienteId) {
                setSelectedCliente(response.data);
            }
            toast.success('Cliente atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar Cliente:', error);
            toast.error('Erro ao editar Cliente.');
        }
    }

    // Função para navegar para a tela de perfil
    const viewClienteProfile = (clienteId: number) => {
        navigate(`/clientes/${clienteId}`);
    };

    return (
        <div className="flex">
            <div className="w-1/4">
                <Sidebar username={'User'} userEmail={localStorage.getItem('email') || 'User@example.com'} />
            </div>
            <div className="w-3/4 p-5">
                {selectedCliente ? ( // Se um cliente está selecionado (ID na URL), mostra o perfil
                    <ClienteProfile
                        cliente={selectedCliente}
                        onEdit={editCliente}
                        onDelete={deleteCliente}
                    />
                ) : ( // Senão, mostra a lista de clientes
                    <>
                        <h2 className="text-3xl font-semibold text-blue-600 text-center mb-8 animate__animated animate__fadeInDown">
                            Perfil
                        </h2>
                        {/* Filtros de pesquisa */}


                        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden animate__animated animate__fadeInUp mt-5">
                            <thead>
                                <tr className="bg-gray-100 font-semibold">
                                    <th className="p-3 text-left">Código</th>
                                    <th className="p-3 text-left">Nome</th>
                                    <th className="p-3 text-left">CPF/CNPJ</th>
                                    <th className="p-3 text-left">Cidade</th>
                                    <th className="p-3 text-left">UF</th>
                                    <th className="p-3 text-left">Crédito</th>
                                    <th className="p-3 text-left">Validade</th>
                                    <th className="p-3 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClientes.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center text-gray-500">Nenhum cliente encontrado.</td>
                                    </tr>
                                ) : (
                                    filteredClientes.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="p-3">{cliente.Codigo}</td>
                                            <td className="p-3">{cliente.Nome}</td>
                                            <td className="p-3">{cliente.CPF_CNPJ}</td>
                                            <td className="p-3">{cliente.Cidade}</td>
                                            <td className="p-3">{cliente.UF}</td>
                                            <td className="p-3">R$ {cliente.LimiteCredito.toFixed(2)}</td>
                                            <td className="p-3">{new Date(cliente.Validade).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <button
                                                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                                                    onClick={() => viewClienteProfile(cliente.id)} // Botão para ver o perfil
                                                >
                                                    Ver Perfil
                                                </button>
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
                                                    onClick={() => editCliente(cliente.id, cliente)}
                                                >
                                                    Editar
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}