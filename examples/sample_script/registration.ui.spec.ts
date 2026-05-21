import { test, expect } from "@playwright/test";
import { uniqueEmail, FE_URL } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - UI Test", () => {
  test("TC-REG-005: Form validation empty submit", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    try {
      await test.step("Step 1: Buka halaman /register", async () => {
        await page.goto(`${FE_URL}/register`);
        await expect(page).toHaveURL(/\/register/);
        console.log("[TC-REG-005] Navigated to /register");
      });

      await test.step("Step 2: Klik button Register tanpa mengisi field", async () => {
        const registerButton = page.getByRole("button", { name: "Register" });
        await expect(registerButton).toBeVisible();
        await registerButton.click();
        console.log("[TC-REG-005] Clicked Register button without filling fields");
      });

      await test.step("Step 3: Validasi error message tampil", async () => {
        const emailError = page.locator('[data-testid="email-error"]');
        await expect(
          emailError,
          'Error message "Email is required" harus visible'
        ).toBeVisible();
        await expect(emailError).toHaveText("Email is required");

        const registerButton = page.getByRole("button", { name: "Register" });
        await expect(
          registerButton,
          "Button Register harus tetap enabled"
        ).toBeEnabled();

        console.log("[TC-REG-005] Validation error displayed correctly");
      });
    } finally {
      await ctx.close();
    }
  });

  test("TC-REG-006: Tampilkan success state setelah register", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const testEmail = uniqueEmail("uiuser");

    try {
      await test.step("Step 1: Buka halaman /register", async () => {
        await page.goto(`${FE_URL}/register`);
        await expect(page).toHaveURL(/\/register/);
        console.log("[TC-REG-006] Navigated to /register");
      });

      await test.step("Step 2: Input email", async () => {
        const emailInput = page.locator('[data-testid="email-input"]');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(testEmail);
        console.log(`[TC-REG-006] Filled email: ${testEmail}`);
      });

      await test.step("Step 3: Input password", async () => {
        const passwordInput = page.locator('[data-testid="password-input"]');
        await expect(passwordInput).toBeVisible();
        await passwordInput.fill("Pass1234");
        console.log("[TC-REG-006] Filled password");
      });

      await test.step("Step 4: Klik button Register", async () => {
        const registerButton = page.getByRole("button", { name: "Register" });
        await registerButton.click();
        console.log("[TC-REG-006] Clicked Register button");
      });

      await test.step("Step 5: Validasi success message tampil", async () => {
        const successMessage = page.locator('[data-testid="success-message"]');
        await expect(
          successMessage,
          "Success message harus visible setelah registrasi"
        ).toBeVisible();
        await expect(successMessage).toHaveText("Registration successful");

        console.log("[TC-REG-006] Success message displayed correctly");
      });
    } finally {
      await ctx.close();
    }
  });
});
