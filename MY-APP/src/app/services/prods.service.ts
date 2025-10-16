import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Modules/Product';

@Injectable({
  providedIn: 'root'
})
export class ProdsService {
  private apiUrl = 'http://localhost:8090/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Product[]>(this.apiUrl, { params });
  }
}
