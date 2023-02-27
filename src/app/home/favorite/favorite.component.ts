import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
import { FavoriteListService } from 'src/app/services/favorite-list.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {

  favorites: ISpecialist[] = [];
  favorite$ !: Subscription;
  constructor(private favoriteList: FavoriteListService){}

  ngOnInit(){
    this.favorite$ = this.favoriteList.getFavoriteList().subscribe( val=>
      this.favorites = val
    );
  }

  removeFavorite(favorite: ISpecialist){this.favoriteList.removeFavoriteSpecialist(favorite)}
  ngOnDestroy(){
    this.favorite$.unsubscribe();
  }

}
