import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldGroupService } from '../../shared/field-group.service';

export interface FormElement {
  id: number;
  type: string;
  email: string;
  description?: string;
  required?: boolean;
}

@Component({
  selector: 'app-middle-pane',
  standalone: true,
  imports: [FormsModule, CommonModule,DragDropModule],
  templateUrl: './middle-pane.component.html',
  styleUrl: './middle-pane.component.css'
})
export class MiddlePaneComponent implements OnInit{

  selectedGroup: string = '';
  selectedGroupDescription: string = '';
  formElements: any[] = [];

  constructor(private fieldGroupService: FieldGroupService) {}

  ngOnInit(): void {
    this.fieldGroupService.selectedGroup$.subscribe((group) => {
      this.selectedGroup = group;
      const selectedGroupData = this.fieldGroupService.getFieldGroups().find((g) => g.name === group);
      this.selectedGroupDescription = selectedGroupData?.description || '';
      this.formElements = selectedGroupData?.elements || [];
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formElements, event.previousIndex, event.currentIndex);
      this.fieldGroupService.updateElementsOrder(this.selectedGroup, this.formElements);
    } else {
      const element = JSON.parse(event.item.data);
      this.fieldGroupService.addElementToGroup(this.selectedGroup, element);
      this.formElements = this.fieldGroupService.getElementsForGroup(this.selectedGroup);
    }
  }

  deleteElement(index: number) {
    if (confirm('Are you sure you want to delete this element?')) {
      this.fieldGroupService.removeElementFromGroup(this.selectedGroup, index);
      this.formElements.splice(index, 1);
    }
  }
  
  editElement(index: number) {
    this.fieldGroupService.openRightDrawer(this.formElements[index]);
  }
  
}
