import test from '@playwright/test';
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
    const expences:[string,string,number][] = [
        ["2025-05-11", "Whole Foods Market", 82.14],
        ["2025-05-10", "Uber ride", 15.50],
        ["2025-05-12", "CVS Pharmacy", 25.00],
        ["2025-05-10", "Netflix subscription", 13.99]
    ];
    await categorizerPage.validateCategories(expences);
})


test.describe.only('Validate the accuracy of categorization',async ()=>
{
    // const categorizerPage = new MockExpenses(page);
    const filePath = './data/expense-categorizer-sampledata.xlsx';
    // await categorizerPage.navigateToPage();
    const excelHelper = new ExcelReader(filePath,'Sheet1');
    const rawData = excelHelper.readExcel();
    console.log(rawData);
    for (const item of rawData) {
        const date = new Date().toISOString().split('T')[0];
        const description = item[2];
        const amount = item[3];
        const category:string = item[4];
        test(`Validate ${description} categorization`, async ({page}) => {
            const categorizerPage = new MockExpenses(page);
            await categorizerPage.navigateToPage();
            await categorizerPage.validateCategorization([[date,description,amount]],category);
        })
    }
})