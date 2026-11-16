import { describe, expect, test } from "vitest";
import updateToken from "./update-token";
import { getCookie } from "./get-cookie";

describe("updateToken", () => {
  test("updates token if exists", () => {
    updateToken("new-token");
    expect(getCookie("token")).toBe("new-token");
  });

  test("removes token if exists", () => {
    updateToken();
    expect(getCookie("token")).toBe("");
  });
});
