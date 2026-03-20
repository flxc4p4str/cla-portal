import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@abs-environments/environment';
import { inject, Injectable, OnDestroy, OnInit, Signal } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Subscription, firstValueFrom } from 'rxjs';
import { Store } from './store';
import { IFieldPipeArgs } from '@infragistics/igniteui-angular';
// import { GLTPARM2 } from './app.models';

// this service should be @Self-Injected into every component that needs its own data layer
// sample code

// @Component({
//   ...
//   providers: [DataService]
// })
// constructor(
//   ...
//   @Self() public dataService: DataService
//   ) {}

// @Injectable({
//   providedIn: 'root' // Makes the service a singleton application-wide
// })
@Injectable({ providedIn: 'root' })
export class DataService implements OnInit, OnDestroy{

  public dst: any = {};
  private subscriptions: Subscription[] = [];
  public store: any;
  // public state: any;
  public meta: any = {};

  public test = "this is a test"
  public http!: HttpClient;

  public dataURL = environment.urlBaseABS + 'AS/data';
  public screenMode: boolean = false;

  constructor(
    // public http: HttpClient,
  ) {
    this.http = inject(HttpClient)
    // console.log('Instantiating DataService', this.test, this.store)
  }

  ngOnInit(): void {  
    // https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
    // For ngOnInit - use the Constructor for Services (or anything not a Component)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => { x.unsubscribe(); });
    // For ngOnDestroy - this life-cycle hook works for Services
  }

  // not sure whether this is ever being used
  // async updateData<T>(record: T) {
  //   // put?
  //   let ob = this.http.put(environment.urlBase + 'data', record);
  //   return firstValueFrom(ob)
  // }

  pipeArgs(digitsInfo: string) {
    let pipeArgs: IFieldPipeArgs = {}
    if (digitsInfo) {
      pipeArgs = { digitsInfo }
    }
    return pipeArgs;
  }
  


    
//#region "Array Sorting Methods"

  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types

