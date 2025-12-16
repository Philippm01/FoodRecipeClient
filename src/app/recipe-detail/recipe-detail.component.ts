import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService, Recipe } from './recipe.service';
import { FoodService, Wholefood } from '../food-list/food.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
    deleteLoading = false;
    deleteRecipe() {
      if (!this.recipe) return;
      if (!confirm('Are you sure you want to delete this recipe?')) return;
      this.deleteLoading = true;
      const token = this.authService.getToken() || undefined;
      this.recipeService.deleteRecipe(this.recipe.id, token).subscribe({
        next: () => {
          window.location.href = '/';
        },
        error: err => {
          this.updateError = err.error?.error?.message || 'Delete failed';
          this.deleteLoading = false;
        }
      });
    }
  recipe?: Recipe;
  ingredientDetails: { id: number, weight: string, name?: string }[] = [];
  editMode = false;
  editRecipe: Partial<Recipe> = {};
  editIngredients: { id: number, weight: string }[] = [];
  updateError = '';
  updateLoading = false;

  constructor(
    private recipeService: RecipeService,
    private foodService: FoodService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.recipeService.getRecipe(id).subscribe((data) => {
        this.recipe = data;
        this.processIngredients();
      });
    }
  }

  processIngredients() {
    if (!this.recipe?.ingredients) return;
    const parts = this.recipe.ingredients.split(/\\|\n|\r|,/).map(s => s.trim()).filter(Boolean);
    this.ingredientDetails = parts.map(part => {
      const match = part.match(/(\d+)\s*([\d.,a-zA-Z]+)/);
      if (match) {
        return { id: Number(match[1]), weight: match[2] };
      }
      return { id: NaN, weight: part };
    }).filter(i => !isNaN(i.id));
    this.ingredientDetails.forEach((item, idx) => {
      this.foodService.getFood(item.id).subscribe(food => {
        this.ingredientDetails[idx].name = food.name;
      });
    });
  }

  startEdit() {
    if (!this.recipe) return;
    this.editRecipe = {
      name: this.recipe.name,
      calories: this.recipe.calories,
      carbohydrates: this.recipe.carbohydrates,
      fats: this.recipe.fats,
      protein: this.recipe.protein,
      description: this.recipe.description,
      portionSize: this.recipe.portionSize,
      preparationTime: this.recipe.preparationTime,
      difficulty: this.recipe.difficulty
    };
    this.editIngredients = this.ingredientDetails.map(i => ({ id: i.id, weight: i.weight }));
    this.editMode = true;
    this.updateError = '';
  }

  cancelEdit() {
    this.editMode = false;
    this.updateError = '';
  }

  saveEdit() {
    if (!this.recipe) return;
    this.updateLoading = true;
    this.updateError = '';
    const token = this.authService.getToken() || undefined;
    let validIngredients = Array.isArray(this.editIngredients)
      ? this.editIngredients.filter(i => i.id && i.weight && String(i.id).trim() && String(i.weight).trim())
      : [];
    if (validIngredients.length === 0) {
      this.updateError = 'A recipe must have at least one ingredient.';
      this.updateLoading = false;
      return;
    }
    let ingredientsString = validIngredients.map(i => `${i.id} ${i.weight}`).join('\n');
    const payload = {
      ...this.recipe,
      ...this.editRecipe,
      ingredients: ingredientsString
    };
    this.recipeService.updateRecipe(this.recipe.id, payload, token).subscribe({
      next: updated => {
        this.recipe = { ...this.recipe!, ...this.editRecipe, ingredients: ingredientsString };
        this.processIngredients();
        this.editMode = false;
        this.updateLoading = false;
      },
      error: err => {
        this.updateError = err.error?.error?.message || 'Update failed';
        this.updateLoading = false;
      }
    });
  }

  addIngredientField() {
    this.editIngredients.push({id:0,weight:''});
  }

  getIngredientName(id: number): string | undefined {
    const found = this.ingredientDetails.find(i => i.id === id);
    return found?.name;
  }

  removeIngredientField(idx: number) {
    this.editIngredients.splice(idx, 1);
  }
}
