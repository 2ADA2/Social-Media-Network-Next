import { describe, expect, test } from 'vitest';
import { mapUser } from './mapUser';
import type { UserResponse } from '../model/types';

const createUserResponse = (
  overrides: Partial<UserResponse> = {},
): UserResponse =>
  ({
    id: 1,
    username: 'alice',
    firstName: 'Alice',
    secondName: 'Smith',
    email: 'alice@example.com',
    profileImage: '/avatar.png',
    description: 'Some description',
    ...overrides,
  }) as unknown as UserResponse;

describe('mapUser', () => {
  test('maps all fields correctly', () => {
    const result = mapUser(createUserResponse());

    expect(result).toEqual({
      id: '1',
      username: 'alice',
      name: 'Alice',
      surname: 'Smith',
      email: 'alice@example.com',
      avatar: '/avatar.png',
      description: 'Some description',
    });
  });

  test('converts numeric id to string', () => {
    const result = mapUser(createUserResponse({ id: 42 }));

    expect(result.id).toBe('42');
    expect(typeof result.id).toBe('string');
  });

  test('converts null fields to empty strings', () => {
    const result = mapUser(
      createUserResponse({
        firstName: null,
        secondName: null,
        email: null,
        profileImage: null,
        description: null,
      } as unknown as UserResponse),
    );

    expect(result).toEqual({
      id: '1',
      username: 'alice',
      name: '',
      surname: '',
      email: '',
      avatar: '',
      description: '',
    });
  });

  test('keeps username as is', () => {
    const result = mapUser(createUserResponse({ username: 'bob' }));

    expect(result.username).toBe('bob');
  });
});