  dynamicSort<T>(property: keyof T, sortOrder: 1 | -1 = 1) {
    return function (a: T,b: T) {
        // next line works with strings and numbers, and you may want to customize it to your needs
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }
  
  // mothballed 07/14/2024 - delete this if it has no applications
  // public sortBy<T>(a: T, b: T, d: keyof T) {
  //   if (d && a && b && a[d] && b[d]) {
  //     if (a[d] && b[d]) {
  //         if (a[d] > b[d]) { return 1; }
  //         if (a[d] < b[d]) { return -1; }
  //     }
  //     return 0;
  //   } else {
  //     return 0;
  //   }
  // }
  
  // WJZ: we need to get this to work if we want to sort by multiple fields, some ascending and others descending
  // and then this needs to be declared in a standard library
//https://stackoverflow.com/questions/68278850/how-to-extend-a-keyof-type-so-that-it-includes-modified-versions-of-the-keys-e/68279093#68279093
  //  type sortArg<T> = keyof T | `-${string & keyof T}`
/**
 * Returns a comparator for objects of type T that can be used by sort
 * functions, were T objects are compared by the specified T properties.
 *
 * @param sortBy - the names of the properties to sort by, in precedence order.
 *                 Prefix any name with `-` to sort it in descending order.
 */
// export function byPropertiesOf<T extends object> (sortBy: Array<sortArg<T>>) {
//     function compareByProperty (arg: sortArg<T>) {
//         let key: keyof T
//         let sortOrder = 1
//         if (typeof arg === 'string' && arg.startsWith('-')) {
//             sortOrder = -1
//             // Typescript is not yet smart enough to infer that substring is keyof T
//             key = arg.substr(1) as keyof T
//         } else {
//             // Likewise it is not yet smart enough to infer that arg here is keyof T
//             key = arg as keyof T
//         }
//         return function (a: T, b: T) {
//             const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
//             return result * sortOrder
//         }
//     }
//     return function (obj1: T, obj2: T) {
//         let i = 0
//         let result = 0
//         const numberOfProperties = sortBy?.length
//         while (result === 0 && i < numberOfProperties) {
//             result = compareByProperty(sortBy[i])(obj1, obj2)
//             i++
//         }
//         return result
//     }
// }

/**
 * Sorts an array of T by the specified properties of T.
 *
 * @param arr - the array to be sorted, all of the same type T
 * @param sortBy - the names of the properties to sort by, in precedence order.
 *                 Prefix any name with `-` to sort it in descending order.
 */
// export function sort<T extends object> (arr: T[], ...sortBy: Array<sortArg<T>>) {
//     arr.sort(byPropertiesOf<T>(sortBy))
// }

//#endregion


  getJWT(USER_ID: string) {
    const JWT = localStorage.getItem('JWT');
    if (!JWT) {
      // for string return type, you need these
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      const responseType = 'text';
      // why would we be able (OR NEED) to get the JWT for a user using the API?
      // this.http.get(environment.urlBaseABS.replace('/api','')+`GetJWT/${USER_ID}`)
      this.http.get(environment.urlBaseABS.replace('/api', '') + `GetJWT/${USER_ID}`, { headers, responseType })
        .subscribe(
          (next: string) => {
            console.log('JWT:', next);
            localStorage.setItem('JWT', next);
          }
        );
    }
  }

  getMetaData(TABLE_NAME: string, SCHEMA_NAME = '') {
    const body = {TABLE_NAME, SCHEMA_NAME};
    return this.http.post(environment.urlBaseABS + 'AS/GetMetaData', body);
  }

  async getRecord(
    storeTABLE_NAME: string,
    TABLE_NAME: string,
    record: any, // WHY ARE WE PASSING IN RECORD
    where_clause = '',
    SCHEMA_NAME = '') : Promise<any>
    {
      let errorMessage = '';
      let records: any[] = [];
      let recordCount = 0;
      let meta = this.meta[storeTABLE_NAME]
      const body = {TABLE_NAME, SCHEMA_NAME, where_clause, meta, record};
      let ob = this.http.post(environment.urlBaseABS + 'AS/GetRecord', body)
      .pipe(
        tap((res: any) => {
          // console.log('tap from GetRecord', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            record = res.data[0];
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            console.log('returning blank record', meta.record )
            if (storeTABLE_NAME === 'BSTCBSCM' || storeTABLE_NAME === 'BSCCBSBC') {
              console.log('setting ABS for ' + storeTABLE_NAME)
            }
            errorMessage = "No Record";
            return meta.record;
          }
        })
      )

      let r = await firstValueFrom(ob).then(
        (res: any) => {
          this.store.set(storeTABLE_NAME, res);
          return res;
        },
        (err: any) => {
          console.log('err: ', err)
          errorMessage = err;
          return err;
        }
      );

    return {recordCount: recordCount, errorMessage: errorMessage, record: record, records: records};
  }

  async getData(
    storeTABLE_NAME: string,
    TABLE_NAME: string,
    where_clause = '',
    SCHEMA_NAME = '', 
    order_by = '', 
    sig: any = undefined) {

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;
    let meta = this.meta[storeTABLE_NAME]

    const body = {TABLE_NAME, SCHEMA_NAME, where_clause, order_by};


    let JWT = localStorage.getItem('JWT');
    let headerItems = {} // { 'Content-Type': 'application/json' }
    if (JWT) {
      headerItems = { ...headerItems, Authorization: 'Bearer ' + JWT }
    } else {
      headerItems = { 'Content-Type': 'application/json' }
      }
    let headers = new HttpHeaders(headerItems);
    let options = { headers: headers };

    console.log({JWT, options})

    console.log('in getData',environment.urlBaseABS + 'AS/GetData', body) //, options)

    let ob = this.http.post(environment.urlBaseABS + 'AS/GetData', body) //, options)
      .pipe(
        tap((res: any) => {
          console.log('tap from getData', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            console.log('returning blank record', meta.record )
            errorMessage = "No Records";
            return meta.record;
          }
        })
      )
 
      ob.subscribe((result) => {
        // console.log({result})

        if (result.length !== 0) {
          // console.log('returning valid record',  res )
          recordCount = result.length;
          records = result;
          sig.set(result)
          console.log('result again', result)
          return {recordCount, errorMessage, records};
        } else {
          console.log('returning blank record', meta.record )
          errorMessage = "No Records";
          return meta.record;
        }
      })

      console.error (this.store, storeTABLE_NAME)
      // try {
      //   const res = await firstValueFrom(ob)
      //   // AS/GetData does not return a SUCCESS property
      //   // if (res.SUCCESS) {
      //     this.store.set(storeTABLE_NAME, res);
      //     console.log(`getting ${storeTABLE_NAME} in getData`, res)
      //   // } else {
      //   //   console.error(`error getting ${storeTABLE_NAME} in getData`, res)
      //   // }
      // } catch (error) {
      //   console.error(error); // Handle errors
      // }
          console.log('result again was not the last line executed')
    return {recordCount: recordCount, errorMessage: errorMessage, records: records};
  }

