import { Product } from "./product.model";

export class ProductResponse {
  constructor(
    public products: Product[],
    public pageNumber: number,
    public pageSize: number,
    public totalElements: number,
    public totalPages: number,
    public lastPage: boolean
  ) {}
}
