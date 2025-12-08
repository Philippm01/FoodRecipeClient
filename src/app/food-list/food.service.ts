import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Wholefood {
  id: number;
  name: string;
  calories?: number;
  carbohydrates?: number;
  fats?: number;
  protein?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private apiUrl = 'http://185.245.182.232:5000/api/Wholefood';

  constructor(private http: HttpClient) {}

  getFoods(): Observable<Wholefood[]> {
    return this.http.get<Wholefood[]>(this.apiUrl);
  }

  getFood(id: number): Observable<Wholefood> {
    return this.http.get<Wholefood>(`${this.apiUrl}/${id}`);
  }
}
