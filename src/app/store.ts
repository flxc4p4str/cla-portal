import { pluck, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class Store<T> {

  private subject: BehaviorSubject<T>;
  private store: Observable<T>;

  constructor (@Inject('initialState') initialState: T) {
    this.subject = new BehaviorSubject(initialState);
    this.store = this.subject.asObservable().pipe(distinctUntilChanged());
  }
  get value() {
    return this.subject.value;
  }

  select<K extends keyof T>(name: K): Observable<T[K]> {
    // return this.store.pipe(pluck(name), distinctUntilChanged());
    return this.store.pipe(
      // pluck('foo') is map(x => x?.foo)
      // pluck(name), 
      map(x => x[name]),
      distinctUntilChanged()
    );

  }

  set(name: string, new_value: any) {
    console.log('store is setting ' + name)
    this.subject.next({
      ...this.value, [name]: new_value
    });
  }
}
