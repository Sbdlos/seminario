import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular'; // Asegúrate de tener NavController
import { AuthService } from '../services/auth.service'; // Importa tu servicio de autenticación

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: any;

  formErrors = {
    name: [{ type: 'required', message: 'El nombre es obligatorio' }],
    last_name: [{ type: 'required', message: 'El apellido es obligatorio' }],
    email: [
      { type: 'required', message: 'El correo es obligatorio' },
      { type: 'email', message: 'El correo no es válido' },
    ],
    username: [{ type: 'required', message: 'El usuario es obligatorio' }],
    password: [
      { type: 'required', message: 'La contraseña es obligatoria' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres' },
    ],
    passwordConfirmation: [
      { type: 'required', message: 'Debes confirmar tu contraseña' },
      { type: 'mismatch', message: 'Las contraseñas no coinciden' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController, // Inyecta NavController para navegación
    private authService: AuthService // Inyecta tu servicio de autenticación
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
        passwordConfirmation: new FormControl('', Validators.required),
      },
      { validators: this.matchPasswords }
    );
  }

  ngOnInit() {}

  registerUser(registerData: any) {
    console.log(registerData, 'Datos de registro:');
    
    // Llama al servicio de autenticación para registrar al usuario
    this.authService.register(registerData).then((res) => {
      console.log('Registro exitoso:', res);
      this.errorMessage = ''; // Limpia cualquier mensaje de error
      this.navCtrl.navigateForward('/login'); // Redirige a la página de login
    }).catch((err) => {
      console.log('Error al registrar:', err);
      this.errorMessage = 'Ocurrió un error al registrar el usuario'; // Mensaje de error
    });
  }
  goToLogin() {
    this.navCtrl.navigateForward('/login'); // Redirige a la página de Login
  }
  private matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
