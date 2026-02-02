// Klio Admin Dashboard - Main Application
class AdminApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.monitoringActive = true;
        this.monitorInterval = null;

        this.skills = [
            { id: 'github', name: 'GitHub', icon: '🐙', status: 'active', description: 'Repository management, PRs, issues' },
            { id: 'coding-agent', name: 'Coding Agent', icon: '🤖', status: 'active', description: 'Code generation, debugging, refactoring' },
            { id: 'mcporter', name: 'MCPorter', icon: '🚪', status: 'active', description: 'MCP server integration and management' },
            { id: 'notion', name: 'Notion', icon: '📝', status: 'inactive', description: 'Notion workspace sync and queries' },
            { id: 'slack', name: 'Slack', icon: '💬', status: 'active', description: 'Team communication and notifications' },
            { id: 'terminal', name: 'Terminal', icon: '⬛', status: 'active', description: 'Shell command execution' },
            { id: 'browser', name: 'Browser', icon: '🌐', status: 'active', description: 'Web browsing and scraping' },
            { id: 'memory', name: 'Memory', icon: '🧠', status: 'active', description: 'Persistent context storage' }
        ];

        this.services = [
            { id: 'gateway', name: 'Gateway Server', icon: '🌐', status: 'running', port: 3000 },
            { id: 'websocket', name: 'WebSocket', icon: '🔌', status: 'running', port: 3001 },
            { id: 'api', name: 'API Server', icon: '⚡', status: 'running', port: 3002 },
            { id: 'mcp-server', name: 'MCP Server', icon: '🚪', status: 'stopped', port: 3003 },
            { id: 'agent', name: 'Agent Core', icon: '🦁', status: 'running', port: null }
        ];

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTerminal();
        this.updateClock();
        this.fetchSystemStatus();
        this.startMonitoring();
        setInterval(() => this.updateClock(), 1000);
    }

    // Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
        });
        document.getElementById(`page-${page}`).style.display = 'block';

        // Update title
        const titles = {
            dashboard: 'Dashboard',
            skills: 'Skills',
            services: 'Services',
            monitor: 'System Monitor',
            terminal: 'Terminal',
            settings: 'Settings'
        };
        document.getElementById('current-page-title').textContent = titles[page] || 'Dashboard';

        this.currentPage = page;

        // Load page data
        if (page === 'skills') this.renderSkills();
        if (page === 'services') this.renderServices();
        if (page === 'monitor') this.startMonitoring();
        else this.stopMonitoring();
    }

    // Clock
    updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('clock').textContent = now.toLocaleDateString('en-US', options);
    }

    // System Status
    async fetchSystemStatus() {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                this.updateDashboardStats(data);
            }
        } catch (error) {
            console.log('Using simulated status');
            this.updateDashboardStats({
                cpu: Math.floor(Math.random() * 30) + 15,
                memory: Math.floor(Math.random() * 8) + 4,
                storage: Math.floor(Math.random() * 30) + 40,
                uptime: Date.now() / 1000
            });
        }
    }

    updateDashboardStats(data) {
        document.getElementById('stat-cpu').textContent = `${data.cpu || 0}%`;
        document.getElementById('stat-memory').textContent = `${data.memory || 0} GB`;
        document.getElementById('stat-storage').textContent = `${data.storage || 0}%`;

        const uptime = data.uptime || 0;
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        document.getElementById('stat-uptime').textContent = `${hours}h ${minutes}m`;

        // Update system status text
        const statusEl = document.getElementById('system-status-text');
        if (data.status === 'online') {
            statusEl.textContent = 'System Online';
        }
    }

    // Skills
    renderSkills() {
        const grid = document.getElementById('skills-grid');
        grid.innerHTML = this.skills.map(skill => `
            <div class="skill-card">
                <div class="skill-card-header">
                    <span class="skill-icon">${skill.icon}</span>
                    <span class="skill-status ${skill.status}">${skill.status}</span>
                </div>
                <h4>${skill.name}</h4>
                <p class="skill-desc">${skill.description}</p>
                <div class="skill-actions">
                    <button class="skill-btn ${skill.status === 'active' ? 'stop' : 'start'}"
                            onclick="app.toggleSkill('${skill.id}')">
                        ${skill.status === 'active' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button class="skill-btn action" onclick="app.showSkillActions('${skill.id}')">
                        ⚡ Actions
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleSkill(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
            skill.status = skill.status === 'active' ? 'inactive' : 'active';
            this.renderSkills();
            this.showNotification(`${skill.name} ${skill.status === 'active' ? 'started' : 'stopped'}`);
        }
    }

    startAllSkills() {
        this.skills.forEach(s => s.status = 'active');
        this.renderSkills();
        this.showNotification('All skills started');
    }

    stopAllSkills() {
        this.skills.forEach(s => s.status = 'inactive');
        this.renderSkills();
        this.showNotification('All skills stopped');
    }

    refreshSkills() {
        this.renderSkills();
        this.showNotification('Skills refreshed');
    }

    showSkillActions(skillId) {
        const actions = this.getSkillActions(skillId);
        const actionNames = actions.map(a => a.label).join(', ');
        this.showNotification(`${skillId}: ${actionNames}`);
    }

    getSkillActions(skillId) {
        const actions = {
            'github': ['List Repositories', 'Create PR', 'Sync All'],
            'coding-agent': ['New Task', 'Debug Mode', 'Optimize'],
            'mcporter': ['List Servers', 'Start MCP', 'Restart All'],
            'notion': ['Sync Pages', 'Query Database'],
            'slack': ['Send Message', 'List Channels'],
            'terminal': ['Clear Cache', 'Restart Terminal'],
            'browser': ['Clear Cookies', 'Reset Session'],
            'memory': ['Clear Memory', 'Export Context']
        };
        return (actions[skillId] || ['View Status']).map((label, i) => ({ id: i, label }));
    }

    // Services
    renderServices() {
        const list = document.getElementById('services-list');
        list.innerHTML = this.services.map(service => `
            <div class="service-card">
                <span class="service-icon">${service.icon}</span>
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p class="service-port">${service.port ? `Port: ${service.port}` : 'Core Service'}</p>
                </div>
                <div class="service-status">
                    <span class="skill-status ${service.status === 'running' ? 'active' : 'inactive'}">${service.status}</span>
                </div>
                <div class="service-actions">
                    ${service.status === 'running' ?
                        `<button class="service-btn stop" onclick="app.controlService('${service.id}', 'stop')">⏹️</button>
                         <button class="service-btn restart" onclick="app.controlService('${service.id}', 'restart')">🔄</button>` :
                        `<button class="service-btn start" onclick="app.controlService('${service.id}', 'start')">▶️</button>`
                    }
                </div>
            </div>
        `).join('');
    }

    controlService(serviceId, action) {
        const service = this.services.find(s => s.id === serviceId);
        if (service) {
            if (action === 'start') service.status = 'running';
            else if (action === 'stop') service.status = 'stopped';
            else if (action === 'restart') {
                service.status = 'restarting';
                setTimeout(() => { service.status = 'running'; this.renderServices(); }, 1000);
            }
            this.renderServices();
            this.showNotification(`${service.name} ${action}ed`);
        }
    }

    startAllServices() {
        this.services.forEach(s => s.status = 'running');
        this.renderServices();
        this.showNotification('All services started');
    }

    stopAllServices() {
        this.services.forEach(s => s.status = 'stopped');
        this.renderServices();
        this.showNotification('All services stopped');
    }

    restartAllServices() {
        this.services.forEach(s => s.status = 'restarting');
        this.renderServices();
        setTimeout(() => {
            this.services.forEach(s => s.status = 'running');
            this.renderServices();
            this.showNotification('All services restarted');
        }, 1500);
    }

    // Monitoring
    startMonitoring() {
        if (this.monitorInterval) return;
        this.monitorInterval = setInterval(() => {
            if (!this.monitoringActive) return;

            const cpu = Math.floor(Math.random() * 30) + 15;
            const memory = Math.floor(Math.random() * 8) + 4;
            const storage = Math.floor(Math.random() * 20) + 45;

            this.updateMonitor(cpu, memory, storage);
        }, 2000);
        this.updateMonitor(35, 6.2, 52);
    }

    stopMonitoring() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
    }

    updateMonitor(cpu, memory, storage) {
        document.getElementById('monitor-cpu').textContent = cpu;
        document.getElementById('monitor-cpu-bar').style.width = `${cpu}%`;

        document.getElementById('monitor-memory').textContent = memory;
        document.getElementById('monitor-memory-bar').style.width = `${(memory / 16) * 100}%`;

        document.getElementById('monitor-storage').textContent = storage;
        document.getElementById('monitor-storage-bar').style.width = `${storage}%`;

        const network = (Math.random() * 5 + 0.5).toFixed(1);
        document.getElementById('monitor-network').textContent = `↓ ${network}`;
    }

    toggleMonitoring() {
        this.monitoringActive = !this.monitoringActive;
        const btn = document.getElementById('monitor-toggle');
        const icon = document.getElementById('monitor-toggle-icon');
        icon.textContent = this.monitoringActive ? '⏸️' : '▶️';
        btn.querySelector('span:last-child').textContent = this.monitoringActive ? 'Pause' : 'Resume';
    }

    refreshMonitor() {
        this.updateMonitor(35, 6.2, 52);
        this.showNotification('Monitor refreshed');
    }

    refreshActivity() {
        const activityList = document.getElementById('activity-list');
        const items = activityList.querySelectorAll('.activity-item');
        items.forEach(item => {
            const time = item.querySelector('.activity-time');
            if (time) time.textContent = 'Just now';
        });
        this.showNotification('Activity refreshed');
    }

    // Terminal
    setupTerminal() {
        const input = document.getElementById('terminal-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    this.executeCommand(command);
                }
                input.value = '';
            }
        });
    }

    executeCommand(command) {
        const output = document.getElementById('terminal-output');

        // Add command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.textContent = `$ ${command}`;
        output.appendChild(cmdLine);

        // Process command
        let response = '';
        let type = 'info';

        switch(command.toLowerCase()) {
            case 'help':
                response = 'Available commands: help, date, whoami, uptime, clear, echo, status, skills, services, cpu, memory';
                break;
            case 'date':
                response = new Date().toString();
                break;
            case 'whoami':
                response = 'clawdbot';
                break;
            case 'uptime':
                response = `Uptime: ${Math.floor(performance.now() / 60000)} minutes`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'echo':
                response = '';
                break;
            case 'status':
                response = 'System Status: All services running normally';
                break;
            case 'skills':
                response = this.skills.map(s => `${s.icon} ${s.name}: ${s.status}`).join('\n');
                break;
            case 'services':
                response = this.services.map(s => `${s.icon} ${s.name}: ${s.status}`).join('\n');
                break;
            case 'cpu':
                response = `CPU Usage: ${Math.floor(Math.random() * 30) + 15}%`;
                break;
            case 'memory':
                response = `Memory: ${(Math.random() * 8 + 4).toFixed(1)} GB`;
                break;
            default:
                response = `Command not found: ${command}. Type 'help' for available commands.`;
                type = 'error';
        }

        if (response) {
            const respLine = document.createElement('div');
            respLine.className = `terminal-line ${type}`;
            respLine.textContent = response;
            output.appendChild(respLine);
        }

        output.scrollTop = output.scrollHeight;
    }

    clearTerminal() {
        document.getElementById('terminal-output').innerHTML = `
            <div class="terminal-line info">Terminal cleared</div>
            <div class="terminal-line"></div>
        `;
    }

    // Notifications
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<span class="notification-icon">ℹ️</span><span>${message}</span>`;

        document.body.appendChild(notification);

        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #2d2d2d;
            color: #e0e0e0;
            padding: 12px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            z-index: 10000;
            animation: notificationSlide 0.3s ease-out;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;

        setTimeout(() => {
            notification.style.animation = 'notificationFade 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app
const app = new AdminApp();
window.app = app;
