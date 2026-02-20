import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const config: MatSnackBarConfig = {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`toast-${type}`]
    };
    this.snackBar.open(message, 'CLOSE', config);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  async confirm(title: string, message: string, confirmText = 'Confirm', confirmColor = 'primary'): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true, // Obliga al usuario a elegir una opción
      data: { title, message, confirmText, confirmColor }
    });

    // firstValueFrom convierte el Observable a Promesa para usar await
    return await firstValueFrom(dialogRef.afterClosed()) || false;
  }
}
