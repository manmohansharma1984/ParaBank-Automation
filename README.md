# ParaBank Test Automation

A focused Playwright test automation framework demonstrating UI and API testing for the ParaBank application.

## Quick Start

```bash
npm install
npx playwright install chromium
npm run test:api  # Run API tests
npm run test:ui   # Run UI tests
npm run test      # Run all tests
```

## Project Structure

```
├── .github/workflows/             # GitHub Actions CI/CD
├── config/
│   ├── environment.config.ts      # Environment configuration
│   └── playwright.config.ts       # Playwright test configuration
├── docs/
│   └── jenkins-integration.md     # Jenkins CI/CD documentation
├── src/
│   ├── api/                       # API testing classes
│   ├── pages/                     # Page Object Model classes
│   └── utils/                     # Test data generation utilities
├── tests/
│   ├── api/                       # API test specifications
│   └── ui/e2e/                    # UI end-to-end tests
├── Jenkinsfile                    # Jenkins pipeline configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This documentation
```

## Features

- **Page Object Model** for maintainable UI tests
- **API Testing** with defensive validation
- **TypeScript** for type safety and IntelliSense
- **Parallel Test Execution** for faster feedback
- **Comprehensive Reporting** with HTML reports
- **CI/CD Integration** (GitHub Actions + Jenkins)
- **Code Quality** with ESLint and Prettier

## Test Coverage

- **UI Tests**: User registration flow with ParaBank
- **API Tests**: Transaction search and validation endpoints
- **Cross-browser**: Chromium support (Firefox/WebKit configurable)

## CI/CD Integration

### GitHub Actions
- **Automated**: Runs on push/PR to main/develop branches
- **Manual**: Can be triggered via GitHub UI
- **Reporting**: Uploads test artifacts and reports

### Jenkins
- **Pipeline**: Complete CI/CD pipeline with stages
- **Reporting**: HTML reports and JUnit XML results
- **Documentation**: See `docs/jenkins-integration.md`

## Known Limitations

ParaBank's shared environment may cause username conflicts. Tests use unique username generation to mitigate this issue.
