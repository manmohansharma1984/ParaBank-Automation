# ParaBank Test Automation

Test automation framework for the ParaBank application using Playwright and TypeScript. Includes both UI and API test coverage.

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

## Test Coverage

### UI Tests
- User registration with form validation
- Login verification after registration
- Navigation between application sections
- Account overview display
- Opening new savings accounts
- Transferring funds between accounts
- Bill payment processing

### API Tests
- Transaction search by amount
- Transaction response validation
- Empty result handling
- Error response handling
- JSON schema validation

## CI/CD Integration

### GitHub Actions
- Runs automatically on pushes and pull requests to main/develop branches
- Can be triggered manually through the GitHub UI
- Uploads test reports and artifacts for review

### Jenkins
- Pipeline with dependency installation, test execution, and reporting stages
- Generates HTML reports and JUnit XML results
- Documentation available in docs/jenkins-integration.md

## Notes

The ParaBank application uses a shared test environment, which can cause username conflicts between different test runs. The framework generates unique usernames to reduce this issue, but it may still occur in high-traffic scenarios.