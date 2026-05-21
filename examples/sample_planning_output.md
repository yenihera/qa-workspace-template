# QA Planning Output - Register User

## TEST PLAN METADATA

- Generated At: 2026-05-19
- Feature Name: Register User
- Total Test Cases: 12
- Total Positive Scenarios: 7
- Total Negative Scenarios: 5
- Covered Modules: Registration
- Covered Test Types: API, UI, E2E, Property-Based, Security, Performance

### Asumsi

- Tech stack tidak dispesifikasikan, menggunakan best practice umum
- Authentication mechanism: token-based (asumsi)
- API base URL: /api
- UI menggunakan data-testid sebagai primary selector

---

## API Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-001 | Registration | Register valid user | Registrasi user dengan data valid | Positive | API Test | Guest | email: newuser@mail.com, password: Pass1234 | Tidak ada akun dengan email tersebut | Akun baru terbuat di database | 1. POST /api/register dengan body {email: "newuser@mail.com", password: "Pass1234"} | Critical | Status code = 201, response.body.success = true, response.body.data.id exists |
| TC-REG-002 | Registration | Register tanpa email | Registrasi tanpa field email | Negative | API Test | Guest | email: (kosong), password: Pass1234 | - | Akun tidak terbuat | 1. POST /api/register dengan body {email: "", password: "Pass1234"} | High | Status code = 400, response.body.error = "email is required" |
| TC-REG-003 | Registration | Register password kurang dari 8 karakter | Registrasi dengan password terlalu pendek | Negative | API Test | Guest | email: user2@mail.com, password: abc | - | Akun tidak terbuat | 1. POST /api/register dengan body {email: "user2@mail.com", password: "abc"} | High | Status code = 400, response.body.error = "password minimum 8 characters" |
| TC-REG-004 | Registration | Register email duplikat | Registrasi dengan email yang sudah terdaftar | Negative | API Test | Guest | email: existing@mail.com, password: Pass1234 | Akun dengan email existing@mail.com sudah ada di database | Akun baru tidak terbuat | 1. POST /api/register dengan body {email: "existing@mail.com", password: "Pass1234"} | High | Status code = 409, response.body.error = "email already exists" |

---

## UI Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-005 | Registration | Form validation empty submit | Submit form registrasi tanpa mengisi field | Negative | UI Test | Guest | - | Halaman /register terbuka | Form menampilkan error message | 1. Buka halaman /register 2. Klik button "Register" tanpa mengisi field apapun | Medium | Error message "Email is required" visible pada element [data-testid="email-error"], button "Register" tetap enabled |
| TC-REG-006 | Registration | Tampilkan success state setelah register | UI menampilkan feedback sukses setelah registrasi berhasil | Positive | UI Test | Guest | email: uiuser@mail.com, password: Pass1234 | Halaman /register terbuka, tidak ada akun uiuser@mail.com | User melihat success message | 1. Input field [data-testid="email-input"] dengan "uiuser@mail.com" 2. Input field [data-testid="password-input"] dengan "Pass1234" 3. Klik button "Register" 4. Tunggu loading state selesai | High | Element [data-testid="success-message"] visible dengan text "Registration successful" |

---

## E2E Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-007 | Registration | Full flow register lalu login | User register → redirect ke login → login berhasil | Positive | E2E Test | Guest | email: e2euser@mail.com, password: Pass1234 | Tidak ada akun e2euser@mail.com di database | User berhasil login dengan akun baru | 1. Buka halaman /register 2. Input field [data-testid="email-input"] dengan "e2euser@mail.com" 3. Input field [data-testid="password-input"] dengan "Pass1234" 4. Klik button "Register" 5. Tunggu redirect ke /login 6. Input field [data-testid="login-email"] dengan "e2euser@mail.com" 7. Input field [data-testid="login-password"] dengan "Pass1234" 8. Klik button "Login" | Critical | User redirected ke /dashboard, element [data-testid="welcome-text"] visible dengan text mengandung "e2euser" |

---

## Property-Based Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-008 | Registration | Random email format validation | Validasi format email dengan random input non-email | Negative | Property-Based Test | Guest | email: random string tanpa format email (100 iterasi), password: Pass1234 | - | Tidak ada akun baru terbuat | 1. Generate 100 random string tanpa karakter @ atau domain valid 2. Untuk setiap string, POST /api/register dengan body {email: randomString, password: "Pass1234"} | Medium | Semua 100 request return status code = 400, response.body.error contains "invalid email format" |
| TC-REG-009 | Registration | Boundary password length | Validasi password di boundary minimum (7, 8, 9 karakter) | Positive | Property-Based Test | Guest | password_7: "Abcdefg" (7 chars), password_8: "Abcdefgh" (8 chars), password_9: "Abcdefghi" (9 chars) | Tidak ada akun dengan email terkait | Hanya password >= 8 chars yang menghasilkan akun baru | 1. POST /api/register dengan password 7 karakter → expect reject 2. POST /api/register dengan password 8 karakter → expect accept 3. POST /api/register dengan password 9 karakter → expect accept | High | 7 chars → status code = 400; 8 chars → status code = 201; 9 chars → status code = 201 |

---

## Security Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-010 | Registration | SQL Injection pada email field | Coba inject SQL melalui field email | Negative | Security Test | Guest | email: "'; DROP TABLE users; --", password: Pass1234 | Database dalam kondisi normal | Database table users tetap intact, tidak ada data hilang | 1. POST /api/register dengan body {email: "'; DROP TABLE users; --", password: "Pass1234"} 2. Verifikasi table users masih ada dan data tidak berubah | Critical | Status code = 400, database table users tetap intact, jumlah row tidak berubah |
| TC-REG-011 | Registration | XSS pada field email | Coba inject script melalui field email | Negative | Security Test | Guest | email: "<script>alert('xss')</script>@mail.com", password: Pass1234 | - | Script tidak ter-execute di response | 1. POST /api/register dengan body {email: "<script>alert('xss')</script>@mail.com", password: "Pass1234"} 2. Periksa response body tidak mengandung unescaped HTML tag | Critical | Status code = 400, response body tidak mengandung raw <script> tag, content-type header = application/json |

---

## Performance Test

| TestCase ID | Function - Group | Test Case | Test Case Description | Scenario Type | Test Type | User Role | Test Data | Pre-Condition | Postconditions | Test Steps | Severity | Expected Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-REG-012 | Registration | Register endpoint response time under load | Validasi response time endpoint register di bawah threshold saat concurrent request | Positive | Performance Test | Guest | email: perfuser_{n}@mail.com (unique per request), password: Pass1234 | Server dalam kondisi normal, tidak ada throttling aktif | - | 1. Kirim 50 concurrent POST /api/register dengan unique email per request 2. Ukur response time setiap request 3. Hitung 95th percentile | Medium | Response time < 2 seconds untuk 95th percentile, error rate = 0%, semua response status code = 201 |

---

## COVERAGE VALIDATION

| Check | Status |
|---|---|
| Positive scenario coverage | ✅ 7 test cases |
| Negative scenario coverage | ✅ 5 test cases |
| Validation rules (email required, password min 8) | ✅ Covered |
| Edge case: duplicate email | ✅ TC-REG-004 |
| Edge case: boundary value password | ✅ TC-REG-009 |
| Security: SQL Injection | ✅ TC-REG-010 |
| Security: XSS | ✅ TC-REG-011 |
| E2E integration (register → login) | ✅ TC-REG-007 |
| Performance baseline | ✅ TC-REG-012 |
| RBAC coverage | ⚠️ Hanya 1 role (Guest) - sesuai scope fitur register |
