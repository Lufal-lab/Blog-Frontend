import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const mockDialogData = {
    title: 'Confirm Delete',
    message: 'Are you sure?',
    confirmText: 'Delete',
    confirmColor: 'warn'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule   // 👈 ESTA era la que faltaba
      ],
      declarations: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive dialog data correctly', () => {
    expect(component.data.title).toBe('Confirm Delete');
  });
});
