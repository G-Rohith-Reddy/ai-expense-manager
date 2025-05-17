import { expect } from "@playwright/test";
import { BasePage, SelectorType } from "./basepage";
import { Categories, Transaction } from '../types/types';

export class MockExpenses extends BasePage
{
    constructor(page: any)
    {
        super(page);
    }

    private constants = {
        header:"Mock AI Expense Categorizer",
        description:'Paste your expenses JSON below and click Categorize to see results:',
        validCategories:[' Groceries','Health','Shop','Travel','Entertainment','Miscellaneous']
    }

    private pageURL = "file:///C:/Users/Rohit/Downloads/mock_expense_categorizer.html"
    private pageTitle = "h1"
    private pageDescription = "p"
    private inputField = "#input"
    private categorizeButton='button'
    private categorizedData = "#output"
    
    public async navigateToPage()
    {
        await this.gotoPage(this.pageURL)
    }

    public async validateHeaders()
    {
        await expect(await this.readText(SelectorType.Locator,this.pageTitle)).toEqual(this.constants.header);
        await expect(await this.readText(SelectorType.Locator,this.pageDescription)).toEqual(this.constants.description);
    }
    public async validateInputField()
    {
        const inputField = await this.getElement(SelectorType.Locator,this.inputField);
        await expect(inputField).toBeVisible();
        await expect(inputField).toHaveAttribute('placeholder')
    }
    public async CategorizeData(rawData: [string, string, number][])
    {
        const formattedData: Transaction[] = rawData.map((item) => {
            return {
                date: item[0],
                description: item[1],
                amount: item[2]
            }
        });
        const inputField = await this.getElement(SelectorType.Locator,this.inputField);
        await inputField.fill(JSON.stringify(formattedData,null, 2));
        await this.clickElement(SelectorType.Locator,this.categorizeButton);
        const categorizedExpenses = await this.readText(SelectorType.Locator,this.categorizedData)??'';
        // if(!categorizedExpenses)
        // {
        //     throw new Error("Categorization failed");
        // }
        try {
           return JSON.parse(categorizedExpenses).categorized
        }
        catch (error) {
            throw new Error("Categorization failed, as the input is invalid");
        }
    }
    public async validateCategories(rawData: [string, string, number][])
    {
        const parsedData: Categories[] = await this.CategorizeData(rawData); 
        for (const item of parsedData) {
            expect(item).toHaveProperty('date');
            expect(item).toHaveProperty('description');
            expect(item).toHaveProperty('amount');
            expect(item).toHaveProperty('category');
        }
    }
    public async validateCategorization(rawData: [string, string, number][],expectedCategory:string)
    {

        const parsedData: Categories[] = await this.CategorizeData(rawData);
        console.log(parsedData); 
        for (const item of parsedData) {
            let isCategoryAccurate:boolean;
            if(!this.constants.validCategories.includes(item.category))
                throw new Error(`Invalid category: ${item.category} for description: ${item.description}`);
            else
            {
                isCategoryAccurate = item.category.toLowerCase()===expectedCategory.toLowerCase();
            }
            try {
                expect(isCategoryAccurate).toBeTruthy();
            }
            catch (error) {
                throw new Error(`Categorization failed for description: ${item.description}, expected category: ${expectedCategory}, actual category: ${item.category}`);
            }
        }
    }
}
