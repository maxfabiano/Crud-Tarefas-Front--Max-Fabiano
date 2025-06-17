export interface CreateClienteFormData {
  idUsuario: number;
  Codigo: string;
  Nome: string;
  password: string;
  email: string;
  CPF_CNPJ: string;
  CEP: string;
  Logradouro: string;
  Endereco: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  UF: string;
  Complemento?: string;
  Fone?: string;
  LimiteCredito: number;
  Validade: string;
}
export interface Cliente {
  id: number;
  idUsuario: number;
  DataHoraCadastro: string;
  Codigo: string;
  Nome: string;
  CPF_CNPJ: string;
  CEP: number;
  Logradouro: string;
  Endereco: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  UF: string;
  Complemento?: string;
  Fone?: string;
  LimiteCredito: number;
  Validade: string;
}
export interface FilterClienteQueryParams {
  Codigo?: string;
  Nome?: string;
  Cidade?: string;
  CEP?: number;
}