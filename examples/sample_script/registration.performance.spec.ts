import { test, expect } from "@playwright/test";
import { apiFetch, uniqueEmail } from "../../frontend/e2e/helpers/apiClient";

test.describe("TC-REG: Registration - Performance Test", () => {
  test("TC-REG-012: Register endpoint response time under load", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const createdIds: string[] = [];
    const responseTimes: number[] = [];
    const concurrentRequests = 50;

    try {
      await test.step("Step 1: Kirim 50 concurrent POST /api/register", async () => {
        const requests = Array.from({ length: concurrentRequests }, (_, i) => {
          const email = uniqueEmail(`perfuser_${i}`);
          return apiFetch(page, {
            method: "POST",
            endpoint: "/api/register",
            body: { email, password: "Pass1234" },
          });
        });

        const results = await Promise.all(requests);

        for (const result of results) {
          responseTimes.push(result.responseTime);

          if (result.status === 201) {
            const userId = (result.data.data as Record<string, unknown>)?.id as string;
            if (userId) createdIds.push(userId);
          }
        }

        console.log(`[TC-REG-012] Sent ${concurrentRequests} concurrent requests`);
        console.log(`[TC-REG-012] Successful: ${createdIds.length}/${concurrentRequests}`);
      });

      await test.step("Step 2: Validasi response time dan error rate", async () => {
        // Hitung 95th percentile
        const sorted = [...responseTimes].sort((a, b) => a - b);
        const p95Index = Math.ceil(sorted.length * 0.95) - 1;
        const p95ResponseTime = sorted[p95Index];

        // Hitung error rate
        const errorCount = concurrentRequests - createdIds.length;
        const errorRate = errorCount / concurrentRequests;

        console.log(`[TC-REG-012] 95th percentile response time: ${p95ResponseTime}ms`);
        console.log(`[TC-REG-012] Error rate: ${(errorRate * 100).toFixed(1)}%`);
        console.log(`[TC-REG-012] Min: ${sorted[0]}ms, Max: ${sorted[sorted.length - 1]}ms`);

        expect(
          p95ResponseTime,
          `95th percentile (${p95ResponseTime}ms) harus < 2000ms`
        ).toBeLessThan(2000);

        expect(
          errorRate,
          `Error rate (${(errorRate * 100).toFixed(1)}%) harus 0%`
        ).toBe(0);
      });
    } finally {
      // CLEANUP: Hapus semua user yang berhasil dibuat
      console.log(`[TC-REG-012] Cleanup: deleting ${createdIds.length} users...`);
      for (const id of createdIds) {
        try {
          await apiFetch(page, {
            method: "DELETE",
            endpoint: `/api/register/${id}`,
          });
        } catch {
          // Ignore cleanup errors
        }
      }
      console.log(`[TC-REG-012] Cleanup complete`);
      await ctx.close();
    }
  });
});
