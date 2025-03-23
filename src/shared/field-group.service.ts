import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldGroupService {
  private selectedGroupSubject = new BehaviorSubject<string>('AMC Installations - Tier 3');
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  private fieldGroupsSubject = new BehaviorSubject<{ name: string; description: string; elements: any[] }[]>([]);
  fieldGroups$ = this.fieldGroupsSubject.asObservable();

  private rightDrawerSubject = new BehaviorSubject<any>(null);
  rightDrawer$ = this.rightDrawerSubject.asObservable();

  constructor() {
    this.loadFieldGroups();
  }

  private loadFieldGroups() {
    const savedFieldGroups = localStorage.getItem('fieldGroups');
    if (savedFieldGroups) {
      this.fieldGroupsSubject.next(JSON.parse(savedFieldGroups));
    } else {
      const defaultFieldGroups = [
        {
          name: 'AMC Reports',
          description: 'Reports for AMC services',
          elements: [{ type: 'email', email: 'Email', description: "Enter customer's email", required: false }],
        },
        {
          name: 'HVAC Repair',
          description: 'Repair logs for HVAC systems',
          elements: [{ type: 'email', email: 'Email', description: "Enter customer's email", required: false }],
        },
        {
          name: 'AMC Yearly',
          description: 'Yearly maintenance contracts',
          elements: [{ type: 'email', email: 'Email', description: "Enter customer's email", required: false }],
        },
        {
          name: 'AMC Installations - Tier 3',
          description: 'Installation records for Tier 3',
          elements: [{ type: 'email', email: 'Email', description: "Enter customer's email", required: false }],
        },
      ];
      this.fieldGroupsSubject.next(defaultFieldGroups);
      this.saveFieldGroups();
    }
  }

  private saveFieldGroups() {
    localStorage.setItem('fieldGroups', JSON.stringify(this.fieldGroupsSubject.value));
  }

  getFieldGroups(): { name: string; description: string; elements: any[] }[] {
    return this.fieldGroupsSubject.value;
  }

  setSelectedGroup(group: string) {
    this.selectedGroupSubject.next(group);
  }

  getElementsForGroup(group: string): any[] {
    const selectedGroup = this.fieldGroupsSubject.value.find((g) => g.name === group);
    return selectedGroup ? selectedGroup.elements : [];
  }

  addFieldGroup(name: string, description: string) {
    const newGroup = { name, description, elements: [] };
    const updatedFieldGroups = [...this.fieldGroupsSubject.value, newGroup];
    this.fieldGroupsSubject.next(updatedFieldGroups);
    this.saveFieldGroups();
  }

  updateFieldGroup(oldName: string, newName: string, newDescription: string) {
    const updatedFieldGroups = this.fieldGroupsSubject.value.map((group) =>
      group.name === oldName ? { ...group, name: newName, description: newDescription } : group
    );
    this.fieldGroupsSubject.next(updatedFieldGroups);
    this.saveFieldGroups();
  }

  removeFieldGroup(groupName: string) {
    const updatedFieldGroups = this.fieldGroupsSubject.value.filter((group) => group.name !== groupName);
    this.fieldGroupsSubject.next(updatedFieldGroups);
    this.saveFieldGroups();
  }

  addElementToGroup(group: string, element: any) {
    const selectedGroup = this.fieldGroupsSubject.value.find((g) => g.name === group);
    if (selectedGroup) {
      selectedGroup.elements.push(element);
      this.fieldGroupsSubject.next([...this.fieldGroupsSubject.value]);
      this.saveFieldGroups();
    }
  }
  
  removeElementFromGroup(group: string, index: number) {
    const selectedGroup = this.fieldGroupsSubject.value.find((g) => g.name === group);
    if (selectedGroup) {
      selectedGroup.elements.splice(index, 1);
      this.fieldGroupsSubject.next([...this.fieldGroupsSubject.value]);
      this.saveFieldGroups();
    }
  }
  
  updateElementsOrder(group: string, elements: any[]) {
    const selectedGroup = this.fieldGroupsSubject.value.find((g) => g.name === group);
    if (selectedGroup) {
      selectedGroup.elements = elements;
      this.fieldGroupsSubject.next([...this.fieldGroupsSubject.value]);
      this.saveFieldGroups();
    }
  }

  openRightDrawer(element: any) {
    this.rightDrawerSubject.next(element);
  }

  updateElement(updatedElement: any) {
    const selectedGroup = this.fieldGroupsSubject.value.find((g) => g.name === this.selectedGroupSubject.value);
    if (selectedGroup) {
      const index = selectedGroup.elements.findIndex((e) => e === updatedElement);
      if (index !== -1) {
        selectedGroup.elements[index] = updatedElement;
        this.fieldGroupsSubject.next([...this.fieldGroupsSubject.value]);
        this.saveFieldGroups();
      }
    }
  }

}