/* =========================================================
   SPLASH SCREEN CONTROLLER
   - Matrix code rain (Canvas)
   - Boot sequence
   - Profile + Typing animation
   - Circular neon loader
   - Welcome panel + auto-continue
   - Smooth fade transition into main portfolio
   ========================================================= */

(function () {
    'use strict';

    // ---------- Helpers ----------
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const rand = (min, max) => Math.random() * (max - min) + min;

    // ---------- Matrix Canvas ----------
    function initMatrix(canvas) {
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');

        let width, height, columns, drops;
        const fontSize = 16;
        const chars = 'アァカサタナハマヤラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@!<>{}[]|/\\';

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = new Array(columns).fill(0).map(() => Math.random() * height / fontSize);
        }
        resize();
        window.addEventListener('resize', resize);

        function draw() {
            // Trail fade (red-tinted black)
            ctx.fillStyle = 'rgba(10, 2, 2, 0.06)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Leading head (bright red)
                ctx.fillStyle = 'rgba(255, 60, 70, 0.95)';
                ctx.shadowColor = 'rgba(255, 42, 60, 0.85)';
                ctx.shadowBlur = 8;
                ctx.fillText(text, x, y);

                // Body trails (darker crimson)
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(255, 0, 68, 0.4)';
                if (drops[i] > 1) {
                    ctx.fillText(text, x, y - fontSize);
                }

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 0.85;
            }
            requestAnimationFrame(draw);
        }
        draw();
        return { canvas, ctx };
    }

    // ---------- Floating Particles ----------
    function initParticles(container, count) {
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'splash-particle';
            p.style.left = rand(0, 100) + 'vw';
            p.style.animationDuration = rand(8, 18) + 's';
            p.style.animationDelay = rand(0, 10) + 's';
            p.style.opacity = rand(0.3, 0.9);
            p.style.transform = `scale(${rand(0.5, 1.4)})`;
            container.appendChild(p);
        }
    }

    // ---------- Glow Lines ----------
    function initGlowLines(container, count) {
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const line = document.createElement('div');
            line.className = 'splash-glow-line';
            line.style.top = rand(5, 95) + 'vh';
            line.style.width = rand(80, 300) + 'px';
            line.style.animationDelay = rand(0, 6) + 's';
            line.style.animationDuration = rand(4, 8) + 's';
            container.appendChild(line);
        }
    }

    // ---------- Floating Code Snippets ----------
    function initSnippets(container) {
        if (!container) return;
        const snippets = [
            'const developer = new Engineer();',
            'dotnet build --release',
            'SELECT * FROM projects;',
            'git push origin main',
            'app.UseAuthentication();',
            'public class Portfolio { }',
            'npm run dev',
            'docker compose up -d',
            'scaffolding endpoint...',
            'migrating database schema',
            'await Task.Delay(0);',
            'System ready.'
        ];
        snippets.forEach((text, i) => {
            const s = document.createElement('div');
            s.className = 'splash-snippet';
            s.textContent = text;
            s.style.top = rand(5, 95) + 'vh';
            s.style.animationDuration = rand(25, 45) + 's';
            s.style.animationDelay = (i * -3) + 's';
            container.appendChild(s);
        });
    }

    // ---------- Boot Sequence ----------
    async function runBootSequence(bootEl) {
        const lines = [
            { text: 'Loading Portfolio Engine...', type: 'info' },
            { text: 'Initializing Developer Profile...', type: 'info' },
            { text: 'Loading Projects Database...', type: 'info' },
            { text: 'Connecting GitHub Repositories...', type: 'info' },
            { text: 'Compiling Skills Matrix...', type: 'info' },
            { text: 'Loading Experience Timeline...', type: 'info' },
            { text: 'System Ready.', type: 'success' }
        ];

        bootEl.innerHTML = '';
        for (const line of lines) {
            const el = document.createElement('div');
            el.className = 'boot-line ' + line.type;
            el.textContent = line.text;
            bootEl.appendChild(el);
            await wait(rand(180, 360));
        }
        await wait(500);
    }

    // ---------- Typing Animation ----------
    function runTyping(targetEl, phrases) {
        if (!targetEl) return;
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 45;
        const pauseEnd = 1500;
        const pauseStart = 400;

        function tick() {
            const current = phrases[phraseIdx];
            if (!isDeleting) {
                charIdx++;
                targetEl.textContent = current.substring(0, charIdx);
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(tick, pauseEnd);
                    return;
                }
                setTimeout(tick, typeSpeed + rand(-20, 30));
            } else {
                charIdx--;
                targetEl.textContent = current.substring(0, charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(tick, pauseStart);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }
        tick();
    }

    // ---------- Circular Loader + Progress ----------
    async function runLoader(loaderBar, loaderText, progressBar, statusEl, statusMessages) {
        const totalDuration = 2600; // ms total
        const steps = 100;
        const stepTime = totalDuration / steps;

        for (let i = 0; i <= steps; i++) {
            const pct = i;
            // Update circular SVG
            const offset = 376.99 - (376.99 * pct / 100);
            if (loaderBar) loaderBar.style.strokeDashoffset = offset;
            if (loaderText) loaderText.textContent = pct + '%';
            if (progressBar) progressBar.style.width = pct + '%';

            // Update status message at intervals
            const msgIdx = Math.min(
                Math.floor((pct / 100) * statusMessages.length),
                statusMessages.length - 1
            );
            if (statusEl) statusEl.textContent = statusMessages[msgIdx];

            await wait(stepTime);
        }
    }

    // ---------- Welcome Stage ----------
    function showWelcome(welcomeStage, autoContBtn) {
        if (!welcomeStage) return;
        welcomeStage.classList.add('is-active');

        let count = 2;
        if (autoContBtn) autoContBtn.textContent = count;
        const interval = setInterval(() => {
            count--;
            if (autoContBtn) autoContBtn.textContent = count;
            if (count <= 0) {
                clearInterval(interval);
                transitionOut();
            }
        }, 1000);
    }

    // ---------- Transition Out ----------
    function transitionOut() {
        const splash = $('#splash-screen');
        const main = $('#main-portfolio');
        if (splash) splash.classList.add('is-hidden');
        if (main) main.classList.add('is-visible');
        // Restore scrolling
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // ---------- Main Flow ----------
    async function startSplash() {
        // Prevent scroll while splash is active
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Init background effects
        initMatrix($('#matrix-canvas'));
        initParticles($('.splash-particles'), 28);
        initGlowLines($('.splash-glow-lines'), 6);
        initSnippets($('.splash-code-snippets'));

        const bootEl = $('#boot-screen');
        const bootStage = $('#boot-stage');
        const profileWrap = $('#profile-stage-wrapper');
        const profileEl = $('#profile-stage');
        const welcomeEl = $('#welcome-stage');
        const autoContBtn = $('#auto-continue-count');

        // Stage 1: Boot
        await runBootSequence(bootEl);
        if (bootStage) {
            bootStage.style.display = 'none';
        }
        await wait(300);

        // Stage 2: Profile + Loader
        if (profileWrap) {
            profileWrap.style.display = 'flex';
        }
        if (profileEl) profileEl.classList.add('is-active');
        runTyping($('#splash-typing'), [
            'ASP.NET Core',
            'C#',
            'REST API Development',
            'MySQL',
            'Entity Framework Core',
            'Android Development',
            'Software Engineering'
        ]);

        await runLoader(
            $('#loader-bar'),
            $('#loader-text'),
            $('#progress-bar-fill'),
            $('#status-msg'),
            [
                'Booting kernel modules...',
                'Loading Projects...',
                'Loading Portfolio Assets...',
                'Loading Skills Data...',
                'Loading Dashboard...',
                'Preparing Experience Showcase...',
                'Finalizing environment...'
            ]
        );

        await wait(400);

        // Stage 3: Welcome
        showWelcome(welcomeEl, autoContBtn);

        // Enter button click
        const enterBtn = $('#enter-portfolio');
        if (enterBtn) {
            enterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                transitionOut();
            });
        }
    }

    // ---------- Boot ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSplash);
    } else {
        startSplash();
    }
})();
