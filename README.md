# Datavid Celebration Planner Web

A modern, feature-rich birthday tracking and celebration management application built with Angular 20. Helps teams and organizations keep track of member birthdays, view upcoming celebrations, and generate personalized AI-powered birthday messages.

## Features

- **Member Management**: Add, edit, and delete team members with their birthday information
- **Birthday Tracking**: View upcoming birthdays within a configurable time window (default 30 days)
- **Today's Birthdays**: Quick access to celebrations happening today
- **AI-Powered Messages**: Generate personalized birthday messages using AI
- **Age Validation**: Ensures all members are 18+ years old
- **Responsive Design**: Modern Material Design interface that works on all devices
- **Timezone Support**: Proper date/time handling using Luxon library

## Tech Stack

- **Framework**: Angular 20.2
- **UI Components**: Angular Material 20 (Indigo/Pink theme)
- **Date Handling**: Luxon
- **Styling**: SCSS with Material Design System
- **Testing**: Jest & Jasmine
- **Build Tool**: Angular CLI with esbuild
- **TypeScript**: Strict mode enabled

## Architecture

### Project Structure

```
src/app/
├── core/                          # Core singleton services and interceptors
│   ├── interceptors/
│   │   └── error.interceptor.ts   # Global HTTP error handler
│   └── services/
│       └── api.service.ts         # HTTP wrapper service
│
├── features/                      # Feature modules (lazy-loaded)
│   ├── members/                   # Member management
│   │   ├── members-list/          # List all members with sorting
│   │   ├── member-form/           # Add/edit member form
│   │   ├── members.service.ts     # Member CRUD operations
│   │   └── members.routes.ts      # Member feature routes
│   │
│   ├── birthdays/                 # Birthday tracking
│   │   ├── upcoming/              # Upcoming birthdays view
│   │   ├── today/                 # Today's birthdays view
│   │   ├── birthdays.service.ts   # Birthday data fetching
│   │   └── birthdays.routes.ts    # Birthday feature routes
│   │
│   └── ai/                        # AI message generation
│       ├── ai-message-dialog/     # AI message dialog component
│       └── ai.service.ts          # AI message API service
│
├── shared/                        # Shared utilities and models
│   ├── models/                    # TypeScript interfaces
│   └── validators/                # Custom form validators
│
└── environments/                  # Environment configurations
```

### Key Design Patterns

- **Standalone Components**: Modern Angular 20 architecture without NgModules
- **Signals-based Reactivity**: Using Angular signals for component state
- **Dependency Injection**: Using `inject()` function pattern
- **Lazy Loading**: Feature routes loaded on demand
- **Functional Interceptors**: HTTP error handling via functional interceptor pattern

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Angular CLI 20.2 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Marchisrares/datavid-celebration-planner-web.git
cd datavid-celebration-planner-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Update `src/environments/environment.ts` for development
   - Update `src/environments/environment.prod.ts` for production
   - Set the `apiBaseUrl` to your backend API endpoint

## Development

### Start Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build for Development

```bash
npm run watch
# or
ng build --watch --configuration development
```

### Build for Production

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Testing

### Run Unit Tests

```bash
npm test
# or
ng test
```

### Run Tests with Coverage

```bash
npm test -- --coverage --maxWorkers=2
```

### Test Single Component

```bash
ng test --include='**/component-name.spec.ts'
```

## Backend API Requirements

The application expects a REST API at the configured `apiBaseUrl` with the following endpoints:

### Members
- `GET /members?sort=created|upcoming` - List all members
- `GET /members/:id` - Get single member
- `POST /members` - Create new member
- `PUT /members/:id` - Update existing member
- `DELETE /members/:id` - Delete member

### Birthdays
- `GET /birthdays/upcoming?days=30` - Get upcoming birthdays
- `GET /birthdays/today` - Get today's birthdays

### AI
- `POST /ai/message` - Generate personalized birthday message

### Error Response Format

The API should return errors in one of these formats:

```json
{
  "errors": [
    { "message": "Error message here" }
  ]
}
```

or

```json
{
  "message": "Error message here"
}
```

## Configuration

### Environment Variables

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};
```

### Material Theme

The application uses Angular Material with an Indigo/Pink theme. Customize in `src/styles.scss`:

```scss
@use '@angular/material' as mat;
@include mat.core();

$app-primary: mat.define-palette(mat.$indigo-palette);
$app-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
```

## Code Generation

Generate new components, services, and other Angular artifacts:

```bash
# Generate component
ng generate component feature-name/component-name

# Generate service
ng generate service feature-name/service-name

# Generate module
ng generate module feature-name --routing

# See all options
ng generate --help
```

## Deployment

### Build and Deploy

1. Build the production version:
```bash
ng build
```

2. Deploy the contents of `dist/datavid-celebration-planner-web/browser/` to your web server.

### Deployment Platforms

The application can be deployed to:
- **Netlify**: Drop the `dist/` folder or connect to GitHub
- **Vercel**: Import the GitHub repository
- **Firebase Hosting**: Use Firebase CLI
- **AWS S3 + CloudFront**: Upload build artifacts
- **Azure Static Web Apps**: Connect to GitHub repository

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Code Quality

### TypeScript Strictness

The project uses strict TypeScript configuration:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictTemplates: true`

### Code Style

- **Prettier**: 100 character line width, single quotes
- **Component prefix**: `app`
- **Style language**: SCSS

## Performance

### Build Budgets

- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error

### Optimization

- Lazy loading of feature modules
- OnPush change detection where applicable
- Tree-shakeable providers (`providedIn: 'root'`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Repository: [https://github.com/Marchisrares/datavid-celebration-planner-web](https://github.com/Marchisrares/datavid-celebration-planner-web)

## Acknowledgments

- Angular Team for the amazing framework
- Angular Material for the UI components
- Luxon for date/time handling
