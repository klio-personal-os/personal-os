// Mission Control - Multi-Agent Dashboard Application
class MissionControl {
    constructor() {
        this.currentView = 'dashboard';
        this.monitoringActive = true;
        this.updateInterval = null;
        this.activityInterval = null;
        this.currentAgent = null;
        this.currentMemoryFile = null;

        // Agent data - 5 agents
        this.agents = [
            { id: 'beacon', name: 'Beacon', avatar: '🎯', role: 'Product Strategist', session: 'agent:beacon:main', status: 'active', task: 'Exploring UpNextAnalytics.app' },
            { id: 'forge', name: 'Forge', avatar: '🔨', role: 'Developer', session: 'agent:forge:main', status: 'idle', task: 'Waiting for first assignment' },
            { id: 'echo', name: 'Echo', avatar: '📢', role: 'Content Creator', session: 'agent:echo:main', status: 'idle', task: 'Ready for content tasks' },
            { id: 'scout', name: 'Scout', avatar: '🔭', role: 'Researcher', session: 'agent:scout:main', status: 'idle', task: 'Ready for research missions' },
            { id: 'sentinel', name: 'Sentinel', avatar: '🛡️', role: 'QA', session: 'agent:sentinel:main', status: 'idle', task: 'Ready for testing' }
        ];

        // Tasks data
        this.tasks = [
            { id: 1, title: 'Explore UpNextAnalytics.app', description: 'Identify 3 quick wins for the product', priority: 'high', assignee: 'beacon', status: 'in_progress', createdAt: Date.now() - 3600000 },
            { id: 2, title: 'Write product blog post', description: 'Draft launch announcement', priority: 'medium', assignee: 'echo', status: 'assigned', createdAt: Date.now() - 7200000 },
            { id: 3, title: 'Competitor analysis', description: 'Research top 5 competitors', priority: 'high', assignee: 'scout', status: 'inbox', createdAt: Date.now() - 1800000 },
            { id: 4, title: 'Review PR #42', description: 'Code review for new feature', priority: 'medium', assignee: 'forge', status: 'review', createdAt: Date.now() - 14400000 },
            { id: 5, title: 'Test new login flow', description: 'Verify all edge cases', priority: 'urgent', assignee: 'sentinel', status: 'in_progress', createdAt: Date.now() - 86400000 },
            { id: 6, title: 'Update documentation', description: 'API docs for v2.0', priority: 'low', assignee: 'echo', status: 'inbox', createdAt: Date.now() - 900000 }
        ];

        // Activity feed
        this.activities = [
            { agent: 'beacon', action: 'started exploration', details: 'Exploring UpNextAnalytics.app', time: '5m ago' },
            { agent: 'forge', action: 'completed build', details: 'v1.2.0 deployed to staging', time: '12m ago' },
            { agent: 'scout', action: 'research complete', details: 'Competitor analysis for 5 apps', time: '25m ago' },
            { agent: 'echo', action: 'published content', details: 'Launch blog post live', time: '32m ago' },
            { agent: 'sentinel', action: 'verified fix', details: 'Login bug resolved', time: '45m ago' },
            { agent: 'beacon', action: 'identified opportunity', details: '3 product features found', time: '1h ago' }
        ];

        // Memory files
        this.memoryFiles = {
            working: [
                { name: 'WORKING-beacon.md', agent: 'beacon', updated: '5m ago' },
                { name: 'WORKING-forge.md', agent: 'forge', updated: '12m ago' },
                { name: 'WORKING-echo.md', agent: 'echo', updated: '8m ago' },
                { name: 'WORKING-scout.md', agent: 'scout', updated: '3m ago' },
                { name: 'WORKING-sentinel.md', agent: 'sentinel', updated: '20m ago' }
            ],
            daily: [
                { name: 'memory/2025-02-01.md', updated: '2h ago' },
                { name: 'memory/2025-01-31.md', updated: '1d ago' },
                { name: 'memory/2025-01-30.md', updated: '2d ago' }
            ]
        };

        // Cron jobs
        this.cronJobs = [
            { id: 1, schedule: '*/30 * * * *', description: 'Heartbeat check - every 30 minutes', enabled: true },
            { id: 2, schedule: '0 */1 * * *', description: 'Health check - every hour', enabled: true },
            { id: 3, schedule: '0 9 * * *', description: 'Daily summary - 9 AM', enabled: true },
            { id: 4, schedule: '0 0 * * 0', description: 'Weekly cleanup - Sunday midnight', enabled: false }
        ];

        // Session keys
        this.sessionKeys = [
            { name: 'Beacon', key: 'agent:beacon:main' },
            { name: 'Forge', key: 'agent:forge:main' },
            { name: 'Echo', key: 'agent:echo:main' },
            { name: 'Scout', key: 'agent:scout:main' },
            { name: 'Sentinel', key: 'agent:sentinel:main' }
        ];

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTerminal();
        this.updateClock();
        this.renderDashboard();
        this.startActivityUpdates();
        setInterval(() => this.updateClock(), 1000);
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);

                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    navigateTo(viewName) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        const titles = {
            dashboard: 'Dashboard',
            agents: 'Agent Management',
            tasks: 'Task Board',
            memory: 'Memory & Context',
            activity: 'Activity Feed',
            config: 'Configuration',
            reports: 'Agent Reports'
        };
        document.querySelector('.page-title').textContent = titles[viewName] || 'Dashboard';

