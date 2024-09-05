import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaIntelligenceComponent } from './alpha-intelligence.component';

describe('AlphaIntelligenceComponent', () => {
  let component: AlphaIntelligenceComponent;
  let fixture: ComponentFixture<AlphaIntelligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaIntelligenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
