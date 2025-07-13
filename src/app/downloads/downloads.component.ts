// src/app/downloads/downloads.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../services/download.service';
import { Download } from '../models/download';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.css'
})
export class DownloadsComponent implements OnInit {
  downloads: Download[] = [];

  constructor(private downloadService: DownloadService) { }

  ngOnInit(): void {
    this.loadDownloads();
  }

  loadDownloads(): void {
    this.downloadService.getDownloads().subscribe({
      next: (data) => {
        this.downloads = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Downloads:', err);
      }
    });
  }

  onDownloadClick(downloadUrl: string, title: string): void {
    // In einer echten Anwendung würden Sie hier vielleicht eine Zählung implementieren
    // oder komplexere Logik, bevor der Download gestartet wird.
    // Für jetzt leiten wir einfach zur Download-URL weiter.
    window.open(downloadUrl, '_blank');
    console.log(`Download gestartet für: ${title}`);
  }
}
