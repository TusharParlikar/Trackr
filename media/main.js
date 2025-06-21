// media/main.js - Webview JavaScript with progress tracking

const vscode = acquireVsCodeApi();

// State management
let todos = [];
let notes = [];
let roadmap = { milestones: [] };
let progressMode = 'combined'; // 'combined', 'todos', 'roadmap'

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeTodos();
    initializeNotes();
    initializeRoadmap();
    initializeProgressDropdown();
    loadData();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function initializeTodos() {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
}

function initializeNotes() {
    const noteTitle = document.getElementById('noteTitle');
    const addNoteBtn = document.getElementById('addNoteBtn');
    
    addNoteBtn.addEventListener('click', addNote);
    noteTitle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNote();
    });
}

function initializeRoadmap() {
    const milestoneInput = document.getElementById('milestoneInput');
    const milestoneDate = document.getElementById('milestoneDate');
    const addMilestoneBtn = document.getElementById('addMilestoneBtn');
    
    addMilestoneBtn.addEventListener('click', addMilestone);
    milestoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addMilestone();
    });
}

function initializeProgressDropdown() {
    const progressDisplay = document.getElementById('progressDisplay');
    const progressDropdown = document.getElementById('progressDropdown');
    const modeButtons = document.querySelectorAll('.mode-toggle-btn');
    
    // Toggle dropdown on click
    progressDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = progressDropdown.classList.contains('show');
        
        if (isVisible) {
            hideProgressDropdown();
        } else {
            showProgressDropdown();
        }
    });
      // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!progressDisplay.contains(e.target) && !progressDropdown.contains(e.target)) {
            hideProgressDropdown();
        }
    });
    
    // Hide dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && progressDropdown.classList.contains('show')) {
            hideProgressDropdown();
        }
    });
    // Handle mode toggle buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = button.dataset.mode;
            setProgressMode(mode);
            
            // Update progress display
            updateProgress();
        });
    });
}

function showProgressDropdown() {
    const progressDisplay = document.getElementById('progressDisplay');
    const progressDropdown = document.getElementById('progressDropdown');
    
    progressDropdown.classList.add('show');
    progressDisplay.classList.add('active');
}

function hideProgressDropdown() {
    const progressDisplay = document.getElementById('progressDisplay');
    const progressDropdown = document.getElementById('progressDropdown');
    
    progressDropdown.classList.remove('show');
    progressDisplay.classList.remove('active');
}

function setProgressMode(mode) {
    progressMode = mode;
    
    // Save the mode preference
    vscode.postMessage({
        type: 'saveProgressMode',
        data: mode
    });
    
    // Update active button state
    const modeButtons = document.querySelectorAll('.mode-toggle-btn');
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

// TODO Functions
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(todo);
        input.value = '';
        renderTodos();
        saveData();
        updateProgress();
    }
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        saveData();
        updateProgress();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    saveData();
    updateProgress();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">×</button>
        `;
        todoList.appendChild(li);
    });
    
    updateTodoProgress();
}

// Note Functions
function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const title = titleInput.value.trim();
    
    if (title) {
        const note = {
            id: Date.now(),
            title: title,
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        notes.push(note);
        titleInput.value = '';
        renderNotes();
        saveData();
    }
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    renderNotes();
    saveData();
}

function renderNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
            <div class="note-header">
                <h3>${escapeHtml(note.title)}</h3>
                <button class="delete-btn" onclick="deleteNote(${note.id})">×</button>
            </div>
            <textarea placeholder="Write your note here..." 
                      onchange="updateNoteContent(${note.id}, this.value)"
                      onkeyup="updateNoteContent(${note.id}, this.value)">${escapeHtml(note.content)}</textarea>
        `;
        notesList.appendChild(div);
    });
}

function updateNoteContent(id, content) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.content = content;
        note.updatedAt = new Date().toISOString();
        saveData();
    }
}

// Roadmap Functions
function addMilestone() {
    const input = document.getElementById('milestoneInput');
    const dateInput = document.getElementById('milestoneDate');
    const title = input.value.trim();
    const dueDate = dateInput.value;
    
    if (title) {
        const milestone = {
            id: Date.now(),
            title: title,
            dueDate: dueDate,
            tasks: [],
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        roadmap.milestones.push(milestone);
        input.value = '';
        dateInput.value = '';
        renderRoadmap();
        saveData();
        updateProgress();
    }
}

function addTaskToMilestone(milestoneId) {
    const input = document.getElementById(`task-input-${milestoneId}`);
    const text = input.value.trim();
    
    if (text) {
        const milestone = roadmap.milestones.find(m => m.id === milestoneId);
        if (milestone) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            milestone.tasks.push(task);
            input.value = '';
            renderRoadmap();
            saveData();
            updateProgress();
        }
    }
}

