# QA Workflow

## Overview

Workflow QA automation menggunakan AI Agents:

QA Planning → QA Script Generator → QA Executor → QA Quality Analyst

---

## Step-by-Step

### 1. QA Planning

* Input: feature, flow, API, role
* Output: test case (structured)

---

### 2. QA Script Generator

* Input: test case
* Output: Playwright automation script

---

### 3. QA Executor

* Input: automation script
* Output:

  * HTML report
  * JSON execution report
  * Screenshot & video evidence

---

### 4. QA Quality Analyst

* Input: execution report
* Output:

  * Bug report
  * Root cause analysis
  * Risk & release decision

---

## Data Flow

Test Case → Script → Execution Result → Bug Report

---

## Notes

* Semua step HARUS berurutan
* Tidak boleh lompat step
* Output dari agent sebelumnya menjadi input agent berikutnya