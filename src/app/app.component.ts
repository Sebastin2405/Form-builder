import { Component, OnInit } from '@angular/core';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { RightPaneComponent } from './right-pane/right-pane.component';
import { FormElement, MiddlePaneComponent } from './middle-pane/middle-pane.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RightDrawerComponent } from './right-drawer/right-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeftPaneComponent,RightPaneComponent,MiddlePaneComponent,CommonModule,DragDropModule,FormsModule,RightDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'form-builder';

  selectedGroup: any = null;
  formElements: FormElement[] = [];
  selectedElement: FormElement | null = null;
  isPreviewMode = false; 

  constructor(){}
  ngOnInit(): void {
    
  }

  onGroupSelect(group: any) {
    this.selectedGroup = group;
    this.formElements = [];
  }

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;
  }

  onElementDropped(element: FormElement) {
    this.formElements.push({ ...element, id: Date.now() });
  }

  onElementEdit(element: FormElement) {
    this.selectedElement = element;
  }

  onElementUpdate(updatedElement: FormElement) {
    this.formElements = this.formElements.map(el =>
      el.id === updatedElement.id ? updatedElement : el
    );
  }

  onDeleteElement(id: number) {
    this.formElements = this.formElements.filter(el => el.id !== id);
    if (this.selectedElement?.id === id) {
      this.selectedElement = null;
    }
  }
  
}
