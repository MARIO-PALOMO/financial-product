import { ElementRef, Injector, runInInjectionContext } from '@angular/core';
import { DropdownMenuComponent, DropdownOption } from './dropdown-menu.component';

describe('DropdownMenuComponent', () => {
  let component: DropdownMenuComponent;
  let mockElementRef: jest.Mocked<ElementRef>;

  const mockOptions: DropdownOption[] = [
    { id: 'edit', label: 'Editar', icon: '✏️' },
    { id: 'delete', label: 'Eliminar', icon: '🗑️', danger: true }
  ];

  beforeEach(() => {

    mockElementRef = {
      nativeElement: {
        contains: jest.fn()
      }
    };

    const customInjector = Injector.create({
      providers: [
        { provide: ElementRef, useValue: mockElementRef }
      ]
    });

    runInInjectionContext(customInjector, () => {
      component = new DropdownMenuComponent();
    });

    component.options = mockOptions;
  });

  it('Debería crear el componente desplegable', () => {
    expect(component).toBeTruthy();
    expect(component['isOpen']).toBeFalsy();
  });

  it('Debería cambiar el estado de isOpen a true cuando se llama a toggle', () => {
    component.toggle();
    expect(component['isOpen']).toBeTruthy();

    component.toggle();
    expect(component['isOpen']).toBeFalsy();
  });

  it('Debería emitir el evento optionSelected y cerrar el menú desplegable cuando se selecciona un elemento', () => {
    jest.spyOn(component.optionSelected, 'emit');
    component.toggle();

    component['onSelect']('edit');

    expect(component.optionSelected.emit).toHaveBeenCalledWith('edit');
    expect(component['isOpen']).toBeFalsy();
  });

  it('Debería cerrar el menú desplegable si clickOutside se dispara fuera del componente', () => {
    component.toggle();
    expect(component['isOpen']).toBeTruthy();

    mockElementRef.nativeElement.contains.mockReturnValue(false);

    const dummyEvent = { target: document.body } as any;
    component['clickOutside'](dummyEvent);

    expect(component['isOpen']).toBeFalsy();
  });

  it('Debería no cerrar el menú desplegable si clickOutside se dispara dentro del componente', () => {
    component.toggle();
    expect(component['isOpen']).toBeTruthy();

    mockElementRef.nativeElement.contains.mockReturnValue(true);

    const dummyEvent = { target: document.createElement('button') } as any;
    component['clickOutside'](dummyEvent);

    expect(component['isOpen']).toBeTruthy();
  });
});
