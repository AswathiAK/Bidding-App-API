# Real-Time Bidding Platform API

This project implements a comprehensive RESTful API for a real-time bidding platform using Node.js, Express, Socket.io, and a SQL database (PostgreSQL or MySQL). The API supports advanced CRUD operations, user authentication, role-based access control, real-time bidding, and notifications.

## Features

- User registration and authentication
- Role-based access control
- CRUD operations for auction items
- Real-time bidding with WebSocket
- Notifications for bid updates
- Image upload for auction items
- Input validation and error handling

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Prisma ORM

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/bidding-platform.git

   ```

2. Install Dependencies

   ```bash
   npm install

   ```

3. Create a .env file in the root directory and add the following environment variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/bidding_platform"
JWT_SECRET="your_jwt_secret"

```

Replace user, password, and your_jwt_secret with your PostgreSQL user, password, and a secret key for JWT, respectively.

4. Run the project

   ```bash
   npm start

   ```
