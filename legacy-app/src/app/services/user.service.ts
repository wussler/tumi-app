import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MemberStatus, User } from '@tumi/models';
import { subMonths } from 'date-fns';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private store: AngularFirestore) {}

  public getAllMembers$(): Observable<User[]> {
    return this.store
      .collection<User>(User.collection(this.store), (ref) =>
        ref.where('status', 'not-in', [MemberStatus.none])
      )
      .valueChanges()
      .pipe(shareReplay(1));
  }

  public getOne$(id: string): Observable<any> {
    return this.store
      .collection<User>(User.collection(this.store))
      .doc(id)
      .valueChanges()
      .pipe(shareReplay(1));
  }

  public getList$(ids: string[]): Observable<any[]> {
    if (ids.length === 0) {
      return of([]);
    }
    return combineLatest(ids.map((id) => this.getOne$(id)));
  }

  populateRegistrationList$(registrations: any[]): Observable<any[]> {
    if (registrations.length === 0) {
      return of([]);
    }
    return combineLatest(
      registrations.map((registration) =>
        this.getOne$(registration.id).pipe(
          map((user) => ({ ...registration, user }))
        )
      )
    );
  }

  update(id: string, update: Partial<User>): Promise<void> {
    return this.store
      .collection<User>(User.collection(this.store))
      .doc(id)
      .set(update as User, { merge: true });
  }
}
