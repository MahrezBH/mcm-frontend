import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUrlDialogComponent } from './generate-url-dialog.component';

describe('GenerateUrlDialogComponent', () => {
  let component: GenerateUrlDialogComponent;
  let fixture: ComponentFixture<GenerateUrlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateUrlDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
