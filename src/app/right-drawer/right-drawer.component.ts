import { Component, OnInit } from '@angular/core';
import { FieldGroupService } from '../../shared/field-group.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-right-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './right-drawer.component.html',
  styleUrl: './right-drawer.component.css',
})
export class RightDrawerComponent implements OnInit {
  element: any = null;
  isOpen = false; 
  editForm!: FormGroup;
  submitted = false;

  constructor(private fieldGroupService: FieldGroupService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      description: [''], 
      required: [false],
    });
    this.fieldGroupService.rightDrawer$.subscribe((element) => {
      if (element) {
        this.element = element;
        this.isOpen = true;
        this.editForm.patchValue({
          email: element.email,
          description: element.description,
          required: element.required,
        });
      } else {
        this.isOpen = false;
        this.element = null;
        this.editForm.reset();
      }
    });
  }

  saveChanges() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    this.element.label = this.editForm.value.label;
    this.element.description = this.editForm.value.description;
    this.element.required = this.editForm.value.required;
    this.fieldGroupService.updateElement(this.element);
    this.closeDrawer();
  }

  closeDrawer() {
    this.fieldGroupService.openRightDrawer(null);
    this.submitted = false;
  }
  
}
