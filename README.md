# Playwright

Before running tests, please run `npm i` and `npx playwright install`

### Performance Tests

Run `npx playwright test performance.spec.js --ui`

### Accessibility Tests

Run `npx playwright test accessibility.spec.js`
Run `npx playwright test lighthouse.spec.js --project='Chrome Stable' --workers 1`

### UI Tests

Run `npx playwright test ui.spec.js --ui`
