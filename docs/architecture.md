# QA Agents Architecture

## Overview

Sistem terdiri dari 4 agent utama yang bekerja secara pipeline.

---

## Agents Responsibility

### 1. QA Planning

* Generate test case
* Fokus: coverage & design

### 2. QA Script Generator

* Convert test case → automation script
* Fokus: executable code

### 3. QA Executor

* Menjalankan automation
* Menghasilkan report & evidence

### 4. QA Quality Analyst

* Analisa hasil execution
* Generate bug report & insight

---

## Separation of Concerns

| Agent            | Responsibility  | Tidak Boleh   |
| ---------------- | --------------- | ------------- |
| Planning         | Design test     | Execute       |
| Script Generator | Generate script | Run test      |
| Executor         | Run test        | Modify script |
| Analyst          | Analyze result  | Create test   |

---

## Data Contract

### Test Case

* TC ID
* Steps
* Expected Result

### Execution Report

* Status
* Steps result
* Error
* Evidence

### Bug Report

* Root cause
* Severity
* Impact

---

## Design Principles

* Single Responsibility per agent
* No overlapping responsibility
* Traceability end-to-end
* Evidence-based analysis only