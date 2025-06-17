import { Cliente } from '../Interfaces/cliente.interface';
import { useNavigate } from 'react-router-dom';

interface ClienteProfileProps {
  cliente: Cliente;
  onEdit: (id: number, currentData: Cliente) => void;
  onDelete: (id: number) => void;
}

export default function ClienteProfile({ cliente, onEdit, onDelete }: ClienteProfileProps) {
  const navigate = useNavigate();

  if (!cliente) {
    return <div className="text-center text-gray-500">Nenhum Perfil selecionado.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate__animated animate__fadeInUp">
      <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Perfil do Usuario</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold text-gray-700">Código:</p>
          <p className="text-gray-900">{cliente.Codigo}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Nome:</p>
          <p className="text-gray-900">{cliente.Nome}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">CPF/CNPJ:</p>
          <p className="text-gray-900">{cliente.CPF_CNPJ}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">E-mail:</p>
          <p className="text-gray-900">{localStorage.getItem('email') || 'N/A'}</p> {/* Assumindo que você incluiu o usuário */}
        </div>
        <div>
          <p className="font-semibold text-gray-700">Endereço:</p>
          <p className="text-gray-900">{`${cliente.Logradouro}, ${cliente.Numero} ${cliente.Complemento ? `- ${cliente.Complemento}` : ''}`}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Bairro:</p>
          <p className="text-gray-900">{cliente.Bairro}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Cidade/UF:</p>
          <p className="text-gray-900">{`${cliente.Cidade} - ${cliente.UF}`}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">CEP:</p>
          <p className="text-gray-900">{cliente.CEP}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Telefone:</p>
          <p className="text-gray-900">{cliente.Fone || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Limite de Crédito:</p>
          <p className="text-gray-900">R$ {cliente.LimiteCredito.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Validade do Crédito:</p>
          <p className="text-gray-900">{new Date(cliente.Validade).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Data de Cadastro:</p>
          <p className="text-gray-900">{new Date(cliente.DataHoraCadastro).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded mr-3"
          onClick={() => onEdit(cliente.id, cliente)}
        >
          Editar Perfil
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-5 rounded"
          onClick={() => navigate('/clientes')} // Volta para a lista de clientes
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}