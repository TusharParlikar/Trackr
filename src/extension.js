// src/extension.js - Main extension file with status bar integration

const vscode = require('vscode');

let statusBarItem;
let webviewPanel;
let treeProviders = {};

function activate(context) {
    // Show activation message to user
    vscode.window.showInformationMessage('🚀 Trackr Extension Activated! Check status bar and activity bar.');
    
    try {
        // Initialize with some test data if none exists
        const existingTodos = getTodos(context);
        if (existingTodos.length === 0) {
            const testTodos = [
                { text: 'Welcome to Trackr!', completed: false, id: Date.now() },
                { text: 'Try the main interface', completed: false, id: Date.now() + 1 }
            ];
            saveTodos(context, testTodos);
        }
        
        // Create status bar item
        createStatusBarItem(context);
        
        // Register commands
        registerCommands(context);
        
        // Update status bar on activation
        updateStatusBar(context);
        
    } catch (error) {
        vscode.window.showErrorMessage('Failed to activate Trackr extension: ' + error.message);
    }
}

function createStatusBarItem(context) {
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 
        100 // Priority (higher = more left)
    );
    
    // Set initial text
    statusBarItem.text = "📝 Trackr: 0%";
    
    // Set the command to run when clicked
    statusBarItem.command = 'trackr.openTodo';
    statusBarItem.tooltip = 'Click to open Trackr - TODO Notes Roadmap';
    
    // Show the status bar item
    statusBarItem.show();
    
    // Add to subscriptions so it's disposed when extension deactivates
    context.subscriptions.push(statusBarItem);
}

function registerCommands(context) {
    // Main command to open the extension
    const openTodoCommand = vscode.commands.registerCommand('trackr.openTodo', () => {
        createWebviewPanel(context);
    });
    
    // Command to refresh status bar (called from webview)
    const refreshStatusCommand = vscode.commands.registerCommand('trackr.refreshStatus', () => {
        updateStatusBar(context);
    });
      // Command to open from sidebar
    const openFromSidebarCommand = vscode.commands.registerCommand('trackr.openFromSidebar', () => {
        createWebviewPanel(context);
    });
    
    // Command to toggle TODO completion
    const toggleTodoCommand = vscode.commands.registerCommand('trackr.toggleTodo', (item) => {
        if (item && item.id !== undefined) {
            const todos = getTodos(context);
            const index = parseInt(item.id);
            if (index >= 0 && index < todos.length) {
                todos[index].completed = !todos[index].completed;
                saveTodos(context, todos);
                updateStatusBar(context);
                refreshTreeViews();
            }
        }
    });
      // Command to delete TODO
    const deleteTodoCommand = vscode.commands.registerCommand('trackr.deleteTodo', (item) => {
        if (item && item.id !== undefined) {
            const todos = getTodos(context);
            const index = parseInt(item.id);
            if (index >= 0 && index < todos.length) {
                todos.splice(index, 1);
                saveTodos(context, todos);
                updateStatusBar(context);
                refreshTreeViews();
            }
        }
    });
      // Command to open to specific note
    const openToNoteCommand = vscode.commands.registerCommand('trackr.openToNote', (noteIndex) => {
        createWebviewPanel(context);
        // Send message to webview to switch to notes tab and focus on specific note
        if (webviewPanel && typeof noteIndex === 'number') {
            setTimeout(() => {
                webviewPanel.webview.postMessage({
                    type: 'openToNote',
                    noteIndex: noteIndex
                });
            }, 100); // Small delay to ensure webview is ready
        }
    });
    
    // Command to open to specific todo
    const openToTodoCommand = vscode.commands.registerCommand('trackr.openToTodo', (todoIndex) => {
        createWebviewPanel(context);
        // Send message to webview to switch to todos tab and focus on specific todo
        if (webviewPanel && typeof todoIndex === 'number') {
            setTimeout(() => {
                webviewPanel.webview.postMessage({
                    type: 'openToTodo',
                    todoIndex: todoIndex
                });
            }, 100); // Small delay to ensure webview is ready
        }
    });
    
    // Register tree data providers for sidebar views
    registerTreeDataProviders(context);
    
    context.subscriptions.push(openTodoCommand, refreshStatusCommand, openFromSidebarCommand, toggleTodoCommand, deleteTodoCommand, openToNoteCommand, openToTodoCommand);
}

