
# Contributing to CapitalFlow Portal

We welcome contributions to the CapitalFlow Portal project! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Guidelines](#development-guidelines)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Yarn package manager
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/capitalflow-portal.git
   cd capitalflow-portal
   ```

3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/original-owner/capitalflow-portal.git
   ```

4. **Install dependencies**:
   ```bash
   cd app
   yarn install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

6. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

7. **Start the development server**:
   ```bash
   yarn dev
   ```

## 🔄 Contributing Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the code style guidelines
- Add tests for new features
- Update documentation as needed
- Ensure all existing tests pass

### 3. Test Your Changes

```bash
# Type checking
yarn type-check

# Linting
yarn lint

# Format code
yarn format

# Build the project
yarn build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your feature branch
- Fill out the PR template

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use strict mode configurations

### React Components

- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types
- Implement proper error boundaries

### File Naming

- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Use camelCase for function names: `handleSubmit`

### Code Organization

```
components/
├── ui/           # Reusable UI components
├── forms/        # Form components
├── layout/       # Layout components
└── feature/      # Feature-specific components
```

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first approach
- Use semantic color names
- Ensure accessibility compliance

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(auth): add password reset functionality

- Add password reset form component
- Implement email sending logic
- Add validation for reset tokens

Closes #123
```

```
fix(dashboard): resolve transaction loading issue

- Fix infinite loading state
- Add proper error handling
- Improve loading performance

Fixes #456
```

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git checkout feature/your-feature-name
   git rebase main
   ```

2. **Run all checks**:
   ```bash
   yarn lint
   yarn type-check
   yarn build
   ```

3. **Test thoroughly**:
   - Test your changes in different browsers
   - Test responsive design
   - Test with the seeded data

### PR Requirements

- [ ] Clear description of changes
- [ ] Link to relevant issues
- [ ] Screenshots for UI changes
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed

### Review Process

1. **Code Review**: At least one maintainer will review your PR
2. **Testing**: Changes will be tested in a staging environment
3. **Approval**: PR must be approved before merging
4. **Merge**: Maintainers will merge approved PRs

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for common solutions
3. **Test with the latest version**

### Issue Template

```markdown
## Bug Report

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Any other context about the problem.
```

## 🛠️ Development Guidelines

### Database Changes

- Always use Prisma migrations for schema changes
- Test migrations with existing data
- Document breaking changes

### API Development

- Follow RESTful conventions
- Include proper error handling
- Add input validation
- Document API endpoints

### Security

- Never commit sensitive data
- Use environment variables for secrets
- Validate all user inputs
- Follow OWASP guidelines

### Performance

- Optimize database queries
- Use React.memo for expensive components
- Implement proper caching
- Monitor bundle size

### Accessibility

- Use semantic HTML
- Include proper ARIA labels
- Test with screen readers
- Ensure keyboard navigation

### Testing

- Write unit tests for utility functions
- Test API endpoints
- Include integration tests
- Test error scenarios

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)

## 🤝 Community

- Be respectful and inclusive
- Help other contributors
- Share knowledge and best practices
- Provide constructive feedback

## 📄 License

By contributing to CapitalFlow Portal, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CapitalFlow Portal! 🎉
