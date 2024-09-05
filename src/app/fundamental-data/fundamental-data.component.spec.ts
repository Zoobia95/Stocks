import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundamentalDataComponent } from './fundamental-data.component';

describe('FundamentalDataComponent', () => {
  let component: FundamentalDataComponent;
  let fixture: ComponentFixture<FundamentalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundamentalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundamentalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