function registerTreeDataProviders(context) {
    // Overview tree data provider
    const overviewProvider = new TrackrOverviewProvider(context);
    vscode.window.registerTreeDataProvider('trackr-overview', overviewProvider);
    treeProviders.overview = overviewProvider;
    
    // TODOs tree data provider
    const todosProvider = new TrackrTodosProvider(context);
    vscode.window.registerTreeDataProvider('trackr-todos', todosProvider);
    treeProviders.todos = todosProvider;
    
    // Notes tree data provider
    const notesProvider = new TrackrNotesProvider(context);
    vscode.window.registerTreeDataProvider('trackr-notes', notesProvider);
    treeProviders.notes = notesProvider;
}

// Tree Data Provider Classes
class TrackrOverviewProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element) {
        return element;
    }    getChildren(element) {
        if (!element) {
            const todos = getTodos(this.context);
            const completedCount = todos.filter(todo => todo.completed).length;
            const totalCount = todos.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            
            const progressItem = new vscode.TreeItem(`📊 Progress: ${progress}%`, vscode.TreeItemCollapsibleState.None);
            progressItem.command = {
                command: 'trackr.openTodo',
                title: 'Open Trackr',
                arguments: []
            };
            
            const completedItem = new vscode.TreeItem(`✅ Completed: ${completedCount}`, vscode.TreeItemCollapsibleState.None);
            completedItem.command = {
                command: 'trackr.openTodo',
                title: 'Open Trackr',
                arguments: []
            };
            
            const totalItem = new vscode.TreeItem(`📋 Total TODOs: ${totalCount}`, vscode.TreeItemCollapsibleState.None);
            totalItem.command = {
                command: 'trackr.openTodo',
                title: 'Open Trackr',
                arguments: []
            };
            
            const openItem = new vscode.TreeItem(`📝 Open Trackr`, vscode.TreeItemCollapsibleState.None);
            openItem.command = {
                command: 'trackr.openTodo',
                title: 'Open Trackr',
                arguments: []
            };
            
            const items = [progressItem, completedItem, totalItem, openItem];
            return items;
        }
        return [];
    }
}

class TrackrTodosProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element) {
        return element;
    }    getChildren(element) {
        if (!element) {
            const todos = getTodos(this.context);
            
            if (todos.length === 0) {
                const item = new vscode.TreeItem('No TODOs yet - Click to add', vscode.TreeItemCollapsibleState.None);
                item.command = {
                    command: 'trackr.openTodo',
                    title: 'Open Trackr',
                    arguments: []                };
                return [item];
            }
              const items = todos.map((todo, index) => {
                const item = new vscode.TreeItem(
                    `${todo.completed ? '✅' : '⏳'} ${todo.text}`,
                    vscode.TreeItemCollapsibleState.None
                );
                item.tooltip = `${todo.completed ? 'Completed' : 'Pending'} - Click to open this TODO`;
                item.contextValue = 'todo';
                item.command = {
                    command: 'trackr.openToTodo',
                    title: 'Open to TODO',
                    arguments: [index] // Pass the todo index
                };
                // Store the index for context menu actions
                item.id = index.toString();
                return item;            });
            
            return items;
        }
        return [];
    }
}

class TrackrNotesProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element) {
        return element;
    }
      getChildren(element) {
        if (!element) {
            const notes = getNotes(this.context);
            if (notes.length === 0) {
                const item = new vscode.TreeItem('No notes yet - Click to add', vscode.TreeItemCollapsibleState.None);
                item.command = {
                    command: 'trackr.openTodo',
                    title: 'Open Trackr',
                    arguments: []
                };
                return [item];
            }
              return notes.map((note, index) => {
                const preview = note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '');
                const item = new vscode.TreeItem(
                    `📝 ${note.title || preview}`,
                    vscode.TreeItemCollapsibleState.None
                );
                item.tooltip = `${note.content} - Click to open this note`;
                item.command = {
                    command: 'trackr.openToNote',
                    title: 'Open to Note',
                    arguments: [index] // Pass the note index
                };
                return item;
            });
        }
        return [];
    }
}

function createWebviewPanel(context) {
    // Create or show existing panel
    if (webviewPanel) {
        webviewPanel.reveal();
        return;
    }
    
    webviewPanel = vscode.window.createWebviewPanel(
        'trackr',
        'Trackr - TODO Notes Roadmap',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
        }
    );
    
    // Handle panel disposal
    webviewPanel.onDidDispose(() => {
        webviewPanel = undefined;
    });
    
    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage(
        message => handleWebviewMessage(message, context),
        undefined,
        context.subscriptions
    );
    
    // Set webview content
    webviewPanel.webview.html = getWebviewContent(context, webviewPanel.webview);
}

