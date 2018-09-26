import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Item } from './itemModel';
import { File } from './auctionModel';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class DbApiService {

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  public getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(API_URL + '/items')
      .pipe(
        tap(result => this.log('get items from db')),
        catchError(this.handleError<Item[]>('getAllItems'))
      );
  }

  public createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(API_URL + '/items', item)
      .pipe(
        tap((result: Item) => this.log(`added item w/ id=${result.id}`)),
        catchError(this.handleError<Item>('createItem'))
      );
  }

  public getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(API_URL + '/items/' + id)
      .pipe(
        tap(result => this.log('get item by id from db')),
        catchError(this.handleError<Item>('getItemById'))
      );
  }

  public updateItem(item: Item) {
    return this.http.put<Item>(API_URL + '/items/' + item.id, item)
      .pipe(
        tap((result: Item) => this.log(`update item w/ id=${result.id}`)),
        catchError(this.handleError<Item>('updateItem'))
      );
  }

  public deleteItemById(id: number) {
    return this.http.delete<Item>(API_URL + '/items/' + id)
      .pipe(
        tap(result => this.log(`delete item w/ id=${id}`)),
        catchError(this.handleError<Item>('deleteItemById'))
      );
  }

  // AuctionsFiles
  public getAllAuctionsFiles(): Observable<File[]> {
    return this.http.get<File[]>(API_URL + '/auctionsFiles')
      .pipe(
        tap(result => this.log('get auctionsFiles from db')),
        catchError(this.handleError<File[]>('getAllAuctionsFiles'))
      );
  }

  public createAuctionsFiles(file: File): Observable<File> {
    return this.http.post<Item>(API_URL + '/auctionsFiles', file)
      .pipe(
        tap((result: File) => this.log(`added auctionsFiles w/ id=${result.id}`)),
        catchError(this.handleError<File>('createAuctionsFiles'))
      );
  }

  public getAuctionsFilesById(id: number): Observable<File> {
    return this.http.get<File>(API_URL + '/auctionsFiles/' + id)
      .pipe(
        tap(result => this.log('get auctionsFiles by id from db')),
        catchError(this.handleError<File>('getAuctionsFilesById'))
      );
  }

  public getAuctionsFilesByLastModified(lastModified: number): Observable<File[]> {
    return this.http.get<File[]>(API_URL + '/auctionsFiles?lastModified=' + lastModified)
      .pipe(
        tap(result => this.log('get auctionsFiles by lastModified from db')),
        catchError(this.handleError<File[]>('getAuctionsFilesByLastModified'))
      );
  }

  public updateAuctionsFiles(file: File) {
    return this.http.put<File>(API_URL + '/auctionsFiles/' + file.id, file)
      .pipe(
        tap((result: File) => this.log(`update auctionsFiles w/ id=${result.id}`)),
        catchError(this.handleError<File>('updateAuctionsFiles'))
      );
  }

  public deleteAuctionsFilesById(id: number) {
    return this.http.delete<File>(API_URL + '/auctionsFiles/' + id)
      .pipe(
        tap(result => this.log(`delete auctionsFiles w/ id=${id}`)),
        catchError(this.handleError<File>('deleteAuctionsFilesById'))
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
