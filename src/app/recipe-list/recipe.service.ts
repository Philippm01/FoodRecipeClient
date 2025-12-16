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

  addRecipe(data: Partial<Recipe>, token?: string): Observable<Recipe> {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    // Ensure all fields are present as required by the API, and use the id from the form
    const fullData = {
      id: Number(data.id),
      name: String(data.name || ''),
      calories: Number(data.calories ?? 0),
      carbohydrates: Number(data.carbohydrates ?? 0),
      fats: Number(data.fats ?? 0),
      protein: Number(data.protein ?? 0),
      description: String(data.description || ''),
      ingredients: String(data.ingredients || ''),
      portionSize: Number(data.portionSize ?? 0),
      preparationTime: Number(data.preparationTime ?? 0),
      difficulty: Number(data.difficulty ?? 0)
    };
    return this.http.post<Recipe>(this.apiUrl, fullData, headers ? { headers } : {});
  }
  
}
