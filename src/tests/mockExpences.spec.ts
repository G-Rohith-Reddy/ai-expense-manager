import { test } from '@playwright/test';
import { MockExpenses } from '../pages/mockExpense';
import { ExcelReader } from '../utils/excelReader';

test('Validate Mock Expense Categorizer page content', async ({page}) => {
    const categorizerPage = new MockExpenses(page);
    await categorizerPage.navigateToPage();
    await categorizerPage.validateHeaders();
    await categorizerPage.validateInputField();
})

test('validate if Categorization functionality is working', async ({page}) => {
    const categorizerPage = new MockExpenses(page);
    await categorizerPage.navigateToPage();
    const expenses: [string, string, number][] = [
        ["2025-05-11", "Whole Foods Market", 82.14],
        ["2025-05-10", "Uber ride", 15.50],
        ["2025-05-12", "CVS Pharmacy", 25.00],
        ["2025-05-10", "Netflix subscription", 13.99]
    ];
    await categorizerPage.validateCategories(expenses);
})
test('validate if Categorization functionality is working with invalid Json', async ({page}) => {
    const categorizerPage = new MockExpenses(page);
    await categorizerPage.navigateToPage();
    const expenses:{date?: string;description?: string;amount?: number;}[]= [
  { "date":"2025-05-11","description":"Whole Foods Market","amount":82.14  },
  { "date":"2025-05-10","description":"Uber ride","amount":15.50 },
]
    await categorizerPage.submitJSONInput(expenses);
    await categorizerPage.invalidInput();
})
test('validate if Categorization functionality is working with missing properties of Json', async ({page}) => {
    const categorizerPage = new MockExpenses(page);
    await categorizerPage.navigateToPage();
    const expenses:{date?: string;description?: string;amount?: number;}[]= [
  { "date":"2025-05-11","description":"Whole Foods Market","amount":82.14  },
  { "date":"2025-05-10","description":"Uber ride","amount":15.50 },
]
    await categorizerPage.submitJSONInput(expenses);
    await categorizerPage.invalidInput('missing properties');
})

test.describe('Validate categorization for each expense', () => {
    let rawData: any[] = [];

    test.beforeAll(async () => {
        const excelHelper = new ExcelReader('./data/expense-categorizer-sampledata.xlsx', 'Sheet1');
        rawData = await excelHelper.readExcel();
    });

    test('dynamically create tests for each row', async ({ page }) => {
        const categorizerPage = new MockExpenses(page);
        await categorizerPage.navigateToPage();

        const allErrors: string[] = [];

        for (const item of rawData) {
            const expenses: [string, string, number][] = [];
            const date = new Date().toISOString().split('T')[0];
            const description = item.Description.replace('”', '').replace('“', '');
            const amount = item.Amount;
            const category = item['Expected Category'];
            expenses.push([date, description, amount]);

            await test.step(`Validate: ${description}`, async () => {
                try {
                    await categorizerPage.validateCategorization(expenses, category);
                } catch (error: any) {
                    //console.error(`❌ Error in "${description}": ${error.message}`);
                    allErrors.push(`- ${description}: ${error.message}`);
                }
            });
        }

        if (allErrors.length > 0) {
            allErrors.every((error) => { error.includes('') });
            throw new Error(`\n❌ ${allErrors.length} categorization errors:\n` + allErrors.join('\n'));
        }
    });
});
