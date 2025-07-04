import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department';

@Component({
  selector: 'app-department-manager',
  standalone: true,
  imports: [CommonModule], // CommonModule hinzufügen
  templateUrl: './department-manager.component.html',
  styleUrls: ['./department-manager.component.css']
})
export class DepartmentManagerComponent implements OnInit {
  departments: Department[] = [];

  constructor(private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });
  }
}
