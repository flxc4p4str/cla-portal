import { AfterViewInit, Component, effect, inject, Inject, Injector, OnInit, signal, WritableSignal } from '@angular/core';
import { IgxGridModule } from '@infragistics/igniteui-angular/grids/grid';
import { HttpParm, TestClass } from '../../app.models';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { GridSelectionMode, IRowSelectionEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IgxButtonDirective, IgxIconModule, IgxRippleDirective, IgxTabsModule, ITabsSelectedIndexChangingEventArgs } from '@infragistics/igniteui-angular';
import { DataService } from '../../data.service';
import { environment } from '@abs-environments/environment';
import { ARTCUSTX_BOOK, ARTCUSTX_OPEN, ARTCUSTX_PYMT, ARTCUSTX_RF, ARTCUSTX_RTRN, ARTCUSTX_SHIP, SOTORDR1, SOTORDR2, GLTPARM2, ARTCUSTX_ALL, ARTCUSTX } from './summary.models';
import { grdColsARTCUSTX_OPEN, grdColsARTCUSTX_BOOK, grdColsARTCUSTX_SHIP, grdColsARTCUSTX_RTRN, grdColsSOTORDR1, grdColsSOTORDR2, grdColsARTCUSTX_RF, grdColsARTCUSTX_PYMT } from './summary.grids';


// your mission is to change the http from JSON to 
// 1) RxJs
// 2) httpResource

// https://absapi.absolution1.com/api/VAN/EC/Get_Orders/BOOK/202601
// https://absapi.absolution1.com/api/VAN/EC/Get_Order_Details/0008021939