  getDataOb(
    storeTABLE_NAME: string,
    TABLE_NAME: string,
    where_clause = '',
    SCHEMA_NAME = '', 
    order_by = '') {

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;
    let meta = this.meta[storeTABLE_NAME]

    const body = {TABLE_NAME, SCHEMA_NAME, where_clause, order_by};
    let ob = this.http.post(environment.urlBaseABS + 'AS/GetData', body)
      .pipe(
        tap((res: any) => {
          console.log('tap from getData', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            console.log('returning blank record', meta.record )
            errorMessage = "No Records";
            return meta.record;
          }
        })
      )

    return ob;
  }


  
  getClients(pp: string) {

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;
    // let meta = this.meta[storeTABLE_NAME]

    const body = { pp };
    let ob = this.http.post(environment.urlBaseABS + 'BS/GetClients2', body)
      .pipe(
        tap((res: any) => {
          console.log('tap from getClients', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            // console.log('returning blank record', meta.record )
            errorMessage = "No Records";
            return '' // meta.record;
          }
        })
      )

    return ob;
  }
 
  getProjectCodes(pp: string) {

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;
    // let meta = this.meta[storeTABLE_NAME]

    const body = { pp };
    let ob = this.http.post(environment.urlBaseABS + 'BS/GetProjectCodes2', body)
      .pipe(
        tap((res: any) => {
          console.log('tap from getProjectCodes', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            // console.log('returning blank record', meta.record )
            errorMessage = "No Records";
            return '' // meta.record;
          }
        })
      )

    return ob;
  }

   
  getBillingCodes(pp: string) {

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;
    // let meta = this.meta[storeTABLE_NAME]

    const body = { pp };
    let ob = this.http.post(environment.urlBaseABS + 'BS/GetBillingCodes2', body)
      .pipe(
        tap((res: any) => {
          console.log('tap from getBillingCodes', {res})
        }),
        map((res: any) => {
          if (res['data'].length !== 0) {
            // console.log('returning valid record',  res )
            recordCount = res['data'].length;
            records = res.data;
            return res['data']
          } else {
            // console.log('returning blank record', meta.record )
            errorMessage = "No Records";
            return '' // meta.record;
          }
        })
      )

    return ob;
  }



  // important that dbOp is not async, so that it returns an Observable and not a Promise
  dbOp(
    controller: string,
    method: string,
    parms: any = {},
    PROCEDURE_NAME: string,
    SCHEMA_NAME?: string) {
    const body = {PROCEDURE_NAME, SCHEMA_NAME, ...parms};
    return this.http.post<any>(environment.urlBaseABS + `${controller}/${method}`, body);
  }

  async getMethod(
    controller: string,
    method: string,
    parms: any = {},
    storeTABLE_NAME: string,
    TABLE_NAME: string,
    where_clause?: string,
    order_by?: string,
    SCHEMA_NAME?: string) {

    const body = {PROCEDURE_NAME: 'Fill_Records', TABLE_NAME, SCHEMA_NAME, where_clause, order_by, ...parms};
    let ob = this.http.post(environment.urlBaseABS + `${controller}/${method}`, body)

// PRESENTLY WE ARE NOT USING THE RETURN VALUE FROM getMethod in any of the calls - perhaps we should

    await firstValueFrom(ob).then(
      (res: any) => {
        if (res.SUCCESS) {
          this.store.set(storeTABLE_NAME, res[storeTABLE_NAME]);
            return ({ok: true});
        } else {
          console.log ('err in API logic', res)
          return ({ok: false, ...res});
        }
      },
        (err: any) => {
          return ({ok: false, msgs: [err]});
        }
      );
  }

