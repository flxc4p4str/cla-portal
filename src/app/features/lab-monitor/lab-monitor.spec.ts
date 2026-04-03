import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabMonitor } from './lab-monitor';

describe('LabMonitor', () => {
  let component: LabMonitor;
  let fixture: ComponentFixture<LabMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabMonitor],
    }).compileComponents();

    fixture = TestBed.createComponent(LabMonitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
