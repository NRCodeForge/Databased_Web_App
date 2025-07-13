import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { Post } from '../models/post';

/**
 * Komponente zur Anzeige von News-Beiträgen.
 * Lädt Beiträge beim Initialisieren und zeigt sie in der Ansicht an.
 *
 * @export
 * @class NewsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  /** Array von geladenen Beiträgen */
  posts: Post[] = [];

  /**
   * Erstellt eine neue Instanz von NewsComponent.
   *
   * @param contentService Service zum Abrufen der Beiträge
   */
  constructor(private contentService: ContentService) { }

  /**
   * Lifecycle-Hook: Wird nach der Initialisierung der Komponente aufgerufen.
   * Lädt die Beiträge vom Service.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadPosts();
  }

  /**
   * Lädt Beiträge vom ContentService und weist sie der lokalen Variable `posts` zu.
   *
   * @returns {void}
   */
  loadPosts(): void {
    this.contentService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
