import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { ModalController, ActionSheetController } from '@ionic/angular'; // Importa ActionSheetController
import { AddPostModalPage } from '../add-post-modal/add-post-modal.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importa Capacitor Camera

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  posts: any[] = [];
  page: number = 1;
  limit: number = 10;
  hasMore: boolean = true;

  constructor(
    private postService: PostService,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController // Inyecta ActionSheetController
  ) {}

  ngOnInit() {
    console.log('Init Home');
    this.loadPosts();
  }

  async addPost() {
    console.log('Add Post');
    const modal = await this.modalController.create({
      component: AddPostModalPage,
      componentProps: {},
    });
    return await modal.present();
  }

  loadPosts(event?: any) {
    console.log('Load Posts');
    this.postService.getPosts(this.page, this.limit).then(
      (data: any) => {
        if (data.length > 0) {
          this.posts = [...this.posts, ...data];
          this.page++;
        } else {
          this.hasMore = false;
        }

        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        console.log(error);
        if (event) {
          event.target.complete();
        }
      }
    );
  }

  // Función para mostrar las opciones de foto
  async presentPhotoOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Tomar una foto',
          icon: 'camera',
          handler: () => {
            this.takePhoto(CameraSource.Camera); // Llama a takePhoto con la cámara
          },
        },
        {
          text: 'Subir una foto de la galería',
          icon: 'image',
          handler: () => {
            this.takePhoto(CameraSource.Photos); // Llama a takePhoto con la galería
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  // Función para tomar una foto o seleccionar de la galería
  async takePhoto(source: CameraSource) {
    console.log('Tomando foto desde:', source);
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl, // Obtiene la foto como una URL de datos
        source: source, // Usa la fuente proporcionada (cámara o galería)
        quality: 100, // Calidad de la imagen
      });
      console.log(capturedPhoto.dataUrl);

      // Aquí puedes manejar la foto capturada o seleccionada
      // Por ejemplo, puedes guardarla en una variable o enviarla a un servidor
      alert('Foto capturada/seleccionada con éxito: ' + capturedPhoto.dataUrl);
    } catch (error) {
      console.log('Error al tomar/seleccionar la foto:', error);
      alert('Hubo un error al acceder a la cámara o galería');
    }
  }
}