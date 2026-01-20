# ParaBank Test Automation

Automated tests for the ParaBank demo app. Covers user registration, account management, bill payments, and transaction validation.

## Quick Start

```bash
npm install
npx playwright install chromium
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
│   ├── api/                       # API test helpers and requests
│   ├── pages/                     # Page Object Model classes
│   └── utils/                     # Test data generation utilities
├── tests/
│   └── ui/e2e/                    # UI end-to-end tests
├── Jenkinsfile                    # Jenkins pipeline configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This documentation
```

## Test Coverage

### UI Tests
- User registration with form validation
- Login verification after registration
- Navigation between application sections
- Account overview display
- Opening new savings accounts
- Transferring funds between accounts
- Bill payment processing
- Transaction search and validation via API

## CI/CD Integration

### GitHub Actions
- Runs automatically on pushes and pull requests to main/develop branches
- Can be triggered manually through the GitHub UI
- Runs linting and UI tests with API validation integrated
- Uploads test reports and artifacts for review

### Jenkins
- Pipeline with dependency installation, test execution, and reporting stages
- Generates HTML reports and JUnit XML results
- Documentation available in docs/jenkins-integration.md

## Notes

The ParaBank application uses a shared test environment, which can cause username conflicts between different test runs. The framework generates unique usernames to reduce this issue, but it may still occur in high-traffic scenarios.