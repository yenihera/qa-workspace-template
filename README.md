# Kiro QA Agents

Collection of reusable Kiro QA agents designed to accelerate QA workflows, improve testing quality, and standardize testing processes across projects.

## Overview

This repository contains several specialized QA agents that help automate and streamline software testing activities, including:

- QA Planning
- Automation Script Generation
- Test Execution Support
- Bug Analysis

These agents are designed to support both manual QA and automation QA workflows.

---

# Available Agents

## 1. qa_planning

### Purpose
Generate comprehensive and production-ready test planning documentation.

### Capabilities
- Functional test case design
- Positive & negative test scenarios
- Edge case identification
- API test planning
- UI/UX validation scenarios
- Integration testing scenarios
- Security & validation checklist
- Regression scope recommendation

### Example Usage
```prompt
Create test scenarios for user login feature with positive, negative, and edge cases.
```

---

## 2. qa_script_generator

### Purpose
Generate automation testing scripts based on test scenarios or feature requirements.

### Capabilities
- Playwright automation scripts
- API automation scripts
- Locator generation
- Assertion recommendations
- Test structure standardization
- Reusable helper generation

### Example Usage
```prompt
Generate Playwright automation script for login feature using valid and invalid credentials.
```

---

## 3. qa_executor

### Purpose
Assist QA during test execution and validation processes.

### Capabilities
- Test execution guidance
- Validation flow recommendations
- Execution checklist generation
- Result interpretation
- Retest support
- Smoke & regression execution support

### Example Usage
```prompt
Help execute regression testing for payment module and provide execution checklist.
```

---

## 4. qa_bug_analyst

### Purpose
Analyze bugs/issues and help identify root causes efficiently.

### Capabilities
- Root cause analysis
- Bug impact assessment
- Reproduction step improvement
- Severity & priority recommendation
- Log interpretation
- API error analysis
- SQL/query investigation support

### Example Usage
```prompt
Analyze why API returns 500 error during user registration process.
```

---

# Repository Structure

```bash
kiro-qa-agents/
│
├── agents/
│   ├── qa_planning.md
│   ├── qa_script_generator.md
│   ├── qa_executor.md
│   └── qa_bug_analyst.md
│
├── docs/
│   ├── installation.md
│   ├── usage-guide.md
│   └── contribution-guide.md
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone <your-repository-url>
```

## Open Project

Open the repository using your preferred IDE or Kiro environment.

---

# Recommended Workflow

```text
qa_planning
      ↓
qa_script_generator
      ↓
qa_executor
      ↓
qa_bug_analyst
```

---

# Use Cases

- Web Application Testing
- API Testing
- Regression Testing
- Smoke Testing
- UAT Preparation
- Automation Script Generation
- Bug Investigation
- QA Documentation Standardization

---

# Contribution

Feel free to contribute by:
- Improving prompts
- Adding new QA agents
- Enhancing workflows
- Optimizing automation strategies

---

# License

This repository is open for internal team collaboration and learning purposes.
