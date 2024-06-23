import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { map, tap } from "rxjs/operators";
import { apiUrl } from "../apiutility";
import { ProductResponse } from "../models/product-response.model";
import { LoadingService } from "./loading.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductDataService {
  api: string = `${apiUrl}`;
  productResponseChanged = new BehaviorSubject<ProductResponse>(null);

  constructor(
    private http: HttpClient,

    private l: LoadingService
  ) {}

  addProduct(p: Product) {
    return this.http.post<Product>(`${this.api}/api/v1/admin/addproduct`, p);
  }

  getProducts(
    page: number,
    searchTerm = "",
    sortBy = "productId",
    direction = "asc",
    brandfilter = [],
    categoryfilter = []
  ) {
    if (
      searchTerm !== "" ||
      brandfilter.length !== 0 ||
      categoryfilter.length !== 0
    ) {
      return this.http
        .post<ProductResponse>(
          `${this.api}/api/v1/all/filterproducts?pageNumber=${
            page - 1
          }&sortBy=${sortBy}&direction=${direction}&searchTerm=${searchTerm}`,
          { brands: brandfilter, categories: categoryfilter }
        )
        .pipe(
          tap((res) => {
            this.productResponseChanged.next(res);
          })
        );
    } else
      return this.http
        .get<ProductResponse>(
          `${this.api}/api/v1/all/getproducts?pageNumber=${
            page - 1
          }&sortBy=${sortBy}&direction=${direction}`
        )
        .pipe(
          tap((res) => {
            this.productResponseChanged.next(res);
          })
        );
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.api}/api/v1/all/getproduct/${id}`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.api}/api/v1/admin/deleteproduct/${id}`, {
      responseType: "text",
    });
  }

  updateProduct(id: number, product: Product) {
    return this.http.put(
      `${this.api}/api/v1/admin/updateproduct/${id}`,
      product
    );
  }
}
