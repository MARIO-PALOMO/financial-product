import { createEnvironmentInjector, ErrorHandler, Injector, PendingTasks } from '@angular/core';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http'; // 🟢 Inyectamos la desactivación de XSRF
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ProductService } from './product.service';
import { FinancialProduct } from '../models/financial-product.model';
import { API_URL } from '../../../core/services/api-service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockApiUrl = 'http://localhost:3002';

  const mockProducts: FinancialProduct[] = [
    {
      id: 'uno',
      name: 'Tarjeta de Crédito Oro',
      description: 'Tarjeta de consumo preferencial bajo la modalidad de crédito',
      logo: 'visa-oro.png',
      date_release: '2026-01-01',
      date_revision: '2027-01-01'
    }
  ];

  beforeEach(() => {
    const injector = createEnvironmentInjector(
      [
        provideHttpClient(withNoXsrfProtection()),
        provideHttpClientTesting(),
        ProductService,
        { provide: API_URL, useValue: mockApiUrl },
        { provide: ErrorHandler, useClass: ErrorHandler },
        { provide: PendingTasks, useValue: { add: () => () => { }, remove: () => { } } }
      ],
      Injector.create({ providers: [] }) as any
    );

    service = injector.get(ProductService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería recuperar productos financieros (GET) y asignar la propiedad de datos', async () => {
    const productsPromise = firstValueFrom(service.getProducts());

    const req = httpMock.expectOne((request) => request.method === 'GET');
    req.flush({ data: mockProducts });

    const result = await productsPromise;
    expect(result.length).toBe(1);
  });

  it('Debería verificar si un ID existe (GET)', async () => {
    const verifyPromise = firstValueFrom(service.verifyIdExists('uno'));

    const req = httpMock.expectOne((request) => request.method === 'GET');
    req.flush(true);

    const result = await verifyPromise;
    expect(result).toBe(true);
  });

  it('Debería crear un nuevo producto financiero (POST)', async () => {
    const newProduct = mockProducts[0];
    const createPromise = firstValueFrom(service.createProduct(newProduct));

    const req = httpMock.expectOne((request) => request.method === 'POST');
    req.flush({ message: 'Producto creado exitosamente' });

    const result = await createPromise;
    expect(result.message).toBe('Producto creado exitosamente');
  });

  it('should handle HTTP error gracefully across streams', async () => {
    const errorPromise = firstValueFrom(service.getProducts());

    const req = httpMock.expectOne((request) => request.method === 'GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });

    await expect(errorPromise).rejects.toBeTruthy();
  });


  it('Debería eliminar un producto financiero (DELETE)', async () => {
    const deletePromise = firstValueFrom(service.deleteProduct('uno'));

    const req = httpMock.expectOne((request) => request.method === 'DELETE');
    req.flush({ message: 'Producto eliminado exitosamente' });

    const result = await deletePromise;
    expect(result.message).toBe('Producto eliminado exitosamente');
  });
});