function toggleTask(milestoneId, taskId) {
    const milestone = roadmap.milestones.find(m => m.id === milestoneId);
    if (milestone) {
        const task = milestone.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            renderRoadmap();
            saveData();
            updateProgress();
        }
    }
}

function deleteMilestone(id) {
    roadmap.milestones = roadmap.milestones.filter(m => m.id !== id);
    renderRoadmap();
    saveData();
    updateProgress();
}

function renderRoadmap() {
    const milestonesList = document.getElementById('milestonesList');
    milestonesList.innerHTML = '';
    
    roadmap.milestones.forEach(milestone => {
        const completedTasks = milestone.tasks.filter(t => t.completed).length;
        const totalTasks = milestone.tasks.length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        const div = document.createElement('div');
        div.className = 'milestone-item';
        div.innerHTML = `
            <div class="milestone-header">
                <h3>${escapeHtml(milestone.title)}</h3>
                <span class="milestone-date">${milestone.dueDate || 'No due date'}</span>
                <button class="delete-btn" onclick="deleteMilestone(${milestone.id})">×</button>
            </div>
            <div class="milestone-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${completedTasks}/${totalTasks} tasks</span>
            </div>
            <div class="task-input-group">
                <input type="text" id="task-input-${milestone.id}" placeholder="Add task..." />
                <button onclick="addTaskToMilestone(${milestone.id})">Add Task</button>
            </div>
            <ul class="task-list">
                ${milestone.tasks.map(task => `
                    <li class="task-item ${task.completed ? 'completed' : ''}">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="toggleTask(${milestone.id}, ${task.id})">
                        <span class="task-text">${escapeHtml(task.text)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        milestonesList.appendChild(div);
    });
    
    updateRoadmapProgress();
}

// Progress Updates
function updateProgress() {
    updateTodoProgress();
    updateRoadmapProgress();
    updateOverallProgress();
    
    // Notify VS Code extension to update status bar
    vscode.postMessage({
        type: 'dataChanged'
    });
}

function updateTodoProgress() {
    const completed = todos.filter(t => t.completed).length;
    const total = todos.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    const progressBar = document.getElementById('todoProgress');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

function updateRoadmapProgress() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    roadmap.milestones.forEach(milestone => {
        totalTasks += milestone.tasks.length;
        completedTasks += milestone.tasks.filter(t => t.completed).length;
    });
    
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const progressBar = document.getElementById('roadmapProgress');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

function updateOverallProgress() {
    const todoCompleted = todos.filter(t => t.completed).length;
    const todoTotal = todos.length;
    
    let roadmapCompleted = 0;
    let roadmapTotal = 0;
    
    roadmap.milestones.forEach(milestone => {
        roadmapTotal += milestone.tasks.length;
        roadmapCompleted += milestone.tasks.filter(t => t.completed).length;
    });
    
    // Update individual progress bars in dropdown
    updateProgressDropdownContent(todoCompleted, todoTotal, roadmapCompleted, roadmapTotal);
    
    // Calculate main progress based on selected mode
    let percentage, completedTasks, totalTasks, modeText;
    
    switch (progressMode) {
        case 'todos':
            completedTasks = todoCompleted;
            totalTasks = todoTotal;
            percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            modeText = 'TODOs';
            break;
        case 'roadmap':
            completedTasks = roadmapCompleted;
            totalTasks = roadmapTotal;
            percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            modeText = 'Roadmap';
            break;
        case 'combined':
        default:
            completedTasks = todoCompleted + roadmapCompleted;
            totalTasks = todoTotal + roadmapTotal;
            percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            modeText = 'Overall';
            break;
    }
    
    const progressDisplay = document.getElementById('progressDisplay');
    if (progressDisplay) {
        const displayText = totalTasks > 0 
            ? `${modeText}: ${percentage}% (${completedTasks}/${totalTasks})` 
            : `${modeText}: No tasks yet`;
        progressDisplay.textContent = displayText;
    }
}

function updateProgressDropdownContent(todoCompleted, todoTotal, roadmapCompleted, roadmapTotal) {
    // Update TODO progress in dropdown
    const todoPercentage = todoTotal > 0 ? Math.round((todoCompleted / todoTotal) * 100) : 0;
    const todoPercentageEl = document.getElementById('todoPercentage');
    const todoProgressFill = document.getElementById('todoProgressFill');
    const todoStats = document.getElementById('todoStats');
    const todoTotalEl = document.getElementById('todoTotal');
    
    if (todoPercentageEl) todoPercentageEl.textContent = `${todoPercentage}%`;
    if (todoProgressFill) todoProgressFill.style.width = `${todoPercentage}%`;
    if (todoStats) todoStats.textContent = `${todoCompleted} completed`;
    if (todoTotalEl) todoTotalEl.textContent = `${todoTotal} total`;
    
    // Update Roadmap progress in dropdown
    const roadmapPercentage = roadmapTotal > 0 ? Math.round((roadmapCompleted / roadmapTotal) * 100) : 0;
    const roadmapPercentageEl = document.getElementById('roadmapPercentage');
    const roadmapProgressFill = document.getElementById('roadmapProgressFill');
    const roadmapStats = document.getElementById('roadmapStats');
    const roadmapTotalEl = document.getElementById('roadmapTotal');
    
    if (roadmapPercentageEl) roadmapPercentageEl.textContent = `${roadmapPercentage}%`;
    if (roadmapProgressFill) roadmapProgressFill.style.width = `${roadmapPercentage}%`;
    if (roadmapStats) roadmapStats.textContent = `${roadmapCompleted} completed`;
    if (roadmapTotalEl) roadmapTotalEl.textContent = `${roadmapTotal} total`;
}

// Data Management
function saveData() {
    vscode.postMessage({
        type: 'saveTodos',
        data: todos
    });
    
    vscode.postMessage({
        type: 'saveRoadmap',
        data: roadmap
    });
    
    vscode.postMessage({
        type: 'saveNotes',
        data: notes
    });
}

function loadData() {
    vscode.postMessage({
        type: 'getTodos'
    });
    
    vscode.postMessage({
        type: 'getRoadmap'
    });
    
    vscode.postMessage({
        type: 'getNotes'
    });
    
    vscode.postMessage({
        type: 'getProgressMode'
    });
}

// Handle messages from VS Code extension
window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.type) {
        case 'todosData':
            todos = message.data || [];
            renderTodos();
            updateProgress();
            break;
        case 'roadmapData':
            roadmap = message.data || { milestones: [] };
            renderRoadmap();
            updateProgress();
            break;
        case 'notesData':
            notes = message.data || [];
            renderNotes();
            break;
        case 'progressModeData':
            if (message.data) {
                progressMode = message.data;
                setProgressMode(progressMode);
                updateProgress();
            }
            break;        case 'openToNote':
            // Switch to notes tab and focus on specific note
            switchToNotesTab();
            if (typeof message.noteIndex === 'number') {
                focusOnNote(message.noteIndex);
            }
            break;
        case 'openToTodo':
            // Switch to todos tab and focus on specific todo
            switchToTodosTab();
            if (typeof message.todoIndex === 'number') {
                focusOnTodo(message.todoIndex);
            }
            break;
    }
});

