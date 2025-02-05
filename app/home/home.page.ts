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
    private actionSheetCtrl: ActionSheetController 
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

 
  async presentPhotoOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Tomar una foto',
          icon: 'camera',
          handler: () => {
            this.takePhoto(CameraSource.Camera); 
          },
        },
        {
          text: 'Subir una foto de la galería',
          icon: 'image',
          handler: () => {
            this.takePhoto(CameraSource.Photos); 
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


  async takePhoto(source: CameraSource) {
    console.log('Tomando foto desde:', source);
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: source, 
        quality: 100,
      });
      console.log(capturedPhoto.dataUrl);

    
      alert('Foto capturada/seleccionada con éxito: ' + capturedPhoto.dataUrl);
    } catch (error) {
      console.log('Error al tomar/seleccionar la foto:', error);
      alert('Hubo un error al acceder a la cámara o galería');
    }
  }
}
