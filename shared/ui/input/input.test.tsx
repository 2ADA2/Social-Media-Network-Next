import { beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Input } from ".";
import { userEvent } from "vitest/browser";
import { type ShowInputInfoProps } from '@/shared/ui/show-input-info';

vi.mock("@/shared/ui/show-input-info", async() => ({
  ShowInputInfo: ({error, info}:ShowInputInfoProps) => <div data-testid="show-input-info"> {error ? error : info} </div>
}))

const icon = <div data-testid="input-icon">icon</div>;

let user = userEvent.setup()

describe("Input", () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  test("Input renders label", async () => {
    const screen = await render(<Input/>);

    await expect.element(screen.getByTestId("input-label")).toBeVisible();
  });

  test("Input provides value", async () => {
    const screen = await render(<Input value="value" custom info="info"/>);
    
    await expect.element(screen.getByTestId("input")).toHaveValue("value");
  });

  test("Input provides icon", async () => {
    const screen = await render(<Input icon={icon}/>);
    
    await expect.element(screen.getByTestId("input-icon")).toBeVisible();
  });

  test("Input change triggers onChange", async () => {
    const mockChange = vi.fn();
    const screen = await render(<Input onChange={mockChange}/>);

    await expect.element(screen.getByTestId("input-label")).toBeVisible();

    await user.type(screen.getByTestId("input"), "Hello")

    expect(mockChange).toHaveBeenCalledTimes(5);
  });

  test("Input shows error if error in props", async () => {
    const screen = await render(<Input error="invalid"/>);

    await expect.element(screen.getByText("invalid")).toBeVisible();
    await expect.element(screen.getByTestId("input")).toHaveAttribute("aria-invalid", "true");
  });

  test("Input shows custom info if custom and valid", async () => {
    const screen = await render(<Input value="value" custom info="info"/>);
    
    await expect.element(screen.getByText("info")).toBeVisible();
  });

  test("Input doesnt shows custom info if field is empty", async () => {
    const screen = await render(<Input custom info="info"/>);
    
    await expect.element(screen.getByText("info")).not.toBeInTheDocument();
  });

  test("Input info prefers error", async () => {
    const screen = await render(<Input error="error" info="info"/>);
    
    await expect.element(screen.getByTestId("show-input-info")).toHaveTextContent("error");
    await expect.element(screen.getByText("info")).not.toBeInTheDocument();
  });
});