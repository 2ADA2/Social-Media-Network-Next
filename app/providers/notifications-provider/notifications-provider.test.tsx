import { beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { NotificationsProvider } from ".";
import { useNotifications } from "./useNotifications";
import { useEffect } from "react";
import { AddNotificationProps } from "./context";
import { userEvent } from "vitest/browser";
import { TIMEOUT } from "@/shared/ui/notification";

let user = userEvent.setup();

const NotificationTrigger = ({
  notificationInfo,
}: {
  notificationInfo: AddNotificationProps[];
  count?: number;
}) => {
  const { add } = useNotifications();
  useEffect(() => {
    for (let i = 0; i < notificationInfo.length; i++) {
      add(notificationInfo[i]);
    }
  }, []);
  return <div>element</div>;
};

describe("Notifications provider", () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  test("Provides children", async () => {
    const screen = await render(
      <NotificationsProvider>
        <div data-testid="notifications-children">children</div>
      </NotificationsProvider>,
    );

    await expect
      .element(screen.getByTestId("notifications-children"))
      .toBeVisible();
  });

  test("Creates new notification", async () => {
    const screen = await render(
      <NotificationsProvider>
        <NotificationTrigger notificationInfo={[{ message: "message" }]} />
      </NotificationsProvider>,
    );

    await expect.element(screen.getByTestId("notification")).toBeVisible();
  });

  test("Creates new DANGER notification", async () => {
    const screen = await render(
      <NotificationsProvider>
        <NotificationTrigger
          notificationInfo={[{ message: "message", type: "error" }]}
        />
      </NotificationsProvider>,
    );

    await expect
      .element(screen.getByTestId("notification"))
      .toHaveAttribute("role", "alert");
  });

  test("Deletes notification", async () => {
    const screen = await render(
      <NotificationsProvider>
        <NotificationTrigger notificationInfo={[{ message: "message" }]} />
      </NotificationsProvider>,
    );

    await expect.element(screen.getByTestId("notification")).toBeVisible();

    await user.click(screen.getByTestId("notification-delete"));

    await expect
      .element(screen.getByTestId("notification"))
      .not.toBeInTheDocument();
  });

  test(`Removes notification in ${TIMEOUT}`, async () => {
    const screen = await render(
      <NotificationsProvider>
        <NotificationTrigger notificationInfo={[{ message: "message" }]} />
      </NotificationsProvider>,
    );

    await expect.element(screen.getByTestId("notification")).toBeVisible();

    vi.advanceTimersByTime(TIMEOUT);

    await expect
      .element(screen.getByTestId("notification"))
      .not.toBeInTheDocument();
  });
});
