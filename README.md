# Article-Aura

## Project Overview
Article-Aura is a full-stack social media platform for article sharing and discussion. Users can create, share, and interact with articles while engaging in meaningful discussions through comments and likes. The platform features a modern, responsive design with dark/light theme support.

## Features

- 📝 Create and share articles with text and images
- ❤️ Like and interact with posts
- 💬 Comment system for engaging discussions
- 👥 User following system
- 🌓 Dark/Light theme support
- 🔐 User authentication
- 📱 Responsive design

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Heroicons for icons
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB (assumed based on `_id` usage)
- RESTful API architecture

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn
- MongoDB (v4.0.0 or higher)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/article-aura.git
cd article-aura
```

### 2. Install Dependencies

#### Frontend Setup
```bash
cd client/Article-Aura
npm install
# or using yarn
yarn install
```

#### Backend Setup
```bash
cd server
npm install
# or using yarn
yarn install
```

### 3. Database Setup

#### MongoDB Setup
1. Install MongoDB locally or create a cloud instance using MongoDB Atlas
2. Create a new database named 'article-aura'
3. Configure environment variables:

Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/article-aura
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/article-aura
JWT_SECRET=your_secure_jwt_secret
```

#### Database Initialization
The application will automatically create the following collections:
- users
- articles
- comments
- likes

### 4. Running the Application

#### Start Backend Server
```bash
cd server
npm run dev
# or using yarn
yarn dev
```
The server will start on http://localhost:5000

#### Start Frontend Development Server
```bash
cd client/Article-Aura
npm start
# or using yarn
yarn start
```
The application will open in your default browser at http://localhost:3000

## Development

### Environment Variables
Frontend (.env in client/Article-Aura):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Backend (.env in server):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Database Schema

#### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Article Collection
```javascript
{
  title: String,
  content: String,
  author: ObjectId (ref: 'User'),
  likes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client/Article-Aura
npm test
```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Article Endpoints
- GET /api/articles - Get all articles
- POST /api/articles - Create new article
- GET /api/articles/:id - Get specific article
- PUT /api/articles/:id - Update article
- DELETE /api/articles/:id - Delete article

### Interaction Endpoints
- POST /api/articles/:id/like - Like/Unlike article
- POST /api/articles/:id/comment - Add comment
- GET /api/articles/:id/comments - Get article comments

## Error Handling
The application includes comprehensive error handling:
- Frontend: Toast notifications for user feedback
- Backend: Standardized error responses with appropriate HTTP status codes

## Security Features
- JWT-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting on API endpoints

## Production Deployment
1. Build the frontend:
```bash
cd client/Article-Aura
npm run build
```

2. Set production environment variables
3. Configure your web server (nginx/Apache)
4. Set up SSL certificates
5. Configure MongoDB security settings

## Support
For support, email support@article-aura.com or create an issue in the repository.

## License
This project is licensed under the MIT License.

## Project Structure

```
article-aura/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── service/
│   │   └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `POST /api/posts/:id/like` - Like/Unlike post
- `POST /api/posts/:id/comment` - Add comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)

## Contact

Vasudev Pavan - [@PavanVasudev107](https://x.com/PavanVasudev107)
mail_id: pavanvasudev07@gmil.com
Project Link: https://github.com/VasudevPavan07/Article_Aura