  async writeRecord<T>(TABLE_NAME: string, SCHEMA_NAME = '', where_clause = '', record: T) : Promise<any> {

    // so far - this method is referenced only in asfbaset to update the data SRM - ALSO BSFTIME1, ABS.COMPONENT

    let errorMessage = '';
    let records: any[] = [];
    let recordCount = 0;

    let meta = this.meta[TABLE_NAME]
    const body = {TABLE_NAME, SCHEMA_NAME, where_clause, meta, record};
    let ob = this.http.post(environment.urlBaseABS + 'AS/WriteRecord', body)
      .pipe(
        tap((res: any) => console.log('tap from WriteRecord', res)),
        map((res: any) => res?['record'] : '')
      )
      let r = await firstValueFrom(ob).then(
        (res: any) => {
          // store.set(storeTABLE_NAME, res);
          console.log('writeRecord res', res)
          // record = res.data[0];
          // recordCount = res['data'].length;
          // records = res.data;
          return res;
        },
        (err: any) => {
          console.log('err: ', err)
          errorMessage = err;
          return err;
        }
      );
    return {recordCount: recordCount, errorMessage: errorMessage, record: record};
  }

  // T = BSFTIME1State
  // initialState = new BSFTIME1State()

  dstInit<T>(initialState: T, tables: table[]) {
    this.store = new Store<T>(initialState);
    // // this.state = initialState;
    // this.dst['state'] = initialState;
    // console.log('Initializing dstInit', this.store)
    tables.forEach((table) => {
      // this.setupTable<T>(table);
    });
  }

  setupTable<T>(table: table) {

    let TABLE_NAME: string = table.TABLE_NAME;
    let TABLE_ALIAS: string = table.TABLE_ALIAS || TABLE_NAME;

    if (TABLE_NAME.endsWith('s')) { TABLE_NAME = TABLE_NAME.substring(0, 8); }

    this.dst[TABLE_ALIAS  + '$'] = this.store.select(TABLE_ALIAS as keyof T);

    if (TABLE_ALIAS.endsWith('s')) {
      this.dst[TABLE_ALIAS] = [];
    } else {
      // this.dst[x] = [];
      // ICTCOSTB: ICTCOSTB;
    }

    if (!table['meta'] && !table['skipMeta']) {

      // let SCHEMA: string = '';
      // if (table['SCHEMA']) {
      //   SCHEMA = table['SCHEMA'];
      // }

      let SCHEMA: string = table['SCHEMA'] || '';

      const subscriptionMeta = this.getMetaData(TABLE_NAME, SCHEMA)
      .subscribe(
        (next) => {
          this.meta[TABLE_ALIAS] = next;
          // console.log('next = ', next);
          if (table['meta_cb']) {
            table['meta_cb']();
          }
        },
        (error) => {
          console.error('from GetMetaData', error);
        },
        () => { }
      );
      this.subscriptions.push(subscriptionMeta);
    }

    const subscription = this.dst[TABLE_ALIAS  + '$']
      .subscribe(
        (next: any[]) => {
          if (TABLE_ALIAS.endsWith('s')) { // multiple records
            this.dst[TABLE_ALIAS] = next;
          } else {  // single record
            if (next && next[0]) {
              this.dst[TABLE_ALIAS] = next[0];
              this.dst[TABLE_ALIAS] = { ...this.dst[TABLE_ALIAS] };
            } else {
              this.dst[TABLE_ALIAS] = this.dst['state'][TABLE_ALIAS] // this.state[TABLE_ALIAS];
              this.dst[TABLE_ALIAS] = { ...this.dst[TABLE_ALIAS] };
            }
          }

          if (table['cb']) {
            table['cb']();
          }
        },
        (error: any) => { console.log(error); },
        () => { console.log('complete'); }
      );
    this.subscriptions.push(subscription);
  }
}

export interface table {
  TABLE_NAME: string;
  cb?: any;
  TABLE_ALIAS?: string;
  meta?: any;
  skipMeta?: any;
  SCHEMA?: string;
  meta_cb?: any;
}