function handleWebviewMessage(message, context) {
    switch (message.type) {
        case 'dataChanged':
            // Update status bar when data changes
            updateStatusBar(context);
            // Refresh tree views
            refreshTreeViews();
            break;
        case 'getTodos':
            // Send current todos to webview
            const todos = getTodos(context);
            webviewPanel.webview.postMessage({
                type: 'todosData',
                data: todos
            });
            break;        case 'saveTodos':
            // Save todos and update status
            saveTodos(context, message.data);
            updateStatusBar(context);
            refreshTreeViews();
            break;
        case 'getRoadmap':
            // Send current roadmap to webview
            const roadmap = getRoadmap(context);
            webviewPanel.webview.postMessage({
                type: 'roadmapData',
                data: roadmap
            });
            break;        case 'saveRoadmap':
            // Save roadmap and update status
            saveRoadmap(context, message.data);
            updateStatusBar(context);
            refreshTreeViews();
            break;
        case 'getNotes':
            // Send current notes to webview
            const notes = getNotes(context);
            webviewPanel.webview.postMessage({
                type: 'notesData',
                data: notes
            });
            break;        case 'saveNotes':
            // Save notes
            saveNotes(context, message.data);
            refreshTreeViews();
            break;
        case 'getProgressMode':
            // Send current progress mode to webview
            const progressMode = getProgressMode(context);
            webviewPanel.webview.postMessage({
                type: 'progressModeData',
                data: progressMode
            });
            break;
        case 'saveProgressMode':
            // Save progress mode
            saveProgressMode(context, message.data);
            break;
    }
}

function updateStatusBar(context) {
    const progress = calculateProgress(context);
    const progressMode = getProgressMode(context);
    
    // Update status bar text with progress based on mode
    let statusText = '📝 ';
    let modeText = '';
    let currentProgress = 0;
    
    switch (progressMode) {
        case 'todos':
            currentProgress = progress.todos.total > 0 ? 
                Math.round((progress.todos.completed / progress.todos.total) * 100) : 0;
            statusText += `TODOs: ${currentProgress}%`;
            modeText = 'TODOs Only';
            break;
        case 'roadmap':
            currentProgress = progress.roadmap.total > 0 ? 
                Math.round((progress.roadmap.completed / progress.roadmap.total) * 100) : 0;
            statusText += `Roadmap: ${currentProgress}%`;
            modeText = 'Roadmap Only';
            break;
        case 'combined':
        default:
            currentProgress = progress.percentage;
            statusText += `Progress: ${currentProgress}%`;
            modeText = 'Combined';
            break;
    }
    
    statusBarItem.text = statusText;
    
    // Update tooltip with detailed info
    statusBarItem.tooltip = `Trackr Progress (${modeText}): ${currentProgress}%\n` +
                           `Overall: ${progress.completed}/${progress.total}\n` +
                           `TODOs: ${progress.todos.completed}/${progress.todos.total}\n` +
                           `Roadmap: ${progress.roadmap.completed}/${progress.roadmap.total}\n` +
                           `Click to open Trackr`;
}

function calculateProgress(context) {
    const todos = getTodos(context);
    const roadmap = getRoadmap(context);
    
    // Calculate TODO progress
    const todoStats = {
        total: todos.length,
        completed: todos.filter(todo => todo.completed).length
    };
    
    // Calculate Roadmap progress
    let roadmapTasks = [];
    roadmap.milestones?.forEach(milestone => {
        if (milestone.tasks) {
            roadmapTasks = roadmapTasks.concat(milestone.tasks);
        }
    });
    
    const roadmapStats = {
        total: roadmapTasks.length,
        completed: roadmapTasks.filter(task => task.completed).length
    };
    
    // Calculate overall progress
    const totalTasks = todoStats.total + roadmapStats.total;
    const completedTasks = todoStats.completed + roadmapStats.completed;
    
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
        percentage,
        total: totalTasks,
        completed: completedTasks,
        todos: todoStats,
        roadmap: roadmapStats
    };
}

// Data management functions
function getTodos(context) {
    return context.globalState.get('trackr.todos', []);
}

function saveTodos(context, todos) {
    context.globalState.update('trackr.todos', todos);
}

function getRoadmap(context) {
    return context.globalState.get('trackr.roadmap', { milestones: [] });
}

