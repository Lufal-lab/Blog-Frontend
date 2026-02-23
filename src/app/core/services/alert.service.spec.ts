import { TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from './alert.service';

import { of } from 'rxjs';

describe('AlertService', () => {

  let service: AlertService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {

    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as any);

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });

    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('SnackBar messages', () => {
    it('should show success message', () => {
      service.success('Success message');
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Success message',
        'CLOSE',
        jasmine.objectContaining({ panelClass: ['toast-success'] })
      );
    });

    it('should show error message', () => {
      service.error('Error message');
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Error message',
        'CLOSE',
        jasmine.objectContaining({ panelClass: ['toast-error'] })
      );
    });

    it('should show info message', () => {
      service.info('Info message');
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Info message',
        'CLOSE',
        jasmine.objectContaining({ panelClass: ['toast-info'] })
      );
    });

    it('should show warning message', () => {
      service.warning('Warning message');
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Warning message',
        'CLOSE',
        jasmine.objectContaining({ panelClass: ['toast-warning'] })
      );
    });
  });

  describe('Confirm dialog', () => {
    it('should open confirm dialog and return true', async () => {
      const result = await service.confirm('Title', 'Message');
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(result).toBeTrue();
    });
  });
});
