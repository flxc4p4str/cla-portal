import { computed } from '@angular/core';

export class GLTPARM2 {
    OPS_YYYYPP!: string;
    PRD_END_DATE!: Date;
    LEGEND!: string;
    OPS_YYYYMM!: string;
}

export class ARTCUSTX_RF {
    YP!: string;
    BEG_BAL!: number;
    GRS_SLS!: number;
    DISC!: number;
    NET_SLS!: number;
    SLS_TAX!: number;
    FRT_CHG!: number;
    MISC_CHG!: number;
    NET_AMT!: number;
    GRS_PMT!: number;
    FEE_AMT!: number;
    OTH_DED!: number;
    NET_PMT!: number;
    CGS!: number;
    GRS_PRF!: number;
    NET_PRF!: number;
    END_BAL!: number;
    OOBAL!: number;
}

export class ARTCUSTX {
    CUST_CODE!: string;
    CUST_NAME!: string;
    OPEN_CNT!: number;
    OPEN_QTY!: number;
    OPEN_AMT!: number;
    OPEN_MIN_DATE!: Date;
    OPEN_MAX_DATE!: Date;
    BOOK_CNT!: number;
    BOOK_QTY!: number;
    BOOK_AMT!: number;
    BOOK_MIN_DATE!: Date;
    BOOK_MAX_DATE!: Date;
    BOOK_CNT_OPEN!: number;
    BOOK_CNT_PICK!: number;
    BOOK_CNT_SHIP!: number;
    BOOK_CNT_CANC!: number;
    SHIP_CNT!: number;
    SHIP_QTY!: number;
    SHIP_AMT!: number;
    SHIP_GRS!: number;
    SHIP_DSC!: number;
    RTRN_CNT!: number;
    RTRN_QTY!: number;
    RTRN_AMT!: number;
    AR_OPEN_CNT!: number;
    AR_OPEN_AMT!: number;
    AR_OVER_CNT!: number;
    AR_OVER_AMT!: number;
}


export class ARTCUSTX_OPEN {
    TYPE!: string;
    YP!: string;
    CNT!: number;
    QTY!: number;
    AMT!: number;
    MIN_DATE!: Date;
    MAX_DATE!: Date;
}


export class ARTCUSTX_BOOK {
    TYPE!: string;
    YP!: string;
    CNT!: number;
    QTY!: number;
    AMT!: number;
    CNT_OPEN!: number;
    CNT_PICK!: number;
    CNT_SHIP!: number;
    CNT_CANC!: number;
}


export class ARTCUSTX_SHIP {
    TYPE!: string;
    YP!: string;
    CNT!: number;
    QTY!: number;
    AMT!: number;
    GROSS!: number;
    DISC!: number;
    UNPAID!: number;
}


export class ARTCUSTX_RTRN {
    TYPE!: string;
    YP!: string;
    CNT!: number;
    QTY!: number;
    AMT!: number;
    GROSS!: number;
    DISC!: number;
    UNPAID!: number;
}


export class ARTCUSTX_PYMT {
    TYPE!: string;
    YP!: string;
    CNT!: number;
    PYMT!: number;
    APPL!: number;
    FEE!: number;
    OTHER!: number;
    GL!: number;
    CBOA!: number;
    TB!: number;
}

export class SOTORDR1 {
    ORDR_NO!: string;
    ORDR_DATE!: Date;
    ORDR_CUST_PO!: string;
    SHIP_VIA_CODE!: string;
    INIT_DATE!: Date;
    LAST_DATE!: Date;    
    ORDR_SOURCE!: string;
    FRT_TERMS!: string;
    ORDR_DATE_BOOKED!: Date;    
    ORDR_YYYYPP_BOOKED!: string;  
    ORDR_STATUS!: string; 
    ORDR_HOLD!: string; 
    ORDR_NO_WEB!: string; 
    ECOM_CODE!: string; 
    ORDR_BUYER_NAME!: string; 
    ORDR_BUYER_EMAIL!: string;          
    ORDR_WEB_IND!: string;          
    ORDR_WEB_ID!: string;          
    ORDR_QTY!: number;
    ORDR_QTY_OPEN!: number;
    ORDR_QTY_PICK!: number;
    ORDR_QTY_SHIP!: number;
    ORDR_QTY_CANC!: number;
    ORDR_AMT!: number;
    ORDR_AMT_OPEN!: number;    
    ORDR_AMT_PICK!: number;
    ORDR_AMT_SHIP!: number;
    ORDR_AMT_CANC!: number;
    ORDR_GRS_AMT!: number;   
    ORDR_GRS_AMT_OPEN!: number;    
    ORDR_GRS_AMT_PICK!: number;
    ORDR_GRS_AMT_SHIP!: number;
    ORDR_GRS_AMT_CANC!: number;
    ORDR_DSC_AMT!: number;   
    ORDR_DSC_AMT_OPEN!: number;
    ORDR_DSC_AMT_PICK!: number;
    ORDR_DSC_AMT_SHIP!: number;
    ORDR_DSC_AMT_CANC!: number;       
}

export class SOTORDR2 {
    ORDR_NO!: string;
    ORDR_LNO!: number;
    STYLE_CODE!: string;
    COLOR_CODE!: string;
    STYLE_DESC!: string; 
    ORDR_EXTD_COST!: number;
    ORDR_UNIT_PRICE!: number;
    ORDR_QTY!: number;
    ORDR_QTY_OPEN!: number;
    ORDR_QTY_PICK!: number;
    ORDR_QTY_SHIP!: number;
    ORDR_QTY_CANC!: number;
    ORDR_STATUS!: string;     
    CUST_UPC!: string;        
    STYLE_PRICE!: number;
    STYLE_RETAIL!: number;
    ORDR_RETAIL_PRICE!: number;
    ORDR_FULLFILL_FEE!: number;
    ORDR_SELLER_FEE!: number;
    PARTNER_LN_ID!: string;        
    COLOR_DESC!: string;        
    ORDR_UNIT_DISC!: number;
    // ORDR_AMT!: number;
    // ORDR_AMT2 = computed(() => {100});
    ORDR_AMT2 = computed(() => {100 + this.ORDR_QTY * this.ORDR_UNIT_PRICE});
    // ORDR_AMT2!: number;
    ORDR_AMT_OPEN!: number;    
    ORDR_AMT_PICK!: number;
    ORDR_AMT_SHIP!: number;
    ORDR_AMT_CANC!: number;
    ORDR_DSC!: number;   
    ORDR_DSC_OPEN!: number;
    ORDR_DSC_PICK!: number;
    ORDR_DSC_SHIP!: number;
    ORDR_DSC_CANC!: number;    
    ORDR_GRS!: number;   
    ORDR_GRS_OPEN!: number;    
    ORDR_GRS_PICK!: number;
    ORDR_GRS_SHIP!: number;
    ORDR_GRS_CANC!: number;   
}

export class ARTCUSTX_ALL {
    OPENs: ARTCUSTX_OPEN[] = [];
    BOOKs: ARTCUSTX_BOOK[] = [];
    SHIPs: ARTCUSTX_SHIP[] = [];
    RTRNs: ARTCUSTX_RTRN[] = [];
    PYMTs: ARTCUSTX_PYMT[] = [];
    GLTPARM2s: GLTPARM2[] = [];
}
