import { test, expect } from '@playwright/test'

test('home redirects into a day lesson', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL(/\/day\/\d+/)
  await expect(page.getByRole('heading').first()).toBeVisible()
})

test('day 1 loads overview', async ({ page }) => {
  await page.goto('/day/1')
  await expect(page.getByText(/Overview/i).first()).toBeVisible()
})

test('unlock gate blocks locked days', async ({ page }) => {
  await page.goto('/day/8')
  await expect(
    page.getByRole('heading', { name: /Day 8 is locked/i }),
  ).toBeVisible({ timeout: 15_000 })
})

test('formula explorer opens from Explore', async ({ page }) => {
  await page.goto('/day/1')
  const explore = page.getByRole('button', { name: /Explore/i }).first()
  await expect(explore).toBeVisible({ timeout: 15_000 })
  await explore.click()
  await expect(page.getByText(/Formula Explorer/i).first()).toBeVisible({
    timeout: 10_000,
  })
})

test('exam page loads', async ({ page }) => {
  await page.goto('/exam')
  await expect(page.getByRole('heading', { name: /AP Exam Mode/i })).toBeVisible()
})

test('analytics page loads', async ({ page }) => {
  await page.goto('/analytics')
  await expect(page.locator('main')).toBeVisible()
})
