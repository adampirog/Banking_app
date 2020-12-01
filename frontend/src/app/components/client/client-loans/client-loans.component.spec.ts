import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLoansComponent } from './client-loans.component';

describe('ClientLoansComponent', () => {
  let component: ClientLoansComponent;
  let fixture: ComponentFixture<ClientLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
