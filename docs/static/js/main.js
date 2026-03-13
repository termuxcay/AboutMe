document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        startGooseChaos();
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    startGooseChaos();
});

let goose;
let isGooseActive = false;

// SVG do Ganso (Simples e fofo)
const gooseSVG = `
<svg viewBox="0 0 100 100" width="100%" height="100%">
    <g id="goose-body">
        <!-- Patas -->
        <path id="leg-left" d="M40,80 L40,95 L30,95" stroke="orange" stroke-width="4" fill="none" />
        <path id="leg-right" d="M60,80 L60,95 L70,95" stroke="orange" stroke-width="4" fill="none" />
        
        <!-- Corpo -->
        <ellipse cx="50" cy="65" rx="30" ry="20" fill="white" stroke="#ddd" stroke-width="2"/>
        
        <!-- Pescoço e Cabeça -->
        <path d="M70,55 Q80,40 80,25 Q80,10 65,10 Q50,10 50,25 L50,50" fill="white" stroke="#ddd" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Bico -->
        <path d="M80,20 L95,22 L80,25" fill="orange" />
        
        <!-- Olho -->
        <circle cx="68" cy="18" r="2" fill="black" />
        
        <!-- Asa -->
        <path d="M40,60 Q50,70 65,60" fill="none" stroke="#ddd" stroke-width="2" />
    </g>
</svg>
`;

async function startGooseChaos() {
    if (isGooseActive) return;
    isGooseActive = true;

    // Cria o ganso
    goose = document.createElement('div');
    goose.id = 'agent-goose';
    goose.innerHTML = gooseSVG;
    Object.assign(goose.style, {
        position: 'fixed',
        width: '80px',
        height: '80px',
        zIndex: '100000',
        pointerEvents: 'none',
        left: '-100px', // Começa fora
        top: '50%',
        transition: 'left 0.5s linear, top 0.5s linear', // Movimento suave
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
    });
    document.body.appendChild(goose);

    // Adiciona estilos de animação
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes waddle {
            0% { transform: rotate(-5deg) translateY(0); }
            50% { transform: rotate(5deg) translateY(-5px); }
            100% { transform: rotate(-5deg) translateY(0); }
        }
        .goose-walking {
            animation: waddle 0.3s infinite ease-in-out;
        }
        .honk-bubble {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border: 2px solid black;
            padding: 5px 10px;
            border-radius: 10px;
            font-weight: bold;
            font-family: sans-serif;
            font-size: 14px;
            color: black;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s;
        }
    `;
    document.head.appendChild(style);

    // Balão de Honk
    const honkBubble = document.createElement('div');
    honkBubble.className = 'honk-bubble';
    honkBubble.innerText = 'HONK!';
    goose.appendChild(honkBubble);

    // Alvos
    const targets = Array.from(document.querySelectorAll('h1, h2, p, li, .rounded-lg, i'));
    
    // Função de espera
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    // Função Honk
    const honk = async () => {
        honkBubble.style.opacity = '1';
        await wait(500);
        honkBubble.style.opacity = '0';
    };

    // Função Andar
    const walkTo = async (x, y) => {
        const currentLeft = parseFloat(goose.style.left || 0);
        const currentTop = parseFloat(goose.style.top || 0);
        
        // Vira o ganso
        if (x < currentLeft) {
            goose.querySelector('svg').style.transform = 'scaleX(-1)'; // Olha pra esquerda
        } else {
            goose.querySelector('svg').style.transform = 'scaleX(1)'; // Olha pra direita
        }

        goose.classList.add('goose-walking');
        
        // Calcula tempo baseado na distância (velocidade constante)
        const dist = Math.sqrt(Math.pow(x - currentLeft, 2) + Math.pow(y - currentTop, 2));
        const speed = 0.3; // pixels por ms
        const duration = dist / speed;

        goose.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        goose.style.left = x + 'px';
        goose.style.top = y + 'px';

        await wait(duration);
        goose.classList.remove('goose-walking');
    };

    // Entra na tela
    await walkTo(window.innerWidth / 2, window.innerHeight / 2);
    await honk();
    await wait(500);

    // Rouba os itens
    for (const target of targets) {
        if (!target.isConnected || target.style.display === 'none') continue;
        
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        // Vai até o item
        await walkTo(rect.left - 40, rect.top - 20);
        
        // Pega o item
        await honk();
        target.style.transition = 'transform 0.5s, opacity 0.5s';
        target.style.transform = 'scale(0.1) rotate(360deg) translate(100px, -100px)';
        target.style.opacity = '0';
        
        await wait(200);
        target.style.display = 'none';
    }

    // Sai vitorioso
    await walkTo(window.innerWidth + 200, window.innerHeight / 2);
    
    // Tela final
    document.body.innerHTML = '';
    document.body.style.background = '#0a0a0f';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    
    const endMsg = document.createElement('h1');
    endMsg.innerText = "GOOSE SECURITY: THREAT ELIMINATED";
    endMsg.style.color = '#4ade80';
    endMsg.style.fontFamily = 'monospace';
    endMsg.style.fontSize = '2rem';
    endMsg.style.textAlign = 'center';
    
    const subMsg = document.createElement('p');
    subMsg.innerText = "HONK!";
    subMsg.style.color = 'orange';
    subMsg.style.fontFamily = 'monospace';
    subMsg.style.fontSize = '1.5rem';
    subMsg.style.marginTop = '20px';

    document.body.appendChild(endMsg);
    document.body.appendChild(subMsg);
}
