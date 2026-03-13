document.addEventListener('keydown', function(e) {
    // Detecta Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault(); // Tenta bloquear o inspetor (pode não funcionar em todos os navegadores)
        startDuckHeist();
    }
});

async function startDuckHeist() {
    // Verifica se o pato já está agindo
    if (document.getElementById('agent-duck')) return;

    // Cria o Agente Pato 🦆
    const duck = document.createElement('div');
    duck.id = 'agent-duck';
    duck.innerHTML = '🦆';
    duck.style.position = 'fixed';
    duck.style.fontSize = '80px';
    duck.style.zIndex = '99999';
    duck.style.pointerEvents = 'none';
    duck.style.transition = 'all 0.3s ease-out';
    // Começa fora da tela (esquerda)
    duck.style.left = '-100px';
    duck.style.top = '50%';
    document.body.appendChild(duck);

    // Mensagem do pato
    const msg = document.createElement('div');
    msg.innerText = "QUACK! NADA PARA VER AQUI!";
    msg.style.position = 'fixed';
    msg.style.left = '50%';
    msg.style.top = '10%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'black';
    msg.style.color = '#4ade80'; // verde hacker
    msg.style.padding = '20px';
    msg.style.fontFamily = 'monospace';
    msg.style.fontSize = '24px';
    msg.style.zIndex = '99998';
    msg.style.border = '2px solid #4ade80';
    document.body.appendChild(msg);

    // Seleciona os alvos (cards, headers, etc.)
    // Vamos pegar os cards principais e o header
    const targets = Array.from(document.querySelectorAll('.rounded-lg, h1, p, .bg-\\[\\#161b22\\]'));
    
    // Função de delay
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const target of targets) {
        if (!target.isConnected) continue; // Se já foi removido, pula

        const rect = target.getBoundingClientRect();
        
        // Pato corre até o elemento
        duck.style.left = (rect.left - 20) + 'px';
        duck.style.top = (rect.top - 20) + 'px';
        
        await wait(300); // Tempo para chegar

        // Efeito de "pegar"
        duck.style.transform = 'scale(1.2) rotate(-20deg)';
        target.style.transition = 'all 0.5s ease-in';
        target.style.transform = 'scale(0) rotate(360deg)';
        target.style.opacity = '0';

        await wait(200);

        // Reseta o pato
        duck.style.transform = 'scale(1) rotate(0deg)';
        
        // Remove o elemento da tela
        target.style.display = 'none';
    }

    // Pato vai embora vitorioso
    duck.style.left = '120%';
    await wait(1000);
    
    // Limpa tudo e mostra mensagem final
    document.body.innerHTML = '';
    document.body.style.backgroundColor = 'black';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    
    const finalMsg = document.createElement('h1');
    finalMsg.innerText = "🔒 PROTECTED BY DUCK SECURITY SYSTEMS 🦆";
    finalMsg.style.color = '#4ade80';
    finalMsg.style.fontFamily = 'monospace';
    finalMsg.style.textAlign = 'center';
    document.body.appendChild(finalMsg);
}
