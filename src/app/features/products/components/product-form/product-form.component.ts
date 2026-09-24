import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialProduct } from '../../models/financial-product.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-product-form',
  styleUrl: './product-form.component.scss',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
})
export class ProductFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  protected productForm!: FormGroup;
  protected isEditMode = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');

  ngOnInit(): void {
    this.initForm();
    
    if (isPlatformBrowser(this.platformId)) {
      this.checkEditMode();
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.validateReleaseDate]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
    });

    //Autocalcular de forma reactiva la fecha de revisión (exactamente 1 año después)
    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      this.calculateRevisionDate(value);
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productForm.get('id')?.disable();
      this.loadProductForEdit(id);
    }
  }

  private loadProductForEdit(id: string): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        const product = products.find(p => p.id === id);
        if (product) {
      
          this.productForm.patchValue({
            ...product,
            date_release: this.formatDate(product.date_release),
            date_revision: this.formatDate(product.date_revision)
          });
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  protected onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const productData: FinancialProduct = this.productForm.getRawValue();

    const request$ = this.isEditMode()
      ? this.productService.updateProduct(productData.id, productData)
      : this.productService.createProduct(productData);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.onReset();
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Ocurrió un error al procesar el producto.');
        this.isLoading.set(false);
      }
    });
  }

  protected onReset(): void {
    this.productForm.reset();
    if (!this.isEditMode()) {
      this.productForm.get('id')?.enable();
    }
    this.router.navigate(['/']);
  }

  //Validador personalizado: La fecha debe ser igual o mayor a hoy (UTC/Local sin horas)
  private validateReleaseDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const inputDate = new Date(control.value + 'T00:00:00');
    
    return inputDate >= today ? null : { invalidReleaseDate: true };
  }

  private calculateRevisionDate(releaseDateStr: string): void {
    if (!releaseDateStr) {
      this.productForm.get('date_revision')?.setValue('');
      return;
    }

    const releaseDate = new Date(releaseDateStr + 'T00:00:00');
    releaseDate.setFullYear(releaseDate.getFullYear() + 1);
    
    this.productForm.get('date_revision')?.setValue(this.formatDate(releaseDate));
  }

  private formatDate(dateInput: string | Date): string {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }
}