// Function to switch to notes tab
function switchToNotesTab() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Remove active class from all buttons and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to notes tab
    const notesButton = document.querySelector('[data-tab="notes"]');
    const notesPanel = document.getElementById('notes');
    
    if (notesButton && notesPanel) {
        notesButton.classList.add('active');
        notesPanel.classList.add('active');
    }
}

// Function to focus on a specific note
function focusOnNote(noteIndex) {
    setTimeout(() => {
        const noteElements = document.querySelectorAll('.note-item');
        if (noteElements[noteIndex]) {
            // Scroll the note into view
            noteElements[noteIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Add a highlight effect
            noteElements[noteIndex].style.border = '2px solid #007acc';
            noteElements[noteIndex].style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                noteElements[noteIndex].style.border = '';
                noteElements[noteIndex].style.backgroundColor = '';
            }, 3000);
            
            // Focus on the note content for editing
            const textArea = noteElements[noteIndex].querySelector('textarea');
            if (textArea) {
                textArea.focus();
            }
        }
    }, 200); // Small delay to ensure the notes tab is fully loaded
}

// Function to switch to todos tab
function switchToTodosTab() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Remove active class from all buttons and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to todos tab
    const todosButton = document.querySelector('[data-tab="todos"]');
    const todosPanel = document.getElementById('todos');
    
    if (todosButton && todosPanel) {
        todosButton.classList.add('active');
        todosPanel.classList.add('active');
    }
}

// Function to focus on a specific todo
function focusOnTodo(todoIndex) {
    setTimeout(() => {
        const todoElements = document.querySelectorAll('.todo-item');
        if (todoElements[todoIndex]) {
            // Scroll the todo into view
            todoElements[todoIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Add a highlight effect
            todoElements[todoIndex].style.border = '2px solid #28a745';
            todoElements[todoIndex].style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                todoElements[todoIndex].style.border = '';
                todoElements[todoIndex].style.backgroundColor = '';
            }, 3000);
            
            // Optionally focus on the checkbox or text for interaction
            const checkbox = todoElements[todoIndex].querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.focus();
            }
        }
    }, 200); // Small delay to ensure the todos tab is fully loaded
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.deleteNote = deleteNote;
window.updateNoteContent = updateNoteContent;
window.addTaskToMilestone = addTaskToMilestone;
window.toggleTask = toggleTask;
window.deleteMilestone = deleteMilestone;
