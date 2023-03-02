import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { FavoriteListService } from 'src/app/services/favorite-list.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {

  favorites: ISpecialist[] = [];
  favorite$ !: Subscription;
  constructor(private favoriteList: FavoriteListService, private _excel : ExcelService){}

  ngOnInit(){
    this.favorite$ = this.favoriteList.getFavoriteList().subscribe( val=>
      this.favorites = val
    );
  }

  removeFavorite(favorite: ISpecialist){this.favoriteList.removeFavoriteSpecialist(favorite)}

  saveFavorite(){
    this._excel.exportFavorites(this.favorites);
  }
  ngOnDestroy(){
    this.favorite$.unsubscribe();
  }

}
