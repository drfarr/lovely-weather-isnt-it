import { IWeatherResource } from "@/utils/WeatherAdapter.class";
import { test, expect } from "@playwright/test";

test("should return a 400 if location is missing", async ({ request }) => {
  const response = await request.get(`/api/weather`, {});
  const { data } = await response.json();
  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(400);
  expect(data).toHaveLength(0);
});

test("should return a successful response", async ({ request }) => {
  const response = await request.get(`/api/weather?q=brighton`, {});
  const {
    data: { data: results },
  } = await response.json();

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  expect(results).toHaveProperty("name");
  expect(results).toHaveProperty("address");
  expect(results).toHaveProperty("id");
  expect(results).toHaveProperty("units");
  expect(results).toHaveProperty("date");
  expect(results).toHaveProperty("icon");
  expect(results).toHaveProperty("sunRiseTime");
  expect(results).toHaveProperty("sunSetTime");
  expect(results).toHaveProperty("maxTemp");
  expect(results.days.length).toBeGreaterThan(4);
});

test("should return a 405 if HTTP method is not GET", async ({ request }) => {
  const response = await request.post(`/api/weather?q=brighton`, {});
  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(405);
});
