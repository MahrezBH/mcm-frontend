import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlDisplayDialogComponent } from './url-display-dialog.component';

describe('UrlDisplayDialogComponent', () => {
  let component: UrlDisplayDialogComponent;
  let fixture: ComponentFixture<UrlDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlDisplayDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrlDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
