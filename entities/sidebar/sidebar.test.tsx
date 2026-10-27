import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { Sidebar } from '.';
import { type UserCardProps } from '../user/ui/user-card';
import {
  communityReact,
  suggestedUserAlice,
  suggestedUserBob,
  userAlice,
} from '@/test/mockUsers';

vi.mock('../user/ui/user-card', async () => {
  return {
    UserCard: (props: UserCardProps) => {
      return (
        <div data-testid="usercard">
          <span>{props.title}</span>
          <span>{props.subtitle}</span>
          <img src={props.avatarUrl} />
        </div>
      );
    },
  };
});

describe('Sidebar component', () => {
  const title = 'sidebar title';

  beforeEach(() => {});

  describe('for users', () => {
    test('dont renders empty sidebar', async () => {
      const screen = await render(<Sidebar title={title} users={[]} />);

      await expect.element(screen.getByText(title)).not.toBeInTheDocument();
      await expect
        .element(screen.getByTestId('usercard'))
        .not.toBeInTheDocument();
    });

    test('renders if sidebar has at least 1 user', async () => {
      const screen = await render(
        <Sidebar title={title} users={[suggestedUserAlice]} />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect.element(screen.getByTestId('usercard')).toBeVisible();
    });

    test('Combines first name and second name', async () => {
      const screen = await render(
        <Sidebar
          title={title}
          users={[suggestedUserAlice, suggestedUserBob]}
        />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect
        .element(
          screen.getByText(`${userAlice.firstName} ${userAlice.secondName}`),
        )
        .toBeVisible();
    });

    test('subtitle is @ + username', async () => {
      const screen = await render(
        <Sidebar
          title={title}
          users={[suggestedUserAlice, suggestedUserBob]}
        />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect
        .element(screen.getByText(`@${userAlice.username}`))
        .toBeVisible();
    });
  });

  describe('for groups', () => {
    test('dont renders empty sidebar', async () => {
      const screen = await render(<Sidebar title={title} users={[]} />);

      await expect.element(screen.getByText(title)).not.toBeInTheDocument();
      await expect
        .element(screen.getByTestId('usercard'))
        .not.toBeInTheDocument();
    });

    test('renders if sidebar has at least 1 group', async () => {
      const screen = await render(
        <Sidebar title={title} users={[communityReact]} />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect.element(screen.getByTestId('usercard')).toBeVisible();
    });

    test('Shows group name', async () => {
      const screen = await render(
        <Sidebar title={title} users={[communityReact]} />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect
        .element(screen.getByText(`${communityReact.title}`))
        .toBeVisible();
    });

    test('subtitle is member count', async () => {
      const screen = await render(
        <Sidebar title={title} users={[communityReact]} />,
      );

      await expect.element(screen.getByText(title)).toBeVisible();
      await expect
        .element(
          screen.getByText(`${communityReact.membersCount}`, { exact: false }),
        )
        .toBeVisible();
    });
  });
});
