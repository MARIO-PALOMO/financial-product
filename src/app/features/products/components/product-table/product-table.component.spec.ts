import { ProductTableComponent } from './product-table.component';
import { FinancialProduct } from '../../models/financial-product.model';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;

  const mockProducts: FinancialProduct[] = [
    { id: 'prd-1', name: 'Producto A', description: 'Descripción A', logo: 'prd-1.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 'prd-2', name: 'Producto B', description: 'Descripción B', logo: 'prd-2.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 'prd-3', name: 'Producto C', description: 'Descripción C', logo: 'prd-3.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 'prd-4', name: 'Producto D', description: 'Descripción D', logo: 'prd-4.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 'prd-5', name: 'Producto E', description: 'Descripción E', logo: 'prd-5.png', date_release: '2026-01-01', date_revision: '2027-01-01' },
    { id: 'prd-6', name: 'Producto F', description: 'Descripción F', logo: 'prd-6.png', date_release: '2026-01-01', date_revision: '2027-01-01' }
  ];

  beforeEach(() => {
    component = new ProductTableComponent();
    component.products = mockProducts;
  });

  it('Debería crear el componente de la tabla', () => {
    expect(component).toBeTruthy();
    expect(component['totalRecords']()).toBe(6);
  });

  it('Debería manejar de forma segura si la entrada de productos es nula', () => {
    component.products = null as any;
    expect(component['totalRecords']()).toBe(0);
  });

  it('Debería dividir el array de productos según el límite de tamaño de página', () => {
    component['pageSize'].set(5);
    expect(component['pagedProducts']().length).toBe(5);
    expect(component['pagedProducts']()[0].id).toBe('prd-1');
  });

  it('Debería reiniciar la página actual a 1 cuando cambia la entrada de productos', async () => {
    component['currentPage'].set(2);
    component.products = [mockProducts[0]];
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component['currentPage']()).toBe(1);
  });

  it('Debería cambiar el tamaño de página y reiniciar la página actual cuando se activa onPageSizeChange', async () => {
    const dummyEvent = { target: { value: '10' } } as any;
    component['currentPage'].set(2);
    component['onPageSizeChange'](dummyEvent);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component['pageSize']()).toBe(10);
    expect(component['currentPage']()).toBe(1);
  });

  it('Debería emitir el evento editRequested cuando se selecciona la acción de edición', () => {
    jest.spyOn(component.editRequested, 'emit');
    const targetProduct = mockProducts[0];
    component['onActionSelected']('edit', targetProduct);
    expect(component.editRequested.emit).toHaveBeenCalledWith(targetProduct);
  });

  it('Debería emitir el evento deleteRequested cuando se selecciona la acción de eliminación', () => {
    jest.spyOn(component.deleteRequested, 'emit');
    const targetProduct = mockProducts[0];
    component['onActionSelected']('delete', targetProduct);
    expect(component.deleteRequested.emit).toHaveBeenCalledWith(targetProduct);
  });

  it('No debería emitir ningún evento si la acción seleccionada es inválida', () => {
    jest.spyOn(component.editRequested, 'emit');
    jest.spyOn(component.deleteRequested, 'emit');
    component['onActionSelected']('unknown-action', mockProducts[0]);
    expect(component.editRequested.emit).not.toHaveBeenCalled();
    expect(component.deleteRequested.emit).not.toHaveBeenCalled();
  });
});
