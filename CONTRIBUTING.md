# Contributing to Bulk Email Sender

Thank you for your interest in contributing to the Bulk Email Sender project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** provided
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node.js version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/bulk-email-sender.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**:
   ```bash
   # Backend
   cd Backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

#### Development Guidelines

##### Code Style

- **Backend**: Follow standard JavaScript/Node.js conventions
- **Frontend**: Follow Angular TypeScript style guide
- **Use meaningful variable and function names**
- **Add comments for complex logic**
- **Keep functions small and focused**

##### Testing

- **Test your changes** thoroughly
- **Ensure existing functionality** still works
- **Test on different browsers** (Chrome, Firefox, Safari)
- **Test responsive design** on different screen sizes

##### Database Changes

- **Create migrations** for database schema changes
- **Test migrations** on clean database
- **Document breaking changes**

#### Commit Guidelines

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add CSV import validation for email addresses"
git commit -m "fix: resolve campaign status update issue"
git commit -m "docs: update README with installation instructions"

# Avoid
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

#### Pull Request Process

1. **Ensure your code** follows the style guidelines
2. **Add tests** if applicable
3. **Update documentation** if needed
4. **Test thoroughly** before submitting
5. **Create a pull request** with:
   - Clear description of changes
   - Screenshots if UI changes
   - Reference to related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏗️ Project Structure

### Backend (`/Backend`)
- `controllers/` - API route handlers
- `models/` - Database models
- `routes/` - API route definitions
- `middleware/` - Authentication and other middleware
- `migrations/` - Database migrations
- `utils/` - Utility functions

### Frontend (`/frontend`)
- `src/app/components/` - Angular components
- `src/app/services/` - Angular services
- `src/app/models/` - TypeScript interfaces
- `src/app/guards/` - Route guards

## 🧪 Development Setup

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- Git

### Local Development

1. **Database Setup**:
   ```bash
   mysql -u root -p
   CREATE DATABASE bulk_email_sender;
   ```

2. **Environment Configuration**:
   ```bash
   cp Backend/env.example Backend/.env
   # Edit Backend/.env with your settings
   ```

3. **Run Migrations**:
   ```bash
   cd Backend
   npx sequelize-cli db:migrate
   ```

4. **Start Development Servers**:
   ```bash
   # Backend (Terminal 1)
   cd Backend && npm start
   
   # Frontend (Terminal 2)
   cd frontend && ng serve
   ```

## 📋 Development Checklist

Before submitting a pull request:

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] No sensitive data in code
- [ ] Responsive design tested
- [ ] Cross-browser compatibility checked

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment**:
   - OS and version
   - Node.js version
   - Browser and version
   - Database version

2. **Steps to Reproduce**:
   - Clear, numbered steps
   - Expected behavior
   - Actual behavior

3. **Additional Context**:
   - Screenshots
   - Error messages
   - Console logs
   - Network requests

## 💡 Feature Requests

For feature requests:

1. **Use Case**: Explain why this feature is needed
2. **Proposed Solution**: Describe your suggested implementation
3. **Alternatives**: Consider other approaches
4. **Impact**: Who would benefit from this feature

## 📚 Documentation

### Code Documentation
- **Comment complex logic**
- **Document API endpoints**
- **Update README** for new features
- **Include examples** in documentation

### API Documentation
- **Document all endpoints**
- **Include request/response examples**
- **Specify authentication requirements**
- **List error codes and messages**

## 🔒 Security

### Security Guidelines
- **Never commit sensitive data** (passwords, API keys, etc.)
- **Use environment variables** for configuration
- **Validate all user inputs**
- **Follow security best practices**
- **Report security issues** privately

### Security Issues
If you discover a security vulnerability:

1. **Do NOT** create a public issue
2. **Email** the maintainers privately
3. **Include** detailed information about the vulnerability
4. **Wait** for response before public disclosure

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes** and stability improvements
- **Performance optimizations**
- **Security enhancements**
- **Documentation improvements**

### Medium Priority
- **New features** with clear use cases
- **UI/UX improvements**
- **Test coverage** improvements
- **Code refactoring**

### Low Priority
- **Nice-to-have features**
- **Cosmetic improvements**
- **Additional integrations**

## 📞 Getting Help

### Community Support
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check README and code comments

### Development Questions
- **Code review**: Ask for feedback on pull requests
- **Architecture**: Discuss major changes before implementation
- **Best practices**: Share knowledge and learn from others

## 🏆 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub** contributor statistics

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Bulk Email Sender! 🚀
