# Mock AI Expense Categorizer

This project is an automated test suite for a web-based AI Expense Categorizer using [Playwright](https://playwright.dev/). It validates the categorization of expenses using sample data from an Excel file and ensures the application's categorization logic works as expected.

## Project Structure

```
.
├── data/
│   └── expense-categorizer-sampledata.xlsx   # Sample expenses data for tests
├── playwright.config.ts                      # Playwright configuration
├── src/
│   ├── pages/
│   │   ├── basepage.ts                       # Base page object for Playwright
│   │   └── mockExpense.ts                    # Page object for the Expense Categorizer
│   ├── tests/
│   │   └── mockExpences.spec.ts              # Main Playwright test suite
│   ├── utils/
│   │   └── excelReader.ts                    # Utility to read Excel files
│   └── types/
│       └── types.ts                          # Type definitions
├── test-results/                             # Playwright test results (gitignored)
├── playwright-report/                        # Playwright HTML reports (gitignored)
├── package.json                              # Project dependencies and scripts
└── .gitignore
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Verify the sample data:**
   - Ensure `data/expense-categorizer-sampledata.xlsx` exists and contains the expected columns:  
     `Description`, `Amount`, `Expected Category`, etc.

## Running Tests

### Run all tests

```sh
npm test
```

### View HTML Test Report

After running tests, view the Playwright report:

```sh
npm run test:report
```

This opens an interactive HTML report in your browser.

## Test Details

- Tests are defined in [`src/tests/mockExpences.spec.ts`](src/tests/mockExpences.spec.ts).
- The suite:
  - Navigates to the Mock AI Expense Categorizer page.
  - Reads test cases from the Excel file using [`ExcelReader`](src/utils/excelReader.ts).
  - Submits each expense and validates the returned category against the expected value.
  - Reports any mismatches or errors in the Playwright report.

## Customization

- **Add/modify test data:**  
  Edit `data/expense-categorizer-sampledata.xlsx` to add new expenses or change expected categories.
- **Page logic:**  
  Update [`src/pages/mockExpense.ts`](src/pages/mockExpense.ts) if the web app UI changes.
- **Excel reading logic:**  
  Update [`src/utils/excelReader.ts`](src/utils/excelReader.ts) for different data formats.

## Troubleshooting

- **Test failures:**  
  See detailed error messages and mismatches in the Playwright HTML report.
- **Excel file issues:**  
  Ensure the Excel file is not open in another program and follows the expected format.

## Scripts

| Command              | Description                       |
|----------------------|-----------------------------------|
| `npm test`           | Run all Playwright tests          |
| `npm run test:report`| Open the Playwright HTML report   |

## License

This project is licensed under the ISC License.

---

**Maintainer:**  
Rohith Reddy Gundra  
Rohith.gundra@hotmail.com