function saveRoadmap(context, roadmap) {
    context.globalState.update('trackr.roadmap', roadmap);
}

function getNotes(context) {
    return context.globalState.get('trackr.notes', []);
}

function saveNotes(context, notes) {
    context.globalState.update('trackr.notes', notes);
}

function getProgressMode(context) {
    return context.globalState.get('trackr.progressMode', 'combined');
}

function saveProgressMode(context, progressMode) {
    context.globalState.update('trackr.progressMode', progressMode);
}

function getWebviewContent(context, webview) {
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'style.css')
    );
    
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
            <title>Trackr - TODO Notes Roadmap</title>
        </head>
        <body>
            <div class="container">                <header>
                    <h1>📝 Trackr</h1>
                    <div class="progress-summary">
                        <div id="progressDisplay">Progress: 0%</div>
                        <div class="progress-dropdown" id="progressDropdown">
                            <div class="progress-dropdown-header">
                                Progress Breakdown
                            </div>
                            
                            <div class="progress-category">
                                <div class="progress-category-header">
                                    <div class="progress-category-title">
                                        📝 TODOs
                                    </div>
                                    <div class="progress-category-percentage" id="todoPercentage">0%</div>
                                </div>
                                <div class="progress-category-bar">
                                    <div class="progress-category-fill todos" id="todoProgressFill"></div>
                                </div>
                                <div class="progress-category-stats">
                                    <span id="todoStats">0 completed</span>
                                    <span id="todoTotal">0 total</span>
                                </div>
                            </div>
                            
                            <div class="progress-category">
                                <div class="progress-category-header">
                                    <div class="progress-category-title">
                                        🛤️ Roadmap
                                    </div>
                                    <div class="progress-category-percentage" id="roadmapPercentage">0%</div>
                                </div>
                                <div class="progress-category-bar">
                                    <div class="progress-category-fill roadmap" id="roadmapProgressFill"></div>
                                </div>
                                <div class="progress-category-stats">
                                    <span id="roadmapStats">0 completed</span>
                                    <span id="roadmapTotal">0 total</span>
                                </div>
                            </div>
                            
                            <div class="progress-mode-toggle">
                                <button class="mode-toggle-btn active" data-mode="combined">Combined</button>
                                <button class="mode-toggle-btn" data-mode="todos">TODOs Only</button>
                                <button class="mode-toggle-btn" data-mode="roadmap">Roadmap Only</button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <div class="tabs">
                    <button class="tab-button active" data-tab="todos">TODOs</button>
                    <button class="tab-button" data-tab="notes">Notes</button>
                    <button class="tab-button" data-tab="roadmap">Roadmap</button>
                </div>
                
                <div class="tab-content">
                    <!-- TODO Tab -->
                    <div id="todos" class="tab-panel active">
                        <div class="input-group">
                            <input type="text" id="todoInput" placeholder="Add a new TODO..." />
                            <button id="addTodoBtn">Add</button>
                        </div>
                        <div class="progress-bar">
                            <div id="todoProgress" class="progress-fill"></div>
                        </div>
                        <ul id="todoList"></ul>
                    </div>
                    
                    <!-- Notes Tab -->
                    <div id="notes" class="tab-panel">
                        <div class="input-group">
                            <input type="text" id="noteTitle" placeholder="Note title..." />
                            <button id="addNoteBtn">New Note</button>
                        </div>
                        <div id="notesList"></div>
                    </div>
                    
                    <!-- Roadmap Tab -->
                    <div id="roadmap" class="tab-panel">
                        <div class="input-group">
                            <input type="text" id="milestoneInput" placeholder="New milestone..." />
                            <input type="date" id="milestoneDate" />
                            <button id="addMilestoneBtn">Add Milestone</button>
                        </div>
                        <div class="progress-bar">
                            <div id="roadmapProgress" class="progress-fill"></div>
                        </div>
                        <div id="milestonesList"></div>
                    </div>
                </div>
            </div>
            
            <script src="${scriptUri}"></script>
        </body>
        </html>
    `;
}

function refreshTreeViews() {
    // Refresh all tree views
    if (treeProviders.overview) {
        treeProviders.overview.refresh();
    }
    if (treeProviders.todos) {
        treeProviders.todos.refresh();
    }
    if (treeProviders.notes) {
        treeProviders.notes.refresh();
    }
}

function deactivate() {
    // Clean up status bar item
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (webviewPanel) {
        webviewPanel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
