// // src/app/core/services/alert.service.spec.ts
// import { TestBed } from '@angular/core/testing';
// import { AlertService } from './alert.service';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// describe('AlertService', () => {
//   let service: AlertService;
//   let snackBar: MatSnackBar;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [MatSnackBarModule],
//       providers: [AlertService]
//     });

//     service = TestBed.inject(AlertService);
//     snackBar = TestBed.inject(MatSnackBar);

//     spyOn(snackBar, 'open'); // 🔹 espionaje de la función open
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should call MatSnackBar.open on success', () => {
//     service.success('Success message');
//     expect(snackBar.open).toHaveBeenCalledWith(
//       'Success message',
//       'OK',
//       jasmine.objectContaining({
//         panelClass: ['toast-success']
//       })
//     );
//   });

//   it('should call MatSnackBar.open on error', () => {
//     service.error('Error message');
//     expect(snackBar.open).toHaveBeenCalledWith(
//       'Error message',
//       'OK',
//       jasmine.objectContaining({
//         panelClass: ['toast-error']
//       })
//     );
//   });

//   it('should call MatSnackBar.open on info', () => {
//     service.info('Info message');
//     expect(snackBar.open).toHaveBeenCalledWith(
//       'Info message',
//       'OK',
//       jasmine.objectContaining({
//         panelClass: ['toast-info']
//       })
//     );
//   });

//   it('should call MatSnackBar.open on warning', () => {
//     service.warning('Warning message');
//     expect(snackBar.open).toHaveBeenCalledWith(
//       'Warning message',
//       'OK',
//       jasmine.objectContaining({
//         panelClass: ['toast-warning']
//       })
//     );
//   });
// });
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from './alert.service';

describe('AlertService', () => {

  let service: AlertService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {

    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(AlertService);
  });

  it('should show success message', () => {

    service.success('Success message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Success message',
      'OK',
      jasmine.objectContaining({
        panelClass: ['toast-success']
      })
    );
  });

  it('should show error message', () => {

    service.error('Error message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error message',
      'OK',
      jasmine.objectContaining({
        panelClass: ['toast-error']
      })
    );
  });

  it('should show info message', () => {

    service.info('Info message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Info message',
      'OK',
      jasmine.objectContaining({
        panelClass: ['toast-info']
      })
    );
  });

  it('should show warning message', () => {

    service.warning('Warning message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Warning message',
      'OK',
      jasmine.objectContaining({
        panelClass: ['toast-warning']
      })
    );
  });

});
