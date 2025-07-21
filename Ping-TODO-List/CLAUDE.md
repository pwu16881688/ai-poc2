# CLAUDE.md - Ping TODO List Project Information

## Project Overview
**Project Name**: Ping TODO List  
**Type**: Full-stack web application  
**Status**: In Development  
**Created**: January 2025

## Architecture Summary

### Technology Stack
- **Frontend**: Angular 18 (TypeScript, HTML, CSS)
- **Backend**: Spring Boot 3.x (Java 17+)
- **Database**: SQLite
- **Build Tools**: Angular CLI, Maven/Gradle
- **Development Ports**: Frontend (4200), Backend (8080)

### Project Structure
```
Ping-TODO-List/
├── frontend/          # Angular 18 SPA
├── backend/           # Spring Boot REST API
├── docs/              # Project documentation
├── DESIGN.md          # Comprehensive design document
├── CLAUDE.md          # This file
└── README.md          # Project overview
```

## Core Features
1. **Task Management**
   - Add new tasks to the list
   - Mark tasks as completed/incomplete
   - Delete tasks from the list
   - View all tasks in a list format

2. **Data Persistence**
   - SQLite database for task storage
   - RESTful API for data operations
   - CRUD operations (Create, Read, Update, Delete)

## Technical Architecture

### Frontend (Angular 18)
- **Components**: Task list, task item, add task form
- **Services**: HTTP client for API communication
- **Models**: TypeScript interfaces for type safety
- **Routing**: Single-page application navigation

### Backend (Spring Boot)
- **REST API**: RESTful endpoints for task operations
- **Data Layer**: JPA repositories with SQLite
- **Business Logic**: Service layer for task management
- **Validation**: Input validation and error handling

### Database Schema
```sql
tasks table:
- id (PRIMARY KEY, AUTOINCREMENT)
- title (VARCHAR, NOT NULL)
- description (TEXT)
- completed (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## API Endpoints
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update existing task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Development Commands

### Frontend (Angular)
```bash
cd frontend
npm install                 # Install dependencies
ng serve                   # Start development server (port 4200)
ng build                   # Build for production
ng test                    # Run unit tests
ng e2e                     # Run end-to-end tests
```

### Backend (Spring Boot)
```bash
cd backend
mvn clean install         # Build project
mvn spring-boot:run       # Start development server (port 8080)
mvn test                  # Run tests
```

## Important Implementation Notes

### Task Entity Requirements
- Tasks must have a non-empty title
- New tasks are appended to the end of the list
- Completed status can be toggled
- Tasks can be deleted permanently

### UI/UX Guidelines
- Clean, modern interface
- Responsive design for mobile/desktop
- Clear visual feedback for completed tasks
- Intuitive task management controls

### Data Flow
1. User interacts with Angular frontend
2. Frontend makes HTTP requests to Spring Boot API
3. Backend processes requests and interacts with SQLite database
4. Results are returned to frontend and displayed to user

## Security Considerations
- Input validation on both frontend and backend
- CORS configuration for cross-origin requests
- SQL injection prevention through JPA
- XSS protection through input sanitization

## Testing Strategy
- Frontend: Unit tests for components/services, E2E tests
- Backend: Unit tests for services, integration tests for repositories
- API: REST endpoint testing
- Target: 80% code coverage minimum

## Deployment Notes
- Development: Local servers with hot reload
- Database: SQLite file in project directory
- Future: Docker containerization for production

## Code Standards
- **Frontend**: Angular style guide, TypeScript strict mode
- **Backend**: Java coding conventions, Spring Boot best practices
- **Database**: Proper indexing and normalization
- **Documentation**: Comprehensive JSDoc/Javadoc comments

## Dependencies Management

### Frontend Key Dependencies
- @angular/core, @angular/common, @angular/forms
- @angular/material (for UI components)
- rxjs (for reactive programming)

### Backend Key Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- sqlite-jdbc
- spring-boot-starter-validation

## Project Status Tracking
Use this space to track major milestones and current development status:

- ✅ Project structure created
- ✅ Design documents generated
- ⏳ Frontend application setup
- ⏳ Backend application setup
- ⏳ Database integration
- ⏳ CRUD operations implementation
- ⏳ UI development
- ⏳ Testing implementation
- ⏳ Integration testing

## Common Issues and Solutions
(To be updated as development progresses)

### CORS Issues
- Configure Spring Boot to allow requests from localhost:4200
- Add proper CORS headers in controller

### Database Connection
- Ensure SQLite driver is included in dependencies
- Verify database file permissions and location

### Angular Build Issues
- Check Node.js and npm versions compatibility
- Clear node_modules and reinstall if needed

## Performance Considerations
- Implement pagination for large task lists
- Use Angular OnPush change detection strategy
- Optimize database queries with proper indexing
- Consider virtual scrolling for large datasets

## Future Enhancement Ideas
- User authentication and authorization
- Task categories and tags
- Due dates and reminders
- Task priority levels
- Search and filter functionality
- Collaborative features
- Mobile application
- Offline support with service workers

## Contact and Collaboration
This project is developed following the PRD requirements. All changes should be tracked in this document and the design document should be updated accordingly.

---
*Last Updated: January 2025*
*Next Review: After implementation completion*