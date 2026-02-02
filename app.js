// Mission Control - Multi-Agent Dashboard Application
class MissionControl {
    constructor() {
        this.currentView = 'dashboard';
        this.monitoringActive = true;
        this.updateInterval = null;
        this.activityInterval = null;
        this.currentAgent = null;
        this.currentMemoryFile = null;

        // Agent data
        this.agents = [
            { id: 'jarvis', name: 'Jarvis', avatar: '🤵', role: 'Lead Coordinator', session: 'agent:main:main', status: 'active', task: 'Managing agent workflow' },
            { id: 'shuri', name: 'Shuri', avatar: '👩‍🔬', role: 'Product Analyst', session: 'agent:product-analyst:main', status: 'active', task: 'Analyzing product metrics' },
            { id: 'fury', name: 'Fury', avatar: '🕶️', role: 'Security Lead', session: 'agent:security:main', status: 'idle', task: 'Monitoring system security' },
            { id: 'vision', name: 'Vision', avatar: '🔮', role: 'Data Scientist', session: 'agent:data-scientist:main', status: 'active', task: 'Processing data streams' },
            { id: 'loki', name: 'Loki', avatar: '🦹', role: 'DevOps Engineer', session: 'agent:devops:main', status: 'idle', task: 'Infrastructure management' },
            { id: 'quill', name: 'Quill', avatar: '🧑‍🚀', role: 'Explorer', session: 'agent:explorer:main', status: 'blocked', task: 'Waiting for input' },
            { id: 'wanda', name: 'Wanda', avatar: '🧙‍♀️', role: 'Context Manager', session: 'agent:context-manager:main', status: 'active', task: 'Maintaining conversation context' },
            { id: 'pepper', name: 'Pepper', avatar: '👩‍💼', role: 'Administrator', session: 'agent:admin:main', status: 'active', task: 'Managing admin tasks' },
            { id: 'friday', name: 'Friday', avatar: '🤖', role: 'Assistant', session: 'agent:assistant:main', status: 'idle', task: 'Ready for commands' },
            { id: 'wong', name: 'Wong', avatar: '🧙‍♂️', role: 'Librarian', session: 'agent:librarian:main', status: 'active', task: 'Organizing knowledge base' }
        ];

        // Tasks data
        this.tasks = [
            { id: 1, title: 'Review PR #42', description: 'Code review for feature branch', priority: 'high', assignee: 'shuri', status: 'in_progress', createdAt: Date.now() - 3600000 },
            { id: 2, title: 'Update documentation', description: 'Update API docs', priority: 'low', assignee: 'wong', status: 'assigned', createdAt: Date.now() - 7200000 },
            { id: 3, title: 'Security audit', description: 'Weekly security check', priority: 'urgent', assignee: 'fury', status: 'inbox', createdAt: Date.now() - 1800000 },
            { id: 4, title: 'Deploy to staging', description: 'Push latest changes', priority: 'medium', assignee: 'loki', status: 'review', createdAt: Date.now() - 14400000 },
            { id: 5, title: 'Analyze user metrics', description: 'Weekly analytics report', priority: 'medium', assignee: 'vision', status: 'done', createdAt: Date.now() - 86400000 },
            { id: 6, title: 'Setup new dev environment', description: 'Configure local environment', priority: 'low', assignee: 'quill', status: 'inbox', createdAt: Date.now() - 900000 },
            { id: 7, title: 'Memory optimization', description: 'Optimize context handling', priority: 'high', assignee: 'wanda', status: 'in_progress', createdAt: Date.now() - 5400000 },
            { id: 8, title: 'User onboarding flow', description: 'Design new user flow', priority: 'medium', assignee: 'pepper', status: 'assigned', createdAt: Date.now() - 10800000 }
        ];

        // Activity feed
        this.activities = [
            { agent: 'jarvis', action: 'assigned task', details: 'Review PR #42 to Shuri', time: '2m ago' },
            { agent: 'wanda', action: 'updated context', details: 'Synced 15 conversation contexts', time: '5m ago' },
            { agent: 'fury', action: 'completed scan', details: 'Security scan passed', time: '12m ago' },
            { agent: 'vision', action: 'processed data', details: 'Analyzed 1.2GB of metrics', time: '18m ago' },
            { agent: 'shuri', action: 'created PR', details: 'PR #43: New analytics feature', time: '25m ago' },
            { agent: 'loki', action: 'deployed', details: 'v2.4.1 to production', time: '32m ago' }
        ];

        // Memory files
        this.memoryFiles = {
            working: [
                { name: 'WORKING-jarvis.md', agent: 'jarvis', updated: '5m ago' },
                { name: 'WORKING-shuri.md', agent: 'shuri', updated: '12m ago' },
                { name: 'WORKING-vision.md', agent: 'vision', updated: '8m ago' },
                { name: 'WORKING-wanda.md', agent: 'wanda', updated: '3m ago' },
                { name: 'WORKING-pepper.md', agent: 'pepper', updated: '20m ago' }
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
            { name: 'Main', key: 'agent:main:main' },
            { name: 'Product Analyst', key: 'agent:product-analyst:main' },
            { name: 'Security', key: 'agent:security:main' },
            { name: 'Data Scientist', key: 'agent:data-scientist:main' },
            { name: 'DevOps', key: 'agent:devops:main' },
            { name: 'Explorer', key: 'agent:explorer:main' }
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
            config: 'Configuration'
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
            jarvis: `# Jarvis - Lead Coordinator\n\n## Current Focus\n- Managing agent workflow\n- Coordinating task assignments\n- Monitoring system health\n\n## Recent Actions\n- Assigned 5 tasks this hour\n- Reviewed 3 PRs\n- Synced with 8 agents`,
            shuri: `# Shuri - Product Analyst\n\n## Current Focus\n- Analyzing product metrics\n- User engagement trends\n- Feature performance\n\n## Recent Actions\n- Generated weekly report\n- Analyzed 15k data points\n- Identified 3 insights`,
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
- **Jarvis**: Lead Coordinator - manages agent workflow
- **Shuri**: Product Analyst - metrics and insights
- **Fury**: Security Lead - system protection
- **Vision**: Data Scientist - data processing
- **Loki**: DevOps Engineer - infrastructure
- **Quill**: Explorer - discovery tasks
- **Wanda**: Context Manager - memory handling
- **Pepper**: Administrator - admin tasks
- **Friday**: Assistant - general assistance
- **Wong**: Librarian - knowledge management`,

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

            'WORKING-jarvis.md': this.getWorkingMemory('jarvis'),
            'WORKING-shuri.md': this.getWorkingMemory('shuri'),
            'WORKING-vision.md': this.getWorkingMemory('vision'),
            'WORKING-wanda.md': this.getWorkingMemory('wanda'),
            'WORKING-pepper.md': this.getWorkingMemory('pepper')
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
