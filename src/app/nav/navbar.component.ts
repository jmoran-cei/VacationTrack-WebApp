import { Component, Input } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, take } from "rxjs";
import { AuthService } from "../user/shared/authentication.service";

@Component({
  selector: 'nav-bar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})

export class NavbarComponent {
  isLoggedIn= this.auth.isLoggedIn$.pipe(take(1));
  path!:string;
  isTripPage!:boolean;

  constructor(
    public auth:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe(
      () => {
        let paths = this.router.url.split('/');

        // if the path is 'trips/'
        if (paths[1]==='trips')
          // is on 'trips/:id' if, subpath is a number (valid trip id)
          this.isTripPage = !isNaN(paths[2] as any);
        else
          this.isTripPage = false;
      }
    )
  }

  adjustNameLength(name:string,numChars:number) {
    if (name.length>numChars) {
      return name.substring(0,numChars) + '..'
    }
    return name
  }

  logoutUser() {
    this.auth.logoutUser();
  }
}

