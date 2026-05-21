import { test, expect } from "@playwright/test";
import { uniqueEmail, apiFetch, FE_URL } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - E2E Test", () => {
  test("TC-REG-007: Full flow register lalu login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const testEmail = uniqueEmail("e2euser");
    let createdId: string | null = null;

    try {
      await test.step("Step 1: Buka halaman /register", async () => {
        await page.goto(`${FE_URL}/register`);
        await expect(page).toHaveURL(/\/register/);
        console.log("[TC-REG-007] Navigated to /register");
      });

      await test.step("Step 2: Input email pada form register", async () => {
        const emailInput = page.locator('[data-testid="email-input"]');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(testEmail);
        console.log(`[TC-REG-007] Filled email: ${testEmail}`);
      });

      await test.step("Step 3: Input password pada form register", async () => {
        const passwordInput = page.locator('[data-testid="password-input"]');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill("Pass1234");
        console.log("[TC-REG-007] Filled password");
      });

      await test.step("Step 4: Klik button Register", async () => {
        const registerButton = page.getByRole("button", { name: "Register" });
        await registerButton.click();
        console.log("[TC-REG-007] Clicked Register button");
      });

      await test.step("Step 5: Tunggu redirect ke /login", async () => {
        await page.waitForURL("**/login");
        await expect(page).toHaveURL(/\/login/);
        console.log("[TC-REG-007] Redirected to /login");
      });

      await test.step("Step 6: Input email pada form login", async () => {
        const loginEmail = page.locator('[data-testid="login-email"]');
        await expect(loginEmail).toBeVisible();
        await loginEmail.fill(testEmail);
        console.log("[TC-REG-007] Filled login email");
      });

      await test.step("Step 7: Input password pada form login", async () => {
        const loginPassword = page.locator('[data-testid="login-password"]');
        await expect(loginPassword).toBeVisible();
        await loginPassword.fill("Pass1234");
        console.log("[TC-REG-007] Filled login password");
      });

      await test.step("Step 8: Klik button Login", async () => {
        const loginButton = page.getByRole("button", { name: "Login" });
        await loginButton.click();
        console.log("[TC-REG-007] Clicked Login button");
      });

      await test.step("Step 9: Validasi redirect ke /dashboard dan welcome text", async () => {
        await page.waitForURL("**/dashboard");
        await expect(page).toHaveURL(/\/dashboard/);

        const welcomeText = page.locator('[data-testid="welcome-text"]');
        await expect(
          welcomeText,
          "Welcome text harus visible di dashboard"
        ).toBeVisible();
        await expect(welcomeText).toContainText("e2euser");

        console.log("[TC-REG-007] User successfully logged in and redirected to dashboard");
      });
    } finally {
      // CLEANUP: Hapus user yang dibuat via API
      if (createdId) {
        try {
          await apiFetch(page, {
            method: "DELETE",
            endpoint: `/api/register/${createdId}`,
          });
          console.log(`[TC-REG-007] Cleanup: deleted user ${createdId}`);
        } catch {
          // Ignore cleanup errors
        }
      }
      await ctx.close();
    }
  });
});
