# Course Builder Application

A modern, interactive course builder application built with React, TypeScript, and Tailwind CSS. This application allows users to create, organize, and manage course modules with drag-and-drop functionality.

## Features

### Core Functionality
- ✅ **Module Management**: Create, rename, delete, and reorder modules
- ✅ **Content Management**: Add links and upload files to modules
- ✅ **Drag & Drop**: Reorder modules using react-dnd
- ✅ **Search**: Real-time search across modules and content
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

### Advanced Features
- 🔄 **Data Persistence**: Automatic local storage of course data
- 📤 **Export/Import**: Save and load course data as JSON files
- 🎨 **Modern UI**: Clean, intuitive interface with Feather icons
- ⚡ **Performance**: Optimized React components with proper state management

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Drag & Drop**: react-dnd with HTML5 backend
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ShrutiPundir17/frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── course-builder/          # Course builder components
│   │   ├── CourseBuilder.tsx    # Main container component
│   │   ├── Header.tsx           # Header with search and actions
│   │   ├── ModuleList.tsx       # List of modules
│   │   ├── ModuleItem.tsx       # Individual module component
│   │   ├── ContentItem.tsx      # Module content items
│   │   ├── AddLinkModal.tsx     # Modal for adding links
│   │   ├── AddModuleModal.tsx   # Modal for creating modules
│   │   └── EmptyState.tsx       # Empty state component
│   └── common/                  # Shared components
├── hooks/
│   └── useLocalStorage.ts       # Local storage hook
├── types/
│   └── course-builder.ts        # TypeScript type definitions
├── utils/
│   └── courseUtils.ts           # Utility functions
└── App.tsx                      # Root application component
```

## Usage

### Creating a Course

1. **Add a Module**: Click the "Add" button and select "Create module"
2. **Add Content**: Use the "+" button on each module to add links or upload files
3. **Organize**: Drag and drop modules to reorder them
4. **Search**: Use the search bar to quickly find modules or content

### Managing Content

- **Links**: Add external resources with custom display names
- **Files**: Upload documents, images, or videos (PDF, DOC, images, videos supported)
- **Rename**: Click the menu (⋮) on any module or item to rename it
- **Delete**: Remove modules or items using the delete option in the menu

### Data Management

- **Auto-save**: Your course data is automatically saved to local storage
- **Export**: Download your course data as a JSON file for backup
- **Import**: Load previously exported course data

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

### Code Quality

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for consistent styling

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Components are optimized with proper React patterns
- Local storage is used for data persistence
- Drag and drop is implemented efficiently with react-dnd
- Images and files are handled with proper memory management

## Future Enhancements

- [ ] Course templates
- [ ] Collaborative editing
- [ ] Progress tracking
- [ ] Video embedding
- [ ] Quiz integration
- [ ] Export to different formats (PDF, SCORM)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.