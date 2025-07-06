import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page-views-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #pageViewsCanvas></canvas>
    </div>
  `,
  styles: [`.chart-container { position: relative; height: 150px; }`]
})
export class PageViewsChartComponent implements OnInit, AfterViewInit {
  @ViewChild('pageViewsCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  private http = inject(HttpClient);
  private chart: Chart | undefined;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.http.get<any[]>('/api/page-views').subscribe(data => {
      const labels = data.map(item => new Date(item.Tag).toLocaleDateString('de-DE'));
      const values = data.map(item => item.Aufrufe);
      this.createChart(labels, values);
    });
  }

  createChart(labels: string[], data: number[]): void {
    if (this.canvas) {
      const context = this.canvas.nativeElement.getContext('2d');
      if (context) {
        this.chart = new Chart(context, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Seitenaufrufe',
              data: data,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }
  }
}
