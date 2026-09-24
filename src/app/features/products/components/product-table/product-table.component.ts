import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialProduct } from '../../models/financial-product.model';
import { DropdownMenuComponent, DropdownOption } from '../../../../shared/components/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent {
  protected currentPage = signal<number>(1);
  protected pageSize = signal<number>(5);

  protected _products = signal<FinancialProduct[]>([]);


  @Input() set products(value: FinancialProduct[]) {
    this._products.set(value || []);
    
    setTimeout(() => {
      this.currentPage.set(1);
    }, 0);
  }

  @Output() editRequested = new EventEmitter<FinancialProduct>();
  @Output() deleteRequested = new EventEmitter<FinancialProduct>();

  protected tableActions: DropdownOption[] = [
    { id: 'edit', label: 'Editar', icon: '✏️' },
    { id: 'delete', label: 'Eliminar', icon: '🗑️', danger: true }
  ];

  protected totalRecords = computed(() => this._products().length);

  protected pagedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this._products().slice(startIndex, startIndex + this.pageSize());
  });

  protected onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    
    setTimeout(() => {
      this.currentPage.set(1);
    }, 0);
  }

  protected onActionSelected(optionId: string, product: FinancialProduct): void {
    if (optionId === 'edit') {
      this.editRequested.emit(product);
    } else if (optionId === 'delete') {
      this.deleteRequested.emit(product);
    }
  }
}
