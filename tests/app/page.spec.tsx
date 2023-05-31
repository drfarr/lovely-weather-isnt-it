import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../../app/page";
import data from "../__mocks__/api.json";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/weather", (req, res, ctx) => {
    return res(ctx.json({ data }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should load data to display", async () => {
  render(<Home />);

  expect(
    screen.findAllByText("Brighton, England, United Kingdom")
  ).toBeTruthy();

  expect(screen.findAllByText("Daily Overview")).toBeTruthy();
  expect(screen.findAllByText("5 Day Forecast")).toBeTruthy();
});

test("should handle server error", async () => {
  server.use(
    rest.get("/api/weather", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<Home />);

  expect(screen.findAllByText("Oops something went wrong :(")).toBeTruthy();
  expect(screen.findAllByText("Please try again later.")).toBeTruthy();
});

test("should handles no results", async () => {
  server.use(
    rest.get("/api/weather", (req, res, ctx) => {
      return res(ctx.json({ data: [], message: "No data" }));
    })
  );

  render(<Home />);

  expect(screen.findAllByText("No results found for")).toBeTruthy();
});
