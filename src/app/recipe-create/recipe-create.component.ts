import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService, Recipe } from '../recipe-list/recipe.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent {
  newRecipe: Partial<Recipe> = {};
  newIngredients: { id: number, amount: number }[] = [{ id: 0, amount: 0 }];
  addError = '';
  addLoading = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    public authService: AuthService
  ) {}

  saveAdd() {
    this.addLoading = true;
    this.addError = '';
    const token = this.authService.getToken() || undefined;
    let validIngredients = Array.isArray(this.newIngredients)
      ? this.newIngredients.filter(i => i.id && i.amount && !isNaN(Number(i.amount)))
      : [];
    if (validIngredients.length === 0) {
      this.addError = 'A recipe must have at least one ingredient with a valid id and amount.';
      this.addLoading = false;
      return;
    }
    // Format: [id] [amount]g\n...
    let ingredientsString = validIngredients.map(i => `${i.id} ${i.amount}g`).join('\n');
    const payload = {
      id: Number(this.newRecipe.id),
      name: String(this.newRecipe.name ?? ''),
      calories: Number(this.newRecipe.calories ?? 0),
      carbohydrates: Number(this.newRecipe.carbohydrates ?? 0),
      fats: Number(this.newRecipe.fats ?? 0),
      protein: Number(this.newRecipe.protein ?? 0),
      description: String(this.newRecipe.description ?? ''),
      ingredients: String(ingredientsString),
      portionSize: Number(this.newRecipe.portionSize ?? 0),
      preparationTime: Number(this.newRecipe.preparationTime ?? 0),
      difficulty: Number(this.newRecipe.difficulty ?? 0)
    };
    this.recipeService.addRecipe(payload, token).subscribe({
      next: created => {
        this.addLoading = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.addError = err.error?.error?.message || 'Add failed';
        this.addLoading = false;
      }
    });
  }

  addIngredientField() {
    this.newIngredients.push({id:0,amount:0});
  }

  removeIngredientField(idx: number) {
    this.newIngredients.splice(idx, 1);
  }

  cancelAdd() {
    this.router.navigate(['/']);
  }
}
