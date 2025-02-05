import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';  // Importamos Storage

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlServer = 'http://51.79.26.171';  // URL del servidor
  //urlServer = 'http://localhost:3000';
  httpHeaders = { headers: new HttpHeaders({"Content-Type": "application/json"}) };

  constructor(
    private http: HttpClient,
    private storage: Storage  // Inyectamos Storage
  ) { 
    this.storage.create();  // Inicializamos el almacenamiento
  }

  login(credentials: any){
    return new Promise((accept, reject) => {
      let params = {
        "user": { 
          "email": credentials.email, 
          "password": credentials.password
        }
      };
      this.http.post(`${this.urlServer}/login`, params, this.httpHeaders).subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 'OK') {
            // Guardamos el usuario en el localStorage
            this.storage.set('user', data.user).then(() => {
              accept(data);  // Se acepta la respuesta con el usuario guardado
            });
          } else {
            reject(data.errors);
          }
        },
        (error) => {
          console.log(error);
          if (error.status == 422) {
            reject('Usuario o contraseña incorrectos');
          } else if (error.status == 500) {
            reject('Error, por favor intenta más tarde');
          } else {
            reject('Error al intentar iniciar sesión');
          }
        }
      );
    });
  }

  register(data: any){
    return new Promise((accept, reject) => {
      let params = {
        "user": {
          "email": data.email,
          "password": data.password,
          "password_confirmation": data.password_confirmation,
          "name": data.name,
          "last_name": data.last_name,
          "username": data.username
        }
      };
      this.http.post(`${this.urlServer}/signup`, params, this.httpHeaders).subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 'OK') {
            accept(data);
          } else {
            reject(data.errors);
          }
        },
        (error) => {
          console.log(error);
          if (error.status == 422) {
            reject(error.error.errors);
          } else if (error.status == 500) {
            reject('Error, por favor intenta más tarde');
          } else {
            reject('Error al intentar registrarse');
          }
        }
      );
    });
  }
}
