import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, retry, tap } from 'rxjs';
import { AuthService, IUser } from 'src/app/user';
import { IDestination } from '../../shared/models/destination.model';
import { ITrip } from '../../shared/models/trip.model';

@Injectable()
export class TripService {
  tripsUrl = '/api/trips';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // get all trips
  getTrips(): Observable<ITrip[]> {
    return this.http
      .get<ITrip[]>(this.tripsUrl)
      .pipe(
        map((trips) => this.filterTripsByUsername(trips, this.auth.currentUser.username)),
        retry(2),
        catchError(this.handleError<ITrip[]>('getTrips()', []),
      ));
  }

  filterTripsByUsername(trips: ITrip[], username: string): ITrip[] {
    const filteredTrips = trips.filter((trip:ITrip) => {
      return (trip.members || [])
      .some((member: IUser) => member.username === username)
    })

    return filteredTrips;
  }

  // get a specific trip
  getTrip(id: number): Observable<ITrip> {
    const url = `${this.tripsUrl}/${id}`;

    return this.http
      .get<ITrip>(url)
      .pipe(
        retry(2),
        catchError(this.handleError<ITrip>('getTrip()')
      ));
  }

  // create new trip
  createTrip(trip: ITrip): Observable<ITrip> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<ITrip>(this.tripsUrl, trip, { headers: headers })
      .pipe(
        tap((data: ITrip) => console.table(data)),
        catchError(this.handleError<ITrip>('createTrip()'))
      );
  }

  // save an edited trip
  updateTrip(trip: ITrip): Observable<ITrip> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .put<ITrip>(this.tripsUrl, trip, { headers: headers })
      .pipe(
        tap((data: ITrip) => console.table(data)),
        catchError(this.handleError<ITrip>('createTrip()'))
      );
  }

  // delete an existing trip
  deleteTrip(id: number): Observable<ITrip> {
    const url = `${this.tripsUrl}/${id}`;

    return this.http
      .delete<ITrip>(url)
      .pipe(
        tap((data: ITrip) => console.table(data)),
        catchError(this.handleError<ITrip>('createTrip()'))
    );
  }

  sortByTitle(trips: ITrip[]): ITrip[] {
    // console.log("Trips sorted alphabetically by title");
    return (trips = trips.sort((a: ITrip, b: ITrip) =>
      a.title.localeCompare(b.title)
    ));
  }

  sortByEarliestDate(trips: ITrip[]): ITrip[] {
    // default for PREVIOUS dates
    // console.log("Trips sorted by earliest date");

    // sorting by EARLIEST DATE: sorts dates oldest-newest
    return (trips = trips.sort(
      (a: ITrip, b: ITrip) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ));
  }

  sortByLatestDate(trips: ITrip[]): ITrip[] {
    // default for UPCOMING dates
    // console.log("Trips sorted by latest date");

    // sorting by LATEST DATE: sorts dates newest-oldest
    return (trips = trips.sort(
      (a: ITrip, b: ITrip) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    ));
  }

  // returns boolean based on whether a trip has multiple destinations or not
  hasMultipleDestinations(destinations: IDestination[]): boolean {
    if (destinations.length > 1) {
      return true;
    }
    return false;
  }

  // function for handling errors
  private handleError<ITrip>(operation = 'operation', result?: ITrip): (error: any) => Observable<ITrip> {
    return (error: any): Observable<ITrip> => {
      console.error(error);
      return of(result as ITrip);
    };
  }
}
