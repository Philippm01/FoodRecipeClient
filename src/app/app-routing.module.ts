import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { FoodListComponent } from './food-list/food-list.component';
import { FoodDetailComponent } from './food-detail/food-detail.component';

import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
const routes: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'recipes/create', component: RecipeCreateComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'food', component: FoodListComponent },
  { path: 'food/:id', component: FoodDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
