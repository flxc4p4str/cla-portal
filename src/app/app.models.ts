import { DatePipe, DecimalPipe } from '@angular/common';
import { IgxDateSummaryOperand, IgxNumberSummaryOperand, IgxSummaryOperand } from '@infragistics/igniteui-angular';
import { GridColumnDataType, IFieldPipeArgs, IgxSummaryResult } from '@infragistics/igniteui-angular/core';


  export const pipeArgsNone: IFieldPipeArgs = {}
  export const pipeArgs2: IFieldPipeArgs = { digitsInfo: "1.2-2" }
  export const pipeArgs1: IFieldPipeArgs = { digitsInfo: "1.1-1" }
  export const pipeArgs0: IFieldPipeArgs = { digitsInfo: "1.0-0" }
  export const pipeArgsDateTime: IFieldPipeArgs = { format: 'MM/dd/yyyy HH:mm' }
  export const pipeArgsDateMMDDTime: IFieldPipeArgs = { format: 'MM/dd HH:mm' }
  export const pipeArgsDate: IFieldPipeArgs = { format: 'MM/dd/yyyy' }
  

  export class SumSummary extends IgxNumberSummaryOperand {
    // public operate(data?: any[], allData = [], fieldName = ''): IgxSummaryResult[] {
    override operate(data?: any[], allData = [], fieldName = ''): IgxSummaryResult[] {
        const result = [];
        data = data || []

        let SUM = IgxNumberSummaryOperand.sum(data);
        SUM = Math.round(SUM);
        // SUM =  pipe.transform(result, 'number: 1.0-0') || '';

        result.push({
            key: 'SUM',
            label: '',
            summaryResult: SUM,
            defaultFormatting: true
        });
        // console.log('in SumSummary')
        return result;
    }
}
export class CountSummary extends IgxNumberSummaryOperand {
    // public operate(data?: any[], allData = [], fieldName = ''): IgxSummaryResult[] {
    override operate(data?: any[], allData = [], fieldName = ''): IgxSummaryResult[] {
        const result = [];
        data = data || []
        result.push({
            key: 'SUM',
            label: '#',
            summaryResult: data?.length
        });
        return result;
    }
}

  export function number0SummaryFormat(summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand): any {
    const result = summary.summaryResult;
    // console.log('number0SummaryFormat', {summary, summaryOperand})
    if (summaryOperand instanceof IgxNumberSummaryOperand && summary.key !== 'count'
        && result !== null && result !== undefined) {
        const pipe = new DecimalPipe('en-US');
        // console.log({result})
        return pipe.transform(result, '1.0-0') || '';
    }
    return result;
}
export function number2SummaryFormat(summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand): any {
    const result = summary.summaryResult;
    let instanceOf = summaryOperand instanceof IgxNumberSummaryOperand
    // console.log('number2SummaryFormat', {summary, summaryOperand, instanceOf})
    summary.label = '$' // doesn't appear until you scroll the grid to the right
    // const pipe = new DecimalPipe('en-US');
    // console.log({result})
    // return pipe.transform(result, '1.2-2') || '';

    if (summaryOperand instanceof IgxNumberSummaryOperand && summary.key !== 'count'
        && result !== null && result !== undefined) {
        const pipe = new DecimalPipe('en-US');
        // console.log({result})
        return pipe.transform(result, '1.2-2') || '';
    }
    // console.log({result})
    return result;
}  
export function  dateSummaryFormat(summary: IgxSummaryResult, summaryOperand: IgxSummaryOperand): string {
    const result = summary.summaryResult;
    if (summaryOperand instanceof IgxDateSummaryOperand && summary.key !== 'count'
        && result !== null && result !== undefined) {
        const pipe = new DatePipe('en-US');
        return pipe.transform(result, 'MMM YYYY') || '';
    }
    return result;
}


export class TestClass {
    key!: string;
    value!: number;
}

export class grdCol {
    FIELD!: string;
    HEADER!: string;
    WIDTH!: string;
    DATATYPE!: GridColumnDataType;
    EDITABLE!: boolean;
    COLUMN_FORMAT!: IFieldPipeArgs;
    COLUMN_SUMMARY?: any;
    COLUMN_SUMMARY_FORMAT?: any;
}

export class ASTGRID1 {
    FIELD!: string;
    HEADER!: string;
    WIDTH!: string;
    DATATYPE!: GridColumnDataType;
    EDITABLE!: boolean;
    COLUMN_FORMAT!: IFieldPipeArgs;
    COLUMN_SUMMARY?: any;
    COLUMN_SUMMARY_FORMAT?: any;
}

export interface ASFGRID1 {
    FORM_NAME: string;
    GRID_NAME: string;
    // ASTGRID1s?: ASTGRID1[];
}

export const ASFGRID1_initializer: ASFGRID1 = {
    FORM_NAME: 'G',
    GRID_NAME: 'a',
    // ASTGRID1s: []
}

export interface HttpParms {
  TABLE_NAME?: HttpParm;
}

export interface HttpParm {
  body?: httpBody;
  url?: string;
  refresh_token?: number;
}

export interface httpBody {
  TABLE_NAME: string;
  SCHEMA_NAME: string;
  where_clause: string;
  order_by: string;
}
