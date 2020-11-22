import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from '../_services/user/user.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.userService.user?.token) {
            request = request.clone({
                setHeaders: {
                    token: `${this.userService.user.token}`
                }
            });
        }
        return next.handle(request);
    }
}