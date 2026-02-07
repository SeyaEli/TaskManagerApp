# Task Manager Application

A full-featured, real-time collaborative task management application built with ASP.NET Core and React.

## Features Implemented

### Task Management
- ✅ Create, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Task descriptions
- ✅ Priority levels (Low, Medium, High) with color coding
- ✅ Due dates
- ✅ Task assignment to users
- ✅ Task comments
- ✅ Task search functionality
- ✅ Filter tasks (All, Completed, Incomplete)
- ✅ Task positioning/ordering

### Board Management
- ✅ Create multiple boards
- ✅ Edit board names
- ✅ Delete boards
- ✅ Custom board colors
- ✅ Responsive grid layout

### User Features
- ✅ User registration and login
- ✅ JWT authentication
- ✅ User profiles
- ✅ Assign tasks to users
- ✅ View all users in the system

### UI/UX
- ✅ Dark mode toggle
- ✅ Modern, clean interface
- ✅ Modal dialogs for task editing
- ✅ Color-coded priorities
- ✅ Responsive design
- ✅ Real-time updates via SignalR

### Real-time Collaboration
- ✅ SignalR WebSocket connections
- ✅ Instant updates across all connected clients
- ✅ Automatic reconnection

## Tech Stack

### Backend
- ASP.NET Core 10.0
- Entity Framework Core
- PostgreSQL
- SignalR
- JWT Authentication

### Frontend
- React 18
- Vite
- Axios
- SignalR Client

## Setup Instructions

### Prerequisites
- .NET 10.0 SDK
- Node.js 18+
- PostgreSQL

### Backend Setup

1. **Stop the currently running API** (if running)

2. **Update database connection string** in `TaskManagerAPI/appsettings.json`

3. **Create new migration and update database:**
   ```bash
   cd TaskManagerAPI
   dotnet ef migrations add EnhancedFeatures
   dotnet ef database update
   ```

4. **Run the API:**
   ```bash
   dotnet run
   ```
   API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd TaskManagerFrontend
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## Usage

1. **Register/Login:** Create an account or login with existing credentials
2. **Create Boards:** Add new boards with custom names and colors
3. **Add Tasks:** Click "+ Add Task" on any board
4. **Edit Tasks:** Click on a task to edit details, add descriptions, set priorities, due dates, and assign users
5. **Complete Tasks:** Click the checkmark button to mark tasks as complete
6. **Add Comments:** Open a task and add comments in the modal
7. **Search & Filter:** Use the search box and filter dropdown to find specific tasks
8. **Dark Mode:** Toggle dark mode with the moon/sun icon
9. **Real-time Updates:** All changes are instantly reflected across all connected clients

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create board
- `PUT /api/boards/{id}` - Update board
- `DELETE /api/boards/{id}` - Delete board

### Tasks
- `GET /api/tasks/{boardId}` - Get tasks for board
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `PUT /api/tasks/{id}/complete` - Toggle task completion
- `PUT /api/tasks/{id}/position` - Update task position
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/{id}/comments` - Get task comments
- `POST /api/tasks/{id}/comments` - Add comment

### SignalR Hub
- `/taskhub` - Real-time updates hub

## Database Schema

### Users
- Id, Username, Email, PasswordHash

### Boards
- Id, Name, Color

### Tasks
- Id, Title, Description, IsCompleted, Priority, DueDate, Position, AssignedUserId, BoardId

### TaskComments
- Id, Content, CreatedAt, TaskId, UserId

## Security Notes

- Passwords are hashed using SHA256
- JWT tokens expire after 7 days
- CORS is configured for localhost development
- For production, update the JWT secret key and use proper password hashing (bcrypt)

## Future Enhancements (Not Implemented)
- Drag-and-drop task reordering
- File attachments
- Email notifications
- Task templates
- Recurring tasks
- Activity logs
- Export/import functionality
