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

// SVG do Ganso Melhorado (Articulado para animação)
const gooseSVG = `
<svg viewBox="0 0 120 120" width="100%" height="100%" style="overflow: visible;">
    <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
                <feMergeNode in="offsetblur"/>
                <feMergeNode in="SourceGraphic"/> 
            </feMerge>
        </filter>
    </defs>
    <g id="goose-container" filter="url(#shadow)">
        <!-- Perna Traseira (Laranja Escuro) -->
        <g id="leg-back" transform="translate(60, 85)">
            <path d="M0,0 L0,15 L10,15" stroke="#e07c00" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>

        <!-- Perna Dianteira (Laranja Claro) -->
        <g id="leg-front" transform="translate(45, 85)">
            <path d="M0,0 L0,15 L10,15" stroke="orange" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        
        <!-- Corpo (Branco) -->
        <g id="body-group">
            <!-- Corpo Principal -->
            <path d="M30,60 Q30,40 60,40 L80,40 Q100,40 100,60 Q100,85 70,85 L45,85 Q30,85 30,60 Z" fill="white"/>
            
            <!-- Asa -->
            <path d="M45,55 Q55,45 80,55 Q90,65 80,75 Q60,80 45,70" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            
            <!-- Pescoço e Cabeça -->
            <g id="neck-head" transform="translate(85, 50)">
                <!-- Pescoço -->
                <path d="M0,0 Q10,-20 10,-35 Q10,-50 -5,-50" fill="none" stroke="white" stroke-width="18" stroke-linecap="round"/>
                <!-- Cabeça -->
                <circle cx="-5" cy="-50" r="14" fill="white"/>
                <!-- Bico -->
                <path d="M5,-54 L22,-52 L22,-44 L5,-46 Z" fill="orange"/>
                <!-- Olho -->
                <circle cx="0" cy="-54" r="2" fill="black"/>
            </g>
        </g>
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
    
    // Configuração inicial
    Object.assign(goose.style, {
        position: 'fixed',
        width: '120px', // Maior para ver detalhes
        height: '120px',
        zIndex: '100000',
        pointerEvents: 'none',
        left: '-150px', // Começa fora
        top: '50%',
        willChange: 'left, top, transform', // Otimização de performance
    });
    document.body.appendChild(goose);

    // CSS das animações realistas
    const style = document.createElement('style');
    style.innerHTML = `
        /* Animação das pernas (caminhada) */
        @keyframes walk-leg {
            0% { transform: translate(45px, 85px) rotate(-20deg); }
            50% { transform: translate(45px, 85px) rotate(30deg); }
            100% { transform: translate(45px, 85px) rotate(-20deg); }
        }
        @keyframes walk-leg-back {
            0% { transform: translate(60px, 85px) rotate(30deg); }
            50% { transform: translate(60px, 85px) rotate(-20deg); }
            100% { transform: translate(60px, 85px) rotate(30deg); }
        }
        
        /* Animação do corpo (balanço) */
        @keyframes body-bob {
            0% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(1deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-3px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        /* Classes ativas */
        .goose-walking #leg-front {
            animation: walk-leg 0.4s infinite linear;
            transform-origin: 0 0; /* Articulação no topo da perna */
        }
        .goose-walking #leg-back {
            animation: walk-leg-back 0.4s infinite linear;
            transform-origin: 0 0;
        }
        .goose-walking #body-group {
            animation: body-bob 0.4s infinite ease-in-out;
        }

        /* Balão de texto */
        .honk-bubble {
            position: absolute;
            top: 0px;
            left: 80px;
            background: white;
            border: 3px solid black;
            padding: 8px 12px;
            border-radius: 12px;
            border-bottom-left-radius: 0;
            font-weight: 900;
            font-family: 'Arial Black', sans-serif;
            font-size: 16px;
            color: black;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
            white-space: nowrap;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 100001;
        }
        .honk-visible {
            opacity: 1;
            transform: scale(1) rotate(-10deg);
        }
    `;
    document.head.appendChild(style);

    // Balão de Honk
    const honkBubble = document.createElement('div');
    honkBubble.className = 'honk-bubble';
    honkBubble.innerText = 'HONK!';
    goose.appendChild(honkBubble);

    // Elementos do SVG para animar
    const legFront = goose.querySelector('#leg-front');
    const legBack = goose.querySelector('#leg-back');

    // Função Honk (Rápida e agressiva)
    const honk = async (text = 'HONK!') => {
        honkBubble.innerText = text;
        honkBubble.classList.add('honk-visible');
        
        // Vibração do ganso ao grasnar
        goose.style.transform += ' scale(1.1)';
        setTimeout(() => {
            goose.style.transform = goose.style.transform.replace(' scale(1.1)', '');
        }, 100);

        await new Promise(r => setTimeout(r, 600));
        honkBubble.classList.remove('honk-visible');
    };

    // Função de espera
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    // Função Andar (Mais inteligente)
    const walkTo = async (x, y) => {
        const currentLeft = parseFloat(getComputedStyle(goose).left);
        const currentTop = parseFloat(getComputedStyle(goose).top);
        
        // Ajuste para o centro do ganso (aprox 60x60)
        const targetX = x - 60;
        const targetY = y - 60;

        // Direção
        const isGoingRight = targetX > currentLeft;
        
        // Espelhar o ganso corretamente
        const scaleX = isGoingRight ? 1 : -1;
        goose.querySelector('svg').style.transform = `scaleX(${scaleX})`;
        
        // Ajustar balão para não ficar invertido
        honkBubble.style.transform = isGoingRight ? 'rotate(0deg)' : 'scaleX(-1) rotate(0deg)';
        honkBubble.style.left = isGoingRight ? '80px' : '20px';

        // Ativa animação
        goose.classList.add('goose-walking');
        
        // Velocidade mais rápida (0.6px/ms)
        const dist = Math.sqrt(Math.pow(targetX - currentLeft, 2) + Math.pow(targetY - currentTop, 2));
        const speed = 0.6; 
        const duration = dist / speed;

        // Aplica movimento
        goose.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        
        // Força reflow para garantir transição
        goose.getBoundingClientRect();
        
        goose.style.left = targetX + 'px';
        goose.style.top = targetY + 'px';

        await wait(duration);
        
        // Para animação
        goose.classList.remove('goose-walking');
        goose.style.transition = 'none'; // Reseta transição para movimentos instantâneos se precisar
    };

    // --- Roteiro do Caos ---

    // 1. Entrada Rápida
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Aparece vindo da borda mais próxima
    await walkTo(centerX, centerY);
    await honk("QUACK!");
    
    // Alvos (Prioriza texto grande e cards)
    const targets = Array.from(document.querySelectorAll('h1, h2, .rounded-lg, p, li, i, a'));
    
    for (const target of targets) {
        if (!target.isConnected || target.style.display === 'none') continue;
        const rect = target.getBoundingClientRect();
        
        // Pula elementos invisíveis ou muito pequenos
        if (rect.width < 10 || rect.height < 10) continue;

        // Vai até o elemento
        await walkTo(rect.left + rect.width/2, rect.top + rect.height/2);
        
        // Animação de "Puxar"
        await honk("MINE!");
        
        // Efeito visual no alvo
        target.style.transition = 'all 0.4s ease-in';
        target.style.transformOrigin = 'center';
        target.style.transform = 'scale(0) rotate(180deg)';
        target.style.opacity = '0';
        
        await wait(200); // Espera rapidinho
        target.style.display = 'none'; // Remove
    }

    // Saída Triunfal
    await honk("BYE!");
    await walkTo(window.innerWidth + 200, window.innerHeight / 2);

    // Tela Final Hacker
    document.body.innerHTML = '';
    Object.assign(document.body.style, {
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        color: '#0f0',
        fontFamily: 'monospace'
    });

    const h1 = document.createElement('h1');
    h1.innerText = "SYSTEM SECURED BY GOOSE";
    h1.style.fontSize = '3rem';
    h1.style.textShadow = '0 0 10px #0f0';
    document.body.appendChild(h1);

    const img = document.createElement('div');
    img.innerHTML = gooseSVG;
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.marginTop = '20px';
    document.body.appendChild(img);
}
