import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
// import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { ApiResult, AuctionsResult } from './auctionModel';
import { Item } from './itemModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiKey = '3c3fqxku76ab23gq8e4h3zxqbjkmy5jt';

@Injectable({
  providedIn: 'root'
})
export class WowApiService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getAuctionsFiles(realm: string, locale: string): Observable<ApiResult> {
    const url = `/wow/auction/data/${realm}?locale=${locale}&apikey=${apiKey}`;

    return this.http.get<ApiResult>(url, httpOptions)
      .pipe(
        tap(result => this.log('fetched auction files')),
        catchError(this.handleError<ApiResult>('getAuctionsFiles'))
      );
  }

  getAuctions(fileUrl: string): Observable<AuctionsResult> {
    const correctUrl = fileUrl.replace('http://auction-api-eu.worldofwarcraft.com', '');
    return this.http.get<AuctionsResult>(correctUrl, httpOptions)
      .pipe(
        tap(result => this.log('fetched auction files')),
        catchError(this.handleError<AuctionsResult>('getAuctionsFiles'))
      );
  }

  getAuctionsFromStatic(): Observable<AuctionsResult> {

    return this.http.get<AuctionsResult>('../assets/auctions.json', httpOptions)
      .pipe(
        tap(result => this.log('fetched auction files')),
        catchError(this.handleError<AuctionsResult>('getAuctionsFromStatic'))
      );
  }

  getItem(id: string, locale: string): Observable<Item> {
    return this.http.get<Item>(`wow/item/${id}?locale=${locale}&apikey=${apiKey}`, httpOptions)
      .pipe(
        tap(result => this.log('fetched items')),
        catchError(this.handleError<Item>('getItems'))
      );
  }

  getItems(): Observable<Item[]> {

    return this.http.get<Item[]>('../assets/items.json', httpOptions)
      .pipe(
        tap(result => this.log('fetched items')),
        catchError(this.handleError<Item[]>('getItems'))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`AuctionApiService: ${message}`);
  }
}
