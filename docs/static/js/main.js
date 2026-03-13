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

// SVG do Ganso (Visual Desktop Goose Style - Mais Limpo)
const gooseSVG = `
<svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
        <feOffset dx="1" dy="2" result="offsetblur"/>
        <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge> 
            <feMergeNode in="offsetblur"/>
            <feMergeNode in="SourceGraphic"/> 
        </feMerge>
    </filter>
    
    <g id="goose-body" filter="url(#shadow)">
        <!-- Pernas -->
        <g id="legs" transform="translate(50, 75)">
            <path id="leg-left" d="M-5,0 L-5,12 L-12,12" stroke="orange" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path id="leg-right" d="M5,0 L5,12 L12,12" stroke="#e07c00" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>

        <!-- Corpo Principal -->
        <g id="body-group">
            <!-- Corpo -->
            <path d="M25,60 Q25,45 50,45 L65,45 Q85,45 85,60 Q85,78 60,78 L40,78 Q25,78 25,60 Z" fill="white"/>
            
            <!-- Asa -->
            <path d="M40,55 Q50,55 65,55 Q75,60 70,70 Q55,72 40,65" fill="white" stroke="#e5e7eb" stroke-width="2"/>
            
            <!-- Pescoço e Cabeça (Mais proporcional) -->
            <g id="neck-head">
                <!-- Pescoço -->
                <path d="M75,50 Q80,35 80,25" fill="none" stroke="white" stroke-width="14" stroke-linecap="round"/>
                
                <!-- Cabeça -->
                <circle cx="80" cy="22" r="11" fill="white"/>

                <!-- Boina Duck Shelby -->
                <path d="M68,16 Q80,10 94,16 L94,19 Q80,23 68,19 Z" fill="#333" />
                <ellipse cx="80" cy="16" rx="13" ry="5" fill="#444" />
                <circle cx="80" cy="14" r="1" fill="#222" />
                
                <!-- Bico -->
                <path d="M88,18 L98,20 L98,26 L88,26 Z" fill="orange"/>
                
                <!-- Olho -->
                <circle cx="83" cy="19" r="1.5" fill="black"/>
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
        width: '100px',
        height: '100px',
        zIndex: '100000',
        pointerEvents: 'none',
        left: '-150px',
        top: '50%',
        willChange: 'left, top, transform',
    });
    document.body.appendChild(goose);

    // CSS das animações
    const style = document.createElement('style');
    style.innerHTML = `
        /* Animação das pernas */
        @keyframes walk {
            0% { transform: translateY(0); }
            25% { transform: translateY(-2px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(-2px); }
            100% { transform: translateY(0); }
        }
        
        @keyframes leg-move {
            0% { transform: translateX(0); }
            50% { transform: translateX(4px); }
            100% { transform: translateX(0); }
        }

        .goose-walking #body-group {
            animation: walk 0.3s infinite ease-in-out;
        }
        
        .goose-walking #leg-left {
            animation: leg-move 0.3s infinite reverse;
        }
        .goose-walking #leg-right {
            animation: leg-move 0.3s infinite;
        }

        /* Balão de texto */
        .honk-bubble {
            position: absolute;
            top: -10px;
            left: 80px;
            background: white;
            border: 3px solid black;
            padding: 8px 12px;
            border-radius: 8px;
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            color: black;
            box-shadow: 3px 3px 0px rgba(0,0,0,0.2);
            white-space: nowrap;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.1s, transform 0.1s;
            z-index: 100001;
            pointer-events: none;
        }
        .honk-visible {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);

    // Balão de Honk
    const honkBubble = document.createElement('div');
    honkBubble.className = 'honk-bubble';
    honkBubble.innerText = 'HONK!';
    goose.appendChild(honkBubble);

    // Função Honk
    const honk = async (text = 'HONK!') => {
        honkBubble.innerText = text;
        honkBubble.classList.add('honk-visible');
        
        // Pequeno pulo
        const svg = goose.querySelector('svg');
        svg.style.transform += ' translateY(-5px)';
        setTimeout(() => {
            svg.style.transform = svg.style.transform.replace(' translateY(-5px)', '');
        }, 100);

        await new Promise(r => setTimeout(r, 800));
        honkBubble.classList.remove('honk-visible');
    };

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    // Função Andar
    const walkTo = async (x, y) => {
        const currentLeft = parseFloat(getComputedStyle(goose).left);
        const currentTop = parseFloat(getComputedStyle(goose).top);
        
        const targetX = x - 50; // Centraliza (100px width / 2)
        const targetY = y - 50; // Centraliza

        const isGoingRight = targetX > currentLeft;
        
        // Espelhar APENAS o SVG, não o container (para não inverter o texto)
        const svg = goose.querySelector('svg');
        if (isGoingRight) {
            svg.style.transform = 'scaleX(1)';
            honkBubble.style.left = '80px'; // Balão na direita
        } else {
            svg.style.transform = 'scaleX(-1)';
            honkBubble.style.left = '-20px'; // Balão na esquerda
        }

        goose.classList.add('goose-walking');
        
        const dist = Math.sqrt(Math.pow(targetX - currentLeft, 2) + Math.pow(targetY - currentTop, 2));
        const speed = 0.5; 
        const duration = dist / speed;

        goose.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        goose.getBoundingClientRect(); // Force reflow
        
        goose.style.left = targetX + 'px';
        goose.style.top = targetY + 'px';

        await wait(duration);
        
        goose.classList.remove('goose-walking');
        goose.style.transition = 'none';
    };

    // --- ROTEIRO ---

    // 1. Entrada
    await walkTo(window.innerWidth / 2, window.innerHeight / 2);
    await honk("QUACK!");
    
    // 2. Caça aos elementos
    const targets = Array.from(document.querySelectorAll('h1, h2, p, li, a, i, .rounded-lg'));
    
    for (const target of targets) {
        if (!target.isConnected || target.style.display === 'none') continue;
        const rect = target.getBoundingClientRect();
        
        if (rect.width < 10 || rect.height < 10) continue;

        // Vai até o elemento
        await walkTo(rect.left + rect.width/2, rect.top + rect.height/2);
        
        // Rouba
        await honk("HONK!");
        
        target.style.transition = 'transform 0.3s, opacity 0.3s';
        target.style.transform = 'scale(0) rotate(45deg)';
        target.style.opacity = '0';
        
        await wait(150);
        target.style.display = 'none';
    }

    // 3. Saída
    await honk("BYE!");
    await walkTo(window.innerWidth + 200, window.innerHeight / 2);

    // 4. Tela Final
    document.body.innerHTML = '';
    Object.assign(document.body.style, {
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden',
        color: '#4ade80',
        fontFamily: 'monospace'
    });

    const h1 = document.createElement('h1');
    h1.innerHTML = "DUCK SHELBY:<br>PROTEGENDO A ORDEM DOS PATOS PELO SRTERMAX";
    h1.style.fontSize = '2rem';
    h1.style.textAlign = 'center';
    h1.style.marginBottom = '20px';
    h1.style.lineHeight = '1.5';
    document.body.appendChild(h1);

    const img = document.createElement('div');
    img.innerHTML = gooseSVG;
    img.style.width = '150px';
    img.style.height = '150px';
    document.body.appendChild(img);
}
