import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldGroupService } from '../../shared/field-group.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-left-pane',
  standalone: true,
  imports: [FormsModule,CommonModule,DragDropModule,ReactiveFormsModule],
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.css'
})
export class LeftPaneComponent implements OnInit {

  fieldGroups: { name: string; description: string; elements: any[] }[] = [];
  selectedGroup: string = '';
  newGroupName = '';
  newGroupDescription = '';
  showCreateGroupFields = false;
  createGroupForm: FormGroup;
  submitted = false;

  constructor(private fieldGroupService: FieldGroupService, private fb: FormBuilder) {
    this.createGroupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.fieldGroupService.fieldGroups$.subscribe((fieldGroups) => {
      this.fieldGroups = fieldGroups;
      if (fieldGroups.length > 0) {
        this.selectedGroup = fieldGroups[0].name;
        this.fieldGroupService.setSelectedGroup(this.selectedGroup);
      }
    });
  }

  selectGroup(groupName: string) {
    this.selectedGroup = groupName;
    this.fieldGroupService.setSelectedGroup(groupName);
  }

  toggleCreateGroupFields() {
    this.showCreateGroupFields = !this.showCreateGroupFields;
    if (this.showCreateGroupFields) {
      this.createGroupForm.reset(); 
    }
  }

  createGroup() {
    this.submitted = true;
    if (this.createGroupForm.invalid) {
      return;
    }
    const { name, description } = this.createGroupForm.value;
    this.fieldGroupService.addFieldGroup(name.trim(), description.trim());
    this.createGroupForm.reset();
    this.submitted = false;
    this.showCreateGroupFields = false;
  }
  
  get f() {
    return this.createGroupForm.controls;
  }

  editGroup(index: number) {
    const newName = prompt('Enter new name for the group:', this.fieldGroups[index].name);
    const newDescription = prompt('Enter new description for the group:', this.fieldGroups[index].description);
    if (newName && newName.trim()) {
      this.fieldGroupService.updateFieldGroup(
        this.fieldGroups[index].name,
        newName.trim(),
        newDescription?.trim() || ''
      );
    }
  }

  deleteGroup(index: number) {
    if (confirm('Are you sure you want to delete this group?')) {
      this.fieldGroupService.removeFieldGroup(this.fieldGroups[index].name);
    }
  }

  drop(event: CdkDragDrop<any[]>, groupName: string) {
    const group = this.fieldGroups.find((g) => g.name === groupName);
    if (group) {
      if (event.previousContainer === event.container) {
        moveItemInArray(group.elements, event.previousIndex, event.currentIndex);
      } else {
        const element = JSON.parse(event.item.data);
        group.elements.push(element);
      }
    }
  }
  
  dropGroup(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);
  }

  deleteElement(groupName: string, index: number) {
    const group = this.fieldGroups.find((g) => g.name === groupName);
    if (group) {
      group.elements.splice(index, 1);
    }
  }

}
