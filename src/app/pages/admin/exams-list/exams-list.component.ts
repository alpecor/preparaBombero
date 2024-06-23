import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-exams-list',
  standalone: true,
  imports: [QuillEditorComponent, FormsModule, HeaderComponent],
  templateUrl: './exams-list.component.html',
  styleUrl: './exams-list.component.css'
})
export class ExamsListComponent {
  editorModel = [{
    attributes: {
      font: 'roboto'
    },
    insert: 'test'
  }]
}
