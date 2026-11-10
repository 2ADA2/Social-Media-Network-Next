import { render } from "vitest-browser-react";
import { describe, expect, vi, test } from "vitest";
import { Select } from ".";
import { userEvent } from "vitest/browser";

const user = userEvent.setup();

describe("Select component", () => {
  const defaultOptions = [
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
  ];

  test("renders selected value", async () => {
    const screen = await render(
      <Select options={defaultOptions} value="en" onChange={() => {}} />,
    );

    await expect
      .element(screen.getByRole("combobox"))
      .toHaveTextContent("English");
  });

  test("opens dropdown on click", async () => {
    const screen = await render(
      <Select options={defaultOptions} value="en" onChange={() => {}} />,
    );

    await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));

    await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
    await expect
      .element(screen.getByRole("option", { name: "Русский" }))
      .toBeInTheDocument();
  });

  test("calls onChange and closes dropdown when option is selected", async () => {
    const handleChange = vi.fn();
    const screen = await render(
      <Select options={defaultOptions} value="en" onChange={handleChange} />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Русский" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("ru");

    await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  });
});
