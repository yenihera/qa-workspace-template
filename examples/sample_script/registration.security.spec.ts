import { test, expect } from "@playwright/test";
import { apiFetch } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - Security Test", () => {
  test("TC-REG-010: SQL Injection pada email field", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: POST /api/register dengan SQL injection payload", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: {
            email: "'; DROP TABLE users; --",
            password: "Pass1234",
          },
        });

        console.log(`[TC-REG-010] SQL Injection attempt → status: ${status}`);

        expect(
          status,
          "SQL injection harus ditolak dengan status 400"
        ).toBe(400);
      });

      await test.step("Step 2: Verifikasi database table users masih intact", async () => {
        // Verifikasi dengan mencoba GET endpoint yang membutuhkan table users
        const { status } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: {
            email: "verify_intact@mail.com",
            password: "Pass1234",
          },
        });

        // Jika table users masih ada, endpoint masih bisa merespons (bukan 500)
        expect(
          status,
          "Server harus tetap berfungsi (table users intact), status bukan 500"
        ).not.toBe(500);

        console.log("[TC-REG-010] Database integrity verified - table users intact");
      });
    } finally {
      await ctx.close();
    }
  });

  test("TC-REG-011: XSS pada field email", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: POST /api/register dengan XSS payload", async () => {
        const { status, data, headers } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: {
            email: "<script>alert('xss')</script>@mail.com",
            password: "Pass1234",
          },
        });

        console.log(`[TC-REG-011] XSS attempt → status: ${status}`);

        expect(
          status,
          "XSS payload harus ditolak dengan status 400"
        ).toBe(400);
      });

      await test.step("Step 2: Validasi response tidak mengandung unescaped HTML", async () => {
        const { data, headers } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: {
            email: "<script>alert('xss')</script>@mail.com",
            password: "Pass1234",
          },
        });

        const responseString = JSON.stringify(data);

        expect(
          responseString,
          "Response tidak boleh mengandung raw <script> tag"
        ).not.toContain("<script>");

        expect(
          headers["content-type"],
          "Content-Type harus application/json"
        ).toContain("application/json");

        console.log("[TC-REG-011] Response is safe - no unescaped HTML, correct content-type");
      });
    } finally {
      await ctx.close();
    }
  });
});
