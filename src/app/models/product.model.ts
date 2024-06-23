export class Product {
  constructor(
    public name: string,
    public brand: string,
    public category: string,
    public description: string,
    public url: string,
    public specification: string,
    public price: number,
    public productId?: number
  ) {}
}
