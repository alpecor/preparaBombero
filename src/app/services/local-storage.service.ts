import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Guardar un valor en localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener un valor de localStorage
  getItem(key: string): any {
    const item = localStorage.getItem(key);
    try {
      if(item) return JSON.parse(item)
     } catch {
      return item
    }
  }

  // Eliminar un valor de localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar todo localStorage
  clear(): void {
    localStorage.clear();
  }
}
