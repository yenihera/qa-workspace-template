import { test, expect } from "@playwright/test";
import { apiFetch, uniqueEmail } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - API Test", () => {
  test("TC-REG-001: Register valid user", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const testEmail = uniqueEmail("newuser");
    let createdId: string | null = null;

    try {
      await test.step("Step 1: POST /api/register dengan data valid", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: testEmail, password: "Pass1234" },
        });

        console.log(`[TC-REG-001] POST /api/register → status: ${status}`);

        expect(status, "Status code harus 201 Created").toBe(201);
        expect(data.success, "response.body.success harus true").toBe(true);
        expect(
          (data.data as Record<string, unknown>)?.id,
          "response.body.data.id harus ada"
        ).toBeDefined();

        createdId = (data.data as Record<string, unknown>)?.id as string;
        console.log(`[TC-REG-001] Created user ID: ${createdId}`);
      });
    } finally {
      // CLEANUP: Hapus user yang dibuat
      if (createdId) {
        try {
          await apiFetch(page, {
            method: "DELETE",
            endpoint: `/api/register/${createdId}`,
          });
          console.log(`[TC-REG-001] Cleanup: deleted user ${createdId}`);
        } catch {
          // Ignore cleanup errors
        }
      }
      await ctx.close();
    }
  });

  test("TC-REG-002: Register tanpa email", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: POST /api/register tanpa email", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: "", password: "Pass1234" },
        });

        console.log(`[TC-REG-002] POST /api/register (no email) → status: ${status}`);

        expect(status, "Status code harus 400 Bad Request").toBe(400);
        expect(
          data.error,
          'response.body.error harus "email is required"'
        ).toBe("email is required");
      });
    } finally {
      await ctx.close();
    }
  });

  test("TC-REG-003: Register password kurang dari 8 karakter", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: POST /api/register dengan password pendek", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: "user2@mail.com", password: "abc" },
        });

        console.log(`[TC-REG-003] POST /api/register (short password) → status: ${status}`);

        expect(status, "Status code harus 400 Bad Request").toBe(400);
        expect(
          data.error,
          'response.body.error harus "password minimum 8 characters"'
        ).toBe("password minimum 8 characters");
      });
    } finally {
      await ctx.close();
    }
  });

  test("TC-REG-004: Register email duplikat", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const existingEmail = uniqueEmail("existing");
    let setupId: string | null = null;

    try {
      await test.step("Pre-Condition: Buat akun dengan email yang akan diduplikasi", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: existingEmail, password: "Pass1234" },
        });

        expect(status).toBe(201);
        setupId = (data.data as Record<string, unknown>)?.id as string;
        console.log(`[TC-REG-004] Setup: created user ${setupId} with email ${existingEmail}`);
      });

      await test.step("Step 1: POST /api/register dengan email duplikat", async () => {
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: existingEmail, password: "Pass1234" },
        });

        console.log(`[TC-REG-004] POST /api/register (duplicate) → status: ${status}`);

        expect(status, "Status code harus 409 Conflict").toBe(409);
        expect(
          data.error,
          'response.body.error harus "email already exists"'
        ).toBe("email already exists");
      });
    } finally {
      // CLEANUP: Hapus akun setup
      if (setupId) {
        try {
          await apiFetch(page, {
            method: "DELETE",
            endpoint: `/api/register/${setupId}`,
          });
          console.log(`[TC-REG-004] Cleanup: deleted user ${setupId}`);
        } catch {
          // Ignore cleanup errors
        }
      }
      await ctx.close();
    }
  });
});
