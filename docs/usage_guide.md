# Usage Guide

## Overview

Dokumen ini menjelaskan cara menggunakan QA Agents secara end-to-end untuk melakukan testing fitur menggunakan pipeline:

QA Planning → QA Script Generator → QA Executor → QA Quality Analyst

---

## Use Case: Testing Feature "Login"

---

## Step 1 — Generate Test Case (QA Planning)

### Input

Berikan informasi berikut ke agent:

* Feature: Login
* Flow: User login menggunakan email & password
* Role: Admin
* API: POST /api/login
* Validation:

  * Email wajib valid format
  * Password minimal 8 karakter

### Output

Agent akan menghasilkan:

* Test case dalam bentuk tabel
* Sudah mencakup:

  * Positive scenario
  * Negative scenario
  * Edge cases

---

## Step 2 — Generate Automation Script (QA Script Generator)

### Input

* Copy test case dari Step 1

### Output

* Playwright script (TypeScript)
* Struktur:

  * test.describe
  * test.step
  * assertion sesuai test type

### Notes

* Pastikan semua step terimplementasi
* Jangan ada step kosong atau hanya komentar

---

## Step 3 — Execute Test (QA Executor)

### Perintah

Jalankan:

```bash
npx playwright test
```

### Output

* HTML Report
* JSON Execution Report
* Screenshot per step
* Video per test

### Contoh hasil:

* TC-LOGIN-001 → PASSED
* TC-LOGIN-002 → FAILED

---

## Step 4 — Analyze Result (QA Quality Analyst)

### Input

* Execution report (JSON / HTML)

### Output

* Bug report
* Root cause analysis
* Severity & priority
* Impact analysis
* Release decision (GO / NO-GO)

---

## Output Akhir

### 1. Bug Report

Berisi:

* List bug teridentifikasi
* Severity & priority
* Fix recommendation

### 2. QA Summary

Berisi:

* Pass rate
* Total bug
* Risk analysis
* Release decision

---

## Best Practices

### 1. Ikuti urutan agent

JANGAN lompat step (contoh: langsung ke QA Analyst tanpa execution)

---

### 2. Gunakan data yang konsisten

* Test case → script → execution HARUS sinkron

---

### 3. Jangan modify output agent

* Script Generator output → langsung digunakan oleh Executor
* Execution report → langsung digunakan oleh Analyst

---

### 4. Fokus pada evidence

* Semua analisa HARUS berdasarkan:

  * Screenshot
  * Video
  * Error message

---

## Common Mistakes

### ❌ Test case tidak lengkap

→ menyebabkan script tidak bisa dibuat

### ❌ Script tidak valid

→ execution gagal

### ❌ Tidak ada evidence

→ analisa jadi tidak valid

### ❌ Salah interpretasi failure

→ bug yang salah classification

---

## Troubleshooting

### Test gagal tapi tidak jelas

* Cek screenshot & video
* Cek error message di report

---

### Banyak test flaky

* Cek network
* Cek timeout
* Cek environment

---

### Bug tidak reproducible

* Validasi ulang step
* Pastikan test data sama
* Cek environment

---

## Summary

Gunakan QA Agents sebagai pipeline:

1. Design (Planning)
2. Automate (Script Generator)
3. Execute (Executor)
4. Analyze (Quality Analyst)

Jika semua step dilakukan dengan benar:
→ testing akan lebih cepat, konsisten, dan scalable