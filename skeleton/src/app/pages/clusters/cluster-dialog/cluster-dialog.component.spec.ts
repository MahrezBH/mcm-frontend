import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterDialogComponent } from './cluster-dialog.component';

describe('ClusterDialogComponent', () => {
  let component: ClusterDialogComponent;
  let fixture: ComponentFixture<ClusterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusterDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClusterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
