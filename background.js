chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Envia a URL para o módulo de verificação
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: checkUrl,
            args: [tab.url]
        });
    }
});

async function checkUrl(url) {
    // Módulo de Análise Local: Verifica cookies, cache e labels
    let isSafe = await analyzeLocalData(url);
    if (!isSafe) {
        alertUser("Site potencialmente malicioso detectado.");
    } else {
        console.log("Site seguro.");
    }
}

async function analyzeLocalData(url) {
    // Implementação de consulta de cookies e cache
    const cookies = await chrome.cookies.getAll({ url: url });
    const cacheData = await fetch(url, { method: 'HEAD' });

    // Conectando ao servidor backend para consulta de domínio
    const response = await fetch("https://seu-servidor-backend.com/api/validateDomain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, cookies, cacheData })
    });
    
    return response.ok;
}

function alertUser(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'alert_icon.png',
        title: 'Alerta de Segurança',
        message: message
    });
}
