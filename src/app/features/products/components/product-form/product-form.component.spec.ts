import { Injector, runInInjectionContext, ErrorHandler, PLATFORM_ID } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const mockProduct = {
    id: 'abc-123',
    name: 'Tarjeta Oro',
    description: 'Descripción válida de diez caracteres',
    logo: 'gold.png',
    date_release: '2026-12-01',
    date_revision: '2027-12-01'
  };

  beforeEach(() => {
    mockProductService = {
      createProduct: jest.fn().mockReturnValue(of({ message: 'Success' })),
      getProducts: jest.fn().mockReturnValue(of([mockProduct]))
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null) // Por defecto modo creación
        }
      }
    };

    const customInjector = Injector.create({
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ErrorHandler, useClass: ErrorHandler },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    runInInjectionContext(customInjector, () => {
      component = new ProductFormComponent();
    });
  });

  it('Debería inicializar el formulario vacío en modo creación', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component['isEditMode']()).toBeFalsy();
    expect(component['productForm'].get('id')?.enabled).toBeTruthy();
  });

  it('Debería autocalcular la fecha de revisión sumando un año a la fecha de liberación', () => {
    component.ngOnInit();
    const releaseControl = component['productForm'].get('date_release');
    
    releaseControl?.setValue('2026-05-15');

    expect(component['productForm'].get('date_revision')?.value).toBe('2027-05-15');
  });

  it('Debería marcar errores de validación si los campos no cumplen las reglas de negocio', () => {
    component.ngOnInit();
    const nameControl = component['productForm'].get('name');

    nameControl?.setValue('No'); // Menos de 5 caracteres
    expect(nameControl?.valid).toBeFalsy();

    nameControl?.setValue('Nombre Válido');
    expect(nameControl?.valid).toBeTruthy();
  });

  it('Debería rechazar fechas de liberación anteriores a la fecha actual', () => {
    component.ngOnInit();
    const dateControl = component['productForm'].get('date_release');

    dateControl?.setValue('2020-01-01'); // Fecha del pasado
    expect(dateControl?.hasError('invalidReleaseDate')).toBeTruthy();
  });

  it('Debería invocar el servicio de guardado si el formulario es 100% válido', () => {
    component.ngOnInit();
    component['productForm'].patchValue(mockProduct);

    component['onSubmit']();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('No debería guardar y debería marcar campos si el formulario es inválido', () => {
    component.ngOnInit();
    component['onSubmit']();

    expect(mockProductService.createProduct).not.toHaveBeenCalled();
  });

  it('Debería capturar errores del backend y desplegar el mensaje de alerta', () => {
    mockProductService.createProduct.mockReturnValue(throwError(() => ({
      error: { message: 'El ID ya existe' }
    })));
    
    component.ngOnInit();
    component['productForm'].patchValue(mockProduct);
    component['onSubmit']();

    expect(component['errorMessage']()).toBe('El ID ya existe');
    expect(component['isLoading']()).toBeFalsy();
  });
});
