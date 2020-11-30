import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoansComponent } from './admin-loans.component';

describe('AdminLoansComponent', () => {
  let component: AdminLoansComponent;
  let fixture: ComponentFixture<AdminLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
