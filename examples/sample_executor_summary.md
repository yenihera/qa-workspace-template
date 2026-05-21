# QA Execution Summary

## Execution Metadata

| Field | Value |
|---|---|
| Execution ID | EXEC-REG-20260519-001 |
| Execution Date | 2026-05-19 |
| Started At | 2026-05-19T10:00:00.000Z |
| Finished At | 2026-05-19T10:02:34.512Z |
| Total Duration | 154.5s |
| Browser | Chromium |
| Environment | Local |
| Evidence Mode | FULL |

---

## Execution Summary

| Metric | Count |
|---|---|
| Total Tests | 12 |
| Passed | 9 |
| Failed | 2 |
| Blocked | 0 |
| Flaky | 1 |
| Invalid | 0 |

---

## Results by Test Type

| Test Type | Total | Passed | Failed | Flaky |
|---|---|---|---|---|
| API Test | 4 | 4 | 0 | 0 |
| UI Test | 2 | 1 | 1 | 0 |
| E2E Test | 1 | 0 | 0 | 1 |
| Property-Based Test | 2 | 2 | 0 | 0 |
| Security Test | 2 | 1 | 1 | 0 |
| Performance Test | 1 | 1 | 0 | 0 |

---

## All Test Results

| TC ID | Test Name | Test Type | Status | Duration | Failure Category | Retry |
|---|---|---|---|---|---|---|
| TC-REG-001 | Register valid user | API Test | ✅ PASSED | 3.2s | - | 0 |
| TC-REG-002 | Register tanpa email | API Test | ✅ PASSED | 1.8s | - | 0 |
| TC-REG-003 | Register password kurang dari 8 karakter | API Test | ✅ PASSED | 1.8s | - | 0 |
| TC-REG-004 | Register email duplikat | API Test | ✅ PASSED | 3.4s | - | 0 |
| TC-REG-005 | Form validation empty submit | UI Test | ❌ FAILED | 32.4s | ELEMENT_NOT_FOUND | 2 |
| TC-REG-006 | Tampilkan success state setelah register | UI Test | ✅ PASSED | 6.8s | - | 0 |
| TC-REG-007 | Full flow register lalu login | E2E Test | ⚠️ FLAKY | 38.3s | TIMEOUT_FAILURE | 1 |
| TC-REG-008 | Random email format validation | Property-Based | ✅ PASSED | 13.3s | - | 0 |
| TC-REG-009 | Boundary password length | Property-Based | ✅ PASSED | 7.2s | - | 0 |
| TC-REG-010 | SQL Injection pada email field | Security Test | ✅ PASSED | 4.5s | - | 0 |
| TC-REG-011 | XSS pada field email | Security Test | ❌ FAILED | 19.3s | ASSERTION_FAILURE | 2 |
| TC-REG-012 | Register endpoint response time under load | Performance Test | ✅ PASSED | 21.7s | - | 0 |

---

## Failed Test Details

### TC-REG-005: Form validation empty submit

| Field | Detail |
|---|---|
| Failure Category | ELEMENT_NOT_FOUND |
| Failed Step | Step 3: Validasi error message tampil |
| Error | Element [data-testid="email-error"] not found. Timeout 30000ms exceeded. |
| Retry Count | 2 (all failed) |
| Trace | evidence/TC-REG-005-trace.zip |

**Root Cause Analysis:**
Element `[data-testid="email-error"]` tidak ditemukan di DOM setelah submit form kosong. Kemungkinan:
- data-testid belum diimplementasikan di frontend
- Validasi error menggunakan selector/attribute berbeda
- Form menggunakan native HTML5 validation (browser-level) bukan custom error element

---

### TC-REG-011: XSS pada field email

| Field | Detail |
|---|---|
| Failure Category | ASSERTION_FAILURE |
| Failed Step | Step 2: Validasi response tidak mengandung unescaped HTML |
| Error | expect(received).not.toContain(expected) — Response body contains raw `<script>` tag. XSS vulnerability detected. |
| Retry Count | 2 (all failed) |
| Trace | evidence/TC-REG-011-trace.zip |

**Root Cause Analysis:**
API mengembalikan input email tanpa sanitasi/escaping di response body. Response mengandung raw `<script>` tag yang berpotensi XSS vulnerability. Backend perlu implementasi input sanitization atau output encoding.

**Security Impact:** HIGH — Potential Stored XSS jika data ditampilkan di UI tanpa escaping.

---

## Flaky Test Details

### TC-REG-007: Full flow register lalu login

| Field | Detail |
|---|---|
| Failure Category | TIMEOUT_FAILURE |
| Initial Failure | Timeout waiting for navigation to **/dashboard |
| Retry Result | PASSED on retry 1 |
| Trace | evidence/TC-REG-007-trace.zip |

**Analysis:**
Navigation ke /dashboard timeout pada initial run, kemungkinan karena:
- Slow redirect setelah login
- Race condition antara auth state dan route guard
- Network latency pada initial page load

---

## Cleanup Summary

| TC ID | Cleanup Status | Notes |
|---|---|---|
| TC-REG-001 | ✅ Success | User deleted |
| TC-REG-004 | ✅ Success | Setup user deleted |
| TC-REG-009 | ✅ Success | 2 boundary users deleted |
| TC-REG-012 | ✅ Success | 50 perf users deleted |
| TC-REG-002 | ⏭️ Skipped | No data created (negative test) |
| TC-REG-003 | ⏭️ Skipped | No data created (negative test) |
| TC-REG-005 | ⏭️ Skipped | UI test, no API data |
| TC-REG-008 | ⏭️ Skipped | No data created (all rejected) |
| TC-REG-010 | ⏭️ Skipped | No data created (rejected) |
| TC-REG-011 | ⏭️ Skipped | No data created (rejected) |

---

## Report Locations

| Report | Path |
|---|---|
| HTML Report | Dummy Output/executor-report.html |
| JSON Report | Dummy Output/executor-results.json |
| Evidence Directory | Dummy Output/evidence/ |

---

## Recommendations

1. **TC-REG-005 (FAILED):** Verify `[data-testid="email-error"]` exists in frontend implementation. Coordinate with frontend team.
2. **TC-REG-011 (FAILED):** Critical security finding — backend must sanitize/escape user input before including in response body. File security bug ticket.
3. **TC-REG-007 (FLAKY):** Add explicit wait for auth state before asserting dashboard redirect. Consider increasing navigation timeout or adding retry-aware wait.
