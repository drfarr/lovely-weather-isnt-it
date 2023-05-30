describe("/api/weather Endpoint", () => {
  it("should return a successful response", async () => {
    const res = null;
    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 400 if location is missing", async () => {
    const res = null;
    expect(res.statusCode).toBe(400);
    expect(res.statusMessage).toEqual("OK");
  });

  it("should return a 405 if HTTP method is not GET", async () => {
    const res = null;
    expect(res.statusCode).toBe(405);
  });
});
