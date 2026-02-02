// Personal OS - Mac-inspired Desktop App with Clawdbot Admin Dashboard
class PersonalOS {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.dragData = null;
        this.zIndex = 100;
        this.systemStatus = {
            cpu: 0,
            memory: 0,
            disk: 0,
            uptime: 0,
            sessions: [],
            services: []
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

        this.init();
    }

    init() {
        this.updateClock();
        this.startStatusUpdates();
        setInterval(() => this.updateClock(), 1000);
        this.setupEventListeners();
    }

    updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    startStatusUpdates() {
        // Simulate real-time status updates (in production, fetch from actual APIs)
        setInterval(() => {
            this.systemStatus.cpu = Math.floor(Math.random() * 30) + 10;
            this.systemStatus.memory = Math.floor(Math.random() * 40) + 30;
            this.systemStatus.disk = Math.floor(Math.random() * 20) + 45;
            this.systemStatus.uptime = Date.now() / 1000;

            // Update any open monitor windows
            this.updateMonitorWindows();
        }, 2000);
    }

    updateMonitorWindows() {
        document.querySelectorAll('.monitor-stats').forEach(el => {
            const cpuEl = el.querySelector('.cpu-value');
            const memEl = el.querySelector('.memory-value');
            const diskEl = el.querySelector('.disk-value');
            if (cpuEl) cpuEl.textContent = `${this.systemStatus.cpu}%`;
            if (memEl) memEl.textContent = `${this.systemStatus.memory}%`;
            if (diskEl) diskEl.textContent = `${this.systemStatus.disk}%`;
        });
    }