@Component({
  selector: 'app-summary',
  imports: [IgxGridModule, IgxTabsModule, IgxIconModule, IgxButtonDirective, IgxRippleDirective ],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary implements OnInit, AfterViewInit {

  dst: any = {};
  public dataService: DataService;

  // terniary
  // initializing: boolean = environment.production ? false : true;
  initializing: boolean = true;

  CYP = signal<string>("202601")

  // why do we need to redeclare these here instead of just importing them from the models file?
  environment = environment;
  grdColsARTCUSTX_OPEN = grdColsARTCUSTX_OPEN
  grdColsARTCUSTX_BOOK = grdColsARTCUSTX_BOOK
  grdColsARTCUSTX_SHIP = grdColsARTCUSTX_SHIP
  grdColsARTCUSTX_RTRN = grdColsARTCUSTX_RTRN
  grdColsSOTORDR1 = grdColsSOTORDR1
  grdColsSOTORDR2 = grdColsSOTORDR2
  grdColsARTCUSTX_RF = grdColsARTCUSTX_RF
  grdColsARTCUSTX_PYMT = grdColsARTCUSTX_PYMT

  ABS_TABLE_NAME: string = ""

  ARTCUSTX_OPEN = signal<ARTCUSTX_OPEN[]>([])
  ARTCUSTX_BOOK = signal<ARTCUSTX_BOOK[]>([])
  ARTCUSTX_SHIP = signal<ARTCUSTX_SHIP[]>([])
  ARTCUSTX_RTRN = signal<ARTCUSTX_RTRN[]>([])
  ARTCUSTX_PYMT = signal<ARTCUSTX_PYMT[]>([])
  ARTCUSTX_RF = signal<ARTCUSTX_RF[]>([])

  GLTPARM2 = signal<GLTPARM2[]>([])
  SOTORDR1 = signal<SOTORDR1[]>([])
  SOTORDR2 = signal<SOTORDR2[]>([])
  SOTORDR2_ORDR = signal<SOTORDR2[]>([])

  selectedTab: number = 0;

  public selectionMode: GridSelectionMode = 'single'; // 'multiple';
  public selectionModes: any[] = [];
  public hideRowSelectors = true; // false;
  public selectedRows: string[] = []; // TRY PLACING AN ORDR_NO HERE
  public selectedRowsCount: any;
  public selectedRowIndex: any;
  public selectedRowObjects: any[] = []

  testClass = signal<TestClass>({key:'A', value: 0})

  grdHeaderStyles = {
    background: 'var(--app-surface-soft)',
    borderColor: 'var(--surface-border)',
    color: (column: any) => (column.field === 'ORDR_NO') ? 'var(--app-brand-strong)' : 'var(--text-primary)'
  }

    grdSOTORDR1_title: string = '';
    grdSOTORDR1_signal = signal('')
    grdSOTORDR2_title: string = '';
    grdSOTORDR2_signal = signal('')

    

    public statusMap: { [key: string]: string } = {
      'O': 'Open',
      'P': 'Shipped',
      'F': 'Shipped',
      'C': 'Canceled',
    };

    public ypMap: { [key: string]: string } = {
      '000000': "Open",
      '202601': "Jan'26",
      '202512': "Dec'25",
      '202511': "Nov'25",
    };

  public httpParms: { [ key: string ] : WritableSignal<HttpParm>} = {}

  dataSignalObject = signal<{firstname: string, lastname: string}>({ firstname: 'John', lastname: 'Doe' } )
  // dataSignal = signal<string>('0'); 
  // data = httpResource<ARTCUSTX_ALL>(() => `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary/?value=${this.dataSignal()}`, { injector: inject(Injector) })
  // data = httpResource<ARTCUSTX_ALL>(() => `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary`, { injector: inject(Injector) })
  // dataResultSignal = signal<ARTCUSTX_ALL>({} as ARTCUSTX_ALL)

  data = httpResource<ARTCUSTX_ALL>(() => {
    // console.log('httpResource function called with dataSignal value: ' + this.dataSignal());
    let obj = this.dataSignalObject();
    // console.log('httpResource function called with dataSignalObject value: ' + JSON.stringify(this.dataSignalObject()));
    console.log('httpResource function called')
    if (this.initializing) {
      return undefined; // this prevents the httpResource from firing on initialization, but allows it to fire on subsequent calls to refresh2 which updates the dataSignal. Note that the httpResource does not fire when dataSignal is updated if we do not include this check for initializing, which is why we need to set dataSignal to '0' initially and then update it in refresh2. This is a bit of a hack, but it works. A better solution would be to have a separate signal that tracks whether we are initializing or not, and use that signal in the httpResource instead of dataSignal. That way we could avoid using a hacky value like '0' in dataSignal.
    }
    return {
      // url: `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary/?value=${this.dataSignal()}`,
      url: `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary/`,   
      // method: 'GET', // change this to POST and add body if needed
      // // body: { value: this.dataSignal() }
      method: 'POST', // change this to POST and add body if needed
      body: { TEST: 'HI MOM' }
    };
  }, { injector: inject(Injector) }
)


      // private readonly x =  httpResource<httpResp>(
      //     () => {
  
      //       let body = this.body // note that using a string does not trigger the resource when the year signal is set
      //       let rt = this.refreshToken(); // this is the triggering signal
      //       console.log(this.refreshToken())
      //       if (this.initializing) {
      //         return undefined;
      //       } 
            
      //       return {
      //         url: environment.urlBaseABS + 'AS/GetData',
      //         method: 'POST',
      //         body: body,
      //       };
      //     },
      //     { injector: this.injector }
      //   );

  constructor(private http: HttpClient, @Inject(Injector) private injector: Injector) {
    
    this.dataService =inject(DataService);
    
    effect(() => { 
      console.log('INSIDE 2nd effect') 
      let result = this.dataSignalObject();
    } );


    effect(() => {


      const result = this.data.value();
      // const result = this.dataResultSignal();


      // if (Array.isArray(rows)) {    
      //   this.GLTPARM2.set([...rows]);
      //   console.log('INSIDE effect', this.GLTPARM2())
      // }

      console.log('INSIDE effect', result)

      if (result && !this.initializing) {

        console.log('result from httpResource', result)

        this.ARTCUSTX_BOOK.update(() => result.BOOKs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_OPEN.update(() => result.OPENs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_SHIP.update(() => result.SHIPs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_RTRN.update(() => result.RTRNs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        // this.ARTCUSTX_PYMT.update(() => result.PYMTs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.GLTPARM2.update(() => result.GLTPARM2s); 

        this.CYP.update(() => this.GLTPARM2()[2].OPS_YYYYPP)
        console.log(this.CYP())
        // "2026-02 (Feb'26)".match(/\((.*?)\)/)?.[1]
        console.log(this.GLTPARM2()[2].OPS_YYYYPP)

        this.ypMap = {
          ['000000']: 'Open',
          [this.GLTPARM2()[0].OPS_YYYYPP]: this.GLTPARM2()[0].LEGEND.substring(9, 15),
          [this.GLTPARM2()[1].OPS_YYYYPP]: this.GLTPARM2()[1].LEGEND.substring(9, 15),
          [this.GLTPARM2()[2].OPS_YYYYPP]: this.GLTPARM2()[2].LEGEND.substring(9, 15),
        }       
      }
    });

  }    

  ngOnInit() {
    // this.grdColsSOTORDR2.set([
    // {FIELD: 'ORDR_LNO', HEADER: 'Ln', WIDTH: 70, DATATYPE: 'number', EDITABLE: true}
    // ])
  }

  async ngAfterViewInit() {
    // console.log('before')
    this.readJsonFile();
    // console.log('after')
    // this.refresh2() // controlled Fill_Records, used if we configure httpResource to not fire on initialization (see data signal and initializing boolean)

  }

  async getDataAfterClick() {
    console.log('retrieving GLTPARM2')
    await this.getTABLE_NAME('GLTPARM2')
    console.log('retrieved GLTPARM2', this.dst)
  }

  refresh(TYPE: string) {
    this.initializing = false;

    console.log('Now Refreshing data using RxJs - for TYPE: ' + TYPE)
    //    this.http.get<ARTCUSTX_BOOK[]>('https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary')'
    this.http.get<ARTCUSTX_ALL>('https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary')
      .pipe(
   
      )
      .subscribe(result => {
        console.log('completed refresh', result)        
        this.ARTCUSTX_BOOK.update(() => result.BOOKs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_OPEN.update(() => result.OPENs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_SHIP.update(() => result.SHIPs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.ARTCUSTX_RTRN.update(() => result.RTRNs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        // this.ARTCUSTX_PYMT.update(() => result.PYMTs.sort((a, b) => Number(b.YP) - Number(a.YP)));
        this.GLTPARM2.update(() => result.GLTPARM2s); 

        this.CYP.update(() => this.GLTPARM2()[2].OPS_YYYYPP)
        console.log(this.CYP())
        // "2026-02 (Feb'26)".match(/\((.*?)\)/)?.[1]
        console.log(this.GLTPARM2()[2].OPS_YYYYPP)

        this.ypMap = {

          [this.GLTPARM2()[0].OPS_YYYYPP]: this.GLTPARM2()[0].LEGEND.substring(9, 15),
          [this.GLTPARM2()[1].OPS_YYYYPP]: this.GLTPARM2()[1].LEGEND.substring(9, 15),
          [this.GLTPARM2()[2].OPS_YYYYPP]: this.GLTPARM2()[2].LEGEND.substring(9, 15),
        }
      });
  }

  refresh2() {
    this.initializing = false;

    console.log('Now Refreshing data using httpResource')

    // let data = httpResource<ARTCUSTX_ALL>(() => `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary/?value=${this.dataSignal()}`, { injector: inject(Injector) })
    // let data = httpResource<ARTCUSTX_ALL>(() => `https://absapi.absolution1.com/api/VAN/EC/Get_eComm_Summary/?value=${this.dataSignal()}`, { injector: this.injector })

    // this.dataSignal.set(this.dataSignal()+"1"); // successive calls do not cause successive http.gets
    // this.dataSignal.update((value) => value + "1") // this does trigger successive http.get calls, but the value becomes "011", "0111", etc. which is not ideal;
    
    console.log(this.dataSignalObject().firstname)
    // this.dataSignalObject.set ( {...this.dataSignalObject(), firstname: "Jane", lastname: "Smith" })
    this.dataSignalObject.set ( {...this.dataSignalObject()})
    // this.dataSignalObject().firstname = "Jane";
    // this.dataSignalObject().firstname = "Jane";

    console.log(this.dataSignalObject().firstname)

    // // let newObject = this.dataSignalObject()
    
    // // let newObject = { ...this.dataSignalObject() }

    // // let newObject = Object.assign(this.dataSignalObject())
    // let newObject = Object.assign({}, this.dataSignalObject())

    // newObject.firstname = "Jane";

    // console.log('before')
    // console.log('newObject: ' + JSON.stringify(newObject)); 
    // console.log('oldObject: ' + JSON.stringify(this.dataSignalObject())); 

    // this.dataSignalObject.set(newObject)
    // // this.dataSignalObject.set(this.dataSignalObject())
 
    // console.log('after')
    // console.log('newObject: ' + JSON.stringify(newObject)); 
    // console.log('oldObject: ' + JSON.stringify(this.dataSignalObject())); 



    // this.dataSignalObject.update((value) => ({...value, firstname: "Jane"})) // this triggers successive http.get calls, and the value remains an object with firstname and lastname properties, which is ideal.  

        
    console.log('data from httpResource', this.data);
    // console.log('data from httpResource', data);
  }

  test1() {
    
    this.testClass().value +=1;

    //   SOTORDR2 = signal<SOTORDR2[]>([])
    // this.SOTORDR2()[0]["ORDR_QTY"].set(-2)
    // this.SOTORDR2()[0]["ORDR_QTY"] += -2
    this.SOTORDR2_ORDR()[0]["ORDR_QTY"] += -2
    let SOTORDR0rec = this.SOTORDR2_ORDR()[0]
    SOTORDR0rec["ORDR_QTY"] += -2

    let newArray = [
       ...this.SOTORDR2(),
      SOTORDR0rec
    ]
        console.log({SOTORDR0rec, newArraySOTORDR2: this.SOTORDR2()})
    // this.SOTORDR2_ORDR().set(
    //   ...this.SOTORDR2()
    // ) 

      console.log('test1', this.SOTORDR2()[0])
  }
      
  readJsonFile() {

    console.log('result from JSON files')

    this.http.get<GLTPARM2[]>('assets/data/GLTPARM2.json')
      .pipe(
        // Map the array of objects to an array of strings (e.g., the 'name' property)
        // map(data => data.map(item => item.name)) 
        // map((x) => {x.PRD_END_DATE = ExcelDateToJSDate(x.PRD_END_DATE)}
      )
      .subscribe(result => {
        // console.log('1 completed GLTPARM2')

        for (let i = 0; i < result.length; i++) {
          // let x:GLTPARM2 = this.xx[i] // same as using result
          let x:GLTPARM2 = result[i]
          // let n:number = Number(x.PRD_END_DATE.toString()); // works
          let n:number = +(x.PRD_END_DATE.toString()); // works
          // let n:number = x.PRD_END_DATE; // Type 'Date' is not assignable to type 'number'.
          x.PRD_END_DATE = ExcelDateToJSDate(n)
        }

        this.GLTPARM2.set(result);
      });
     

    // this.http.get<ARTCUSTX_OPEN[]>('assets/data/ARTCUSTX_OPEN.json')
    //   .pipe(
   
    //   )
    //   .subscribe(result => {
    //     console.log('2A completed ARTCUSTX_OPEN')   
                
    //     for (let i = 0; i < result.length; i++) {
    //       let x:ARTCUSTX_OPEN = result[i]
    //       let n:number = +(x.MIN_DATE.toString());
    //       x.MIN_DATE = ExcelDateToJSDate(n)
    //       let n2:number = +(x.MAX_DATE.toString());
    //       x.MAX_DATE = ExcelDateToJSDate(n2)
    //     }

    //     this.ARTCUSTX_OPEN.set(result);
    //     // console.log(this.ARTCUSTX_OPEN()); 
    //   });

    // console.log('2B started ARTCUSTX_BOOK')
    // this.http.get<ARTCUSTX_BOOK[]>('assets/data/ARTCUSTX_BOOK.json')
    //   .pipe(
   
    //   )
    //   .subscribe(result => {
    //     // console.log('2B completed ARTCUSTX_BOOK')        
    //     this.ARTCUSTX_BOOK.set(result);
    //     // this.ARTCUSTX_BOOK.update(() =>result);
    //     // console.log(this.ARTCUSTX_BOOK()); 
    //   });
      
    // // console.log('2C started ARTCUSTX_SHIP')
    // this.http.get<ARTCUSTX_SHIP[]>('assets/data/ARTCUSTX_SHIP.json')
    //   .pipe(
   
    //   )
    //   .subscribe(result => {
    //     // // console.log ('2C completed ARTCUSTX_SHIP')        
    //     this.ARTCUSTX_SHIP.set(result);
    //     // console.log (this.ARTCUSTX_SHIP()); 
    //   });

    // console.log ('2D started ARTCUSTX_RTRN')
    this.http.get<ARTCUSTX_RTRN[]>('assets/data/ARTCUSTX_RTRN.json')
      .pipe(
   
      )
      .subscribe(result => {
        // console.log ('2D completed ARTCUSTX_RTRN')        
        this.ARTCUSTX_RTRN.set(result);
        // console.log (this.ARTCUSTX_RTRN()); 
      });

    // console.log ('2E started ARTCUSTX_PYMT')
    this.http.get<ARTCUSTX_PYMT[]>('assets/data/ARTCUSTX_PYMT.json')
      .pipe(
   
      )
      .subscribe(result => {
        // console.log ('2E completed ARTCUSTX_PYMT')        
        this.ARTCUSTX_PYMT.set(result);
        // console.log (this.ARTCUSTX_PYMT()); 
      });

    // console.log ('2F started ARTCUSTX_RF')
    this.http.get<ARTCUSTX_RF[]>('assets/data/ARTCUSTX_RF.json')
      .pipe(
   
      )
      .subscribe(result => {
        // console.log ('2F completed ARTCUSTX_RF')        
        this.ARTCUSTX_RF.set(result);
        // console.log (this.ARTCUSTX_RF()); 
      });

    // console.log ('3 started SOTORDR1')
    // this.http.get<SOTORDR1[]>('assets/data/SOTORDR1.json')
    //   .pipe(
    //     // Map the array of objects to an array of strings (e.g., the 'name' property)
    //     // map(data => data.map(item => item.name)) 
    //     // map((x) => {x.PRD_END_DATE = ExcelDateToJSDate(x.PRD_END_DATE)}
    //   )
    //   .subscribe(result => {
    //     // console.log ('3 completed SOTORDR1')

    //     for (let i = 0; i < result.length; i++) {
    //       let x:SOTORDR1 = result[i]
    //       let n:number = +(x.ORDR_DATE.toString());
    //       x.ORDR_DATE = ExcelDateToJSDate(n)
    //       let n2:number = +(x.INIT_DATE.toString());
    //       x.INIT_DATE = ExcelDateToJSDate(n2)
    //     }

    //     this.SOTORDR1.set(result);        
    //     // console.log (this.SOTORDR1()); 
    //   });
        
    // console.log ('4 started SOTORDR2')
    // this.http.get<SOTORDR2[]>('assets/data/SOTORDR2.json')
    //   .pipe(
    //   )
    //   .subscribe(result => {
    //     // console.log ('4 completed SOTORDR2')
    //     this.SOTORDR2.set(result);
    //     result[0].ORDR_QTY = -1;
    //     // console.log (this.SOTORDR2()); 
    //   });
  }




  getOrders(YP: string, TYPE: string ) {
     
    console.log('1 started SOTORDR1 for ' + YP)
    // this.http.get<SOTORDR1[]>(`assets/data/SOTORDR1_BOOK_${YP}.json`)
    // let body = {'TYPE': 'BOOK', 'YP': YP}
    // this.http.post<SOTORDR1[]>(`https://absapi.absolution1.com/api/VAN/EC/Get_Orders/BOOK/${YP}`, body)
    this.http.get<any>(`${environment.urlBase}api/VAN/EC/Get_Orders/${TYPE}/${YP}`)    
      .pipe(
      )
      .subscribe(result => {
        console.log({result})
        console.log('1 completed SOTORDR1 for ' + YP)

        result = result['SOTORDR1s']

        let ORDR_NO: string = '';
        for (let i = 0; i < result.length; i++) {
          try {
            let x:SOTORDR1 = result[i]
            ORDR_NO = x.ORDR_NO;
            // let n:number = +(x.ORDR_DATE.toString());
            // x.ORDR_DATE = ExcelDateToJSDate(n)
            // let n2:number = +(x.INIT_DATE.toString());
            // x.INIT_DATE = ExcelDateToJSDate(n2)
          } catch (error: any) {
            console.error({ORDR_NO})
            // Code to handle the error
            console.error("An error occurred:", error.message);
            // Output the specific name of the error
            console.error("Error name:", error.name);
          }
        }

        this.SOTORDR1.set(result);        
       console.log(this.SOTORDR1()); 
      });
        
    // console.log('2 started SOTORDR2 for ' + YP)
    // this.http.get<SOTORDR2[]>(`assets/data/SOTORDR2_BOOK_${YP}.json`)
    //   .pipe(
    //   )
    //   .subscribe(result => {
    //     console.log('2 completed SOTORDR2 for ' + YP)
    //     this.SOTORDR2.set(result);
    //     result[0].ORDR_QTY = -1;
    //     console.log(this.SOTORDR2); 
    //   });

    //https://absapi.absolution1.com/api/VAN/EC/Get_Order_Details/0008021932
    // this.getOrderDetails(ORDR_NO);
    //       this.SOTORDR2_ORDR.set(this.SOTORDR2().filter(x => x.ORDR_NO === ORDR_NO))
    
    
  }

  getOrderDetails(Order: string) {
     
    console.log('1 started SOTORDR2 for ' + Order)
    // this.http.get<SOTORDR1[]>(`assets/data/SOTORDR1_BOOK_${YP}.json`)
    // let body = {'TYPE': 'BOOK', 'YP': YP}
    // this.http.post<SOTORDR1[]>(`https://absapi.absolution1.com/api/VAN/EC/Get_Orders/BOOK/${YP}`, body)
    // this.http.get<any>(`https://absapi.absolution1.com/api/VAN/EC/Get_Order_Details/${Order}`)    
    this.http.get<any>(`${environment.urlBase}api/VAN/EC/Get_Order_Details/${Order}`)    
      .pipe(
      )
      .subscribe(result => {
        console.log({result})
        console.log('1 completed SOTORDR2 for ' + Order)

        result = result['SOTORDR2s']

        let ORDR_NO: string = '';
        for (let i = 0; i < result.length; i++) {
          try {
            let x:SOTORDR2 = result[i]
            ORDR_NO = x.ORDR_NO;
            // let n:number = +(x.ORDR_DATE.toString());
            // x.ORDR_DATE = ExcelDateToJSDate(n)
            // let n2:number = +(x.INIT_DATE.toString());
            // x.INIT_DATE = ExcelDateToJSDate(n2)
          } catch (error: any) {
            console.error({ORDR_NO})
            // Code to handle the error
            console.error("An error occurred:", error.message);
            // Output the specific name of the error
            console.error("Error name:", error.name);
          }
        }

        this.SOTORDR2_ORDR.set(result);        
        console.log(this.SOTORDR2_ORDR()); 
      });
        
    // console.log('2 started SOTORDR2 for ' + YP)
    // this.http.get<SOTORDR2[]>(`assets/data/SOTORDR2_BOOK_${YP}.json`)
    //   .pipe(
    //   )
    //   .subscribe(result => {
    //     console.log('2 completed SOTORDR2 for ' + YP)
    //     this.SOTORDR2.set(result);
    //     result[0].ORDR_QTY = -1;
    //     console.log(this.SOTORDR2); 
    //   });

    //https://absapi.absolution1.com/api/VAN/EC/Get_Order_Details/0008021932
    
  }




    public handleRowSelection(event: IRowSelectionEventArgs) {
        this.selectedRowsCount = event.newSelection.length;
        this.selectedRowIndex = event.newSelection[0];
        console.log('selectedRowsCount', this.selectedRowsCount)
        console.log('selectedRowIndex', this.selectedRowIndex)
    }

    public selectCellSelectionMode(args: any) {
        this.selectionMode = this.selectionModes[args.index].label;
        this.selectedRowsCount = undefined;
        this.selectedRowIndex = undefined;

        console.log('selectionMode', this.selectionMode)
    }

    rowSelectionChanged(event: IRowSelectionEventArgs) {
        this.selectedRowObjects = event.newSelection;
        console.log('selectedRowObjects', this.selectedRowObjects);
        console.log(event);

        if (event.owner.id === 'grdARTCUSTX_OPEN') {
          let YP: string = this.selectedRowObjects[0]['YP']
          let title: string =  ' Open Orders';
          this.grdSOTORDR1_title = title;
          // this.grdSOTORDR1_signal.set(title)
          this.getOrders(YP,'OPEN');
          this.grdSOTORDR2_title = '';
        }

        if (event.owner.id === 'grdARTCUSTX_BOOK') {
          let YP: string = this.selectedRowObjects[0]['YP']
          let title: string =  'Orders Booked in ' + YP;
          this.grdSOTORDR1_title = title;
          // this.grdSOTORDR1_signal.set(title)
          this.getOrders(YP,'BOOK');
          this.grdSOTORDR2_title = '';
        }
        if (event.owner.id === 'grdARTCUSTX_SHIP') {
          let YP: string = this.selectedRowObjects[0]['YP']
          let title: string =  'Orders Shipped in ' + YP;
          this.grdSOTORDR1_title = title;
          // this.grdSOTORDR1_signal.set(title)
          this.getOrders(YP,'SHIP');
          this.grdSOTORDR2_title = '';
        }
        if (event.owner.id === 'grdSOTORDR1') {
          let ORDR_NO: string = this.selectedRowObjects[0]['ORDR_NO']
          let title: string =  'Order Details for Order ' + ORDR_NO;
          this.grdSOTORDR2_title = title;
         //  this.grdSOTORDR2_signal.set(title)
           this.getOrderDetails(ORDR_NO);
          this.SOTORDR2_ORDR.set(this.SOTORDR2().filter(x => x.ORDR_NO === ORDR_NO))
          console.log(this.SOTORDR2_ORDR())
          console.log({ORDR_NO})
          console.log(this.SOTORDR2())
        }
    }






    public tabIndexChanged(tabIndex: number) {
      this.grdSOTORDR1_title = '';
      this.grdSOTORDR2_title = '';
    }

    public tabIndexChanging(args: ITabsSelectedIndexChangingEventArgs) {

    }

    
    
  async getData(event: any) {
    console.log(event)
    await this.dataService.getData(this.ABS_TABLE_NAME + 's', this.ABS_TABLE_NAME);
  }

  async getTABLE_NAME(TABLE_NAME: string) {
    // console.log('getTABLE_NAME', `${TABLE_NAME}s`, TABLE_NAME, `TABLE_NAME = '${TABLE_NAME}'`)
    // await this.dataService.getData(`${TABLE_NAME}s`, TABLE_NAME, `TABLE_NAME = '${TABLE_NAME}'`);
      console.log('getTABLE_NAME', `${TABLE_NAME}s`, TABLE_NAME, `TABLE_NAME = '${TABLE_NAME}'`)
      await this.dataService.getData(`${TABLE_NAME}s`, TABLE_NAME, `OPS_YYYYPP like '2026%'`);
  }

  async getRecord(View_or_Edit?: string) {
    const record = { ...this.dst[this.ABS_TABLE_NAME] };
    let errorMessage = '';
    // console.log("getRecord key=",key)

    // console.log('meta1 ---->', this.dataService.meta[this.ABS_TABLE_NAME].record);
    let r = await this.dataService.getRecord(
      this.ABS_TABLE_NAME,
      this.ABS_TABLE_NAME,
      record,
      errorMessage);
    // console.log('meta2 ---->', this.dataService.meta[this.ABS_TABLE_NAME].record);
    // console.log('r = ', r);
    if (r.recordCount == 1) {

      // let key = this.getKey(r.record);
      // if (!this.previousKeys.includes(key)) {
      //   this.previousKeys.unshift(key)
      // }

    }
    return r;
  }

}

function ExcelDateToJSDate(serial: number) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}
