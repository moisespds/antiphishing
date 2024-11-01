const express = require('express');
const dns = require('dns');
const app = express();

app.use(express.json());

app.post('/api/validateDomain', (req, res) => {
    const { url, cookies, cacheData } = req.body;

    // Extrair hostname
    const hostname = new URL(url).hostname;

    // Verificar com serviço DNS
    dns.lookup(hostname, (err, address) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao consultar o DNS.' });
        }
        
        // Validar domínio com base em listas confiáveis
        if (validateDomain(address, hostname)) {
            res.status(200).json({ message: 'Domínio validado com sucesso.' });
        } else {
            res.status(400).json({ message: 'Domínio suspeito.' });
        }
    });
});

function validateDomain(address, hostname) {
    // Implementar lógica de validação de domínio
    const knownSafeDomains = ["amazon.com", "paypal.com"];  // Exemplo de lista segura
    return knownSafeDomains.includes(hostname);
}

app.listen(3000, () => {
    console.log('Servidor de verificação de phishing rodando na porta 3000');
});
