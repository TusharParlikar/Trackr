# 🎯[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code%20Marketplace-TusharParlikar.trackr--task--manager-blue?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)
[![Version](https://img.shields.io/badge/Version-1.0.3-green?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://github.com/TusharParlikar/Trackr/blob/main/LICENSE) Trackr - Task Manager

> Complete task management with TODOs, notes, and roadmap planning. Real-time progress tracking in your status bar. Boost productivity with milestone tracking for developers.

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code%20Marketplace-TusharParlikar.trackr--task--manager-blue?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)
[![Version](https://img.shields.io/badge/Version-1.0.3-green?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://github.com/TusharParlikar/Trackr/blob/main/LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-TusharParlikar%2FTrackr-orange?style=flat-square)](https://github.com/TusharParlikar/Trackr)

**📦 Extension ID:** `TusharParlikar.trackr-task-manager` | **🔖 Version:** 1.0.3 | **📄 License:** MIT

## ✨ Features

### 📋 Smart TODO Management
- ✅ Quick task creation and completion
- 📊 Real-time progress tracking in status bar
- 🎯 Click any TODO in sidebar to jump directly to it
- 💾 Auto-save and instant updates

### 📝 Integrated Notes
- 📓 Rich text editing for detailed notes
- 🎯 Click notes in sidebar to open and edit instantly
- 💾 Auto-save functionality
- 📁 Organized alongside your tasks

### 🛤️ Roadmap Planning
- 🎯 Milestone-based project tracking
- 📅 Task organization within milestones
- 📈 Visual progress indicators
- 🏆 Goal achievement tracking

### 📊 Activity Bar Integration
- 📋 Dedicated Trackr panel in VS Code sidebar
- 👁️ Quick overview of all TODOs and notes
- 🎯 One-click navigation to specific items
- 📈 Live progress statistics

## 🚀 Quick Start

1. **Install**: Search "Trackr Task Manager" in VS Code Extensions
2. **Open**: Press `Ctrl+Shift+T` or click the Trackr icon in Activity Bar
3. **Create**: Add your first TODO or note
4. **Track**: Watch progress update in status bar automatically

## 🎮 Usage

### Opening Trackr
- **Keyboard**: `Ctrl+Shift+T` (or `Cmd+Shift+T` on Mac)
- **Activity Bar**: Click the 📒 Trackr icon
- **Command Palette**: `Ctrl+Shift+P` → "Open Trackr"
- **Status Bar**: Click the progress indicator

### Smart Navigation
- **Click any TODO** in sidebar → Jump to TODOs tab, highlight that task
- **Click any note** in sidebar → Jump to Notes tab, focus on that note
- **Click progress stats** → Open main interface

### Managing Tasks
- **Add TODO**: Type in input field and press Enter
- **Complete**: Click checkbox or right-click → Toggle
- **Delete**: Right-click TODO → Delete
- **Progress**: Automatically calculated and displayed

## 📊 Interface Overview

### Main Interface
- **TODOs Tab**: Complete task management with progress tracking
- **Notes Tab**: Rich text note editing and organization  
- **Roadmap Tab**: Milestone-based project planning

### Sidebar Panel
- **Overview**: Live progress statistics and quick access
- **TODOs**: List of all tasks with completion status
- **Notes**: Preview of all notes with click-to-edit

### Status Bar
- **Progress Indicator**: Live completion percentage
- **Click to Open**: Instant access to full interface

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+T` | Open Trackr |
| `Enter` | Add new item in any input field |
| `Tab` | Navigate between sections |

## ⚙️ Configuration

Customize Trackr through VS Code settings:

```json
{
  "trackr.showProgressInStatusBar": true,
  "trackr.progressFormat": "percentage",
  "trackr.statusBarPosition": "left",
  "trackr.autoSave": true,
  "trackr.showNotifications": true
}
```

### Available Settings

- **Show Progress in Status Bar**: Display progress percentage in status bar
- **Progress Format**: Choose between percentage, fraction, or both
- **Status Bar Position**: Position status bar item on left or right
- **Auto Save**: Automatically save changes
- **Show Notifications**: Enable notifications for due items

## 🎯 Use Cases

### For Developers
- Track feature development progress
- Manage bug fixes and improvements
- Plan sprint goals and milestones
- Keep development notes organized

### For Project Managers
- Monitor project completion
- Track team milestones
- Manage project documentation
- Visualize progress across initiatives

### For Students
- Organize coursework and assignments
- Track study goals and progress
- Manage research notes
- Plan semester milestones

### For Everyone
- Daily task management
- Goal setting and tracking
- Note organization
- Progress visualization

## 🛠️ Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Trackr Task Manager"
4. Click "Install"

### From Command Line
```bash
code --install-extension TusharParlikar.trackr-task-manager
```

### From VSIX Package
```bash
code --install-extension trackr-task-manager-1.0.3.vsix
```

## 🚀 Development

### Tech Stack
- **JavaScript (ES6+)**: Core functionality
- **VS Code Extension API**: Integration
- **HTML5 & CSS3**: User interface
- **Node.js**: Runtime environment

### Local Development
```bash
# Clone the repository
git clone https://github.com/TusharParlikar/Trackr.git

# Navigate to the project directory
cd Trackr

# Open in VS Code
code .

# Press F5 to launch extension development host
```

### Building
```bash
# Package the extension
vsce package

# Publish to marketplace
vsce publish
```

## 📊 Features in Detail

### TODO Management
- **Quick Add**: Type and press Enter to add tasks
- **Toggle Complete**: Click checkbox to mark done
- **Delete Tasks**: Remove completed or unwanted tasks
- **Progress Tracking**: Visual progress bar shows completion

### Notes System
- **Rich Text**: Full text editing capabilities
- **Auto-Save**: Changes saved automatically
- **Organization**: Title-based note organization
- **Quick Access**: Instant note creation and editing

### Roadmap Planning
- **Milestones**: Create project milestones with due dates
- **Task Breakdown**: Add multiple tasks per milestone
- **Progress Visualization**: See completion percentage per milestone
- **Date Management**: Set and track due dates

### Status Bar Integration
- **Real-time Updates**: Progress updates instantly
- **Detailed Tooltips**: Hover for breakdown by category
- **Quick Access**: Click to open extension
- **Visual Indicator**: Always visible progress tracking

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure VS Code compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tushar Parlikar**
- 🌐 GitHub: [@TusharParlikar](https://github.com/TusharParlikar)
- 💼 LinkedIn: [Tushar Parlikar](https://www.linkedin.com/in/tushar-parlikar-98272b292/)
- 📧 Email: tparlikar497@gmail.com

## 🙏 Acknowledgments

- VS Code Extension API documentation
- Community feedback and feature requests
- Open source contributors

## 📈 Roadmap

### Upcoming Features
- [ ] Export/Import functionality
- [ ] Team collaboration features
- [ ] Advanced filtering and search
- [ ] Custom themes and styling
- [ ] Integration with external tools
- [ ] Mobile companion app
- [ ] Analytics and insights

### Version History
- **v1.0.3**: Latest version with fixed badges and documentation
  - Fixed marketplace badges to avoid rate limiting
  - Updated all documentation consistency
  - Improved badge reliability with static badges
- **v1.0.2**: Badge compatibility improvements
- **v1.0.1**: Updated extension name for marketplace uniqueness
- **v1.0.0**: Initial release with core features
  - TODO management
  - Notes system
  - Roadmap planning
  - Status bar integration

## 🐛 Known Issues

Please check the [GitHub Issues](https://github.com/TusharParlikar/Trackr/issues) page for known issues and to report new ones.

## 📞 Support

- **Issues**: [Report bugs or request features](https://github.com/TusharParlikar/Trackr/issues)
- **Feedback**: [Rate and review on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)
- **Email**: tparlikar497@gmail.com

---

⭐ **Star this project if you find it helpful!** [GitHub Repository](https://github.com/TusharParlikar/Trackr)

📝 **Found a bug or have a feature request?** [Open an issue](https://github.com/TusharParlikar/Trackr/issues)

🚀 **Ready to boost your productivity?** [Install Trackr now!](https://marketplace.visualstudio.com/items?itemName=TusharParlikar.trackr-task-manager)

---

**Made with ❤️ by Tushar Parlikar**

*Trackr - Where productivity meets simplicity*
