# Jenkins CI Integration

Basic Jenkins pipeline for running ParaBank automated tests.

## Setup

1. Create a new Pipeline job in Jenkins
2. Configure to use "Pipeline script from SCM"
3. Point to this repository
4. The `Jenkinsfile` will handle the rest

## Pipeline Stages

- **Checkout**: Gets source code
- **Install Dependencies**: Runs `npm ci`
- **Install Playwright**: Sets up browser testing
- **Run Tests**: Executes all tests via `npm test`
- **Archive Reports**: Saves test results

## Requirements

- Node.js installed on Jenkins agent
- Git for source control
- Basic Jenkins permissions

No special plugins required for this minimal setup.