import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, Output, EventEmitter, HostListener } from '@angular/core';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
  danger?: boolean;
}

@Component({
  imports: [CommonModule],
  selector: 'app-dropdown-menu',
  styleUrl: './dropdown-menu.component.scss',
  templateUrl: './dropdown-menu.component.html',
     standalone: true,
})
export class DropdownMenuComponent {

  private elementRef = inject(ElementRef);
  @Input() options: DropdownOption[] = [];
  @Output() optionSelected = new EventEmitter<string>();

  protected isOpen = false;

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

  protected onSelect(optionId: string): void {
    this.optionSelected.emit(optionId);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  protected clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
