import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../../services/download.service';
import { Download } from '../../models/download';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-download-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './download-form-modal.component.html',
  styleUrls: ['./download-form-modal.component.css']
})
export class DownloadFormModalComponent implements OnInit {
  @Input() download: Partial<Download> | null = null;
  @Input() currentUserId: number | null = null;
  @Output() downloadSaved = new EventEmitter<Download>();
  @Output() cancelEdit = new EventEmitter<void>();

  selectedShowcaseImageFile: File | null = null;
  selectedDownloadFile: File | null = null;
  showcaseImagePreviewUrl: string | null = null;
  showSuccessMessage: boolean = false;
  successMessageText: string = '';

  constructor(
    private downloadService: DownloadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.download && this.download.showcaseImage) {
      this.showcaseImagePreviewUrl = this.download.showcaseImage;
    }
  }

  onFileSelected(event: Event, type: 'showcase' | 'download'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'showcase') {
        this.selectedShowcaseImageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.showcaseImagePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedDownloadFile = file;
      }
    } else {
      if (type === 'showcase') {
        this.selectedShowcaseImageFile = null;
        this.showcaseImagePreviewUrl = this.download?.showcaseImage || null;
      } else {
        this.selectedDownloadFile = null;
      }
    }
  }

  onSaveDownload(): void {
    if (!this.download || !this.download.title) {
      alert('Titel ist erforderlich.');
      return;
    }
    if (!this.download.id && !this.selectedDownloadFile) {
      alert('Eine Download-Datei ist für neue Einträge erforderlich.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.download.title);
    if (this.download.description) {
      formData.append('description', this.download.description);
    }

    if (this.selectedShowcaseImageFile) {
      formData.append('showcaseImage', this.selectedShowcaseImageFile, this.selectedShowcaseImageFile.name);
    } else if (this.download.showcaseImage) {
      formData.append('showcaseImage', this.download.showcaseImage);
    }

    if (this.selectedDownloadFile) {
      formData.append('downloadFile', this.selectedDownloadFile, this.selectedDownloadFile.name);
    } else if (this.download.downloadUrl) {
      formData.append('downloadUrl', this.download.downloadUrl);
    }

    formData.append('userId', String(this.currentUserId || 0));
    if (this.download.order !== undefined && this.download.order !== null) {
      formData.append('order', String(this.download.order));
    }

    if (this.download.id) {
      this.downloadService.updateDownloadWithFiles(this.download.id, formData).subscribe({
        next: (savedDownload) => {
          this.showSuccessMessage = true;
          this.successMessageText = 'Download erfolgreich aktualisiert!';
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.downloadSaved.emit(savedDownload);
          }, 2000);
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren des Downloads:', err);
          alert('Fehler beim Aktualisieren des Downloads.');
        }
      });
    } else {
      this.downloadService.createDownloadWithFiles(formData).subscribe({
        next: (savedDownload) => {
          this.showSuccessMessage = true;
          this.successMessageText = 'Download erfolgreich hinzugefügt!';
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.downloadSaved.emit(savedDownload);
          }, 2000);
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen des Downloads:', err);
          alert('Fehler beim Hinzufügen des Downloads.');
        }
      });
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}
