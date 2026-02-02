// Mission Control - Task Board Application
class MissionControl {
    constructor() {
        this.initAsync();
    }

    async initAsync() {
        this.tasks = await this.loadTasks();
        this.features = this.loadFeatures();
        this.editingTaskId = null;
        this.bindNavigation();
        this.bindDragDrop();
        await this.render();
    }
        this.initAsync();
    }

    async initAsync() {
        this.tasks = await this.loadTasks();
        this.features = this.loadFeatures();
        this.editingTaskId = null;
        this.bindNavigation();
        this.bindDragDrop();
        await this.render();
    }

    // Data persistence
    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            return data.tasks || [];
        } catch {
            return [];
        }
    }

    async saveTasks() {
        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: this.tasks })
            });
        } catch (err) {
            console.error('Failed to save tasks:', err);
        }
        this.render();
    }

    loadFeatures() {
        return [
            { id: 'stat-stories', name: 'Stat Stories', description: 'Shareable Instagram highlight cards', icon: '📊', status: 'approved', agents: ['beacon', 'forge', 'echo', 'sentinel'], priority: 'high' },
            { id: 'game-previews', name: 'Game Previews', description: 'Match preview cards with key stats', icon: '⚽', status: 'pending', agents: ['scout', 'beacon'], priority: 'medium' },
            { id: 'team-analytics', name: 'Team Analytics', description: 'Team performance dashboards', icon: '📈', status: 'pending', agents: ['scout'], priority: 'low' }
        ];
    }

    // Navigation
    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.showView(view);
            });
        });
    }

    showView(view) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        document.querySelector(`.nav-item[data-view="${view}"]`).classList.add('active');
        document.getElementById(`view-${view}`).classList.add('active');
    }

    // Rendering
    render() {
        this.renderBoard();
        this.renderAgents();
        this.renderFeatures();
    }

    renderBoard() {
        const statuses = ['backlog', 'todo', 'doing', 'review', 'done'];
        
        statuses.forEach(status => {
            const tasks = this.tasks.filter(t => t.status === status);
            const container = document.getElementById(status);
            const count = document.getElementById(`count-${status}`);
            
            count.textContent = tasks.length;
            
            if (tasks.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <div class="empty-state-text">No tasks</div>
                    </div>
                `;
            } else {
                container.innerHTML = tasks.map(task => this.renderTaskCard(task)).join('');
            }
        });
    }

    renderTaskCard(task) {
        const agent = this.getAgent(task.agent);
        return `
            <div class="task-card priority-${task.priority}" data-id="${task.id}" draggable="true">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                ${task.desc ? `<div class="task-desc">${this.escapeHtml(task.desc)}</div>` : ''}
                <div class="task-meta">
                    <div class="task-assignee">
                        ${agent ? `<span class="task-agent-avatar">${agent.avatar}</span>` : ''}
                        <span>${agent ? agent.name : 'Unassigned'}</span>
                    </div>
                    <span>${this.formatDate(task.createdAt)}</span>
                </div>
            </div>
        `;
    }

    renderAgents() {
        const agents = [
            { id: 'beacon', name: 'Beacon', avatar: '🎯', role: 'Product Strategist', status: 'active', task: 'Stat Stories Sprint' },
            { id: 'forge', name: 'Forge', avatar: '🔨', role: 'Developer', status: 'active', task: 'Card Components' },
            { id: 'echo', name: 'Echo', avatar: '📢', role: 'Content Creator', status: 'active', task: 'Social Copy' },
            { id: 'scout', name: 'Scout', avatar: '🔭', role: 'Researcher', status: 'active', task: 'Feature Research' },
            { id: 'sentinel', name: 'Sentinel', avatar: '🛡️', role: 'QA', status: 'active', task: 'Testing Login Flow' }
        ];

        const grid = document.getElementById('agents-grid');
        grid.innerHTML = agents.map(agent => `
            <div class="agent-card">
                <div class="agent-header">
                    <span class="agent-avatar">${agent.avatar}</span>
                    <div>
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                </div>
                <div class="agent-status ${agent.status}">
                    <span class="agent-status-dot"></span>
                    ${agent.status === 'active' ? 'Active' : 'Idle'}
                </div>
                <div class="agent-task">
                    <strong>Current:</strong> ${agent.task}
                </div>
            </div>
        `).join('');
    }

    renderFeatures() {
        const grid = document.getElementById('features-grid');
        grid.innerHTML = this.features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">${feature.icon}</div>
                <div class="feature-content">
                    <div class="feature-name">${feature.name}</div>
                    <div class="feature-desc">${feature.description}</div>
                    <div class="feature-meta">
                        <span class="feature-status ${feature.status}">${feature.status.toUpperCase()}</span>
                        <span>Priority: ${feature.priority}</span>
                        <span>Agents: ${feature.agents.map(a => this.getAgent(a)?.name || a).join(', ')}</span>
                    </div>
                </div>
                <div class="feature-actions">
                    ${feature.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="app.approveFeature('${feature.id}')">Approve</button>
                        <button class="btn btn-secondary btn-sm" onclick="app.declineFeature('${feature.id}')">Decline</button>
                    ` : feature.status === 'approved' ? `
                        <button class="btn btn-secondary btn-sm" onclick="app.declineFeature('${feature.id}')">Decline</button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="app.approveFeature('${feature.id}')">Re-approve</button>
                    `}
                </div>
            </div>
        `).join('');
    }

    // Drag and Drop
    bindDragDrop() {
        document.querySelectorAll('.column-tasks').forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });

            column.addEventListener('dragleave', () => {
                column.classList.remove('drag-over');
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.id;
                this.moveTask(taskId, newStatus);
            });
        });

        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
            }
        });
    }

    moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
        }
    }

    // Task Modal
    showTaskModal(taskId = null) {
        this.editingTaskId = taskId;
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('task-modal-title');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Edit Task';
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-desc').value = task.desc || '';
                document.getElementById('task-agent').value = task.agent || '';
                document.getElementById('task-priority').value = task.priority || 'medium';
            }
        } else {
            title.textContent = 'New Task';
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value = '';
            document.getElementById('task-agent').value = '';
            document.getElementById('task-priority').value = 'medium';
        }
        
        modal.classList.add('active');
    }

    hideTaskModal() {
        document.getElementById('task-modal').classList.remove('active');
        this.editingTaskId = null;
    }

    saveTask() {
        const title = document.getElementById('task-title').value.trim();
        const desc = document.getElementById('task-desc').value.trim();
        const agent = document.getElementById('task-agent').value;
        const priority = document.getElementById('task-priority').value;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        if (this.editingTaskId) {
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                task.title = title;
                task.desc = desc;
                task.agent = agent;
                task.priority = priority;
                task.updatedAt = new Date().toISOString();
            }
        } else {
            this.tasks.push({
                id: Date.now().toString(),
                title,
                desc,
                agent,
                priority,
                status: 'backlog',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        this.saveTasks();
        this.hideTaskModal();
    }

    // Feature Approval
    approveFeature(id) {
        const feature = this.features.find(f => f.id === id);
        if (feature) {
            feature.status = 'approved';
            this.renderFeatures();
        }
    }

    declineFeature(id) {
        const feature = this.features.find(f => f.id === id);
        if (feature) {
            feature.status = 'declined';
            this.renderFeatures();
        }
    }

    // Helpers
    getAgent(id) {
        const agents = {
            beacon: { name: 'Beacon', avatar: '🎯' },
            forge: { name: 'Forge', avatar: '🔨' },
            echo: { name: 'Echo', avatar: '📢' },
            scout: { name: 'Scout', avatar: '🔭' },
            sentinel: { name: 'Sentinel', avatar: '🛡️' }
        };
        return agents[id];
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize
const app = new MissionControl();
window.app = app;
