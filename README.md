# SecureMate

**AI-Powered Personal Cyber Guard**

SecureMate is a professional cybersecurity web application that provides real-time threat detection, secure vault management, and AI-driven security analysis. Built with modern web technologies, it offers an intuitive dashboard for monitoring digital safety and protecting sensitive information.

## Features

### Core Security Features
- **URL Threat Scanner** - Real-time analysis of suspicious URLs using VirusTotal API integration
- **Security Score** - Dynamic safety score based on scan history and threat detection
- **Cyber Vault** - Encrypted storage for passwords and secure notes (AES-256-CBC)
- **AI Security Assistant** - Context-aware chatbot powered by Google Gemini AI
- **Report Generation** - Export scan reports to PDF and CSV formats

### User Experience
- **Dark/Light Theme** - Professional theme toggle with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Onboarding Tour** - Interactive first-time user guide
- **Toast Notifications** - Real-time feedback for all user actions
- **Google OAuth** - Seamless authentication with Google accounts

### Learning Hub
- **Video Tutorials** - Curated cybersecurity educational content
- **Security Articles** - In-depth technical articles and best practices
- **Interactive Modals** - Detailed summaries and full article views

## Tech Stack

### Frontend
- **React 19** - Modern UI library with concurrent features
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router 7** - Client-side routing
- **Lucide React** - Beautiful icon library
- **jsPDF** - Client-side PDF generation

### Backend
- **Express.js 5** - Fast, minimalist web framework
- **Firebase Admin** - Cloud Firestore database
- **JWT Authentication** - Secure token-based auth
- **Google OAuth 2.0** - Social authentication
- **Helmet.js** - Security headers middleware
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Joi schema validation
- **MongoDB Sanitization** - NoSQL injection prevention
- **XSS Protection** - Cross-site scripting prevention

### AI & Integration
- **Google Gemini AI** - Advanced conversational AI
- **VirusTotal API** - Threat intelligence and URL scanning
- **Google OAuth** - User authentication

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project with Firestore enabled
- VirusTotal API key (optional, for real scanning)
- Google OAuth credentials (optional, for social login)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SecureMate
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
VIRUSTOTAL_API_KEY=your_virustotal_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
ENCRYPTION_KEY=your_64_character_hex_string_here
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Create `.env` in the root directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000/api
```

5. **Run the development servers**

Frontend (terminal 1):
```bash
npm run dev
```

Backend (terminal 2):
```bash
cd backend
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## Project Structure

```
SecureMate/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── chat/         # AI chat widget
│   │   └── Onboarding.tsx # New user tour
│   ├── contexts/         # React contexts (Auth, Toast, Theme)
│   ├── hooks/            # Custom React hooks
│   ├── layout/           # Layout components (Sidebar, Topbar)
│   ├── lib/              # API client and utilities
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   └── index.css         # Global styles
├── backend/
│   ├── config/           # Passport, Firebase config
│   ├── middleware/       # Auth, validation, rate limiting
│   ├── routes/           # Express route handlers
│   ├── services/         # Firebase store service
│   ├── server.js         # Express server entry
│   └── .env.example      # Backend environment template
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── vercel.json           # Vercel deployment config
```

## Key Components

### Authentication System
- JWT-based authentication with secure HTTP-only considerations
- Google OAuth 2.0 integration
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with automatic redirect

### Security Vault
- AES-256-CBC encryption for sensitive data
- Support for passwords and secure notes
- Search and filter functionality
- Auto-lock timeout settings

### URL Scanner
- VirusTotal API integration
- Mock mode for development
- Real-time threat analysis
- AI-powered security summaries

### AI Assistant
- Context-aware responses
- Markdown formatting support
- Conversation history
- Fallback intelligent responses

## Security Best Practices

1. **Encryption**: All vault data encrypted with AES-256-CBC
2. **Authentication**: JWT tokens with 1-hour expiration
3. **Rate Limiting**: API endpoints protected against abuse
4. **Input Validation**: Joi schemas for all API inputs
5. **Security Headers**: Helmet.js for comprehensive security
6. **Sanitization**: MongoDB and XSS sanitization enabled
7. **CORS**: Configurable origin whitelist

## Deployment

### Vercel (Recommended)
The project includes a `vercel.json` configuration for seamless deployment:
```bash
vercel deploy
```

### Environment Variables for Production
Ensure all production environment variables are set in your deployment platform's dashboard.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@securemate.com or join our Slack channel.

---

**Built with security in mind. Designed for everyone.**
