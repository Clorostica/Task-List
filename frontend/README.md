# ✅ Task List App

A comprehensive task management application built with **React** and **Auth0** authentication. It allows authenticated users to securely manage their to-dos with a clean and modern interface, featuring **user-specific task persistence** across devices.

## 🚀 Key Features

- 🔐 **Secure Authentication** - Login with Auth0
- 👤 **User-Specific Tasks** - Each user's tasks are saved independently
- 🌐 **Cross-Device Sync** - Access your tasks from any laptop with backend session management
- ✅ **Full CRUD Operations** - Add, update, and delete tasks
- 🌙 **Responsive Design** - Clean and modern UI that works on all devices
- ⚛️ **Modern Stack** - Built with React and Tailwind CSS
- 🐳 **Containerized** - Deployed using Docker for consistent environments
- 🔧 **API Testing** - Thoroughly tested with Postman

## 🧩 Tech Stack

**Frontend:**

- [React](https://reactjs.org/) - UI Framework
- [Auth0](https://auth0.com/) - Authentication Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling

**Backend & Infrastructure:**

- 🐳 [Docker](https://www.docker.com/) - Containerization
- 🔧 [Postman](https://www.postman.com/) - API Testing
- 💾 Backend API for user session and task management

## 🖥️ Installation

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/task-list-app.git
cd task-list-app
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **🔑 Set up Auth0**

Create a `.env` file in the root directory and add your Auth0 credentials:

```env
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
```

### 4. **🐳 Docker Setup (Optional)**

If you prefer running with Docker:

```bash
docker build -t task-list-app .
docker run -p 3000:3000 task-list-app
```

### 5. **🚀 Run the development server**

```bash
npm start
```

Your app should now be running on `http://localhost:3000`.

## 🔥 What Makes This Special

- **💾 Persistent User Data**: Your tasks are automatically saved to your account and synchronized across all your devices
- **🔒 Secure by Design**: Each user's data is completely isolated and protected
- **📱 Universal Access**: Log in from any computer and find all your tasks exactly as you left them
- **⚡ Production Ready**: Containerized with Docker for reliable deployment

## 🧪 API Testing

The backend API has been thoroughly tested using **Postman** to ensure reliable task management and user session handling.
