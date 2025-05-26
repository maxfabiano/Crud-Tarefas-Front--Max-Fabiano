interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string; // Cidade
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export async function fetchAddressByCep(cep: string): Promise<ViaCEPResponse | null> {
    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length !== 8) {
        console.warn('CEP inválido: deve conter 8 dígitos.');
        return null;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);

        if (!response.ok) {
            console.error(`Erro ao buscar CEP ${cleanedCep}: Status ${response.status}`);
            return null;
        }

        const data: ViaCEPResponse = await response.json();

        if (data.erro === true) {
            console.warn(`CEP ${cleanedCep} não encontrado na base de dados do ViaCEP.`);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição ViaCEP:', error);
        return null;
    }
}