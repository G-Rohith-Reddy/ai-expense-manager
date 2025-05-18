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
    public async submitInput(rawData: [string, string, number][])
    {
        let formattedData: Transaction[] = rawData.map((item) => {
            return {
                date: item[0],
                description: item[1],
                amount: item[2]
            }
        });
        
        const inputField = await this.getElement(SelectorType.Locator,this.inputField);
        await inputField.fill(JSON.stringify(formattedData,null, 2));
        await this.clickElement(SelectorType.Locator,this.categorizeButton);
    }

    public async submitJSONInput(data:{date?: string;description?: string;amount?: number;}[])
    {
        const inputField = await this.getElement(SelectorType.Locator,this.inputField);
        await inputField.fill(data.toLocaleString());
        await this.clickElement(SelectorType.Locator,this.categorizeButton);
    }
    public async CategorizeData(rawData: [string, string, number][])
    {
        
        await this.submitInput(rawData); 
        const categorizedExpenses = await this.readText(SelectorType.Locator,this.categorizedData)??'';
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
    public async invalidInput(hasMissingProperty?:string)
    {
        let message:String;
        if(hasMissingProperty)
            message="";
        else 
           message = "Invalid JSON: Unexpected token"
        const errorMessage = await this.readText(SelectorType.Locator,this.categorizedData);
        expect(errorMessage).toContain(message);
    }
    public async validateCategorization(rawData: [string, string, number][], expectedCategory: string) 
    {
        const parsedData: Categories[]=await this.CategorizeData(rawData);;
        const mismatches: string[] = [];

        for (const item of parsedData) {
            if (!this.constants.validCategories.includes(item.category)|| item.description === '') {
                mismatches.push(`Invalid category: ${item.category} for description: ${item.description}`);
                continue;
            }

            const isCategoryAccurate = item.category.toLowerCase() === expectedCategory.toLowerCase();

            if (!isCategoryAccurate) {
                mismatches.push(`Categorization failed for description: ${item.description}, expected: ${expectedCategory}, got: ${item.category}`);
            }
        }

        // Fail the test at the end if there are mismatches
        expect(mismatches, mismatches.join('\n')).toHaveLength(0);
    }

}
