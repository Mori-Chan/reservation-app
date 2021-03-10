import { Component, OnInit } from '@angular/core';
import { products } from '../../products';

@Component({
  selector: 'app-product-listings',
  templateUrl: './product-listings.component.html',
  styleUrls: ['./product-listings.component.scss']
})
export class ProductListingsComponent implements OnInit {

  products: any

  constructor() { }

  ngOnInit(): void {
    this.products = products;
  }

}
