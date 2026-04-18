import { CountSummary, grdCol, number0SummaryFormat, number2SummaryFormat, SumSummary } from "@abs-services/app.models";
import { signal } from "@angular/core";
import { GridColumnDataType } from '@infragistics/igniteui-angular/core';
import { pipeArgsNone, pipeArgs0, pipeArgs1, pipeArgs2, pipeArgsDate, pipeArgsDateTime, pipeArgsDateMMDDTime } from '../../app.models';

export const grdColsGLTPARM2 = signal<grdCol[]>([
    {FIELD: 'OPS_YYYYPP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'LEGEND', HEADER: 'Legend', WIDTH: "90", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'PRD_END_DATE', HEADER: 'Period End Date', WIDTH: "100", DATATYPE: GridColumnDataType.Date, EDITABLE: true, COLUMN_FORMAT: pipeArgsDate},
    {FIELD: 'OPS_YYYYMM', HEADER: 'YM', WIDTH: "150", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
  ])
  
export const grdColsARTCUSTX_OPEN = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YPx', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'CNT', HEADER: 'Count', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'QTY', HEADER: 'Qty', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'AMT', HEADER: 'Net Sales', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'MIN_DATE', HEADER: 'Min Date', WIDTH: "120", DATATYPE: GridColumnDataType.Date, EDITABLE: true, COLUMN_FORMAT: pipeArgsDate},
    {FIELD: 'MAX_DATE', HEADER: 'Max Date', WIDTH: "120", DATATYPE: GridColumnDataType.Date, EDITABLE: true, COLUMN_FORMAT: pipeArgsDate},
  ])

