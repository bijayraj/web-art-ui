import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordBasicComponent } from './forgot-password-basic.component';

describe('ForgotPasswordBasicComponent', () => {
  let component: ForgotPasswordBasicComponent;
  let fixture: ComponentFixture<ForgotPasswordBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordBasicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
