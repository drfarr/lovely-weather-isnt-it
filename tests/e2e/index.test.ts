import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.locator('[data-cy="address"]')).toHaveText(
    "Brighton, England, United Kingdom"
  );

  await page.locator('[data-cy="imperial"]').click();
  await expect(page.locator('[data-cy="current-temp"]')).toContainText("°F");
  await page.locator('[data-cy="metric"]').click();
  await expect(page.locator('[data-cy="current-temp"]')).toContainText("°C");

  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("london");
  await page.getByRole("button").click();

  await expect(page.locator('[data-cy="address"]')).toHaveText(
    "London, England, United Kingdom"
  );

  await expect(page.locator('[data-cy="current-temp"]')).toContainText("°C");
  await page.locator('[data-cy="imperial"]').click();
  await expect(page.locator('[data-cy="current-temp"]')).toContainText("°F");
  await page.locator('[data-cy="metric"]').click();
  await expect(page.locator('[data-cy="current-temp"]')).toContainText("°C");

  await page.getByPlaceholder("Search").fill("wazloeeee");
  await page.getByPlaceholder("Search").press("Enter");
  await expect(
    page.locator("text=No results found for wazloeeee")
  ).toBeTruthy();
});
