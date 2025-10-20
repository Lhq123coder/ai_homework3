# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01

### Added

#### Core Features
- ✨ Intelligent trip planning with AI (Alibaba Cloud Qwen)
- 🎤 Voice recognition for trip input (Web Speech API)
- 💰 Expense budget management with voice input support
- 🗺️ Map navigation with Amap (高德地图) integration
- 👤 User authentication system (JWT + bcrypt)
- ☁️ Cloud data synchronization (Supabase)

#### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Zustand for state management
- React Router v6 for routing
- Responsive and modern UI design
- Voice recognition integration
- Interactive map with markers and routes
- Real-time expense tracking

#### Backend
- Express.js REST API
- JWT authentication
- Supabase PostgreSQL integration
- AI itinerary generation
- Expense analysis API
- CORS enabled

#### DevOps
- Docker containerization
- Docker Compose for easy deployment
- GitHub Actions CI/CD
- Automated Docker image building and pushing to Aliyun
- Comprehensive documentation

#### Documentation
- Detailed README.md
- Deployment guide (DEPLOYMENT.md)
- Submission document (SUBMISSION.md)
- Contributing guidelines (CONTRIBUTING.md)
- Database schema (schema.sql)

### Technical Details

#### Dependencies
- Node.js 20
- React 18.2.0
- Express 4.18.2
- TypeScript 5.3.3
- Supabase Client 2.39.0
- Various other dependencies (see package.json files)

#### APIs Integrated
- Alibaba Cloud DashScope (通义千问)
- 高德地图 (Amap)
- Web Speech API
- Supabase

#### Security
- Password hashing with bcrypt
- JWT token authentication
- Environment variable protection
- Supabase Row Level Security

### Project Structure

```
ai-travel-planner/
├── frontend/              # React frontend
├── backend/               # Express backend
├── database/              # Database scripts
├── scripts/               # Setup scripts
├── .github/workflows/     # CI/CD workflows
└── docs/                  # Documentation
```

## [Unreleased]

### Planned Features
- [ ] Multi-language support (i18n)
- [ ] Weather forecast integration
- [ ] Collaborative trip planning
- [ ] Trip sharing functionality
- [ ] Mobile app (React Native)
- [ ] AI chatbot assistant
- [ ] Export trip to PDF
- [ ] Calendar integration
- [ ] Social media sharing
- [ ] Recommendation system

### Potential Improvements
- [ ] Performance optimization
- [ ] Better error handling
- [ ] Unit and integration tests
- [ ] E2E testing
- [ ] Accessibility improvements
- [ ] SEO optimization
- [ ] Progressive Web App (PWA)

---

## Version History

- **1.0.0** (2024-01) - Initial release with all core features
  - Trip planning with AI
  - Voice recognition
  - Expense management
  - Map navigation
  - User authentication
  - Cloud synchronization

---

For more details, see [SUBMISSION.md](SUBMISSION.md)

