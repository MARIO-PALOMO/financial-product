import { Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api-service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancialProduct } from "../models/financial-product.model";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends ApiService {
    private readonly productsEndpoint = 'bp/products';

    getProducts(): Observable<FinancialProduct[]> {
        return this.http.get<{ data: FinancialProduct[] }>(this.buildUrl(this.productsEndpoint)).pipe(
            map(response => response.data)
        );
    }

    verifyIdExists(id: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.buildUrl(this.productsEndpoint)}/verification/${id}`);
    }

    createProduct(product: FinancialProduct): Observable<any> {
        console.log(this.buildUrl(this.productsEndpoint))
        return this.http.post(this.buildUrl(this.productsEndpoint), product);
    }

    updateProduct(id: string, product: Omit<FinancialProduct, 'id'>): Observable<any> {
        return this.http.put(`${this.buildUrl(this.productsEndpoint)}/${id}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.buildUrl(this.productsEndpoint)}/${id}`);
    }
}