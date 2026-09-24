import { Component, OnInit, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { FinancialProduct } from '../../models/financial-product.model';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ModalConfirmComponent } from '../../../../shared/components/modal-confirm/modal-confirm/modal-confirm.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-dashboard-page',
  standalone: true,
  imports: [CommonModule, ProductTableComponent, ModalConfirmComponent, HeaderComponent],
  templateUrl: './product-dashboard-page.component.html',
  styleUrls: ['./product-dashboard-page.component.scss']
})
export class ProductDashboardPageComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private router = inject(Router, { optional: true });
  private platformId = inject(PLATFORM_ID);
  private productSub?: Subscription;

  private allProducts: FinancialProduct[] = [];
  protected displayProducts = signal<FinancialProduct[]>([]);
  
  protected searchTerm = signal<string>('');
  protected isLoading = signal<boolean>(false);
  
  protected isModalOpen = signal<boolean>(false);
  protected productToDelete = signal<FinancialProduct | null>(null);
  protected infoProduct: FinancialProduct | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  protected loadProducts(): void {
    this.isLoading.set(true);
    this.productSub?.unsubscribe();

    this.productSub = this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data || [];
        this.displayProducts.set(this.allProducts);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // Ejecutamos el filtrado por demanda explícita del usuario
  protected onSearchChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase().trim();
    this.searchTerm.set(input.value);

    if (!term) {
      this.displayProducts.set(this.allProducts);
      return;
    }

    const filtered = this.allProducts.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.description.toLowerCase().includes(term)
    );
    
    this.displayProducts.set(filtered);
  }

  protected onAddProduct(): void {
    if (this.router) this.router.navigate(['/products/add']);
  }

  protected onEditProduct(product: FinancialProduct): void {
    if (this.router) this.router.navigate([`/products/edit/${product.id}`]);
  }

  protected openDeleteModal(product: FinancialProduct): void {
    this.infoProduct = product;
    this.productToDelete.set(product);
    this.isModalOpen.set(true);
  }

  protected confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.allProducts = this.allProducts.filter(p => p.id !== product.id);
        this.displayProducts.set(this.allProducts);
        this.closeModal();
      },
      error: () => this.closeModal()
    });
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
    this.productToDelete.set(null);
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }
}
