import { Component, Input } from "@angular/core";
import { ITrip } from "src/app/shared";
import { TripService } from "../../shared/trip.service";

@Component({
  selector: 'trip-thumbnail',
  templateUrl: 'trip-thumbnail.component.html',
  styleUrls: ['trip-thumbnail.component.css']
})

export class TripThumbnailComponent {
  @Input() trip!:ITrip
  multipleDestinations!:boolean

  constructor(public tripService:TripService) {}

  ngOnInit() {
    this.multipleDestinations = this.tripService.hasMultipleDestinations(this.trip.destinations);
  }
}