import { Component, OnInit } from '@angular/core';
import { FoodService, Wholefood } from './food.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {
  foods: Wholefood[] = [];

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.foodService.getFoods().subscribe((data) => {
      this.foods = data;
    });
  }
}
