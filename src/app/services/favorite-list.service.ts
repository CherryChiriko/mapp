import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISpecialist } from '../interfaces/interfaces';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteListService {

  constructor(private helper: HelperService) { }

  public favoriteSArray : ISpecialist[] = [];
  public favoriteSpecialist$ = new BehaviorSubject<ISpecialist[]>([]);

  public addSpecialistFavorite(specialist : ISpecialist){
    this.favoriteSArray.push(specialist);
    this.favoriteSpecialist$.next(this.favoriteSArray);
  }

  public removeFavoriteSpecialist(specialist : ISpecialist){
    this.helper.removeElement(specialist, this.favoriteSArray);
    this.favoriteSpecialist$.next(this.favoriteSArray);
  }

  public getFavoriteList() : Observable<ISpecialist[]> {
    return this.favoriteSpecialist$;
  }
}
