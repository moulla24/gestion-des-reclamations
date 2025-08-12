// src/app/core/services/categorie.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categorie } from '../../models/categorie.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/user/categories';

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl);
  }
}
