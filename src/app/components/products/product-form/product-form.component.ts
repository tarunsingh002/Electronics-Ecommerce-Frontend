import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Product } from "../../../models/product.model";
import { ProductDataService } from "../../../services/product-data.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"],
})
export class ProductFormComponent implements OnInit {
  editMode = false;
  id: number;
  reactiveForm: FormGroup;

  constructor(
    private dservice: ProductDataService,
    private aroute: ActivatedRoute,
    private route: Router,
    private l: LoadingService
  ) {}

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      brand: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      specification: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });

    this.aroute.params.subscribe((params: Params) => {
      if (params["index"] != null) {
        this.editMode = true;
        this.dservice.getProductById(params["index"]).subscribe((p) => {
          let editProduct = p;
          this.reactiveForm.setValue({
            name: editProduct.name,
            brand: editProduct.brand ? editProduct.brand : "",
            category: editProduct.category ? editProduct.category : "",
            description: editProduct.description,
            url: editProduct.url,
            specification: editProduct.specification,
            price: editProduct.price,
          });
          this.id = editProduct.productId;
        });
      }
    });
  }

  onSubmit(rf: FormGroup) {
    let value = rf.value;
    let product = new Product(
      value.name,
      value.brand,
      value.category,
      value.description,
      value.url,
      value.specification,
      value.price
    );

    rf.reset();

    this.l.isLoading.next(true);
    if (this.editMode) {
      this.dservice.updateProduct(this.id, product).subscribe(() => {
        this.l.isLoading.next(false);
        this.route.navigate(["products"]);
      });
    } else {
      this.dservice.addProduct(product).subscribe((response) => {
        product.productId = response.productId;
        // this.pservice.addProduct(product);
        this.l.isLoading.next(false);
        this.route.navigate(["products"]);
      });
    }
  }
}
