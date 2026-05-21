import { test, expect } from "@playwright/test";
import { apiFetch, uniqueEmail } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - Property-Based Test", () => {
  test("TC-REG-008: Random email format validation", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: Generate random strings tanpa format email dan validasi rejection", async () => {
        const invalidEmails = [
          "plainstring",
          "missing-at-sign.com",
          "@no-local-part.com",
          "spaces in@email.com",
          "double@@at.com",
          ".starts-with-dot@mail.com",
          "ends-with-dot.@mail.com",
          "no-domain@",
          "special!#$%@mail.com",
          "unicode-émàil@mail.com",
        ];

        let allRejected = true;

        for (const invalidEmail of invalidEmails) {
          const { status, data } = await apiFetch(page, {
            method: "POST",
            endpoint: "/api/register",
            body: { email: invalidEmail, password: "Pass1234" },
          });

          console.log(`[TC-REG-008] Email: "${invalidEmail}" → status: ${status}`);

          if (status !== 400) {
            allRejected = false;
          }

          expect(
            status,
            `Email "${invalidEmail}" harus ditolak dengan status 400`
          ).toBe(400);
          expect(
            String(data.error),
            `Error harus mengandung "invalid email" untuk "${invalidEmail}"`
          ).toContain("invalid email");
        }

        expect(allRejected, "Semua invalid email harus ditolak").toBe(true);
        console.log(`[TC-REG-008] All ${invalidEmails.length} invalid emails rejected correctly`);
      });
    } finally {
      await ctx.close();
    }
  });

  test("TC-REG-009: Boundary password length", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const createdIds: string[] = [];

    try {
      await test.step("Step 1: POST /api/register dengan password 7 karakter (expect reject)", async () => {
        const email7 = uniqueEmail("boundary7");
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: email7, password: "Abcdefg" }, // 7 chars
        });

        console.log(`[TC-REG-009] Password 7 chars → status: ${status}`);
        expect(status, "Password 7 karakter harus ditolak (400)").toBe(400);
        expect(data.error).toBe("password minimum 8 characters");
      });

      await test.step("Step 2: POST /api/register dengan password 8 karakter (expect accept)", async () => {
        const email8 = uniqueEmail("boundary8");
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: email8, password: "Abcdefgh" }, // 8 chars
        });

        console.log(`[TC-REG-009] Password 8 chars → status: ${status}`);
        expect(status, "Password 8 karakter harus diterima (201)").toBe(201);

        const userId = (data.data as Record<string, unknown>)?.id as string;
        if (userId) createdIds.push(userId);
      });

      await test.step("Step 3: POST /api/register dengan password 9 karakter (expect accept)", async () => {
        const email9 = uniqueEmail("boundary9");
        const { status, data } = await apiFetch(page, {
          method: "POST",
          endpoint: "/api/register",
          body: { email: email9, password: "Abcdefghi" }, // 9 chars
        });

        console.log(`[TC-REG-009] Password 9 chars → status: ${status}`);
        expect(status, "Password 9 karakter harus diterima (201)").toBe(201);

        const userId = (data.data as Record<string, unknown>)?.id as string;
        if (userId) createdIds.push(userId);
      });
    } finally {
      // CLEANUP: Hapus user yang berhasil dibuat
      for (const id of createdIds) {
        try {
          await apiFetch(page, {
            method: "DELETE",
            endpoint: `/api/register/${id}`,
          });
          console.log(`[TC-REG-009] Cleanup: deleted user ${id}`);
        } catch {
          // Ignore cleanup errors
        }
      }
      await ctx.close();
    }
  });
});
