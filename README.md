npm install
Vite --host


Guia Rápido: Configuração e Execução do Frontend
Este guia é para você configurar e rodar o projeto frontend rapidinho.
Este prjeto usa Vite
🚀 Primeiros Passos
Antes de tudo, tenha Node.js e npm (ou Yarn/pnpm, se preferir) instalados.

Acesse a Pasta do Projeto:
Abra seu terminal e navegue até a pasta raiz do projeto frontend.

Instale as Dependências:

Bash

npm install
⚙️ Configuração da Conexão com o Backend
O frontend precisa saber onde o backend está rodando para se comunicar.

1. Verifique a URL da API
   A URL base do seu backend está configurada no arquivo:

src/services/api.ts
Abra este arquivo e certifique-se de que a variável API_URL aponte para o endereço e porta corretos do seu backend. Por exemplo:

TypeScript

// src/services/api.ts
import axios from 'axios';

// Certifique-se de que esta URL corresponde ao seu backend
const API_URL = 'http://localhost:3005';

export const api = axios.create({
baseURL: API_URL,
});

api.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});
▶️ Rodando o Frontend
Com as dependências instaladas e a URL da API verificada, você pode iniciar o servidor de desenvolvimento do frontend usando o Vite.

Iniciar o Servidor de Desenvolvimento:

Bash

npm run dev
Este comando, configurado no package.json, geralmente executa o vite ou vite dev. Ele inicia o servidor em http://localhost:5173 (ou outra porta disponível).

Acessar de Outros Dispositivos na Rede Local (--host):
Se você precisar acessar o frontend de outros dispositivos na mesma rede local (como seu celular), use:

Bash

npm run dev -- --host 0.0.0.0
Observação: O -- antes de --host é necessário para passar o argumento host diretamente para o comando vite que npm run dev executa.
Este comando faz com que o servidor do Vite seja acessível por qualquer interface de rede, não apenas localhost. Após executá-lo, o terminal geralmente mostrará o endereço IP da sua máquina na rede local para você acessar.