import { tesloApi } from "@/api/tesloApi";
import { env } from "@/lib/utils/env";
import MockAdpater from "axios-mock-adapter";

const mockTesloApi = new MockAdpater(tesloApi);

mockTesloApi.onGet("/test").reply(200, {
  data: "test",
});

describe("tesloApi axios instance", () => {
  it("should have baseUrl set to VITE_TESLO_API_URL", () => {
    expect(tesloApi.defaults.baseURL).toEqual(env.VITE_TESLO_API_URL);
  });

  it("should set Authorization header with token from localStorage ", async () => {
    const token = "test-token";
    localStorage.setItem("token", token);

    const resp = await tesloApi.get("/test");

    expect(resp.config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("should not set Authorization header if token is not in localStorage", async () => {
    localStorage.clear();

    const resp = await tesloApi.get("/test");

    expect(resp.config.headers.Authorization).toBeUndefined();
  });
});
