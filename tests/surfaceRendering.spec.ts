import { test } from '@playwright/test';
import {
  visitExample,
  checkForScreenshot,
  screenShotPaths,
} from './utils/index';

test.beforeEach(async ({ page }) => {
  await visitExample(page, 'surfaceRenderingForTest');
});

// this is too much for the CI.
test(
  'should render the segmentation correctly',
  {
    testTimeout: 2000,
    tag: '@slow',
  },
  async ({ page }) => {
    const locator = page.locator('.cornerstone-canvas');
    await checkForScreenshot(
      page,
      locator,
      screenShotPaths.surfaceRendering.viewport
    );
  }
);
