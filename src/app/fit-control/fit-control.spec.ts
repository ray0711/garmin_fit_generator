import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitControl } from './fit-control';

describe('FitControl', () => {
  let component: FitControl;
  let fixture: ComponentFixture<FitControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
