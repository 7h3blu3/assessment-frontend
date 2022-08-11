import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({providedIn: "root"})
export class ExcelService {

    exportExcelFile(fileName: string, json: any[]): void
    {
      /* pass here the table id */
      const workBook= XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(json);

      /* generate workbook and add the worksheet */
      XLSX.utils.book_append_sheet(workBook, workSheet, 'data');
      XLSX.writeFile(workBook, fileName + " - " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ".xlsx");
   
      
    }
}