import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { ContentService } from '../../services/content.service';
import { Post } from '../../models/post';
import { PostEditorComponent } from '../post-editor/post-editor.component'; // Importieren

@Component({
  selector: 'app-content-manager',
  standalone: true, // Sicherstellen, dass die Komponente eigenständig ist
  imports: [CommonModule, PostEditorComponent], // CommonModule und PostEditorComponent hinzufügen
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent implements OnInit {
  posts: Post[] = [];
  selectedPost: Post | null = null;
  showPostEditor = false;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.contentService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  editPost(post: Post): void {
    this.selectedPost = post;
    this.showPostEditor = true;
  }

  addPost(): void {
    this.selectedPost = null;
    this.showPostEditor = true;
  }

  onPostSaved(post: Post): void {
    this.showPostEditor = false;
    this.loadPosts();
  }
}
