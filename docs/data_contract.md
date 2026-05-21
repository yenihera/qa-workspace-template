# Data Contract

## Overview

Dokumen ini mendefinisikan format data yang digunakan antar QA Agents untuk memastikan konsistensi, traceability, dan interoperability.

Pipeline:
QA Planning → QA Script Generator → QA Executor → QA Quality Analyst

---

## 1. Test Case Contract (Output: QA Planning)

Format tabel:

| Field                 | Type          | Mandatory | Description                                        |
| --------------------- | ------------- | --------- | -------------------------------------------------- |
| TestCase ID           | String        | Yes       | Unique ID (format: TC-MODULE-XXX)                  |
| Function - Group      | String        | Yes       | Nama module/fitur                                  |
| Test Case             | String        | Yes       | Judul test case                                    |
| Test Case Description | String        | Yes       | Penjelasan test                                    |
| Scenario Type         | Enum          | Yes       | Positive / Negative                                |
| Test Type             | Enum          | Yes       | API / UI / E2E / Property / Security / Performance |
| User Role             | String        | No        | Role user                                          |
| Test Data             | Object/String | Yes       | Data input                                         |
| Pre-Condition         | String        | Yes       | Kondisi awal                                       |
| Postconditions        | String        | No        | Kondisi setelah test                               |
| Test Steps            | Array         | Yes       | Step by step (numbered)                            |
| Severity              | Enum          | Yes       | Critical / High / Medium / Low                     |
| Expected Result       | String        | Yes       | Harus measurable & assertable                      |
| Status Run Test       | String        | No        | Placeholder (diisi oleh Executor)                  |
| Actual Result         | String        | No        | Placeholder (diisi oleh Executor)                  |
| Evidence              | String        | No        | Placeholder (diisi oleh Executor)                  |

### Notes

* Field `Status Run Test`, `Actual Result`, dan `Evidence` TIDAK boleh diisi oleh QA Planning
* Test Steps HARUS executable dan tidak ambigu

---

## 2. Automation Script Contract (Output: QA Script Generator)

Format: Playwright (TypeScript)

### Mandatory Structure

* Menggunakan `test.describe()` dan `test()`
* Menggunakan `test.step()` untuk setiap langkah
* Menggunakan helper:

  * loginAsPIC / loginAsAdmin / dll
  * apiFetch()

### Requirements

| Rule | Description                                                   |
| ---- | ------------------------------------------------------------- |
| 1    | Semua test steps HARUS diimplementasikan (tidak boleh kosong) |
| 2    | HARUS memiliki minimal 2 assertion                            |
| 3    | Assertion sesuai Test Type                                    |
| 4    | Semua async HARUS pakai await                                 |
| 5    | Tidak boleh ada variable undefined                            |

---

## 3. Execution Report Contract (Output: QA Executor)

Format JSON:

```json
{
  "tc_id": "TC-XXX-001",
  "status": "PASSED | FAILED | BLOCKED",
  "duration": "ms",
  "error": "string",
  "failure_category": "ASSERTION_FAILURE | ELEMENT_NOT_FOUND | API_FAILURE | TIMEOUT_FAILURE | DATA_ISSUE | ENVIRONMENT_FAILURE",
  "steps": [
    {
      "step_id": "1",
      "step_name": "Click login",
      "status": "PASSED | FAILED | SKIPPED",
      "duration_ms": 1200,
      "error_message": "",
      "screenshot_path": "path/to/image.png"
    }
  ],
  "evidence": {
    "screenshots": [],
    "video": "path/to/video.mp4",
    "trace": "path/to/trace.zip"
  }
}
```

### Rules

* Setiap test HARUS memiliki:

  * Screenshot per step
  * Video per test
* Jika step gagal:

  * Step berikutnya HARUS SKIPPED
* Setiap FAILED test HARUS memiliki `failure_category`

---

## 4. Bug Report Contract (Output: QA Quality Analyst)

Format tabel:

| Field              | Type   | Mandatory | Description                                                               |
| ------------------ | ------ | --------- | ------------------------------------------------------------------------- |
| Bug ID             | String | Yes       | Unique bug identifier                                                     |
| Title              | String | Yes       | Ringkas & jelas                                                           |
| Module             | String | Yes       | Area terdampak                                                            |
| Requirement ID     | String | Yes       | N/A jika tidak ada                                                        |
| Related TC IDs     | Array  | Yes       | TC terkait                                                                |
| Description        | String | Yes       | Penjelasan issue                                                          |
| Steps to Reproduce | Array  | Yes       | Step reproduksi                                                           |
| Reproducibility    | Enum   | Yes       | Reproducible / Not Reproducible / Unknown                                 |
| Expected Result    | String | Yes       | Expected                                                                  |
| Actual Result      | String | Yes       | Actual                                                                    |
| Severity           | Enum   | Yes       | Critical / High / Medium / Low                                            |
| Priority           | Enum   | Yes       | P1 / P2 / P3 / P4                                                         |
| Status             | Enum   | Yes       | Open / In Progress / Ready for Retest / Retest Passed / Reopened / Closed |
| Confidence Level   | Enum   | Yes       | High / Medium / Low                                                       |
| Root Cause         | String | Yes       | Hipotesis teknis                                                          |
| Failure Category   | String | Yes       | Dari Executor                                                             |
| Affected Areas     | String | Yes       | Area terdampak                                                            |
| Fix Recommendation | String | Yes       | Rekomendasi                                                               |
| Impact Analysis    | String | Yes       | Dampak                                                                    |

---

## 5. Traceability Rules (MANDATORY)

Setiap layer HARUS bisa ditelusuri:

| From             | To               |
| ---------------- | ---------------- |
| Test Case        | Script           |
| Script           | Execution Result |
| Execution Result | Bug Report       |

---

## 6. Data Integrity Rules

* Tidak boleh mengubah format antar agent
* Tidak boleh menghilangkan field mandatory
* Semua data HARUS berbasis evidence (tidak boleh asumsi)

---

## 7. Versioning (Optional)

Jika terjadi perubahan format:

* Tambahkan version pada contract
* Contoh:

  * v1.0 → initial
  * v1.1 → tambah failure_category