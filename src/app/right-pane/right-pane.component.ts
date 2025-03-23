import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FieldGroupService } from '../../shared/field-group.service';

@Component({
  selector: 'app-right-pane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-pane.component.html',
  styleUrl: './right-pane.component.css'
})
export class RightPaneComponent implements OnInit {

  textElements = [
    { icon: 'fas fa-font', title: 'Single Line Text', subtitle: 'Single text area' },
    { icon: 'fas fa-align-left', title: 'Multi Line Text', subtitle: 'Multi text area' },
    { icon: 'fas fa-hashtag', title: 'Integer', subtitle: 'Integer type area' },
  ];

  dateElements = [
    { icon: 'fas fa-calendar-alt', title: 'Date', subtitle: 'Select date from datepicker.' },
    { icon: 'fas fa-clock', title: 'Time', subtitle: 'Select time from timepicker.' },
    { icon: 'fas fa-calendar', title: 'Date & Time', subtitle: 'Select date & time from picker.' },
  ];

  multiElements = [
    { icon: 'fas fa-check-circle', title: 'Single Selection', subtitle: 'Select single option.' },
    { icon: 'fas fa-check-square', title: 'Multi Selection', subtitle: 'Select multiple options.' },
    { icon: 'fas fa-caret-down', title: 'Dropdown', subtitle: 'Select options from dropdown.' },
  ];

  mediaElements = [
    { icon: 'fas fa-upload', title: 'Upload', subtitle: 'Upload documents/media files.' },
  ];

  constructor(private fieldGroupService: FieldGroupService) {}

  ngOnInit(): void {}

  onDragStart(event: DragEvent, element: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(element));
  }

}
