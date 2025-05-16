# Chat API Application

This project is a chat application built using Node.js, Express, and MongoDB. It supports both group and personal chats, file sharing, and real-time communication through WebSockets.

## Features

- **Group Chat**: Create and manage group chats.
- **Personal Chat**: Send and receive messages between users.
- **File Sharing**: Upload and share files within chats.
- **Real-Time Communication**: Utilize Socket.io for real-time messaging.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- Multer (for file uploads)

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd chat-api-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string and any other necessary environment variables.

### Running the Application

To start the application, run:
```
npm start
```

The server will start on the specified port (default is 3000).

## API Endpoints

### User Endpoints

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Log in an existing user.
- `GET /api/users/:id`: Get user details.

### Chat Endpoints

- `POST /api/chats`: Send a message.
- `GET /api/chats/:chatId`: Get messages for a specific chat.
- `POST /api/chats/group`: Create a new group chat.

## Socket Events

- `connect`: Triggered when a user connects.
- `message`: Triggered when a message is sent.
- `groupChat`: Triggered for group chat management.

## File Uploads

File uploads are handled using Multer. You can send files through the chat by using the appropriate endpoint.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.