// Personal OS - Mac-inspired Desktop App
class PersonalOS {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.dragData = null;
        this.zIndex = 100;
        
        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.setupEventListeners();
        this.setupDesktopApps();
    }

    updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('clock').textContent = now.toLocaleDateString('en-US', options);
    }

    setupEventListeners() {
        // Desktop click to deselect icons
        document.querySelector('.desktop').addEventListener('click', (e) => {
            if (e.target.classList.contains('desktop')) {
                document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
                this.hideContextMenu();
            }
        });

        // Context menu
        document.querySelector('.desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Hide context menu on click elsewhere
        document.addEventListener('click', () => this.hideContextMenu());

        // Desktop icon double-click
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => this.openApp(icon.dataset.app));
        });

        // Dock item click
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

    setupDesktopApps() {
        // Apps are defined in openApp method
    }

    openApp(appName) {
        const windowId = `window-${appName}-${Date.now()}`;
        
        switch(appName) {
            case 'projects':
                this.createWindow(windowId, 'Projects', 'projects-content');
                break;
            case 'upnext':
                this.createWindow(windowId, 'UpNext Analytics', 'upnext-content');
                break;
            case 'github':
                this.createWindow(windowId, 'GitHub', 'github-content');
                break;
            case 'terminal':
                this.createWindow(windowId, 'Terminal', 'terminal-content');
                break;
            case 'notes':
                this.createWindow(windowId, 'Notes', 'notes-content');
                break;
            case 'instagram':
                this.createWindow(windowId, 'Instagram', 'instagram-content');
                break;
            default:
                this.createWindow(windowId, appName.charAt(0).toUpperCase() + appName.slice(1), 'default-content');
        }
    }

    createWindow(id, title, contentType) {
        const container = document.querySelector('.windows-container');
        
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = id;
        windowEl.style.left = `${100 + (this.windows.length * 30)}px`;
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
                ${this.getContentForType(contentType)}
            </div>
        `;

        container.appendChild(windowEl);
        this.windows.push({ id, element: windowEl, title });
        this.activeWindow = windowEl;

        this.setupWindowControls(windowEl);
        this.makeDraggable(windowEl);
        this.focusWindow(windowEl);

        // Terminal initialization
        if (contentType === 'terminal-content') {
            this.initTerminal(windowEl);
        }
    }

    getContentForType(type) {
        const contents = {
            'projects-content': this.getProjectsContent(),
            'upnext-content': this.getUpNextContent(),
            'github-content': this.getGitHubContent(),
            'terminal-content': this.getTerminalContent(),
            'notes-content': this.getNotesContent(),
            'instagram-content': this.getInstagramContent(),
            'default-content': '<p style="color: #8e8e93;">App content coming soon...</p>'
        };
        return contents[type] || contents['default-content'];
    }

    getProjectsContent() {
        return `
            <div class="app-projects">
                <div class="project-card" onclick="window.personalOS.openApp('upnext')">
                    <h3>⚽ UpNext Analytics</h3>
                    <p>Youth soccer stats platform</p>
                    <p style="color: #28c840; margin-top: 8px;">● Live</p>
                </div>
                <div class="project-card">
                    <h3>🐙 Personal OS</h3>
                    <p>Your Mac-inspired desktop</p>
                    <p style="color: #007AFF; margin-top: 8px;">● In Development</p>
                </div>
                <div class="project-card">
                    <h3>📱 Future Project</h3>
                    <p>Coming soon...</p>
                </div>
            </div>
        `;
    }

    getUpNextContent() {
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>840+</h3>
                    <p>Teams Tracked</p>
                </div>
                <div class="stat-card">
                    <h3>13.8k</h3>
                    <p>Players</p>
                </div>
                <div class="stat-card">
                    <h3>16.5k</h3>
                    <p>Goals</p>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #28c840 0%, #30d158 100%);">
                    <h3>$7.99</h3>
                    <p>Pro / Month</p>
                </div>
            </div>
            <div class="window-toolbar">
                <button class="toolbar-btn" onclick="window.open('https://UpNextAnalytics.app', '_blank')">🌐 Open Site</button>
                <button class="toolbar-btn">📊 View Dashboard</button>
                <button class="toolbar-btn">📈 Analytics</button>
                <button class="toolbar-btn">💰 Revenue</button>
            </div>
            <div style="padding: 20px;">
                <h3 style="color: white; margin-bottom: 15px;">Quick Actions</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div class="project-card" style="text-align: center;">
                        <h3>🔍 Check Rankings</h3>
                        <p>View current leaderboards</p>
                    </div>
                    <div class="project-card" style="text-align: center;">
                        <h3>📝 Submit Correction</h3>
                        <p>Pro member priority</p>
                    </div>
                    <div class="project-card" style="text-align: center;">
                        <h3>👥 Track Teams</h3>
                        <p>Add to favorites</p>
                    </div>
                    <div class="project-card" style="text-align: center;">
                        <h3>📱 Instagram</h3>
                        <p>Check latest posts</p>
                    </div>
                </div>
            </div>
        `;
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
                <div class="terminal-line">Welcome to Personal OS Terminal v1.0</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line" style="margin-top: 10px;"></div>
            </div>
            <div style="display: flex; margin-top: 10px;">
                <span style="color: #28c840; margin-right: 8px;">$</span>
                <input type="text" id="terminal-input" 
                    style="flex: 1; background: transparent; border: none; color: white; 
                           font-family: inherit; font-size: 13px; outline: none;"
                    autofocus>
            </div>
        `;
    }

    getNotesContent() {
        return `
            <div class="window-toolbar">
                <button class="toolbar-btn">📝 New Note</button>
                <button class="toolbar-btn">📁 New Folder</button>
                <button class="toolbar-btn">🔍 Search</button>
            </div>
            <div style="padding: 20px;">
                <textarea style="width: 100%; height: 300px; background: #1e1e1e; border: none; 
                               color: white; font-family: inherit; font-size: 14px; 
                               resize: none; outline: none; line-height: 1.6;"
                    placeholder="Start typing your notes here..."></textarea>
            </div>
        `;
    }

    getInstagramContent() {
        return `
            <div class="window-toolbar">
                <button class="toolbar-btn" onclick="window.open('https://instagram.com/upnextanalytics', '_blank')">📱 Open</button>
                <button class="toolbar-btn">📊 Insights</button>
                <button class="toolbar-btn">✏️ Draft</button>
            </div>
            <div style="padding: 20px;">
                <div style="text-align: center; padding: 40px; color: #8e8e93;">
                    <p style="font-size: 48px; margin-bottom: 15px;">📸</p>
                    <p>@upnextanalytics</p>
                    <p style="margin-top: 10px;">Growing and looking to monetize</p>
                </div>
            </div>
        `;
    }

    initTerminal(windowEl) {
        const input = windowEl.querySelector('#terminal-input');
        const output = windowEl.querySelector('#terminal-output');
        
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

    executeCommand(command, output) {
        const line = document.createElement('div');
        line.className = 'terminal-line input';
        line.textContent = `$ ${command}`;
        output.appendChild(line);

        const response = document.createElement('div');
        response.className = 'terminal-line';

        switch(command.toLowerCase()) {
            case 'help':
                response.textContent = 'Available commands: help, date, whoami, uptime, clear, echo, projects, upnext';
                break;
            case 'date':
                response.textContent = new Date().toString();
                break;
            case 'whoami':
                response.textContent = 'klio-personal-os';
                break;
            case 'uptime':
                response.textContent = `System running for ${Math.floor(process.uptime / 60)} minutes`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            case 'echo':
                response.textContent = '';
                break;
            case 'projects':
                response.textContent = '1. UpNext Analytics (live)\n2. Personal OS (dev)';
                break;
            case 'upnext':
                response.textContent = 'UpNext Analytics: 840+ teams, 13.8k players, 16.5k goals. Pro at $7.99/mo';
                break;
            default:
                response.className = 'terminal-line error';
                response.textContent = `Command not found: ${command}`;
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
}

// Initialize Personal OS
window.personalOS = new PersonalOS();
