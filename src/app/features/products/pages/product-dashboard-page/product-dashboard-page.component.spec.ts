import { Injector, runInInjectionContext, ErrorHandler, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductDashboardPageComponent } from './product-dashboard-page.component';
import { ProductService } from '../../services/product.service';
import { FinancialProduct } from '../../models/financial-product.model';

describe('ProductDashboardPageComponent', () => {
  let component: ProductDashboardPageComponent;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let customInjector: Injector;

  const mockProducts: FinancialProduct[] = [
    { id: 't1', name: 'Visa Gold', description: 'Crédito oro corporativo', logo: 'g.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 't2', name: 'Cuenta Ahorro', description: 'Débito cuenta banco', logo: 'd.png', date_release: '2026-01-01', date_revision: '2027-01-01' }
  ];

  beforeEach(() => {
    mockProductService = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Deleted successfully' }))
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    customInjector = Injector.create({
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ErrorHandler, useClass: ErrorHandler },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    runInInjectionContext(customInjector, () => {
      component = new ProductDashboardPageComponent();
    });
  });

  it('Debería crear la página del dashboard y cargar productos desde el servicio', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component['allProducts'].length).toBe(2);
  });

  it('Debería apagar el estado isLoading incluso si el servicio de productos responde con un error', () => {
    mockProductService.getProducts.mockReturnValue(throwError(() => new Error('Error de red')));
    component.ngOnInit();
    expect(component['isLoading']()).toBe(false);
    expect(component['displayProducts']().length).toBe(0);
  });

  it('Debería filtrar los productos financieros reactivamente usando el buscador', () => {
    component.ngOnInit();
    const dummyEvent = { target: { value: 'Visa' } } as any;
    component['onSearchChanged'](dummyEvent);
    expect(component['displayProducts']().length).toBe(1);

    const emptyEvent = { target: { value: '' } } as any;
    component['onSearchChanged'](emptyEvent);
    expect(component['displayProducts']().length).toBe(2);
  });

  it('Debería redirigir al usuario al formulario de adición al invocar onAddProduct', () => {
    component['onAddProduct']();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('Debería redirigir al usuario a la vista de edición enviando el ID por parámetro de ruta', () => {
    const targetProduct = mockProducts[0];
    component['onEditProduct'](targetProduct);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/products/edit/${targetProduct.id}`]);
  });

  it('Debería abrir el modal de confirmación y guardar la referencia del producto al intentar eliminar', () => {
    const targetProduct = mockProducts[0];
    component['openDeleteModal'](targetProduct);
    expect(component['isModalOpen']()).toBe(true);
  });

  it('No debería invocar al servicio de eliminación si productToDelete es nulo', () => {
    component['productToDelete'].set(null);
    component['confirmDelete']();
    expect(mockProductService.deleteProduct).not.toHaveBeenCalled();
  });

  it('Debería cerrar el modal de confirmación si el servicio de eliminación falla', () => {
    mockProductService.deleteProduct.mockReturnValue(throwError(() => new Error('Error al borrar')));
    component['productToDelete'].set(mockProducts[0]);
    component['confirmDelete']();
    expect(component['isModalOpen']()).toBe(false);
  });

  it('Debería procesar la eliminación en el servicio y actualizar la rejilla localmente al confirmar', () => {
    component.ngOnInit();
    component['openDeleteModal'](mockProducts[0]);
    component['confirmDelete']();
    expect(component['displayProducts']().length).toBe(1);
  });

  it('Debería cerrar el modal de confirmación y limpiar la referencia al cancelar', () => {
    component['openDeleteModal'](mockProducts[0]);
    component['closeModal']();
    expect(component['isModalOpen']()).toBe(false);
  });
});
