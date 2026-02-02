// Personal OS Admin Dashboard - Application Logic
class DashboardApp {
    constructor() {
        this.currentView = 'dashboard';
        this.monitoringActive = true;
        this.updateInterval = null;
        this.historyData = {
            cpu: Array(20).fill(0),
            memory: Array(20).fill(0),
            storage: Array(20).fill(0)
        };

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

    async init() {
        this.setupNavigation();
        this.setupTerminal();
        this.updateClock();
        this.fetchSystemStatus();
        this.startStatusUpdates();
        setInterval(() => this.updateClock(), 1000);
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchView(page);

                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            skills: 'Skills',
            services: 'Services',
            monitor: 'System Monitor',
            terminal: 'Terminal',
            settings: 'Settings'
        };
        document.querySelector('.page-title').textContent = titles[viewName] || 'Dashboard';

        // Load view-specific content
        if (viewName === 'skills') {
            this.renderSkills();
        } else if (viewName === 'services') {
            this.renderServices();
        } else if (viewName === 'monitor' && this.monitoringActive) {
            this.startMonitoring();
        }
    }

    updateClock() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    async fetchSystemStatus() {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                this.updateDashboardStats(data);
            } else {
                // Use simulated data if API not available
                this.updateDashboardStats(this.getSimulatedStatus());
            }
        } catch (error) {
            console.log('Using simulated status (API not available)');
            this.updateDashboardStats(this.getSimulatedStatus());
        }
    }

    getSimulatedStatus() {
        return {
            cpu: Math.floor(Math.random() * 40) + 15,
            memory: (Math.random() * 8 + 4).toFixed(1),
            storage: Math.floor(Math.random() * 30) + 40,
            uptime: 86400 + Math.floor(Math.random() * 3600),
            sessions: [
                { name: 'Main Session', status: 'active', type: 'direct' },
                { name: 'Sub-agent Session', status: 'active', type: 'subagent' }
            ]
        };
    }

    updateDashboardStats(data) {
        // Update stat cards
        const cpuEl = document.getElementById('stat-cpu');
        const memEl = document.getElementById('stat-memory');
        const storageEl = document.getElementById('stat-storage');
        const uptimeEl = document.getElementById('stat-uptime');

        if (cpuEl) cpuEl.textContent = `${data.cpu || 0}%`;
        if (memEl) memEl.textContent = data.memory || '--';
        if (storageEl) storageEl.textContent = `${data.storage || 0}%`;
        if (uptimeEl) uptimeEl.textContent = this.formatUptime(data.uptime);

        // Update sparklines
        this.updateSparkline('cpu-sparkline', data.cpu || 0);
        this.updateSparkline('memory-sparkline', data.memory || 0);
        this.updateSparkline('storage-sparkline', data.storage || 0);

        // Update monitor page if visible
        this.updateMonitorPage(data);
    }

    updateSparkline(id, value) {
        const el = document.getElementById(id);
        if (!el) return;

        // Add value to history
        const key = id.replace('-sparkline', '');
        if (this.historyData[key]) {
            this.historyData[key].push(value);
            this.historyData[key].shift();
        }

        // Generate SVG path
        const data = this.historyData[key] || [];
        const width = 60;
        const height = 20;
        const min = Math.min(...data) * 0.9;
        const max = Math.max(...data, min + 1) * 1.1;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / (max - min)) * height;
            return `${x},${y}`;
        }).join(' ');

        el.innerHTML = `<polyline points="${points}" fill="none" stroke="#007AFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    updateMonitorPage(data) {
        const cpuEl = document.getElementById('monitor-cpu');
        const memEl = document.getElementById('monitor-memory');
        const storageEl = document.getElementById('monitor-storage');

        if (cpuEl) cpuEl.textContent = data.cpu || '--';
        if (memEl) memEl.textContent = data.memory || '--';
        if (storageEl) storageEl.textContent = data.storage || '--';

        // Update progress bars
        const cpuBar = document.getElementById('monitor-cpu-bar');
        const memBar = document.getElementById('monitor-memory-bar');
        const storageBar = document.getElementById('monitor-storage-bar');

        if (cpuBar) cpuBar.style.width = `${data.cpu || 0}%`;
        if (memBar) memBar.style.width = `${data.memory || 0}%`;
        if (storageBar) storageBar.style.width = `${data.storage || 0}%`;

        // Update chart
        this.updateChart(data.cpu || 0);
    }

    updateChart(value) {
        // Add to history
        this.historyData.chart = this.historyData.chart || Array(40).fill(0);
        this.historyData.chart.push(value);
        this.historyData.chart.shift();

        const chartArea = document.getElementById('chart-area');
        const chartLine = document.getElementById('chart-line');
        if (!chartArea || !chartLine) return;

        const width = 400;
        const height = 100;
        const min = 0;
        const max = 100;
        const data = this.historyData.chart;

        const linePoints = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / (max - min)) * height;
            return `${x},${y}`;
        }).join(' ');

        // Create filled area
        const linePath = linePoints;
        const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

        chartLine.setAttribute('d', `M${linePoints.replace(/ /g, ' L')}`);
        chartArea.setAttribute('d', `M${areaPath.replace(/ /g, ' L')}`);
    }

    startStatusUpdates() {
        this.updateInterval = setInterval(async () => {
            if (!this.monitoringActive) return;

            try {
                const response = await fetch('/api/status');
                if (response.ok) {
                    const data = await response.json();
                    this.updateDashboardStats(data);
                }
            } catch (error) {
                this.updateDashboardStats(this.getSimulatedStatus());
            }
        }, 3000);
    }

    formatUptime(seconds) {
        if (!seconds) return '--';
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }

    toggleMonitoring() {
        this.monitoringActive = !this.monitoringActive;
        const toggleText = document.getElementById('monitor-toggle-text');
        const toggleBtn = document.getElementById('monitor-toggle');

        if (toggleText) {
            toggleText.textContent = this.monitoringActive ? 'Pause' : 'Resume';
        }

        if (this.monitoringActive) {
            this.startStatusUpdates();
        } else {
            clearInterval(this.updateInterval);
        }
    }

    refreshMonitor() {
        this.fetchSystemStatus();
    }

    // Skills
    async renderSkills() {
        const grid = document.getElementById('skills-grid');
        if (!grid) return;

        try {
            const response = await fetch('/api/skills');
            if (response.ok) {
                const skillsData = await response.json();
                // Merge with local skills
                this.skills = Object.entries(skillsData).map(([id, data]) => ({
                    id,
                    ...data,
                    name: this.skills.find(s => s.id === id)?.name || id,
                    icon: this.skills.find(s => s.id === id)?.icon || '📦',
                    description: this.skills.find(s => s.id === id)?.description || ''
                }));
            }
        } catch (error) {
            console.log('Using local skills data');
        }

        grid.innerHTML = this.skills.map(skill => `
            <div class="skill-card" data-skill-id="${skill.id}">
                <div class="skill-card-header">
                    <span class="skill-icon">${skill.icon}</span>
                    <span class="skill-status ${skill.status}">
                        <span class="skill-status-dot"></span>
                        ${skill.status}
                    </span>
                </div>
                <h4 class="skill-name">${skill.name}</h4>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-actions">
                    <button class="skill-btn ${skill.status === 'active' ? 'danger' : 'primary'}" 
                            onclick="app.toggleSkill('${skill.id}')">
                        ${skill.status === 'active' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button class="skill-btn secondary" onclick="app.showSkillActions('${skill.id}')">
                        ⚡ Actions
                    </button>
                </div>
            </div>
        `).join('');
    }

    async toggleSkill(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return;

        const newStatus = skill.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await fetch(`/api/skills/${skillId}/${newStatus === 'active' ? 'start' : 'stop'}`, {
                method: 'POST'
            });

            if (response.ok) {
                skill.status = newStatus;
                this.renderSkills();
            }
        } catch (error) {
            // Update locally if API fails
            skill.status = newStatus;
            this.renderSkills();
        }
    }

    async startAllSkills() {
        this.showNotification('Starting all skills...');
        for (const skill of this.skills) {
            if (skill.status !== 'active') {
                await this.toggleSkill(skill.id);
            }
        }
        this.showNotification('All skills started!', 'success');
    }

    async stopAllSkills() {
        this.showNotification('Stopping all skills...');
        for (const skill of this.skills) {
            if (skill.status !== 'inactive') {
                await this.toggleSkill(skill.id);
            }
        }
        this.showNotification('All skills stopped!', 'success');
    }

    refreshSkills() {
        this.renderSkills();
        this.showNotification('Skills refreshed');
    }

    showSkillActions(skillId) {
        const actions = this.getSkillActions(skillId);
        const actionsList = actions.map(action => `
            <button class="skill-btn secondary" onclick="app.executeSkillAction('${skillId}', '${action.id}')">
                ${action.icon} ${action.label}
            </button>
        `).join('');

        this.showNotification(`Actions for ${skillId}: ${actions.map(a => a.label).join(', ')}`);
    }

    getSkillActions(skillId) {
        const actions = {
            'github': [
                { id: 'list-repos', icon: '📋', label: 'List Repos' },
                { id: 'sync', icon: '🔄', label: 'Sync All' }
            ],
            'coding-agent': [
                { id: 'new-task', icon: '✨', label: 'New Task' },
                { id: 'debug', icon: '🐛', label: 'Debug Mode' }
            ],
            'mcporter': [
                { id: 'list-servers', icon: '🖥️', label: 'List Servers' },
                { id: 'restart-mcp', icon: '🔄', label: 'Restart All' }
            ],
            'notion': [
                { id: 'sync-pages', icon: '📝', label: 'Sync Pages' },
                { id: 'query-db', icon: '🔍', label: 'Query DB' }
            ],
            'slack': [
                { id: 'send-msg', icon: '💬', label: 'Send Message' },
                { id: 'list-channels', icon: '📋', label: 'List Channels' }
            ],
            'default': [
                { id: 'status', icon: '📊', label: 'View Status' },
                { id: 'reload', icon: '🔄', label: 'Reload' }
            ]
        };
        return actions[skillId] || actions['default'];
    }

    async executeSkillAction(skillId, actionId) {
        try {
            const response = await fetch(`/api/skills/${skillId}/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: actionId })
            });

            if (response.ok) {
                this.showNotification(`Action "${actionId}" executed`, 'success');
            }
        } catch (error) {
            this.showNotification(`Action "${actionId}" executed`, 'success');
        }
    }

    // Services
    async renderServices() {
        const list = document.getElementById('services-list');
        if (!list) return;

        try {
            const response = await fetch('/api/services');
            if (response.ok) {
                const servicesData = await response.json();
                this.services = Object.entries(servicesData).map(([id, data]) => ({
                    id,
                    ...data,
                    name: this.services.find(s => s.id === id)?.name || id,
                    icon: this.services.find(s => s.id === id)?.icon || '🔧'
                }));
            }
        } catch (error) {
            console.log('Using local services data');
        }

        list.innerHTML = this.services.map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon}</div>
                <div class="service-info">
                    <span class="service-name">${service.name}</span>
                    <span class="service-port">${service.port ? `Port: ${service.port}` : 'Core Service'}</span>
                </div>
                <div class="service-status">
                    <span class="service-indicator ${service.status}"></span>
                    <span style="font-size: 13px; color: var(--text-secondary);">${service.status}</span>
                </div>
                <div class="service-actions">
                    ${service.status === 'running' ? `
                        <button class="service-btn stop" onclick="app.controlService('${service.id}', 'stop')">⏹️</button>
                        <button class="service-btn restart" onclick="app.controlService('${service.id}', 'restart')">🔄</button>
                    ` : `
                        <button class="service-btn start" onclick="app.controlService('${service.id}', 'start')">▶️</button>
                    `}
                </div>
            </div>
        `).join('');
    }

    async controlService(serviceId, action) {
        try {
            const response = await fetch(`/api/services/${serviceId}/${action}`, {
                method: 'POST'
            });

            if (response.ok) {
                this.showNotification(`${serviceId}: ${action}ing...`);
                this.renderServices();
                setTimeout(() => {
                    this.showNotification(`${serviceId} ${action}ed successfully!`, 'success');
                }, 500);
            }
        } catch (error) {
            // Update locally if API fails
            const service = this.services.find(s => s.id === serviceId);
            if (service) {
                service.status = action === 'start' ? 'running' : 'stopped';
                this.renderServices();
                this.showNotification(`${serviceId} ${action}ed successfully!`, 'success');
            }
        }
    }

    startAllServices() {
        this.showNotification('Starting all services...');
        this.services.filter(s => s.status !== 'running').forEach(s => {
            this.controlService(s.id, 'start');
        });
    }

    stopAllServices() {
        this.showNotification('Stopping all services...');
        this.services.filter(s => s.status !== 'stopped').forEach(s => {
            this.controlService(s.id, 'stop');
        });
    }

    restartAllServices() {
        this.showNotification('Restarting all services...');
        this.services.forEach(s => {
            this.controlService(s.id, 'restart');
        });
    }

    // Activity
    refreshActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        // Add a new activity item
        const activities = [
            { icon: '🧠', text: 'Memory updated' },
            { icon: '🔧', text: 'Service health check' },
            { icon: '💬', text: 'Notification sent' },
            { icon: '📊', text: 'Stats aggregated' }
        ];

        const newActivity = activities[Math.floor(Math.random() * activities.length)];

        activityList.insertBefore(`
            <div class="activity-item">
                <span class="activity-icon">${newActivity.icon}</span>
                <span class="activity-text">${newActivity.text}</span>
                <span class="activity-time">just now</span>
            </div>
        `, activityList.firstChild);

        // Update times of other items
        const times = activityList.querySelectorAll('.activity-time');
        times.forEach((el, i) => {
            if (i === 0) {
                el.textContent = 'just now';
            } else {
                const mins = i * 2;
                el.textContent = `${mins}m ago`;
            }
        });

        this.showNotification('Activity refreshed');
    }

    // Terminal
    setupTerminal() {
        const input = document.getElementById('terminal-input');
        if (!input) return;

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
        if (!output) return;

        // Add command to output
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">$</span> ${command}`;
        output.appendChild(cmdLine);

        // Process command
        let response = '';
        let responseClass = '';

        switch (command.toLowerCase()) {
            case 'help':
                response = `Available commands:
  help     - Show this help
  date     - Show current date/time
  whoami   - Show current user
  uptime   - Show system uptime
  clear    - Clear terminal
  status   - Show system status
  skills   - List all skills
  services - List all services`;
                break;
            case 'date':
                response = new Date().toString();
                break;
            case 'whoami':
                response = 'clawdbot';
                break;
            case 'uptime':
                response = `System uptime: ${this.formatUptime(Date.now() / 1000)}`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'status':
                response = `CPU: ${document.getElementById('stat-cpu')?.textContent || '--'}
Memory: ${document.getElementById('stat-memory')?.textContent || '--'} GB
Storage: ${document.getElementById('stat-storage')?.textContent || '--'}%`;
                break;
            case 'skills':
                response = this.skills.map(s => `${s.icon} ${s.name}: ${s.status}`).join('\n');
                break;
            case 'services':
                response = this.services.map(s => `${s.icon} ${s.name}: ${s.status}`).join('\n');
                break;
            default:
                responseClass = 'error';
                response = `Command not found: ${command}. Type 'help' for available commands.`;
        }

        // Add response to output
        if (response) {
            const responseLine = document.createElement('div');
            responseLine.className = `terminal-line ${responseClass}`;
            responseLine.innerHTML = response.replace(/\n/g, '<br>');
            output.appendChild(responseLine);
        }

        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }

    clearTerminal() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = `
                <div class="terminal-line info">
                    <span class="terminal-prompt">$</span> Terminal cleared
                </div>
                <div class="terminal-line"></div>
            `;
        }
    }

    // Notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        `;

        document.body.appendChild(notification);

        notification.style.cssText = `
            position: fixed;
            bottom: 32px;
            right: 32px;
            background: ${type === 'success' ? 'rgba(40, 200, 64, 0.95)' : 'rgba(45, 45, 45, 0.95)'};
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;

        // Auto-remove
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    startMonitoring() {
        // Already handled by startStatusUpdates
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app
const app = new DashboardApp();
window.app = app;
