import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-admin-toolbar',
  templateUrl: './admin-toolbar.component.html',
  styleUrls: ['./admin-toolbar.component.css']
})
export class AdminToolbarComponent implements OnInit {

  constructor(private userService: UserService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'dollar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/dollar-symbol.svg'));
  }

  public logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  ngOnInit(): void {
  }

}
