import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {

  constructor() { }

  public favoriteSArray : ISpecialist[] = [];
  public favoriteSpecialist$ = new BehaviorSubject<ISpecialist[]>([]);

  public addSpecialistFavorite(specialist : ISpecialist){
    this.favoriteSArray.push(specialist);
    this.favoriteSpecialist$.next(this.favoriteSArray);
    console.log(this.favoriteSArray);

  }

  public removeFavoriteSpecialist(specialist : ISpecialist){
    let index = this.favoriteSArray.indexOf(specialist);
    if(index > -1) {
      this.favoriteSArray.splice(index, 1);
    }
    this.favoriteSpecialist$.next(this.favoriteSArray);
  }

  public getFavoriteList() : Observable<ISpecialist[]> {
    return this.favoriteSpecialist$;
  }
}
