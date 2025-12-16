import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from './recipe.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  addMode = false;
  newRecipe: Partial<Recipe> = {};
  newIngredients: { id: number, weight: string }[] = [];
  addError = '';
  addLoading = false;

  constructor(
    private recipeService: RecipeService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
    });
  }

  startAdd() {
    this.router.navigate(['/recipes/create']);
  }

  cancelAdd() {
    this.addMode = false;
    this.addError = '';
  }

  saveAdd() {
    this.addLoading = true;
    this.addError = '';
    const token = this.authService.getToken() || undefined;
    let validIngredients = Array.isArray(this.newIngredients)
      ? this.newIngredients.filter(i => i.id && i.weight && String(i.id).trim() && String(i.weight).trim())
      : [];
    if (validIngredients.length === 0) {
      this.addError = 'A recipe must have at least one ingredient.';
      this.addLoading = false;
      return;
    }
    let ingredientsString = validIngredients.map(i => `${i.id} ${i.weight}`).join('\n');
    const payload = {
      ...this.newRecipe,
      ingredients: ingredientsString
    };
    this.recipeService.addRecipe(payload, token).subscribe({
      next: created => {
        this.recipes.push(created);
        this.addMode = false;
        this.addLoading = false;
      },
      error: err => {
        this.addError = err.error?.error?.message || 'Add failed';
        this.addLoading = false;
      }
    });
  }

  addIngredientField() {
    this.newIngredients.push({id:0,weight:''});
  }

  removeIngredientField(idx: number) {
    this.newIngredients.splice(idx, 1);
  }
}
