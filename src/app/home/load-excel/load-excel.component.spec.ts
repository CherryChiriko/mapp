import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadExcelComponent } from './load-excel.component';

describe('LoadExcelComponent', () => {
  let component: LoadExcelComponent;
  let fixture: ComponentFixture<LoadExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
