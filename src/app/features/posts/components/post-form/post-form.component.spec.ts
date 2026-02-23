// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';

// import { Router } from '@angular/router';
// import { PostFormComponent } from './post-form.component';

// /**
//  * Mock completo para Quill.
//  * Incluimos los Inputs para que no de error de "unknown property"
//  */
// @Component({
//   selector: 'quill-editor',
//   template: '<div (input)="onChange($any($event.target).value)"></div>',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules: any; // Para [modules]="quillConfig"
//   @Input() theme!: string; // Para theme="snow"
//   @Input() placeholder!: string;

//   onChange: any = () => {};
//   onTouch: any = () => {};

//   writeValue(value: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent
//       ],
//       imports: [
//         ReactiveFormsModule,
//         NoopAnimationsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatButtonModule
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       // NO_ERRORS_SCHEMA es la red de seguridad final
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should not submit if form is invalid', () => {
//     spyOn(component.submitForm, 'emit');

//     // Forzamos invalidez
//     component.form.patchValue({
//       title: '',
//       content: ''
//     });

//     component.onSubmit();
//     expect(component.submitForm.emit).not.toHaveBeenCalled();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Test Title',
//       content: 'Test Content',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });

//     fixture.detectChanges();
//     component.onSubmit();

//     expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
//       title: 'Test Title',
//       content: 'Test Content'
//     }));
//   });

//   it('should navigate to home on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });

//   it('should update hierarchy when team is set to none', () => {
//     // Según tu handleHierarchy: si team es 'none', public y authenticated deben ser 'none'
//     component.form.get('team')?.setValue('none');

//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });

//   it('should update hierarchy when public is set to read_only', () => {
//     // Si public es read_only y los demas eran none, deben subir a read_only
//     component.form.get('public')?.setValue('none');
//     component.form.get('authenticated')?.setValue('none');

//     component.form.get('public')?.setValue('read_only');

//     // Por tu lógica, si el valor era 'none' y el anterior sube a RO, este sube a RO
//     expect(component.form.get('authenticated')?.value).toBe('read_only');
//   });
// });


















// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';

// import { PostFormComponent } from './post-form.component';

// // MOCK DEFINITIVO: Sin lógica, solo para satisfacer a Angular
// @Component({
//   selector: 'quill-editor',
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules: any;
//   @Input() theme: any;
//   @Input() format: any;
//   // Implementación vacía de ControlValueAccessor
//   writeValue(obj: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
//   setDisabledState?(isDisabled: boolean): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent // Declarado aquí
//       ],
//       imports: [
//         ReactiveFormsModule,
//         NoopAnimationsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatButtonModule
//         // NO importamos QuillModule aquí para evitar conflictos con el Mock
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     // Forzamos que el formulario se inicialice ANTES de la primera detección de cambios
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Test Title',
//       content: 'Test Content',
//       public: 'read_only'
//     });

//     component.onSubmit();
//     expect(component.submitForm.emit).toHaveBeenCalled();
//   });

//   it('should update hierarchy when team is set to none', () => {
//     component.form.get('team')?.setValue('none');
//     expect(component.form.get('public')?.value).toBe('none');
//   });

//   it('should navigate to home on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });
// });































// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// // Importaciones corregidas de Material
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';

// import { PostFormComponent } from './post-form.component';

// // Mock de Quill para que no estorbe
// @Component({
//   selector: 'quill-editor',
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules: any;
//   @Input() theme: any;
//   writeValue(value: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent
//       ],
//       imports: [
//         ReactiveFormsModule,
//         NoopAnimationsModule,
//         // Es vital que estos 4 estén aquí para que reconozca los inputs y selects
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatButtonModule
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges(); // Primera detección para inicializar el form en el HTML
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should not submit if form is invalid', () => {
//     spyOn(component.submitForm, 'emit');
//     component.form.patchValue({ title: '', content: '' });
//     component.onSubmit();
//     expect(component.submitForm.emit).not.toHaveBeenCalled();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');
//     component.form.patchValue({
//       title: 'Test Title',
//       content: 'Test Content',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });
//     fixture.detectChanges();
//     component.onSubmit();
//     expect(component.submitForm.emit).toHaveBeenCalled();
//   });

//   it('should update hierarchy when team is set to none', () => {
//     // Si team es none, public y authenticated deben ser none por tu handleHierarchy
//     component.form.get('team')?.setValue('none');
//     fixture.detectChanges();
//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });
// });














// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// // Asegúrate de que estas rutas de Material coincidan con tu versión de Angular
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';

// import { PostFormComponent } from './post-form.component';

