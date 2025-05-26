import { api } from '../services/api';
import 'animate.css';
import ClienteForm from '../components/ClienteForm'; // Importe o novo ClienteForm
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Cliente, CreateClienteFormData, FilterClienteQueryParams } from '../Interfaces/cliente.interface';
import {useEffect, useState} from "react"; // Importe as interfaces de Cliente

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
    const [filterParams, setFilterParams] = useState<FilterClienteQueryParams>({}); // Estado para os filtros
    const navigate = useNavigate();

    // Efeito para buscar clientes na montagem do componente ou quando navegar
    useEffect(() => {
        fetchClientes();
    }, [navigate]);

    // Efeito para filtrar clientes quando a lista original ou os parâmetros de filtro mudam
    useEffect(() => {
        filterClientesLocalmente(); // Filtro local para os campos já retornados
    }, [clientes, filterParams]);

    const fetchClientes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Se precisar buscar clientes já filtrados pelo backend, use assim:
            // const response = await api.get('/clientes', { params: filterParams });
            const response = await api.get('/clientes'); // Busca todos e filtra localmente por enquanto
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            alert('Erro ao buscar clientes.');
        }
    };

    // Função para filtrar clientes localmente
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

    // Função para adicionar um novo cliente
    async function addCliente(clienteData: CreateClienteFormData) {
        try {
            const response = await api.post('/clientes', clienteData);
            setClientes(prevClientes => [...prevClientes, response.data]);
            alert('Cliente adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            alert('Erro ao adicionar cliente.');
        }
    }

    // Função para deletar um cliente
    async function deleteCliente(id: number) {
        if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }
        try {
            await api.delete(`/clientes/${id}`);
            setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== id));
            alert('Cliente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir cliente.');
        }
    }

    // Função para editar um cliente (exemplo de prompt)
    async function editCliente(id: number, currentData: Cliente) {
        const newNome = prompt('Novo Nome:', currentData.Nome);
        const newCidade = prompt('Nova Cidade:', currentData.Cidade);
        const newLimiteCredito = prompt('Novo Limite de Crédito:', currentData.LimiteCredito.toString());

        if (newNome === null || newCidade === null || newLimiteCredito === null) {
            return; // Usuário cancelou
        }

        // Crie um objeto com os dados que deseja enviar para atualização
        const updateData: Partial<CreateClienteFormData> = {
            Nome: newNome,
            Cidade: newCidade,
            // Certifique-se de que LimiteCredito seja um número
            LimiteCredito: parseFloat(newLimiteCredito),
        };

        try {
            // Note: O método PATCH pode ser usado para atualizações parciais
            // se o seu backend estiver configurado para isso (com @nestjs/mapped-types no DTO)
            const response = await api.put(`/clientes/${id}`, updateData);
            setClientes(prevClientes =>
                prevClientes.map(cliente => (cliente.id === id ? { ...cliente, ...response.data } : cliente))
            );
            alert('Cliente atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            alert('Erro ao editar cliente.');
        }
    }

    return (
        <div className="flex">
            <div className="w-1/4">
                <Sidebar username={'User'} userEmail={'user@example.com'} /> {/* Ajuste conforme sua autenticação */}
            </div>
            <div className="w-3/4 p-5">
                <h2 className="text-3xl font-semibold text-blue-600 text-center mb-8 animate__animated animate__fadeInDown">
                    Lista de Clientes
                </h2>

                <ClienteForm onClienteAdded={addCliente} /> {/* Use o novo ClienteForm */}

                {/* Filtros de pesquisa */}
                <div className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Filtrar Clientes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Filtrar por Código"
                            value={filterParams.Codigo || ''}
                            onChange={(e) => setFilterParams(prev => ({ ...prev, Codigo: e.target.value }))}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por Nome"
                            value={filterParams.Nome || ''}
                            onChange={(e) => setFilterParams(prev => ({ ...prev, Nome: e.target.value }))}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por Cidade"
                            value={filterParams.Cidade || ''}
                            onChange={(e) => setFilterParams(prev => ({ ...prev, Cidade: e.target.value }))}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="number"
                            placeholder="Filtrar por CEP"
                            value={filterParams.CEP === undefined ? '' : filterParams.CEP}
                            onChange={(e) => setFilterParams(prev => ({ ...prev, CEP: parseInt(e.target.value) || undefined }))}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {/* Botão de limpar filtros se desejar */}
                    {/* <button onClick={() => setFilterParams({})} className="mt-2 bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded">Limpar Filtros</button> */}
                </div>

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
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
                                        onClick={() => editCliente(cliente.id, cliente)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                        onClick={() => deleteCliente(cliente.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}