export const grdColsARTCUSTX_BOOK = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'CNT', HEADER: 'Count', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'QTY', HEADER: 'Qty', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'AMT', HEADER: 'Net Sales', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'CNT_OPEN', HEADER: '#Open', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'CNT_PICK', HEADER: '#Pick', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'CNT_SHIP', HEADER: '#Ship', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'CNT_CANC', HEADER: '#Canc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
  ])

  export const grdColsARTCUSTX_SHIP = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'CNT', HEADER: 'Count', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'QTY', HEADER: 'Qty', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'AMT', HEADER: 'Net Sales', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GROSS', HEADER: 'Grs Sls', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'DISC', HEADER: 'Disc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'UNPAID', HEADER: 'unpd', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
  ])

  export const grdColsARTCUSTX_RTRN = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'CNT', HEADER: 'Count', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'QTY', HEADER: 'Qty', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'AMT', HEADER: 'Net Sales', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GROSS', HEADER: 'Grs Sls', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'DISC', HEADER: 'Disc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'UNPAID', HEADER: 'unpd', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
  ])

  export const grdColsARTCUSTX_PYMT = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'CNT', HEADER: 'Count', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0},
    {FIELD: 'PYMT', HEADER: 'Pymt', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'APPL', HEADER: 'Appl', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'FEE', HEADER: 'Fee', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'OTHER', HEADER: 'Other', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GL', HEADER: 'GL', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'CBOA', HEADER: 'CBOA', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'TB', HEADER: 'TB', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
  ])

  export const grdColsARTCUSTX_RF = signal<grdCol[]>([
    {FIELD: 'YP', HEADER: 'YP', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'BEG_BAL', HEADER: 'Beg Bal', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GRS_SLS', HEADER: 'Grs Sls', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'DISC', HEADER: 'Disc', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'NET_SLS', HEADER: 'Net Sls', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'SLS_TAX', HEADER: 'STax', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'FRT_CHG', HEADER: 'Frt', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'MISC_CHG', HEADER: 'Misc', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'NET_AMT', HEADER: 'Net Amt', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GRS_PMT', HEADER: 'Cash', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'FEE_AMT', HEADER: 'Fee', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'OTH_DED', HEADER: 'Other', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'NET_PMT', HEADER: 'Appl', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'CGS', HEADER: 'CGS', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'GRS_PRF', HEADER: 'Grs Prf', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'NET_PRF', HEADER: 'Net Prf', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'END_BAL', HEADER: 'End Bal', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},
    {FIELD: 'OOBAL', HEADER: 'OOBAL', WIDTH: "120", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2},

  ])

  export const grdColsSOTORDR1 = signal<grdCol[]>([
    {FIELD: 'ORDR_NO', HEADER: 'Order No', WIDTH: "130", DATATYPE: GridColumnDataType.String, EDITABLE: true, 
      COLUMN_FORMAT: pipeArgs2, 
      COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_DATE', HEADER: 'Order Date', WIDTH: "130", DATATYPE: GridColumnDataType.Date, EDITABLE: true, 
      COLUMN_FORMAT: pipeArgsDate, 
      },
    {FIELD: 'ORDR_GRS_AMT', HEADER: '$Gross', WIDTH: "160", DATATYPE: GridColumnDataType.Number, EDITABLE: true, 
      COLUMN_FORMAT: pipeArgs2, 
      COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},

    {FIELD: 'ORDR_DSC_AMT', HEADER: '$Disc', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},
    {FIELD: 'ORDR_AMT', HEADER: '$Net Sales', WIDTH: "160", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},   

    {FIELD: 'ORDR_CUST_PO', HEADER: 'Cust PO', WIDTH: "120", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'SHIP_VIA_CODE', HEADER: 'SVia', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'INIT_DATE', HEADER: 'Order Recd', WIDTH: "120", DATATYPE: GridColumnDataType.DateTime, EDITABLE: true, COLUMN_FORMAT: pipeArgsDateMMDDTime},
    {FIELD: 'ORDR_SOURCE', HEADER: 'Src', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'FRT_TERMS', HEADER: 'Frt', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},    
    {FIELD: 'ORDR_STATUS', HEADER: 'Status', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_HOLD', HEADER: 'Hold', WIDTH: "70", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_NO_WEB', HEADER: 'Ordr#Web', WIDTH: "120", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_BUYER_NAME', HEADER: 'Buyer', WIDTH: "200", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_BUYER_EMAIL', HEADER: 'email', WIDTH: "200", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_WEB_IND', HEADER: 'WebInd', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},
    {FIELD: 'ORDR_WEB_ID', HEADER: 'Web ID', WIDTH: "120", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone},  
    {FIELD: 'ORDR_QTY', HEADER: '#Ordr', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0, COLUMN_SUMMARY: SumSummary},

    {FIELD: 'ORDR_QTY_OPEN', HEADER: '#Open', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_PICK', HEADER: '#Pick', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_SHIP', HEADER: '#Ship', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_CANC', HEADER: '#Canc', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs0, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_AMT_OPEN', HEADER: '$Open', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},
    {FIELD: 'ORDR_AMT_PICK', HEADER: '$Pick', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},
    {FIELD: 'ORDR_AMT_SHIP', HEADER: '$Ship', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},
    {FIELD: 'ORDR_AMT_CANC', HEADER: '$Canc', WIDTH: "150", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number2SummaryFormat},
  ])                          

    export const grdColsSOTORDR2 = signal<grdCol[]>([
    {FIELD: 'ORDR_LNO', HEADER: 'Ln', WIDTH: "70", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'STYLE_CODE', HEADER: 'Style', WIDTH: "120", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'STYLE_DESC', HEADER: 'Description', WIDTH: "150", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'COLOR_CODE', HEADER: 'Color', WIDTH: "90", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'COLOR_DESC', HEADER: 'Clr Desc', WIDTH: "100", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},

    {FIELD: 'ORDR_RETAIL_PRICE', HEADER: 'Grs Prc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_UNIT_DISC', HEADER: 'Disc', WIDTH: "80", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_UNIT_PRICE', HEADER: 'Net Prc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgs2, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    
    {FIELD: 'ORDR_QTY', HEADER: 'Qty', WIDTH: "80", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: SumSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_OPEN', HEADER: '#Open', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_PICK', HEADER: '#Pick', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_SHIP', HEADER: '#Ship', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_QTY_CANC', HEADER: '#Canc', WIDTH: "90", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'ORDR_AMT2()', HEADER: '$Net Sales', WIDTH: "100", DATATYPE: GridColumnDataType.Number, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
    {FIELD: 'CUST_UPC', HEADER: 'UPC', WIDTH: "160", DATATYPE: GridColumnDataType.String, EDITABLE: true, COLUMN_FORMAT: pipeArgsNone, COLUMN_SUMMARY: CountSummary, COLUMN_SUMMARY_FORMAT: number0SummaryFormat},
  ])
  
