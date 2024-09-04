import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreStockComponent } from './core-stock.component';

describe('CoreStockComponent', () => {
  let component: CoreStockComponent;
  let fixture: ComponentFixture<CoreStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
