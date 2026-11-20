import { describe, expect, test } from "vitest";
import { buildOptions, getMonthName } from "./options";

describe("getMonthName", () => {
  test("returns English month name for valid date", () => {
    expect(getMonthName("15.01.2024", "en")).toBe("Jan");
    expect(getMonthName("15.06.2024", "en")).toBe("Jun");
    expect(getMonthName("15.12.2024", "en")).toBe("Dec");
  });

  test("returns Russian month name for valid date", () => {
    expect(getMonthName("15.01.2024", "ru")).toBe("Янв");
    expect(getMonthName("15.06.2024", "ru")).toBe("Июн");
    expect(getMonthName("15.12.2024", "ru")).toBe("Дек");
  });

  test("returns empty string for undefined date", () => {
    expect(getMonthName(undefined, "en")).toBe("");
  });

  test("falls back to English for unknown language", () => {
    expect(getMonthName("15.03.2024", "fr")).toBe("Mar");
  });
});

describe("buildOptions", () => {
  const mockCategories = ["15.01.2024", "15.02.2024", "15.03.2024"];

  test("creates basic options for line chart", () => {
    const options = buildOptions(mockCategories, "light", "test-chart", "line");

    expect(options.chart).toEqual({
      toolbar: { show: false },
      background: "transparent",
      id: "test-chart",
      type: "line",
    });

    expect(options.colors).toEqual(["var(--chart-primary)"]);
    expect(options.stroke).toEqual({
      curve: "straight",
      width: 3,
    });
  });

  test("creates basic options for bar chart", () => {
    const options = buildOptions(mockCategories, "dark", "bar-chart", "bar");

    expect(options?.chart?.type).toBe("bar");
    expect(options.plotOptions?.bar?.columnWidth).toBe("80%");
    expect(options.plotOptions?.bar?.borderRadius).toBe(4);
  });

  test("sets correct annotations for line chart", () => {
    const options = buildOptions(mockCategories, "light", "test-chart", "line");

    expect(options.annotations?.xaxis).toHaveLength(2);
    expect(options.annotations?.xaxis?.[0].label?.text).toBe("Jan");
    expect(options.annotations?.xaxis?.[1].label?.text).toBe("Mar");
    expect(options.annotations?.xaxis?.[0].x).toBe("15");
    expect(options.annotations?.xaxis?.[1].x).toBe("15");
  });

  test("sets correct annotations for bar chart", () => {
    const options = buildOptions(mockCategories, "light", "test-chart", "bar");

    expect(options.annotations?.xaxis).toHaveLength(2);
    expect(options.annotations?.xaxis?.[0].label?.text).toBe("Jan");
    expect(options.annotations?.xaxis?.[1].label?.text).toBe("Mar");
    expect(options.annotations?.xaxis?.[0].x).toBe("15.01.2024");
    expect(options.annotations?.xaxis?.[1].x).toBe("15.03.2024");
  });

  test("sets yaxis max value correctly", () => {
    const options = buildOptions(mockCategories, "light", "test-chart", "line");
    const yaxis = Array.isArray(options.yaxis)
      ? options.yaxis[0]
      : options.yaxis;
    const maxValue = yaxis?.max as (val: number) => number;

    expect(maxValue(5)).toBe(10);
    expect(maxValue(0)).toBe(10);
    expect(maxValue(100)).toBe(150);
  });

  test("applies theme mode", () => {
    const lightOptions = buildOptions(
      mockCategories,
      "light",
      "test-chart",
      "line",
    );
    const darkOptions = buildOptions(
      mockCategories,
      "dark",
      "test-chart",
      "line",
    );

    expect(lightOptions.theme?.mode).toBe("light");
    expect(darkOptions.theme?.mode).toBe("dark");
  });
});