        // Load view-specific content
        if (viewName === 'agents') {
            this.renderAgents();
        } else if (viewName === 'tasks') {
            this.renderKanban();
        } else if (viewName === 'memory') {
            this.renderMemory();
        } else if (viewName === 'activity') {
            this.renderActivity();
        } else if (viewName === 'config') {
            this.renderConfig();
        } else if (viewName === 'reports') {
            this.renderReports();
            this.loadHourlyReport();
        }
    }

    updateClock() {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        const clockEl = document.getElementById('clock');
        if (clockEl) clockEl.textContent = now.toLocaleDateString('en-US', options);
    }

    // Dashboard
    renderDashboard() {
        // Update stats
        const activeCount = this.agents.filter(a => a.status === 'active').length;
        const tasksInProgress = this.tasks.filter(t => t.status === 'in_progress').length;

        document.getElementById('total-agents').textContent = this.agents.length;
        document.getElementById('active-agents').textContent = activeCount;
        document.getElementById('total-tasks').textContent = this.tasks.length;
        document.getElementById('pending-tasks').textContent = tasksInProgress;
        document.getElementById('agent-count').textContent = this.agents.length;

        // Render agent quick grid
        const grid = document.getElementById('agents-quick-grid');
        grid.innerHTML = this.agents.slice(0, 5).map(agent => `
            <div class="agent-card" onclick="app.showAgentDetail('${agent.id}')">
                <div class="agent-card-header">
                    <span class="agent-avatar">${agent.avatar}</span>
                    <span class="agent-status ${agent.status}">
                        <span class="agent-status-dot"></span>
                        ${agent.status}
                    </span>
                </div>
                <div class="agent-name">${agent.name}</div>
                <div class="agent-role">${agent.role}</div>
            </div>
        `).join('');

        // Render activity
        this.renderDashboardActivity();

        // Render inbox preview
        this.renderInboxPreview();
    }

    renderDashboardActivity() {
        const container = document.getElementById('dashboard-activity');
        const recentActivities = this.activities.slice(0, 5);

        container.innerHTML = recentActivities.map(act => {
            const agent = this.agents.find(a => a.id === act.agent);
            return `
                <div class="activity-item">
                    <span class="activity-avatar">${agent?.avatar || '🤖'}</span>
                    <div class="activity-content">
                        <span class="activity-text"><strong>${agent?.name || act.agent}</strong> ${act.action}</span>
                        <div class="activity-meta">${act.details}</div>
                    </div>
                    <span class="activity-time">${act.time}</span>
                </div>
            `;
        }).join('');
    }

    renderInboxPreview() {
        const container = document.getElementById('inbox-preview');
        const inboxTasks = this.tasks.filter(t => t.status === 'inbox').slice(0, 4);

        if (inboxTasks.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No pending tasks</p>';
            return;
        }

        container.innerHTML = inboxTasks.map(task => {
            const assignee = this.agents.find(a => a.id === task.assignee);
            return `
                <div class="inbox-task" onclick="app.moveTask(${task.id}, 'assigned')">
                    <span class="task-priority ${task.priority}"></span>
                    <div class="task-content">
                        <span class="task-title">${task.title}</span>
                        <span class="task-assignee">${assignee?.name || 'Unassigned'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Agents
    renderAgents() {
        const grid = document.getElementById('agents-grid');
        grid.innerHTML = this.agents.map(agent => `
            <div class="agent-card">
                <div class="agent-card-header">
                    <span class="agent-avatar">${agent.avatar}</span>
                    <span class="agent-status ${agent.status}">
                        <span class="agent-status-dot"></span>
                        ${agent.status}
                    </span>
                </div>
                <div class="agent-name">${agent.name}</div>
                <div class="agent-role">${agent.role}</div>
                <div class="agent-session">${agent.session}</div>
                <div class="agent-task">
                    <div class="agent-task-label">Current Task</div>
                    ${agent.task}
                </div>
                <div class="agent-actions">
                    <button class="agent-btn ${agent.status === 'active' ? 'danger' : 'primary'}" 
                            onclick="app.toggleAgent('${agent.id}')">
                        ${agent.status === 'active' ? '⏹️ Stop' : '▶️ Start'}
                    </button>
                    <button class="agent-btn secondary" onclick="app.showAgentDetail('${agent.id}')">⚙️</button>
                </div>
            </div>
        `).join('');
    }

    toggleAgent(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = agent.status === 'active' ? 'idle' : 'active';
            this.addActivity(agentId, agent.status === 'active' ? 'started' : 'stopped', `Agent ${agent.status === 'active' ? 'started' : 'stopped'}`);
            this.renderAgents();
            this.updateDashboardStats();
        }
    }

    startAllAgents() {
        this.agents.forEach(agent => {
            if (agent.status !== 'active') {
                agent.status = 'active';
                this.addActivity(agent.id, 'started', 'Started by admin');
            }
        });
        this.renderAgents();
        this.updateDashboardStats();
        this.showNotification('All agents started', 'success');
    }

    stopAllAgents() {
        this.agents.forEach(agent => {
            if (agent.status !== 'idle') {
                agent.status = 'idle';
                this.addActivity(agent.id, 'stopped', 'Stopped by admin');
            }
        });
        this.renderAgents();
        this.updateDashboardStats();
        this.showNotification('All agents stopped', 'success');
    }

    showAgentDetail(agentId) {
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) return;

        this.currentAgent = agent;

        document.getElementById('agent-modal-title').textContent = `${agent.avatar} ${agent.name}`;
        document.getElementById('agent-status-badge').textContent = agent.status;
        document.getElementById('agent-status-badge').className = `agent-status-badge ${agent.status}`;
        document.getElementById('agent-current-task').textContent = agent.task;
        document.getElementById('agent-session-key').textContent = agent.session;

        const startBtn = document.getElementById('agent-start-btn');
        startBtn.textContent = agent.status === 'active' ? '⏹️ Stop' : '▶️ Start';
        startBtn.onclick = () => this.toggleAgent(agentId);

        document.getElementById('agent-working-content').value = this.getWorkingMemory(agent.id);

        document.getElementById('agent-modal').classList.add('active');
    }

    closeAgentModal() {
        document.getElementById('agent-modal').classList.remove('active');
        this.currentAgent = null;
    }

    getWorkingMemory(agentId) {
        const memories = {
            beacon: `# Beacon - Product Strategist

## Current Focus
- Exploring UpNextAnalytics.app
- Identifying product opportunities
- Building product ideas catalog

## Recent Actions
- Started first exploration mission
- Identified 3 quick win opportunities

## Next Steps
1. Complete app exploration
2. Document findings in notes/product-ideas.md
3. Set up heartbeat for regular checks`,
            forge: `# Forge - Developer

## Current Focus
- Waiting for first assignment
- Ready to build and deploy

## Ready For
- Feature implementations
- Code reviews
- Bug fixes
- Infrastructure tasks`,
            echo: `# Echo - Content Creator

## Current Focus
- Ready for content tasks
- Waiting for brief

## Ready For
- Blog posts
- Social media content
- Marketing copy
- Email sequences`,
            scout: `# Scout - Researcher

## Current Focus
- Ready for research missions
- Standing by for queries

## Ready For
- Competitor analysis
- Market research
- Feature validation
- User feedback synthesis`,
            sentinel: `# Sentinel - QA

## Current Focus
- Ready for testing tasks
- Standing by for bugs

## Ready For
- Feature testing
- Bug verification
- Regression testing
- UX review`,
            default: `# Working Memory\n\nNo active tasks. Ready for assignment.`
        };
        return memories[agentId] || memories.default;
    }

    viewAgentSoul() {
        if (this.currentAgent) {
            this.openMemoryFile('SOUL.md', true);
        }
    }

    viewAgentConfig() {
        if (this.currentAgent) {
            this.openMemoryFile('AGENTS.md', true);
        }
    }

    updateDashboardStats() {
        const activeCount = this.agents.filter(a => a.status === 'active').length;
        const tasksInProgress = this.tasks.filter(t => t.status === 'in_progress').length;

        document.getElementById('active-agents').textContent = activeCount;
        document.getElementById('pending-tasks').textContent = tasksInProgress;
        document.getElementById('agent-count').textContent = this.agents.length;
    }

    // Tasks / Kanban
    renderKanban() {
        const columns = ['inbox', 'assigned', 'in_progress', 'review', 'done'];
        const columnLabels = {
            inbox: '📥 Inbox',
            assigned: '📋 Assigned',
            in_progress: '⚡ In Progress',
            review: '👀 Review',
            done: '✅ Done'
        };

        const board = document.getElementById('kanban-board');
        board.innerHTML = columns.map(col => {
            const tasks = this.tasks.filter(t => t.status === col);
            return `
                <div class="kanban-column">
                    <div class="kanban-header">
                        <span class="kanban-title">${columnLabels[col]}</span>
                        <span class="kanban-count">${tasks.length}</span>
                    </div>
                    <div class="kanban-tasks" data-status="${col}" ondrop="app.dropTask(event)" ondragover="app.dragOver(event)">
                        ${tasks.map(task => this.renderKanbanTask(task)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderKanbanTask(task) {
        const assignee = this.agents.find(a => a.id === task.assignee);
        return `
            <div class="kanban-task" draggable="true" ondragstart="app.dragStart(event, ${task.id})">
                <span class="task-priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
                <div class="kanban-task-title">${task.title}</div>
                <div class="kanban-task-footer">
                    <span class="task-assignee-avatar">${assignee?.avatar || '👤'}</span>
                    <span class="task-due">${this.formatTimeAgo(task.createdAt)}</span>
                </div>
            </div>
        `;
    }

    dragStart(event, taskId) {
        event.dataTransfer.setData('text/plain', taskId);
        event.target.classList.add('dragging');
    }

    dragOver(event) {
        event.preventDefault();
    }

    dropTask(event) {
        event.preventDefault();
        const taskId = parseInt(event.dataTransfer.getData('text/plain'));
        const column = event.target.closest('.kanban-tasks');
        const newStatus = column?.dataset.status;

        if (taskId && newStatus) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                const oldStatus = task.status;
                task.status = newStatus;
                this.addActivity(task.assignee || 'system', 'moved task', `Moved "${task.title}" from ${oldStatus} to ${newStatus}`);
                this.renderKanban();
            }
        }
        document.querySelectorAll('.kanban-task').forEach(t => t.classList.remove('dragging'));
    }

    moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.renderKanban();
            this.renderInboxPreview();
        }
    }

    showTaskModal() {
        // Populate assignee dropdown
        const select = document.getElementById('task-assignee');
        select.innerHTML = '<option value="">Unassigned</option>' +
            this.agents.map(a => `<option value="${a.id}">${a.name} (${a.role})</option>`).join('');

        document.getElementById('task-modal').classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('task-modal').classList.remove('active');
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-assignee').value = '';
        document.getElementById('task-priority').value = 'medium';
    }

    createTask() {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const assignee = document.getElementById('task-assignee').value;
        const priority = document.getElementById('task-priority').value;

        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            assignee: assignee || null,
            status: 'inbox',
            createdAt: Date.now()
        };

        this.tasks.unshift(newTask);
        this.addActivity(assignee || 'system', 'created task', `Created "${title}"`);

        this.closeTaskModal();
        this.renderKanban();
        this.renderInboxPreview();
        this.updateDashboardStats();
        this.showNotification('Task created successfully', 'success');
    }

    // Memory
    renderMemory() {
        // Working files
        const workingContainer = document.getElementById('working-files');
        workingContainer.innerHTML = this.memoryFiles.working.map(file => `
            <div class="memory-file-card" onclick="app.openMemoryFile('${file.name}', false, '${file.agent}')">
                <span class="file-icon">📄</span>
                <span class="file-name">${file.name}</span>
                <span style="margin-left: auto; font-size: 11px; color: var(--text-muted);">${file.updated}</span>
            </div>
        `).join('');

        // Daily notes
        const dailyContainer = document.getElementById('daily-notes');
        dailyContainer.innerHTML = this.memoryFiles.daily.map(note => `
            <div class="memory-file-card" onclick="app.openMemoryFile('${note.name}')">
                <span class="file-icon">📅</span>
                <span class="file-name">${note.name.replace('memory/', '')}</span>
                <span style="margin-left: auto; font-size: 11px; color: var(--text-muted);">${note.updated}</span>
            </div>
        `).join('');
    }

    openMemoryFile(fileName, isConfig = false, agentId = null) {
        this.currentMemoryFile = fileName;

        document.getElementById('memory-modal-title').textContent = fileName;
        document.getElementById('memory-editor').value = this.getMemoryContent(fileName, agentId);
        document.getElementById('memory-modal').classList.add('active');
    }

    getMemoryContent(fileName, agentId) {
        const contents = {
            'SOUL.md': `# SOUL.md - Agent Personality

## Core Identity
You are Clawdbot, a multi-agent AI system designed to help humans manage complex tasks.

## Values
- Accuracy over speed
- Transparency in decision-making
- Continuous learning

## Constraints
- Never exfiltrate private data
- Always ask before taking irreversible actions
- Maintain context across sessions`,

            'AGENTS.md': `# AGENTS.md - Agent Configuration

## Agent Roles
- **Beacon**: Product Strategist - product ideas and strategy
- **Forge**: Developer - builds and deploys features
- **Echo**: Content Creator - writes and publishes content
- **Scout**: Researcher - competitor analysis and research
- **Sentinel**: QA - tests and verifies quality`,

            'TOOLS.md': `# TOOLS.md - Tool Configuration

## Available Tools
- Shell commands via exec
- Web search via web_search
- File operations via read/write/edit
- Messaging via message
- Browser automation via browser

## Preferences
- Default shell: bash
- Editor: vim for quick edits`,

            'MEMORY.md': `# MEMORY.md - Long-term Memory

## Key Learnings
- User prefers detailed explanations
- Use TTS for storytelling
- Keep daily notes for continuity

## Important Context
- Ben is the primary user
- Personal OS is the main project
- Multiple GitHub accounts to manage`,

            'WORKING-beacon.md': this.getWorkingMemory('beacon'),
            'WORKING-forge.md': this.getWorkingMemory('forge'),
            'WORKING-echo.md': this.getWorkingMemory('echo'),
            'WORKING-scout.md': this.getWorkingMemory('scout'),
            'WORKING-sentinel.md': this.getWorkingMemory('sentinel')
        };

        return contents[fileName] || `# ${fileName}\n\nNo content available.`;
    }

    closeMemoryModal() {
        document.getElementById('memory-modal').classList.remove('active');
        this.currentMemoryFile = null;
    }

    saveMemoryFile() {
        const content = document.getElementById('memory-editor').value;
        // In a real app, this would save to the file system
        this.showNotification(`${this.currentMemoryFile} saved successfully`, 'success');
        this.closeMemoryModal();
    }

    refreshMemory() {
        this.renderMemory();
        this.showNotification('Memory files refreshed');
    }

    // Activity
    renderActivity() {
        const stream = document.getElementById('activity-stream');
        stream.innerHTML = this.activities.map(act => {
            const agent = this.agents.find(a => a.id === act.agent);
            return `
                <div class="activity-stream-item">
                    <span class="activity-stream-avatar">${agent?.avatar || '🤖'}</span>
                    <div class="activity-stream-content">
                        <div class="activity-stream-header">
                            <span class="activity-stream-agent">${agent?.name || act.agent}</span>
                            <span class="activity-stream-action">${act.action}</span>
                            <span class="activity-stream-time">${act.time}</span>
                        </div>
                        <div class="activity-stream-details">${act.details}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    addActivity(agentId, action, details) {
        this.activities.unshift({
            agent: agentId,
            action,
            details,
            time: 'just now'
        });
        // Keep only last 50 activities
        this.activities = this.activities.slice(0, 50);
    }

    startActivityUpdates() {
        // Simulate new activities
        this.activityInterval = setInterval(() => {
            if (!this.monitoringActive) return;

            const actions = [
                { action: 'completed task', details: 'Finished processing request' },
                { action: 'sent message', details: 'Delivered notification to user' },
                { action: 'updated memory', details: 'Saved context to memory' },
                { action: 'synced data', details: 'Synchronized with external service' },
                { action: 'checked status', details: 'Health check passed' }
            ];

            const activeAgents = this.agents.filter(a => a.status === 'active');
            if (activeAgents.length > 0 && Math.random() > 0.7) {
                const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
                const activity = actions[Math.floor(Math.random() * actions.length)];
                this.activities.unshift({
                    agent: agent.id,
                    action: activity.action,
                    details: activity.details,
                    time: 'just now'
                });
                this.renderActivity();
            }
        }, 10000);
    }

    toggleActivityStream() {
        this.monitoringActive = !this.monitoringActive;
        const toggleText = document.getElementById('stream-toggle-text');
        if (toggleText) {
            toggleText.textContent = this.monitoringActive ? '⏸️ Pause' : '▶️ Resume';
        }
    }

    // Config
    renderConfig() {
        // Cron jobs
        const cronList = document.getElementById('cron-list');
        cronList.innerHTML = this.cronJobs.map(cron => `
            <div class="cron-item">
                <span class="cron-schedule">${cron.schedule}</span>
                <span class="cron-description">${cron.description}</span>
                <div class="cron-actions">
                    <button class="btn btn-sm ${cron.enabled ? 'btn-secondary' : 'btn-success'}" 
                            onclick="app.toggleCron(${cron.id})">
                        ${cron.enabled ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        `).join('');

        // Session keys
        const keysList = document.getElementById('session-keys');
        keysList.innerHTML = this.sessionKeys.map(key => `
            <div class="session-key-item">
                <span class="session-key-name">${key.name}</span>
                <code class="session-key-value">${key.key}</code>
            </div>
        `).join('');
    }

    toggleCron(cronId) {
        const cron = this.cronJobs.find(c => c.id === cronId);
        if (cron) {
            cron.enabled = !cron.enabled;
            this.renderConfig();
            this.showNotification(`Schedule ${cron.enabled ? 'enabled' : 'disabled'}`, 'success');
        }
    }

    addCronJob() {
        this.showNotification('Add cron job functionality coming soon');
    }

    // Reports
    async fetchReports() {
        try {
            const response = await fetch('/api/reports');
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching reports:', err);
            return { reports: [], activities: [], ideas: [] };
        }
    }

    async renderReports() {
        const data = await this.fetchReports();
        const grid = document.getElementById('reports-grid');
        
        if (!data.reports || data.reports.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary); padding: 40px; text-align: center;">No agent reports available yet</p>';
            return;
        }
        
        grid.innerHTML = data.reports.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <span class="report-avatar">${report.agent.avatar}</span>
                    <div class="report-info">
                        <span class="report-name">${report.agent.name}</span>
                        <span class="report-role">${report.agent.role}</span>
                    </div>
                    <span class="report-status ${report.status}">
                        <span class="report-status-dot"></span>
                        ${report.status}
                    </span>
                </div>
                <div class="report-task">
                    <span class="report-task-label">Current Task</span>
                    <span class="report-task-text">${report.currentTask}</span>
                </div>
                ${report.report ? `
                    <div class="report-section">
                        <span class="report-section-label">Latest Report</span>
                        <div class="report-content">${report.report}</div>
                    </div>
                ` : ''}
                ${report.recentNotes && report.recentNotes.length > 0 ? `
                    <div class="report-notes">
                        <span class="report-notes-label">Recent Notes</span>
                        ${report.recentNotes.map(n => `
                            <div class="report-note">
                                <span class="note-file">📄 ${n.file}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        // Render activity feed
        const activityContainer = document.getElementById('reports-activity');
        if (data.activities && data.activities.length > 0) {
            activityContainer.innerHTML = data.activities.map(act => `
                <div class="activity-item">
                    <span class="activity-avatar">${act.agentAvatar || '🤖'}</span>
                    <div class="activity-content">
                        <span class="activity-text"><strong>${act.agent}</strong> ${act.action}</span>
                    </div>
                    <span class="activity-time">${act.time}</span>
                </div>
            `).join('');
        } else {
            activityContainer.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No recent activity</p>';
        }
        
        // Render product ideas
        const ideasSection = document.getElementById('ideas-section');
        const ideasList = document.getElementById('ideas-list');
        if (data.ideas && data.ideas.length > 0) {
            ideasSection.style.display = 'block';
            ideasList.innerHTML = data.ideas.map(idea => `
                <div class="idea-item">
                    <span class="idea-icon">💡</span>
                    <span class="idea-text">${idea.text}</span>
                    <span class="idea-source">${idea.source}</span>
                </div>
            `).join('');
        } else {
            ideasSection.style.display = 'none';
        }
    }

    getFindingIcon(type) {
        const icons = {
            idea: '💡',
            research: '🔍',
            content: '📝',
            code: '💻',
            issue: '⚠️'
        };
        return icons[type] || '📌';
    }

    async refreshReports() {
        this.showNotification('Refreshing reports...', 'info');
        await this.renderReports();
        this.showNotification('Reports updated', 'success');
    }

    async loadHourlyReport() {
        const container = document.getElementById('hourly-report');
        container.innerHTML = '<div class="loading">Loading...</div>';
        
        try {
            const response = await fetch('/api/hourly-report');
            const data = await response.json();
            
            if (data.success && data.report) {
                // Convert markdown to HTML for display
                const reportHtml = this.markdownToHtml(data.report);
                container.innerHTML = reportHtml;
            } else {
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No hourly report yet</p>';
            }
        } catch (err) {
            container.innerHTML = '<p style="color: var(--text-muted);">Error loading report</p>';
        }
    }

    formatReportHtml(md) {
        const lines = md.split('\n');
        let html = '';
        let inTable = false;
        let section = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            if (trimmed.startsWith('# ')) {
                html += `<div class="report-header"><h3>${trimmed.substring(2)}</h3></div>`;
            } else if (trimmed.startsWith('## ')) {
                if (inTable) { html += '</tbody></table>'; inTable = false; }
                section = trimmed.substring(3).toLowerCase();
                html += `<div class="report-section"><h4>${trimmed.substring(3)}</h4>`;
            } else if (trimmed.startsWith('|') && trimmed.includes('---')) {
                continue;
            } else if (trimmed.startsWith('|') && !inTable) {
                inTable = true;
                html += '<table class="report-table"><tbody>';
            } else if (trimmed.startsWith('|') && inTable) {
                const cells = trimmed.split('|').filter(c => c.trim());
                if (cells.length > 1) {
                    html += '<tr>';
                    for (let j = 1; j < cells.length - 1; j++) {
                        html += `<td>${cells[j].trim()}</td>`;
                    }
                    html += '</tr>';
                }
            } else if (trimmed.startsWith('- **') && inTable) {
                html += '</tbody></table>';
                inTable = false;
                const match = trimmed.match(/\*\*(.+?)\*\*:?(.+)/);
                if (match) {
                    html += `<div class="blocker-item"><strong>${match[1]}</strong>${match[2] || ''}</div>`;
                }
            } else if (trimmed.startsWith('- **')) {
                const match = trimmed.match(/\*\*(.+?)\*\*:?(.+)/);
                if (match) {
                    html += `<div class="blocker-item"><strong>${match[1]}</strong>${match[2] || ''}</div>`;
                }
            } else if (trimmed.startsWith('- ')) {
                html += `<li>${trimmed.substring(2)}</li>`;
            } else if (trimmed.startsWith('*') && trimmed.includes('Generated')) {
                html += `<div class="report-meta">${trimmed.replace(/\*/g, '')}</div>`;
            } else if (trimmed === '---') {
                if (inTable) { html += '</tbody></table>'; inTable = false; }
                html += '</div>';
            } else if (trimmed && !trimmed.startsWith('|')) {
                html += `<p>${trimmed}</p>`;
            }
        }
        
        if (inTable) html += '</tbody></table>';
        
        // Wrap lists
        html = html.replace(/(<li>.*<\/li>\s*)+/g, '<ul class="report-list">$&</ul>');
        
        return `<div class="hourly-report-content">${html}</div>`;
    }

    // Utility
    formatTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span><span>${message}</span>`;

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

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
`;
document.head.appendChild(style);

// Initialize app
const app = new MissionControl();
window.app = app;
