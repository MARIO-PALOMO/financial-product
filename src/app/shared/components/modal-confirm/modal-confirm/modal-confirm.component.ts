import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-modal-confirm',
  styleUrl: './modal-confirm.component.scss',
  templateUrl: './modal-confirm.component.html',
     standalone: true,
})
export class ModalConfirmComponent {

  @Input() isOpen = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  protected onConfirm(): void {
    this.confirmed.emit();
    this.isOpen = false;
  }

  protected onCancel(): void {
    this.canceled.emit();
    this.isOpen = false;
  }
}
