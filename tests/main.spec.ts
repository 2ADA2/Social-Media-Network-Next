import { expect, test } from '@playwright/test';

test.describe('main page', () => {
  test.describe.configure({ mode: 'serial' });

  test('correct layout, user is authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    await expect(
      header.getByRole('link', { name: 'Helena Hills' }),
    ).toBeVisible();
  });

  test.describe('like and unlike post', () => {
    test('likes the post', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      const likeButton = post.getByRole('button', { name: 'Like post' });

      await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
      await likeButton.click();
      await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('dislikes the post', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.locator('article').nth(2);
      const likeButton = post.getByRole('button', { name: 'Like post' });

      await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
      await likeButton.click();
      await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  test.describe('Comments', () => {
    test('Opens comments section', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      const commentsButton = post.getByRole('button', {
        name: 'View comments',
      });

      await commentsButton.click();

      const textarea = post.getByRole('textbox');
      const addButton = post.getByRole('button', { name: 'Add a comment' });

      await expect(post.getByText('Great job!')).toBeVisible();
      await expect(textarea).toBeVisible();
      await expect(addButton).toBeVisible();
    });

    test('Shows validation error if textarea is empty', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      const commentsButton = post.getByRole('button', {
        name: 'View comments',
      });
      await commentsButton.click();

      const addButton = post.getByRole('button', { name: 'Add a comment' });
      await addButton.click();

      await expect(post.locator('[aria-live="polite"]')).toBeVisible();
    });

    test('Shows validation error if textarea is overflowing', async ({
      page,
    }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      const commentsButton = post.getByRole('button', {
        name: 'View comments',
      });
      await commentsButton.click();

      const textarea = post.getByRole('textbox');
      const addButton = post.getByRole('button', { name: 'Add a comment' });

      await textarea.fill('a'.repeat(300));
      await addButton.click();

      await expect(post.locator('[aria-live="polite"]')).toBeVisible();
    });

    test('Creates a comment and shows notification', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      const commentsButton = post.getByRole('button', {
        name: 'View comments',
      });
      await commentsButton.click();

      const textarea = post.getByRole('textbox');
      const addButton = post.getByRole('button', { name: 'Add a comment' });

      await textarea.fill('playwright comments this post');
      await addButton.click();

      await expect(
        post.getByText('playwright comments this post'),
      ).toBeVisible();
      await expect(page.getByTestId('notification')).toBeVisible();
    });

    test('Deletes a comment and shows notification', async ({ page }) => {
      const COMMENT_TEXT = 'Nice motivation, Charles!';
      await page.goto('http://localhost:3000/');

      const post = page.locator('article').nth(1);
      const commentsButton = post.getByRole('button', {
        name: 'View comments',
      });

      await commentsButton.click();
      await expect(post.getByText(COMMENT_TEXT)).toBeVisible();

      const deleteCommentButton = await post.getByRole('button', {
        name: 'Delete comment',
      });
      await deleteCommentButton.click();

      await expect(page.getByTestId('notification'));
      await expect(post.getByText(COMMENT_TEXT)).not.toBeVisible();
    });
  });

  test.describe('Deletes post', () => {
    test('Delete post button triggers modal', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      await post.hover();

      const deleteButton = post.getByRole('button', { name: 'Delete post' });
      await deleteButton.click();

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();
    });

    test('Deletes the post', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const post = page.getByRole('article').first();
      await post.hover();

      const deleteButton = post.getByRole('button', { name: 'Delete post' });
      await deleteButton.click();

      const modal = page.getByTestId('modal');
      await modal.getByRole('button', { name: 'Delete' }).click();

      await expect(modal).not.toBeVisible();
      await expect(
        page.getByText('Really nice flowers in San Francisco!'),
      ).not.toBeVisible();
    });
  });

  test.describe('Create post', () => {
    test('Create post modal opens', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const button = page.getByRole('button', { name: 'Tell everyone' });
      await button.click();

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();
    });

    test('Cant create post with empty fields', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const button = page.getByRole('button', { name: 'Tell everyone' });
      await button.click();

      const modal = page.getByTestId('modal');
      const titleInput = modal.getByRole('textbox', { name: 'Post title' });
      const createButton = modal.getByRole('button', { name: 'Create' });

      await createButton.click();
      await expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      await expect(modal.getByText('Description required')).toBeVisible();
    });

    test('Cant create post with overflowing fields', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const button = page.getByRole('button', { name: 'Tell everyone' });
      await button.click();

      const modal = page.getByTestId('modal');
      const titleInput = modal.getByRole('textbox', { name: 'Post title' });
      const descriptionInput = modal.getByRole('textbox', {
        name: 'Description',
      });
      const createButton = modal.getByRole('button', { name: 'Create' });

      await titleInput.fill('A'.repeat(110));
      await descriptionInput.fill('A'.repeat(1100));

      await createButton.click();
      await expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      await expect(
        modal.getByText('Reached the 1000 text limit'),
      ).toBeVisible();
    });

    test('Creates post successfull', async ({ page }) => {
      await page.goto('http://localhost:3000/');

      const button = page.getByRole('button', { name: 'Tell everyone' });
      await button.click();

      const modal = page.getByTestId('modal');
      const titleInput = modal.getByRole('textbox', { name: 'Post title' });
      const descriptionInput = modal.getByRole('textbox', {
        name: 'Description',
      });
      const createButton = modal.getByRole('button', { name: 'Create' });

      await titleInput.fill('post title playwright');
      await descriptionInput.fill('post description playwright');

      await createButton.click();
      await expect(modal).not.toBeVisible();

      const notification = page.getByTestId('notification');
      await expect(notification).toBeVisible();
      await expect(notification.getByText('Post created')).toBeVisible();
    });
  });
});
