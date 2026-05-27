// ============ Theme toggle ============
(function () {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'light' || (!stored && !prefersDark)) {
        root.classList.remove('dark');
    } else {
        root.classList.add('dark');
    }

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            const isDark = root.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
})();

// ============ Lucide icons ============
if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
}

// ============ Navbar shadow on scroll ============
(function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = function () {
        if (window.scrollY > 12) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ============ Reveal-on-scroll ============
(function () {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('visible'); });
        return;
    }
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { observer.observe(el); });
})();

// ============ Year ============
(function () {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

// ============ Engineering principle icons ============
(function () {
    const principleIcons = {
        'Design for failure': 'shield-alert',
        'Domain-Driven Design first': 'boxes',
        'Make incidents cheap': 'siren',
        'Trunk-based development': 'git-branch',
        'SLOs over uptime promises': 'gauge',
        'Zero-trust by default': 'lock',
        'Observability is not optional': 'radar',
        'Boring tech wins': 'anchor',
        'Document the why': 'book-open',
        'Automate the toil': 'bot',
        'Code reviews teach': 'graduation-cap',
        'Test in production safely': 'flask-conical',
        'APIs are forever': 'plug',
        'Shift left on security': 'shield-check',
        'Mentor relentlessly': 'sprout',
        'Ship the smallest thing': 'rocket',
    };

    document.querySelectorAll('.tip-card').forEach(function (card) {
        if (card.querySelector('.tip-icon')) return;
        const titleEl = card.querySelector('.tip-title');
        if (!titleEl) return;
        const title = titleEl.textContent.replace(/\s+/g, ' ').trim();
        const iconName = principleIcons[title];
        if (!iconName) return;
        const wrap = document.createElement('div');
        wrap.className = 'tip-icon';
        wrap.innerHTML = '<i data-lucide="' + iconName + '"></i>';
        card.insertBefore(wrap, card.firstChild);
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
})();

// ============ Tech-pill logos (Simple Icons CDN) ============
(function () {
    // Pill text -> simpleicons slug (or array of fallback slugs).
    // Simple Icons removed a number of branded logos (Microsoft, AWS, OpenAI, etc.).
    // For those we'll fall back to inline SVG below.
    const logoMap = {
        // Languages & frameworks
        '.NET Core': 'dotnet',
        'ASP.NET Core': 'dotnet',
        'C#': '__inline:csharp',
        'TypeScript': 'typescript',
        'Angular': 'angular',
        'AngularJS': 'angular',
        'Node.js': 'nodedotjs',
        'Python': 'python',
        'GraphQL': 'graphql',
        'REST': null,
        'Web API': 'dotnet',
        'ASP.NET MVC': 'dotnet',
        'ASP.NET Web API': 'dotnet',
        'Microservices': null,

        // Cloud & infra
        'Azure': '__inline:azure',
        'AWS': '__inline:aws',
        'AKS': 'kubernetes',
        'Kubernetes': 'kubernetes',
        'Docker': 'docker',
        'Helm': 'helm',
        'Argo CD': 'argo',
        'Flux': null,
        'NGINX Ingress': 'nginx',
        'Azure Key Vault': '__inline:azure',

        // CI/CD & DevOps
        'Azure DevOps': '__inline:azure',
        'GitHub Actions': 'githubactions',
        'Git': 'git',
        'GitHub': 'github',

        // Messaging / caching / observability
        'RabbitMQ': 'rabbitmq',
        'Kafka': 'apachekafka',
        'Redis': 'redis',
        'OpenTelemetry': 'opentelemetry',
        'Prometheus': 'prometheus',
        'Grafana': 'grafana',
        'ELK / OpenSearch': 'elasticsearch',
        'SSRS': '__inline:sql',
        'ETL': null,

        // Databases
        'Azure SQL': '__inline:sql',
        'PostgreSQL': 'postgresql',
        'SQL Server': '__inline:sql',
        'MongoDB': 'mongodb',

        // Security / methodology
        'OAuth2': null,
        'JWT': 'jsonwebtokens',
        'Zero-Trust': null,
        'DDD': null,
        'Agile / Scrum': null,
        'OWASP': 'owasp',

        // AI tools (Anthropic, OpenAI logos removed from Simple Icons — use inline)
        'Claude Code': '__inline:anthropic',
        'Claude (Anthropic)': '__inline:anthropic',
        'OpenAI': '__inline:openai',
        'OpenAI API': '__inline:openai',
        'GPT-4 / GPT-4o': '__inline:openai',
        'Codex': '__inline:openai',
        'Cursor': '__inline:cursor',
        'GitHub Copilot': '__inline:copilot',
        'ChatGPT': '__inline:openai',
        'Embeddings & RAG': null,
        'Prompt Engineering': null,
    };

    // Inline SVGs for logos Simple Icons no longer hosts.
    // Each returns a <svg> string. Color uses currentColor so CSS controls tint.
    const inlineSvgs = {
        'csharp': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.7 0a2.3 2.3 0 0 0-1.16.31L1.71 5.41a2.34 2.34 0 0 0-1.16 2v9.18a2.33 2.33 0 0 0 1.16 2l8.83 5.1a2.32 2.32 0 0 0 2.32 0l8.83-5.1a2.33 2.33 0 0 0 1.16-2V7.41a2.34 2.34 0 0 0-1.16-2L12.86.31A2.3 2.3 0 0 0 11.7 0zm5.16 7.04l1.04 1.79a6.7 6.7 0 1 1-9.3 9.4l1.78-1.04a4.62 4.62 0 1 0 6.48-6.54zM14.1 9.27v1.62h1.62v.97H14.1v1.62h-.97v-1.62H11.5v-.97h1.63V9.27zm3.24 0v1.62h1.62v.97h-1.62v1.62h-.97v-1.62h-1.62v-.97h1.62V9.27z"/></svg>',
        'azure': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.483 21.3H24l-9.872-17.49-3.022 8.123 5.722 6.726-11.345 2.641zM10.738 3.225L0 19.31l9.16-1.585L19.494 3.225h-8.756z"/></svg>',
        'aws': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 10.83q0 .44.1.71.1.28.27.6.06.1.06.18 0 .12-.15.24l-.5.33q-.1.07-.2.07-.13 0-.25-.12-.34-.36-.58-.78-.25-.42-.4-.96-.81 1.92-2.4 1.92-1.13 0-1.8-.65-.67-.65-.67-1.73 0-1.14.81-1.85.81-.71 2.2-.71.45 0 .93.07.5.07 1.02.2v-.93q0-1-.42-1.4-.42-.4-1.46-.4-.47 0-.97.12-.5.12-1 .3-.21.1-.31.13-.1.03-.16.03-.17 0-.17-.24v-.4q0-.18.05-.27.05-.09.2-.18.46-.24 1.12-.4.66-.16 1.4-.16 1.6 0 2.34.73.74.72.74 2.21v2.92zM3.6 12q.43 0 .89-.16.46-.16.81-.45.21-.18.31-.4.1-.22.1-.55v-.27q-.4-.1-.83-.15-.42-.05-.84-.05-.91 0-1.34.36-.43.36-.43 1 0 .63.32.95.32.31.99.31zm6.27.86q-.21 0-.28-.08-.07-.08-.13-.27l-1.71-5.6q-.06-.21-.06-.31 0-.15.14-.15h.8q.22 0 .3.07.1.08.15.27l1.22 4.81 1.13-4.81q.05-.21.13-.28.09-.07.31-.07h.65q.22 0 .3.07.09.07.14.28l1.15 4.86 1.26-4.86q.06-.21.14-.28.09-.07.3-.07h.76q.14 0 .14.15 0 .05-.01.1l-.05.21-1.76 5.6q-.06.21-.14.28-.07.07-.28.07h-.7q-.21 0-.3-.08-.09-.08-.14-.28l-1.13-4.71-1.12 4.71q-.06.21-.14.28-.08.08-.3.08zm9.41.22q-.7 0-1.4-.16-.69-.16-1.04-.34-.21-.13-.3-.24-.07-.11-.07-.24v-.42q0-.24.18-.24.07 0 .14.02.07.02.18.07.4.18.86.27.45.1.92.1.74 0 1.13-.27.4-.26.4-.74 0-.32-.21-.54-.21-.22-.79-.42l-1.13-.36q-.85-.27-1.27-.83-.4-.55-.4-1.18 0-.51.22-.92.21-.4.59-.7.36-.31.85-.47.49-.16 1.04-.16.26 0 .55.04.28.04.54.1.25.07.47.14.22.07.34.13.18.1.27.21.07.1.07.27v.4q0 .24-.18.24-.1 0-.31-.1-.7-.32-1.57-.32-.66 0-1.04.21-.38.21-.38.65 0 .31.24.54.24.21.87.42l1.1.35q.84.27 1.21.81.38.55.38 1.18 0 .53-.21.95-.21.42-.6.74-.4.31-.94.49-.55.18-1.21.18zm1.4 4.34q-2.4 1.79-5.9 2.74-3.5.95-6.94.95-5.42 0-9.5-1.78-.41-.18-.7-.36-.16-.1-.16-.21 0-.13.15-.13.07 0 .2.05 4.5 2.45 9.66 2.45 4.43 0 8.74-1.62.27-.1.32.04.04.13-.17.27-.42.3-.94.6.21-.04.4-.04.14 0 .25.04.21.07.21.27 0 .04-.02.13l-.04.27q-.07.44-.31 1.03-.21.59-.42 1.04-.07.14-.18.14-.07 0-.13-.05-.07-.05-.07-.14 0-.06.04-.16.13-.31.27-.74.13-.42.18-.85.04-.43-.14-.49z"/></svg>',
        'sql': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="4.5" rx="9" ry="2.5"/><path d="M3 7v3c0 1.38 4.03 2.5 9 2.5s9-1.12 9-2.5V7c-1.79 1.04-5.32 1.5-9 1.5S4.79 8.04 3 7zm0 5v3c0 1.38 4.03 2.5 9 2.5s9-1.12 9-2.5v-3c-1.79 1.04-5.32 1.5-9 1.5s-7.21-.46-9-1.5zm0 5v2.5C3 21.05 7.03 22.5 12 22.5s9-1.45 9-3v-2.5c-1.79 1.04-5.32 1.5-9 1.5s-7.21-.46-9-1.5z"/></svg>',
        'openai': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.985 5.985 0 0 0 .516 4.91 6.052 6.052 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.3 12.85l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.7 5.46a.795.795 0 0 0-.393.682zm1.097-2.365l2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z"/></svg>',
        'anthropic': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.83 2H17.5L24 22h-3.66l-1.32-4.27h-7.3L10.4 22h-3.66L13.83 2zm-1.95 12.86h5.55L14.66 7l-2.78 7.86zM4.83 2H8.5L15 22h-3.66L4.83 2z"/></svg>',
        'cursor': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.925 24l10.425-6-.075-12L11.85 0 1.5 6l.075 12zm.075-2.85l-7.95-4.575v-9.15L12 2.85l8.025 4.575v9.15z"/></svg>',
        'copilot': '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.222 11.013c-.018-.115-.054-.224-.108-.327a3.91 3.91 0 0 0-.6-.842 3.85 3.85 0 0 0-.65-.527c-.014-.94-.193-1.872-.539-2.752a6.92 6.92 0 0 0-1.534-2.36 6.83 6.83 0 0 0-2.36-1.534 7.022 7.022 0 0 0-2.752-.54c-.193 0-.385.008-.577.024A4.84 4.84 0 0 0 12 1.143a4.84 4.84 0 0 0-2.102.012 7.022 7.022 0 0 0-.577-.024 7.022 7.022 0 0 0-2.752.54A6.83 6.83 0 0 0 4.21 3.205a6.92 6.92 0 0 0-1.534 2.36 7.022 7.022 0 0 0-.539 2.752c-.227.158-.443.334-.65.527a3.91 3.91 0 0 0-.6.842c-.054.103-.09.212-.108.327a4.91 4.91 0 0 0-.054.732c0 .246.018.49.054.732.018.115.054.224.108.327a3.91 3.91 0 0 0 .6.842 3.85 3.85 0 0 0 .65.527c.014.94.193 1.872.539 2.752a6.92 6.92 0 0 0 1.534 2.36 6.83 6.83 0 0 0 2.36 1.534 7.022 7.022 0 0 0 2.752.54c.193 0 .385-.008.577-.024A4.84 4.84 0 0 0 12 22.857a4.84 4.84 0 0 0 2.102-.012c.192.016.384.024.577.024a7.022 7.022 0 0 0 2.752-.54 6.83 6.83 0 0 0 2.36-1.534 6.92 6.92 0 0 0 1.534-2.36 7.022 7.022 0 0 0 .539-2.752c.227-.158.443-.334.65-.527a3.91 3.91 0 0 0 .6-.842c.054-.103.09-.212.108-.327.036-.242.054-.486.054-.732 0-.246-.018-.49-.054-.732zM8.4 14.4a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm7.2 0a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2z"/></svg>',
    };

    function logoUrl(slug) {
        return 'https://cdn.simpleicons.org/' + encodeURIComponent(slug);
    }

    function makeLogo(slug, extraClass) {
        // Inline SVG path?
        if (typeof slug === 'string' && slug.indexOf('__inline:') === 0) {
            const key = slug.slice('__inline:'.length);
            const svg = inlineSvgs[key];
            if (!svg) return null;
            const span = document.createElement('span');
            span.className = 'tech-logo tech-logo-inline ' + (extraClass || '');
            span.innerHTML = svg;
            return span;
        }
        // Remote (Simple Icons CDN) — graceful failure
        const img = document.createElement('img');
        img.src = logoUrl(slug);
        img.alt = '';
        img.loading = 'lazy';
        img.className = 'tech-logo ' + (extraClass || '');
        img.referrerPolicy = 'no-referrer';
        img.onerror = function () { img.remove(); };
        return img;
    }

    function decorate(pill, extraClass) {
        if (pill.dataset.logoApplied === '1') return;
        const text = pill.textContent.replace(/\s+/g, ' ').trim();
        const slug = logoMap[text];
        pill.dataset.logoApplied = '1';

        if (!slug) return;
        const node = makeLogo(slug, extraClass);
        if (!node) return;

        const dot = pill.querySelector('.ai-dot');
        if (dot) {
            dot.replaceWith(node);
        } else {
            pill.insertBefore(node, pill.firstChild);
        }
    }

    document.querySelectorAll('.tech-pill').forEach(function (p) { decorate(p); });
    document.querySelectorAll('.project-pill').forEach(function (p) { decorate(p, 'tech-logo-sm'); });
})();