// // Mock de Quill ultra-simple para evitar el error de 'content'
// @Component({
//   selector: 'quill-editor',
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules: any;
//   @Input() theme: any;
//   writeValue(value: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent
//       ],
//       imports: [
//         NoopAnimationsModule,
//         ReactiveFormsModule,
//         // Estos módulos son los que quitan el error de 'public', 'team', etc.
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatButtonModule
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       // NO_ERRORS_SCHEMA ignora componentes que no reconozca,
//       // pero NO ignora los errores de [formControlName]
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     // IMPORTANTE: Detectamos cambios para que el formulario se vincule al HTML
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Post de prueba',
//       content: 'Contenido de prueba',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });

//     fixture.detectChanges();
//     component.onSubmit();

//     expect(component.submitForm.emit).toHaveBeenCalled();
//   });

//   it('should update hierarchy: if team is none, public must be none', () => {
//     // Probamos tu lógica de handleHierarchy
//     component.form.get('team')?.setValue('none');

//     // Al cambiar team a none, según tu código, public y authenticated deberían ser none
//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });

//   it('should navigate on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });
// });



// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// // Importamos tus módulos de Material (o los componentes directamente)
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';

// import { PostFormComponent } from './post-form.component';

// /**
//  * Mock de Quill para satisfacer el formControlName="content"
//  */
// @Component({
//   selector: 'quill-editor',
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules!: any;
//   @Input() theme!: string;
//   writeValue(value: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent
//       ],
//       imports: [
//         // NoopAnimations es CRÍTICO para que MatSelect funcione en tests
//         NoopAnimationsModule,
//         ReactiveFormsModule,
//         // Usamos los módulos que tú mismo listaste
//         MatInputModule,
//         MatButtonModule,
//         MatFormFieldModule,
//         MatSelectModule
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       // La red de seguridad final
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     // Forzamos la primera detección de cambios para vincular el FormGroup al HTML
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should not submit if form is invalid', () => {
//     spyOn(component.submitForm, 'emit');
//     // Forzamos valores vacíos
//     component.form.patchValue({ title: '', content: '' });
//     component.onSubmit();
//     expect(component.submitForm.emit).not.toHaveBeenCalled();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Título de prueba',
//       content: 'Contenido de prueba',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });

//     fixture.detectChanges();
//     component.onSubmit();

//     expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
//       title: 'Título de prueba'
//     }));
//   });

//   it('should handle hierarchy logic (team none -> public none)', () => {
//     // Probamos tu lógica: al poner TEAM en 'none', los de arriba (public) deben ser 'none'
//     component.form.get('team')?.setValue('none');
//     fixture.detectChanges();

//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });

//   it('should navigate to home on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });
// });







// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// // Importa tu MaterialModule si la ruta es correcta,
// // si no, deja estas importaciones que cubren lo que usas en el HTML
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';

// import { PostFormComponent } from './post-form.component';

// @Component({
//   selector: 'quill-editor',
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockQuillEditorComponent),
//       multi: true
//     }
//   ]
// })
// class MockQuillEditorComponent implements ControlValueAccessor {
//   @Input() modules!: any;
//   writeValue(value: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
// }

// describe('PostFormComponent', () => {
//   let component: PostFormComponent;
//   let fixture: ComponentFixture<PostFormComponent>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [
//         PostFormComponent,
//         MockQuillEditorComponent
//       ],
//       imports: [
//         NoopAnimationsModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatSelectModule,
//         MatButtonModule
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy },
//         FormBuilder // Aseguramos que el FormBuilder esté disponible
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(PostFormComponent);
//     component = fixture.componentInstance;
//     // IMPORTANTE: Con nonNullable, el formulario necesita detectChanges
//     // antes de cualquier interacción en el test.
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should update hierarchy when team is set to none', () => {
//     // Probamos tu lógica: team none -> public none
//     component.form.get('team')?.setValue('none');

//     // fixture.detectChanges() es clave porque tienes un subscribe en valueChanges
//     fixture.detectChanges();

//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Mi Post',
//       content: 'Contenido',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });

//     component.onSubmit();

//     expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
//       title: 'Mi Post',
//       content: 'Contenido'
//     }));
//   });

//   it('should load initial data', () => {
//     const mockData = {
//       title: 'Edit Post',
//       content: 'Edit Content',
//       privacy_read: 'authenticated',
//       privacy_write: 'team'
//     };

//     component.initialData = mockData;
//     component.ngOnInit(); // Forzamos la carga
//     fixture.detectChanges();

//     expect(component.form.get('title')?.value).toBe('Edit Post');
//   });

//   it('should navigate to home on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });
// });
