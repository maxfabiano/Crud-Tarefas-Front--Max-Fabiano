import React, { useState } from 'react';
import { CreateClienteFormData } from '../Interfaces/cliente.interface';
import { fetchAddressByCep } from '../services/viacep.service';

interface ClienteFormProps {
    onClienteAdded: (clienteData: CreateClienteFormData) => void;
}

export default function ClienteForm({ onClienteAdded }: ClienteFormProps) {
    const id = localStorage.getItem('id');
    const [formData, setFormData] = useState<CreateClienteFormData>({
        idUsuario: Number(id),
        Codigo: '12132132',
        Nome: '',
        email: '',
        password: '',
        CPF_CNPJ: '',
        CEP: '',
        Logradouro: '',
        Endereco: '',
        Numero: '',
        Bairro: '',
        Cidade: '',
        UF: '',
        Complemento: '',
        Fone: '',
        LimiteCredito: 0,
        Validade: new Date().toISOString().split('T')[0],
    });
    const [isAddressAutofilled, setIsAddressAutofilled] = useState(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = event.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
        if (name === 'CEP') {
            setIsAddressAutofilled(false);
        }
    }

    const handleCepBlur = async () => {
            const cep = String(formData.CEP);

            if (cep.replace(/\D/g, '').length === 8 && cep !== '0') {
                const addressData = await fetchAddressByCep(cep);

                if (addressData) {
                    setFormData(prevData => ({
                        ...prevData,
                        Logradouro: addressData.logradouro || '',
                        Bairro: addressData.bairro || '',
                        Cidade: addressData.localidade || '',
                        UF: addressData.uf || '',
                        Complemento: addressData.complemento || '',
                    }));
                    setIsAddressAutofilled(true); // Marca que o endereço foi preenchido automaticamente
                } else {
                    setFormData(prevData => ({
                        ...prevData,
                        Logradouro: '',
                        Bairro: '',
                        Cidade: '',
                        UF: '',
                        Complemento: '',
                    }));
                    setIsAddressAutofilled(false);
                    alert('CEP não encontrado ou inválido. Por favor, verifique e preencha o endereço manualmente.');
                }
            }
        };

    function handleSubmit(event: React.FormEvent) {
            event.preventDefault();

            if (!formData.Codigo || !formData.Nome || !formData.CPF_CNPJ || !formData.Cidade || !formData.UF) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            onClienteAdded(formData);

            setFormData({
                idUsuario: 1,
                Codigo: '',
                Nome: '',
                email: '',
                password: '',
                CPF_CNPJ: '',
                CEP: '',
                Logradouro: '',
                Endereco: '',
                Numero: '',
                Bairro: '',
                Cidade: '',
                UF: '',
                Complemento: '',
                Fone: '',
                LimiteCredito: 0,
                Validade: new Date().toISOString().split('T')[0],
            });
            setIsAddressAutofilled(false);
        }

        return (
            <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-md bg-white">
                <h2 className="h4 text-primary text-center mb-4">Cadastro de Usuarios Regulares</h2>

                <div className="row g-3">

                    {}
                    <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">Email do Usuário:</label>
                                            <input
                                                disabled={false}
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                    <div className="col-md-6">
                                            <label htmlFor="password" className="form-label">Senha do Usuário:</label>
                                            <input
                                                disabled={false}
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                    <div className="col-md-6">
                        <label htmlFor="idUsuario" className="form-label">ID do Usuário:</label>
                        <input
                            disabled={true}
                            type="number"
                            id="idUsuario"
                            name="idUsuario"
                            value={formData.idUsuario}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="Codigo" className="form-label">Código:</label>
                        <input
                            disabled={true}
                            type="text"
                            id="Codigo"
                            name="Codigo"
                            placeholder="Código do Cliente"
                            value={formData.Codigo}
                            onChange={handleChange}
                            maxLength={15}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-12">
                        <label htmlFor="Nome" className="form-label">Nome:</label>
                        <input
                            type="text"
                            id="Nome"
                            name="Nome"
                            placeholder="Nome Completo do Cliente"
                            value={formData.Nome}
                            onChange={handleChange}
                            maxLength={150}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="CPF_CNPJ" className="form-label">CPF/CNPJ:</label>
                        <input
                            type="text"
                            id="CPF_CNPJ"
                            name="CPF_CNPJ"
                            placeholder="CPF ou CNPJ"
                            value={formData.CPF_CNPJ}
                            onChange={handleChange}
                            maxLength={40}
                            required
                            className="form-control"
                        />
                    </div>

                    {/* CEP - Adicionado onBlur para busca automática */}
                    <div className="col-md-6">
                        <label htmlFor="CEP" className="form-label">CEP:</label>
                        <input
                            type="text"
                            id="CEP"
                            name="CEP"
                            placeholder="CEP (apenas números)"
                            value={formData.CEP === '' ? '' : formData.CEP}
                            onChange={handleChange}
                            onBlur={handleCepBlur}
                            maxLength={8}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-12">
                        <label htmlFor="Logradouro" className="form-label">Logradouro:</label>
                        <input
                            type="text"
                            id="Logradouro"
                            name="Logradouro"
                            placeholder="Logradouro"
                            value={formData.Logradouro}
                            onChange={handleChange}
                            maxLength={100}
                            required
                            className="form-control"
                            readOnly={isAddressAutofilled}
                        />
                    </div>

                    {}
                    <div className="col-md-8">
                        <label htmlFor="Endereco" className="form-label">Endereço:</label>
                        <input
                            type="text"
                            id="Endereco"
                            name="Endereco"
                            placeholder="Número e nome da rua"
                            value={formData.Endereco}
                            onChange={handleChange}
                            maxLength={120}
                            required
                            className="form-control"
                        />
                    </div>

                    {/* Número */}
                    <div className="col-md-4">
                        <label htmlFor="Numero" className="form-label">Número:</label>
                        <input
                            type="text"
                            id="Numero"
                            name="Numero"
                            placeholder="Número"
                            value={formData.Numero}
                            onChange={handleChange}
                            maxLength={20}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="Bairro" className="form-label">Bairro:</label>
                        <input
                            type="text"
                            id="Bairro"
                            name="Bairro"
                            placeholder="Bairro"
                            value={formData.Bairro}
                            onChange={handleChange}
                            maxLength={50}
                            required
                            className="form-control"
                            readOnly={isAddressAutofilled}
                        />
                    </div>

                    {}
                    <div className="col-md-4">
                        <label htmlFor="Cidade" className="form-label">Cidade:</label>
                        <input
                            type="text"
                            id="Cidade"
                            name="Cidade"
                            placeholder="Cidade"
                            value={formData.Cidade}
                            onChange={handleChange}
                            maxLength={60}
                            required
                            className="form-control"
                            readOnly={isAddressAutofilled}
                        />
                    </div>

                    {}
                    <div className="col-md-2">
                        <label htmlFor="UF" className="form-label">UF:</label>
                        <input
                            type="text"
                            id="UF"
                            name="UF"
                            placeholder="UF"
                            value={formData.UF}
                            onChange={handleChange}
                            maxLength={2}
                            required
                            className="form-control"
                            readOnly={isAddressAutofilled}
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="Complemento" className="form-label">Complemento (Opcional):</label>
                        <input
                            type="text"
                            id="Complemento"
                            name="Complemento"
                            placeholder="Ex: Apt 101"
                            value={formData.Complemento}
                            onChange={handleChange}
                            maxLength={150}
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="Fone" className="form-label">Telefone (Opcional):</label>
                        <input
                            type="text"
                            id="Fone"
                            name="Fone"
                            placeholder="Ex: (XX) XXXX-XXXX"
                            value={formData.Fone}
                            onChange={handleChange}
                            maxLength={15}
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="LimiteCredito" className="form-label">Limite de Crédito:</label>
                        <input
                            type="number"
                            id="LimiteCredito"
                            name="LimiteCredito"
                            placeholder="0.00"
                            value={formData.LimiteCredito}
                            onChange={handleChange}
                            step="0.01"
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-md-6">
                        <label htmlFor="Validade" className="form-label">Validade:</label>
                        <input
                            type="date"
                            id="Validade"
                            name="Validade"
                            value={formData.Validade}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    {}
                    <div className="col-12 mt-4">
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                        >
                            Cadastrar Usuario
                        </button>
                    </div>
                </div>
            </form>
        );
}