import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '@app/_services/user/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  clientId: number;

  constructor(iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router) {
    iconRegistry.addSvgIcon(
      'dollar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/dollar-symbol.svg'));
    this.clientId = userService.user.clientId;
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['login']);
    })
  }

  ngOnInit(): void {
  }

}
