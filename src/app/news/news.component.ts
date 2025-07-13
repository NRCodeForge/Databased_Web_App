// src/app/news/news.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { Post } from '../models/post';
// import { SectionFormatComponent } from '../section-format/section-format.component'; // Entfernen, wenn nicht verwendet

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule /*, SectionFormatComponent*/], // Entfernen, wenn nicht verwendet
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  posts: Post[] = [];

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.contentService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
