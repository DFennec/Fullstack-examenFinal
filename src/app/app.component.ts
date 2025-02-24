import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="contenedorApp">
      <h2>Recetario diario</h2>

      <div class="dropdown">
        <select [(ngModel)]="seleccionada" (change)="fetchRecetasPorCategoria()">
          <option *ngFor="let categoria of categorias" [value]="categoria">
            {{ categoria }}
          </option>
        </select>
      </div>

      <div class="contenedor">
        <button class="botonAlto" (click)="anteriorReceta()"><</button>
        <div class="tarjeta">
          <ng-container *ngIf="imagenReceta; else placeholder">
            <img [src]="imagenReceta" alt="Receta" class="imagen" />
            <p class="titulo">{{ tituloReceta }}</p>
          </ng-container>
          <ng-template #placeholder>
            <p><img class="cargando" src="https://th.bing.com/th/id/R.e4b6323e19e57f6761b1ce47b7d329e0?rik=D4%2b%2fTxSGPiWP2g&pid=ImgRaw&r=0" alt="cargando"></p>
          </ng-template>
        </div>
        <button class="botonAlto" (click)="siguienteReceta()">></button>
      </div>

      <div class="boton">
        <button (click)="fetchReceta()">Random</button>
        <a [href]="hacerMailto()" class="botonEnvio">Enviar receta</a>
      </div>
    </div>
  `,
  styles: [
    `
      .contenedorApp {
        width: 50vw;
        margin: auto;
        text-align: center;
        font-family: Arial, sans-serif;
      }

      h2{
        color: indigo;
      }

      .cargando{
        max-width:100%;
        max-height:10vh;
      }

      .dropdown {
        margin-bottom: 2vh;
      }

      select{
        background: indigo;
        color: white;
        border-radius: 5vw;
        text-align:center;
        height: 5vh;
        width: 35vw;
        font-weight: 600;
      }

      .contenedor {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
      }

      .tarjeta {
        width: 50vw;
        height: 30vh;
        border-radius: 4vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
        background: indigo;
        color: white;
      }

      .imagen {
        max-width: 100%;
        max-height: 10vw;
        border-radius: 4vw;
      }

      .titulo {
        font-size: 14px;
        font-weight: bold;
        margin-top: 2vh;
      }

      .botonAlto {
        background: indigo;
        color: white;
        border-radius: 4vw;
        font-size: 20px;
        height: 20vh;
      }

      .boton {
        display: flex;
        justify-content: space-between;
      }

      button {
        padding: 2vw;
        border: 1px solid indigo;
        background: indigo;
        color:white;
        font-weight:600;
        border-radius: 4vw;
        font-size:2vw;
      }

      .botonEnvio {
        padding: 2vh;
        padding-top:5vh;
        border: 1px solid indigo;
        text-decoration: none;
        border-radius: 4vw;
        background: indigo;
        font-size: 1.5vw;
        color:white;
        font-weight:600;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  categorias: string[] = [];
  seleccionada = '';

  recetas: any[] = [];
  idx = 0;
  imagenReceta: string | null = null;
  tituloReceta: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCategorias();
  }

  fetchCategorias() {
    this.http
      .get<any>('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .subscribe((response) => {
        if (response.meals) {
          this.categorias = response.meals.map((c: any) => c.strCategory);
          this.seleccionada = this.categorias[0]; 
          this.fetchRecetasPorCategoria(); 
        }
      });
  }


  fetchRecetasPorCategoria() {
    this.http
      .get<any>(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${this.seleccionada}`)
      .subscribe((response) => {
        if (response.meals) {
          this.recetas = response.meals;
          this.idx = 0;
          this.cambiarImagen();
        } else {
          this.recetas = [];
          this.imagenReceta = null;
          this.tituloReceta = 'No se han encontrado recetas';
        }
      });
  }

 
  cambiarImagen() {
    if (this.recetas.length > 0) {
      this.imagenReceta = this.recetas[this.idx].strMealThumb;
      this.imagenReceta = this.recetas[this.idx].strMealThumb;
      this.tituloReceta = this.recetas[this.idx].strMeal;
    }
  }


  anteriorReceta() {
    if (this.recetas.length > 0) {
      this.idx =
        this.idx > 0 ? this.idx - 1 : this.recetas.length - 1;
      this.cambiarImagen();
    }
  }


  siguienteReceta() {
    if (this.recetas.length > 0) {
      this.idx =
        this.idx < this.recetas.length - 1 ? this.idx + 1 : 0;
      this.cambiarImagen();
    }
  }

  fetchReceta() {
    this.http
      .get<any>('https://www.themealdb.com/api/json/v1/1/random.php')
      .subscribe((response) => {
        if (response.meals && response.meals.length > 0) {
          this.imagenReceta = response.meals[0].strMealThumb;
          this.tituloReceta = response.meals[0].strMeal;
        }
      });
  }

  hacerMailto(): string {
    const direccion = 'felipe.jacobs@cesurformacion.com';
    const asunto = encodeURIComponent(`Receta de ${this.tituloReceta || 'Plato no disponible'}`);
    const cuerpo = encodeURIComponent(
      `Hola,\n\n he encontrado esta recetea de ${this.tituloReceta || 'Plato no disponible'}
      \n\n${this.imagenReceta || 'Imagen no disponible' }\n\n¡Espero que te guste!`);

    return `mailto:${direccion}?subject=${asunto}&body=${cuerpo}`;
  }
}
