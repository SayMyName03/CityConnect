# CityConnect

A full-stack web application for reporting and managing city issues with AI-powered chatbot assistance.

## Features

- 🏛️ Issue reporting system for city problems
- 🗺️ Interactive map integration
- 🤖 AI-powered chatbot using Google Gemini
- 🔐 Google OAuth authentication
- 👨‍💼 Admin dashboard for issue management
- 📱 Responsive design with modern UI

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development
- Tailwind CSS for styling
- shadcn/ui components
- Leaflet for maps

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Google OAuth 2.0
- Google Gemini AI API
- JWT authentication

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Cloud Console account
- Google AI Studio account

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SayMyName03/CityConnect.git
   cd CityConnect
   ```

2. **Server Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Fill in your actual values in `server/.env`:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `GEMINI_API_KEY`: From Google AI Studio
   - Update other secrets as needed

3. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on http://localhost:3000

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:8080

### Google Cloud Setup

1. Create a project in Google Cloud Console
2. Enable Google+ API and Google OAuth2 API
3. Create OAuth 2.0 credentials
4. Set authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

### Google AI Studio Setup

1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key for Gemini
3. Add the key to your `.env` file

## Project Structure

```
CityConnect/
├── src/                    # Frontend React application
├── server/                 # Backend Node.js API
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security

- Never commit `.env` files to version control
- Keep API keys and secrets secure
- Use environment variables for all sensitive data

## License

This project is licensed under the MIT License.