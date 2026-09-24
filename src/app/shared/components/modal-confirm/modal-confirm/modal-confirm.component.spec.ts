import { ModalConfirmComponent } from './modal-confirm.component';

describe('ModalConfirmComponent', () => {
  let component: ModalConfirmComponent;

  beforeEach(() => {
    component = new ModalConfirmComponent();
  });

  it('Debería crear el componente modal de confirmación de eliminación', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen).toBeFalsy();
    expect(component.title).toBe('¿Estás seguro?');
  });

  it('Debería emitir el evento confirmed y cerrar el modal cuando se llama a onConfirm', () => {
    jest.spyOn(component.confirmed, 'emit');
    component.isOpen = true;

    component['onConfirm']();

    expect(component.confirmed.emit).toHaveBeenCalled();
    expect(component.isOpen).toBeFalsy();
  });

  it('Debería emitir el evento canceled y cerrar el modal cuando se llama a onCancel', () => {
    jest.spyOn(component.canceled, 'emit');
    component.isOpen = true;

    component['onCancel']();

    expect(component.canceled.emit).toHaveBeenCalled();
    expect(component.isOpen).toBeFalsy();
  });
});