    setupEventListeners() {
        document.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop')) {
                document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
                this.hideContextMenu();
            }
        });

        document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        document.addEventListener('click', () => this.hideContextMenu());

        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => this.openApp(icon.dataset.app));
        });

        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => this.openApp(item.dataset.app));
        });
    }

    showContextMenu(x, y) {
        const menu = document.getElementById('contextMenu');
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.classList.add('show');
    }

    hideContextMenu() {
        document.getElementById('contextMenu').classList.remove('show');
    }

    openApp(appName) {
        const windowId = `window-${appName}-${Date.now()}`;

        switch(appName) {
            case 'admin':
                this.createAdminDashboard(windowId);
                break;
            case 'skills':
                this.createSkillsWindow(windowId);
                break;
            case 'services':
                this.createServicesWindow(windowId);
                break;
            case 'monitor':
                this.createMonitorWindow(windowId);
                break;
            case 'github':
                this.createWindow(windowId, 'GitHub', 'github-content');
                break;
            case 'terminal':
                this.createWindow(windowId, 'Terminal', 'terminal-content');
                break;
            default:
                this.createWindow(windowId, appName.charAt(0).toUpperCase() + appName.slice(1), 'default-content');
        }
    }

    createAdminDashboard(id) {
        const windowEl = this.createWindowFrame(id, '⚙️ Clawdbot Admin', 'admin-content');

        const content = this.getAdminContent();
        windowEl.querySelector('.window-content').innerHTML = content;

        this.setupAdminControls(windowEl);
    }

    getAdminContent() {
        return `
            <div class="admin-dashboard">
                <div class="admin-header">
                    <div class="admin-avatar">🦁</div>
                    <div class="admin-info">
                        <h2>Clawdbot Admin</h2>
                        <p class="status-indicator"><span class="status-dot active"></span> Online</p>
                    </div>
                </div>

                <div class="stats-row">
                    <div class="stat-tile">
                        <div class="stat-icon">🧠</div>
                        <div class="stat-details">
                            <span class="stat-value">8</span>
                            <span class="stat-label">Active Skills</span>
                        </div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon">💬</div>
                        <div class="stat-details">
                            <span class="stat-value">2</span>
                            <span class="stat-label">Active Sessions</span>
                        </div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon">🔧</div>
                        <div class="stat-details">
                            <span class="stat-value">5</span>
                            <span class="stat-label">Services</span>
                        </div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-details">
                            <span class="stat-value" id="uptime-display">12h 34m</span>
                            <span class="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>

                <div class="admin-sections">
                    <div class="admin-section">
                        <h3>🚀 Quick Actions</h3>
                        <div class="action-grid">
                            <button class="action-btn" onclick="window.personalOS.openApp('skills')">
                                <span class="action-icon">🧠</span>
                                <span>Manage Skills</span>
                            </button>
                            <button class="action-btn" onclick="window.personalOS.openApp('services')">
                                <span class="action-icon">🔧</span>
                                <span>Services</span>
                            </button>
                            <button class="action-btn" onclick="window.personalOS.openApp('monitor')">
                                <span class="action-icon">📊</span>
                                <span>System Monitor</span>
                            </button>
                            <button class="action-btn" onclick="window.personalOS.openApp('terminal')">
                                <span class="action-icon">⬛</span>
                                <span>Terminal</span>
                            </button>
                        </div>
                    </div>

                    <div class="admin-section">
                        <h3>📊 System Status</h3>
                        <div class="system-status-bar">
                            <div class="status-item">
                                <span class="status-label">CPU</span>
                                <div class="progress-bar">
                                    <div class="progress-fill cpu" style="width: 35%"></div>
                                </div>
                                <span class="status-value">35%</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Memory</span>
                                <div class="progress-bar">
                                    <div class="progress-fill memory" style="width: 62%"></div>
                                </div>
                                <span class="status-value">62%</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Disk</span>
                                <div class="progress-bar">
                                    <div class="progress-fill disk" style="width: 48%"></div>
                                </div>
                                <span class="status-value">48%</span>
                            </div>
                        </div>
                    </div>

                    <div class="admin-section">
                        <h3>🧠 Skills Overview</h3>
                        <div class="skills-overview" id="skills-overview">
                            ${this.getSkillsOverviewHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSkillsOverviewHTML() {
        return this.skills.map(skill => `
            <div class="skill-item">
                <span class="skill-icon">${skill.icon}</span>
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-status ${skill.status}">${skill.status}</span>
                </div>
            </div>
        `).join('');
    }

    setupAdminControls(windowEl) {
        // Any specific admin control setups
    }

    createSkillsWindow(id) {
        const windowEl = this.createWindowFrame(id, '🧠 Skills Manager', 'skills-content');
        windowEl.querySelector('.window-content').innerHTML = this.getSkillsContent();
        this.setupSkillsControls(windowEl);
    }

    getSkillsContent() {
        return `
            <div class="skills-manager">
                <div class="skills-toolbar">
                    <button class="toolbar-btn" onclick="window.personalOS.refreshSkills()">
                        <span>🔄</span> Refresh
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.toggleAllSkills(true)">
                        <span>▶️</span> Start All
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.toggleAllSkills(false)">
                        <span>⏹️</span> Stop All
                    </button>
                </div>

                <div class="skills-grid">
                    ${this.skills.map(skill => this.getSkillCardHTML(skill)).join('')}
                </div>

                <div class="skill-actions-panel" id="skill-actions-panel" style="display: none;">
                    <h3 id="selected-skill-name">Selected Skill</h3>
                    <div class="action-buttons" id="skill-actions">
                        <!-- Dynamic actions will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    }

    getSkillCardHTML(skill) {
        return `
            <div class="skill-card ${skill.status}" data-skill-id="${skill.id}" onclick="window.personalOS.selectSkill('${skill.id}', this)">
                <div class="skill-card-header">
                    <span class="skill-card-icon">${skill.icon}</span>
                    <span class="skill-card-status ${skill.status}">
                        <span class="status-indicator-dot ${skill.status}"></span>
                        ${skill.status}
                    </span>
                </div>
                <h4>${skill.name}</h4>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-card-actions">
                    <button class="skill-action-btn ${skill.status === 'active' ? 'stop' : 'start'}"
                            onclick="event.stopPropagation(); window.personalOS.toggleSkill('${skill.id}')">
                        ${skill.status === 'active' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button class="skill-action-btn secondary"
                            onclick="event.stopPropagation(); window.personalOS.showSkillActions('${skill.id}')">
                        ⚡ Actions
                    </button>
                </div>
            </div>
        `;
    }

    selectSkill(skillId, element) {
        document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
    }

    toggleSkill(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
            skill.status = skill.status === 'active' ? 'inactive' : 'active';
            this.refreshSkills();
            this.updateSkillsOverview();
        }
    }

    toggleAllSkills(start) {
        this.skills.forEach(s => {
            s.status = start ? 'active' : 'inactive';
        });
        this.refreshSkills();
        this.updateSkillsOverview();
    }

    refreshSkills() {
        const grid = document.querySelector('.skills-grid');
        if (grid) {
            grid.innerHTML = this.skills.map(skill => this.getSkillCardHTML(skill)).join('');
        }
    }

    updateSkillsOverview() {
        const overview = document.getElementById('skills-overview');
        if (overview) {
            overview.innerHTML = this.getSkillsOverviewHTML();
        }
    }

    showSkillActions(skillId) {
        const panel = document.getElementById('skill-actions-panel');
        const nameEl = document.getElementById('selected-skill-name');
        const actionsEl = document.getElementById('skill-actions');

        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return;

        nameEl.textContent = `${skill.icon} ${skill.name} Actions`;
        panel.style.display = 'block';

        const actions = this.getSkillActions(skillId);
        actionsEl.innerHTML = actions.map(action => `
            <button class="action-btn" onclick="window.personalOS.executeSkillAction('${skillId}', '${action.id}')">
                ${action.icon} ${action.label}
            </button>
        `).join('');
    }

    getSkillActions(skillId) {
        const actions = {
            'github': [
                { id: 'list-repos', icon: '📋', label: 'List Repositories' },
                { id: 'create-pr', icon: '🔀', label: 'Create Pull Request' },
                { id: 'sync', icon: '🔄', label: 'Sync All' }
            ],
            'coding-agent': [
                { id: 'new-task', icon: '✨', label: 'New Task' },
                { id: 'debug', icon: '🐛', label: 'Debug Mode' },
                { id: 'optimize', icon: '⚡', label: 'Optimize' }
            ],
            'mcporter': [
                { id: 'list-servers', icon: '🖥️', label: 'List Servers' },
                { id: 'start-mcp', icon: '▶️', label: 'Start MCP' },
                { id: 'restart-mcp', icon: '🔄', label: 'Restart All' }
            ],
            'notion': [
                { id: 'sync-pages', icon: '📝', label: 'Sync Pages' },
                { id: 'query-db', icon: '🔍', label: 'Query Database' }
            ],
            'slack': [
                { id: 'send-msg', icon: '💬', label: 'Send Message' },
                { id: 'list-channels', icon: '📋', label: 'List Channels' }
            ],
            'terminal': [
                { id: 'clear-cache', icon: '🧹', label: 'Clear Cache' },
                { id: 'restart', icon: '🔄', label: 'Restart Terminal' }
            ],
            'browser': [
                { id: 'clear-cookies', icon: '🍪', label: 'Clear Cookies' },
                { id: 'reset-session', icon: '🔄', label: 'Reset Session' }
            ],
            'memory': [
                { id: 'clear-memory', icon: '🧠', label: 'Clear Memory' },
                { id: 'export-context', icon: '📤', label: 'Export Context' }
            ]
        };
        return actions[skillId] || [{ id: 'status', icon: '📊', label: 'View Status' }];
    }

    executeSkillAction(skillId, actionId) {
        const notification = this.showNotification(`Executing ${actionId} on ${skillId}...`);
        setTimeout(() => {
            this.showNotification(`✅ ${actionId} completed successfully!`, 'success');
        }, 1500);
    }

    setupSkillsControls(windowEl) {
        // Additional skill control setups
    }

    createServicesWindow(id) {
        const windowEl = this.createWindowFrame(id, '🔧 Services', 'services-content');
        windowEl.querySelector('.window-content').innerHTML = this.getServicesContent();
        this.setupServicesControls(windowEl);
   Content() {
        }

    getServices const services = [
            { id: 'gateway', name: 'Gateway Server', icon: '🌐', status: 'running', port: 3000 },
            { id: 'websocket', name: 'WebSocket', icon: '🔌', status: 'running', port: 3001 },
            { id: 'api', name: 'API Server', icon: '⚡', status: 'running', port: 3002 },
            { id: 'mcp-server', name: 'MCP Server', icon: '🚪', status: 'stopped', port: 3003 },
            { id: 'agent', name: 'Agent Core', icon: '🦁', status: 'running', port: null }
        ];

        return `
            <div class="services-manager">
                <div class="services-toolbar">
                    <button class="toolbar-btn" onclick="window.personalOS.startAllServices()">
                        <span>▶️</span> Start All
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.stopAllServices()">
                        <span>⏹️</span> Stop All
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.restartAllServices()">
                        <span>🔄</span> Restart All
                    </button>
                </div>

                <div class="services-list">
                    ${services.map(service => this.getServiceCardHTML(service)).join('')}
                </div>
            </div>
        `;
    }

    getServiceCardHTML(service) {
        return `
            <div class="service-card ${service.status}">
                <div class="service-icon">${service.icon}</div>
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p class="service-port">${service.port ? `Port: ${service.port}` : 'Core Service'}</p>
                </div>
                <div class="service-status">
                    <span class="status-indicator ${service.status}">
                        <span class="status-indicator-dot ${service.status}"></span>
                        ${service.status}
                    </span>
                </div>
                <div class="service-actions">
                    ${service.status === 'running' ?
                        `<button class="service-btn stop" onclick="window.personalOS.controlService('${service.id}', 'stop')">⏹️</button>
                         <button class="service-btn restart" onclick="window.personalOS.controlService('${service.id}', 'restart')">🔄</button>` :
                        `<button class="service-btn start" onclick="window.personalOS.controlService('${service.id}', 'start')">▶️</button>`
                    }
                </div>
            </div>
        `;
    }

    controlService(serviceId, action) {
        this.showNotification(`Service: ${action}ing ${serviceId}...`);
        setTimeout(() => {
            this.showNotification(`✅ ${serviceId} ${action}ed successfully!`, 'success');
        }, 1000);
    }

    startAllServices() {
        this.showNotification('Starting all services...');
        setTimeout(() => this.showNotification('✅ All services started!', 'success'), 1500);
    }

    stopAllServices() {
        this.showNotification('Stopping all services...');
        setTimeout(() => this.showNotification('✅ All services stopped!', 'success'), 1500);
    }

    restartAllServices() {
        this.showNotification('Restarting all services...');
        setTimeout(() => this.showNotification('✅ All services restarted!', 'success'), 2000);
    }

    setupServicesControls(windowEl) {
        // Additional service control setups
    }

    createMonitorWindow(id) {
        const windowEl = this.createWindowFrame(id, '📊 System Monitor', 'monitor-content');
        windowEl.querySelector('.window-content').innerHTML = this.getMonitorContent();
        this.startRealTimeUpdates(windowEl);
    }

    getMonitorContent() {
        return `
            <div class="system-monitor">
                <div class="monitor-toolbar">
                    <button class="toolbar-btn" onclick="window.personalOS.toggleMonitoring()">
                        <span id="monitor-toggle-icon">⏸️</span> <span id="monitor-toggle-text">Pause</span>
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.refreshMonitor()">
                        <span>🔄</span> Refresh
                    </button>
                </div>

                <div class="monitor-stats">
                    <div class="monitor-card cpu">
                        <div class="monitor-icon">🖥️</div>
                        <div class="monitor-value">
                            <span class="cpu-value">35%</span>
                            <span class="monitor-label">CPU Usage</span>
                        </div>
                        <div class="monitor-graph">
                            <svg viewBox="0 0 100 30" class="sparkline">
                                <path d="M0,25 L5,20 L10,22 L15,18 L20,15 L25,20 L30,10 L35,15 L40,12 L45,8 L50,15 L55,10 L60,18 L65,12 L70,20 L75,15 L80,10 L85,18 L90,12 L95,15 L100,10" fill="none" stroke="#007AFF" stroke-width="2"/>
                            </svg>
                        </div>
                    </div>

                    <div class="monitor-card memory">
                        <div class="monitor-icon">🧠</div>
                        <div class="monitor-value">
                            <span class="memory-value">62%</span>
                            <span class="monitor-label">Memory</span>
                        </div>
                        <div class="monitor-graph">
                            <div class="memory-bar">
                                <div class="memory-fill" style="width: 62%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="monitor-card disk">
                        <div class="monitor-icon">💾</div>
                        <div class="monitor-value">
                            <span class="disk-value">48%</span>
                            <span class="monitor-label">Disk Usage</span>
                        </div>
                        <div class="monitor-graph">
                            <div class="disk-bar">
                                <div class="disk-fill" style="width: 48%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="monitor-card network">
                        <div class="monitor-icon">🌐</div>
                        <div class="monitor-value">
                            <span class="network-value">↓ 2.4 MB/s</span>
                            <span class="monitor-label">Network</span>
                        </div>
                    </div>
                </div>

                <div class="monitor-sections">
                    <div class="monitor-section">
                        <h3>💬 Active Sessions</h3>
                        <div class="sessions-list">
                            <div class="session-item">
                                <span class="session-icon">🌐</span>
                                <div class="session-info">
                                    <span class="session-name">Web Chat</span>
                                    <span class="session-detail">Connected 12m ago</span>
                                </div>
                                <span class="session-status active">Active</span>
                            </div>
                            <div class="session-item">
                                <span class="session-icon">💬</span>
                                <div class="session-info">
                                    <span class="session-name">Discord</span>
                                    <span class="session-detail">Connected 1h ago</span>
                                </div>
                                <span class="session-status idle">Idle</span>
                            </div>
                        </div>
                    </div>

                    <div class="monitor-section">
                        <h3>📝 Recent Activity</h3>
                        <div class="activity-log">
                            <div class="activity-item">
                                <span class="activity-icon">🧠</span>
                                <span class="activity-text">Memory updated</span>
                                <span class="activity-time">2m ago</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-icon">🐙</span>
                                <span class="activity-text">GitHub sync completed</span>
                                <span class="activity-time">15m ago</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-icon">💬</span>
                                <span class="activity-text">Slack notification sent</span>
                                <span class="activity-time">32m ago</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-icon">🔧</span>
                                <span class="activity-text">Service health check passed</span>
                                <span class="activity-time">1h ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    startRealTimeUpdates(windowEl) {
        this.monitoringActive = true;
        const updateInterval = setInterval(() => {
            if (!this.monitoringActive) {
                clearInterval(updateInterval);
                return;
            }

            const cpuValue = windowEl.querySelector('.cpu-value');
            const memValue = windowEl.querySelector('.memory-value');
            const diskValue = windowEl.querySelector('.disk-value');

            if (cpuValue) {
                const newCpu = Math.floor(Math.random() * 30) + 15;
                cpuValue.textContent = `${newCpu}%`;
                cpuValue.parentElement.parentElement.querySelector('.progress-fill')?.style.setProperty('width', `${newCpu}%`);
            }
            if (memValue) {
                const newMem = Math.floor(Math.random() * 20) + 50;
                memValue.textContent = `${newMem}%`;
            }
            if (diskValue) {
                const newDisk = Math.floor(Math.random() * 10) + 45;
                diskValue.textContent = `${newDisk}%`;
            }
        }, 2000);
    }

    toggleMonitoring() {
        this.monitoringActive = !this.monitoringActive;
        const icon = document.getElementById('monitor-toggle-icon');
        const text = document.getElementById('monitor-toggle-text');
        if (icon && text) {
            icon.textContent = this.monitoringActive ? '⏸️' : '▶️';
            text.textContent = this.monitoringActive ? 'Pause' : 'Resume';
        }
    }

    refreshMonitor() {
        this.showNotification('Refreshing monitor data...');
    }

    createWindowFrame(id, title, contentType) {
        const container = document.querySelector('.windows-container');

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = id;
        windowEl.style.left = `${150 + (this.windows.length * 30)}px`;
        windowEl.style.top = `${50 + (this.windows.length * 30)}px`;
        windowEl.style.zIndex = ++this.zIndex;

        windowEl.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="window-btn close" data-action="close"></div>
                    <div class="window-btn minimize" data-action="minimize"></div>
                    <div class="window-btn maximize" data-action="maximize"></div>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">
                <p style="color: #8e8e93;">Loading...</p>
            </div>
        `;

        container.appendChild(windowEl);
        this.windows.push({ id, element: windowEl, title });
        this.activeWindow = windowEl;

        this.setupWindowControls(windowEl);
        this.makeDraggable(windowEl);
        this.focusWindow(windowEl);

        return windowEl;
    }

    createWindow(id, title, contentType) {
        const windowEl = this.createWindowFrame(id, title, contentType);
        windowEl.querySelector('.window-content').innerHTML = this.getContentForType(contentType);

        if (contentType === 'terminal-content') {
            this.initTerminal(windowEl);
        }
    }

    getContentForType(type) {
        const contents = {
            'github-content': this.getGitHubContent(),
            'terminal-content': this.getTerminalContent(),
            'admin-content': this.getAdminContent(),
            'skills-content': this.getSkillsContent(),
            'services-content': this.getServicesContent(),
            'monitor-content': this.getMonitorContent(),
            'default-content': '<p style="color: #8e8e93;">App content coming soon...</p>'
        };
        return contents[type] || contents['default-content'];
    }

    getGitHubContent() {
        return `
            <div class="window-toolbar">
                <button class="toolbar-btn">🔄 Sync</button>
                <button class="toolbar-btn">📁 New Repo</button>
                <button class="toolbar-btn">🌿 Branches</button>
                <button class="toolbar-btn">⚙️ Settings</button>
            </div>
            <div style="padding: 20px;">
                <h3 style="color: white; margin-bottom: 15px;">Your Repositories</h3>
                <div class="project-card">
                    <h3>🐙 klio-personal-os/personal-os</h3>
                    <p>Your Personal OS desktop application</p>
                    <p style="color: #28c840; margin-top: 8px;">● Main branch</p>
                </div>
            </div>
        `;
    }

    getTerminalContent() {
        return `
            <div class="terminal-content" id="terminal-output">
                <div class="terminal-line">Welcome to Clawdbot Terminal v1.0</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line" style="margin-top: 10px;"></div>
            </div>
            <div style="display: flex; margin-top: 10px;">
                <span style="color: #28c840; margin-right: 8px;">$</span>
                <input type="text" id="terminal-input"
                    style="flex: 1; background: transparent; border: none; color: white;
                           font-family: 'SF Mono', Monaco, monospace; font-size: 13px; outline: none;"
                    autofocus>
            </div>
        `;
    }

    initTerminal(windowEl) {
        const input = windowEl.querySelector('#terminal-input');
        const output = windowEl.querySelector('#terminal-output');

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = input.value.trim();
                    if (command) {
                        this.executeCommand(command, output);
                    }
                    input.value = '';
                }
            });
        }
    }

    executeCommand(command, output) {
        const line = document.createElement('div');
        line.className = 'terminal-line input';
        line.textContent = `$ ${command}`;
        output.appendChild(line);

        const response = document.createElement('div');
        response.className = 'terminal-line';

        switch(command.toLowerCase()) {
            case 'help':
                response.textContent = 'Available commands: help, date, whoami, uptime, clear, echo, status, skills, services';
                break;
            case 'date':
                response.textContent = new Date().toString();
                break;
            case 'whoami':
                response.textContent = 'clawdbot';
                break;
            case 'uptime':
                response.textContent = `System running for ${Math.floor(performance.now() / 60000)} minutes`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'echo':
                response.textContent = '';
                break;
            case 'status':
                response.textContent = `CPU: ${this.systemStatus.cpu}% | Memory: ${this.systemStatus.memory}% | Disk: ${this.systemStatus.disk}%`;
                break;
            case 'skills':
                response.textContent = this.skills.map(s => `${s.icon} ${s.name}: ${s.status}`).join('\n');
                break;
            case 'services':
                response.textContent = 'Services: gateway, websocket, api, mcp-server, agent';
                break;
            default:
                response.className = 'terminal-line error';
                response.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
        }

        output.appendChild(response);
        output.scrollTop = output.scrollHeight;
    }

    setupWindowControls(windowEl) {
        const header = windowEl.querySelector('.window-header');

        windowEl.querySelector('.window-btn.close').addEventListener('click', () => this.closeWindow(windowEl));
        windowEl.querySelector('.window-btn.minimize').addEventListener('click', () => this.minimizeWindow(windowEl));
        windowEl.querySelector('.window-btn.maximize').addEventListener('click', () => this.maximizeWindow(windowEl));

        header.addEventListener('dblclick', () => this.maximizeWindow(windowEl));

        windowEl.addEventListener('mousedown', () => this.focusWindow(windowEl));
    }

    makeDraggable(windowEl) {
        const header = windowEl.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = windowEl.offsetLeft;
            startTop = windowEl.offsetTop;
            windowEl.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowEl.style.left = `${startLeft + dx}px`;
            windowEl.style.top = `${startTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                windowEl.style.transition = '';
            }
        });
    }

    focusWindow(windowEl) {
        this.windows.forEach(w => w.element.style.zIndex = 100);
        windowEl.style.zIndex = ++this.zIndex;
        this.activeWindow = windowEl;
    }

    closeWindow(windowEl) {
        windowEl.remove();
        this.windows = this.windows.filter(w => w.element !== windowEl);
    }

    minimizeWindow(windowEl) {
        windowEl.style.transform = 'scale(0.1)';
        windowEl.style.opacity = '0';
        windowEl.style.pointerEvents = 'none';
    }

    maximizeWindow(windowEl) {
        windowEl.classList.toggle('maximized');
    }

    showNotification(message, type = 'info') {
        // Create a macOS-style notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        `;

        document.body.appendChild(notification);

        // Position notification
        notification.style.position = 'fixed';
        notification.style.bottom = '80px';
        notification.style.right = '20px';
        notification.style.background = type === 'success' ? 'rgba(40, 200, 64, 0.9)' : 'rgba(40, 40, 40, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '10px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.fontSize = '13px';
        notification.style.zIndex = '10002';
        notification.style.animation = 'notificationSlide 0.3s ease-out';
        notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notificationFade 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Helper method for services content
    getServicesContent() {
        const services = [
            { id: 'gateway', name: 'Gateway Server', icon: '🌐', status: 'running', port: 3000 },
            { id: 'websocket', name: 'WebSocket', icon: '🔌', status: 'running', port: 3001 },
            { id: 'api', name: 'API Server', icon: '⚡', status: 'running', port: 3002 },
            { id: 'mcp-server', name: 'MCP Server', icon: '🚪', status: 'stopped', port: 3003 },
            { id: 'agent', name: 'Agent Core', icon: '🦁', status: 'running', port: null }
        ];

        return `
            <div class="services-manager">
                <div class="services-toolbar">
                    <button class="toolbar-btn" onclick="window.personalOS.startAllServices()">
                        <span>▶️</span> Start All
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.stopAllServices()">
                        <span>⏹️</span> Stop All
                    </button>
                    <button class="toolbar-btn" onclick="window.personalOS.restartAllServices()">
                        <span>🔄</span> Restart All
                    </button>
                </div>

                <div class="services-list">
                    ${services.map(service => this.getServiceCardHTML(service)).join('')}
                </div>
            </div>
        `;
    }

    getServiceCardHTML(service) {
        return `
            <div class="service-card ${service.status}">
                <div class="service-icon">${service.icon}</div>
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p class="service-port">${service.port ? `Port: ${service.port}` : 'Core Service'}</p>
                </div>
                <div class="service-status">
                    <span class="status-indicator ${service.status}">
                        <span class="status-indicator-dot ${service.status}"></span>
                        ${service.status}
                    </span>
                </div>
                <div class="service-actions">
                    ${service.status === 'running' ?
                        `<button class="service-btn stop" onclick="window.personalOS.controlService('${service.id}', 'stop')">⏹️</button>
                         <button class="service-btn restart" onclick="window.personalOS.controlService('${service.id}', 'restart')">🔄</button>` :
                        `<button class="service-btn start" onclick="window.personalOS.controlService('${service.id}', 'start')">▶️</button>`
                    }
                </div>
            </div>
        `;
    }

    controlService(serviceId, action) {
        this.showNotification(`Service: ${action}ing ${serviceId}...`);
        setTimeout(() => {
            this.showNotification(`✅ ${serviceId} ${action}ed successfully!`, 'success');
        }, 1000);
    }

    startAllServices() {
        this.showNotification('Starting all services...');
        setTimeout(() => this.showNotification('✅ All services started!', 'success'), 1500);
    }

    stopAllServices() {
        this.showNotification('Stopping all services...');
        setTimeout(() => this.showNotification('✅ All services stopped!', 'success'), 1500);
    }

    restartAllServices() {
        this.showNotification('Restarting all services...');
        setTimeout(() => this.showNotification('✅ All services restarted!', 'success'), 2000);
    }

    setupServicesControls(windowEl) {
        // Additional service control setups
    }
}

// Initialize Personal OS
window.personalOS = new PersonalOS();