import * as XLSX from 'xlsx';

export class ExcelReader
{
    private filePath: string;
    private sheetName: string;
    private data: any[];
    constructor(filePath: string, sheetName: string)
    {
        this.filePath = filePath;
        this.sheetName = sheetName;
        this.data = [];
    }
    
    public async readExcel(): Promise<any[]>
    {
        const workbook = XLSX.readFile(this.filePath);
        const sheet = workbook.Sheets[this.sheetName];
        this.data = XLSX.utils.sheet_to_json(sheet,{ defval: '' });
        return this.data;
    }
}