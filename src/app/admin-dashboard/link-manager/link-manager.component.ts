import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { ContentService } from '../../services/content.service';
import { Post } from '../../models/post';
import { PostEditorComponent } from '../post-editor/post-editor.component'; // Importieren

@Component({
  selector: 'app-link-manager',
  imports: [CommonModule],
  templateUrl: './link-manager.component.html',
  styleUrl: './link-manager.component.css'
})
export class LinkManagerComponent implements OnInit{
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}
