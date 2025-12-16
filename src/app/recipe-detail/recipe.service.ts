import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  name: string;
  calories?: number;
  carbohydrates?: number;
  fats?: number;
  protein?: number;
  description: string;
  ingredients: string;
  portionSize?: number;
  preparationTime?: number;
  difficulty?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://185.245.182.232:5000/api/Recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  updateRecipe(id: number, data: Partial<Recipe>, token?: string): Observable<Recipe> {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, data, { headers });
  }

  deleteRecipe(id: number, token?: string): Observable<any> {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  addRecipe(data: Partial<Recipe>, token?: string): Observable<Recipe> {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post<Recipe>(this.apiUrl, data, { headers });
  }
}
