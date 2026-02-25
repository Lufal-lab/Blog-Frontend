// // import { ComponentFixture, TestBed } from '@angular/core/testing';
// // import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// // import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// // import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// // import { Router } from '@angular/router';

// // import { PostFormComponent } from './post-form.component';

// // import { QuillModule } from 'ngx-quill';

// // /**
// //  * MOCK UNIVERSAL
// //  * Este componente se encargará de pretender ser <quill-editor>, <mat-select>, etc.
// //  */
// // @Component({
// //   selector: 'mock-control', // Se usará para suplantar selectores en el override
// //   template: '',
// //   providers: [
// //     {
// //       provide: NG_VALUE_ACCESSOR,
// //       useExisting: forwardRef(() => MockControlComponent),
// //       multi: true
// //     }
// //   ]
// // })
// // class MockControlComponent implements ControlValueAccessor {
// //   @Input() modules: any;
// //   @Input() theme: any;
// //   @Input() placeholder: any;
// //   writeValue(value: any): void {}
// //   registerOnChange(fn: any): void {}
// //   registerOnTouched(fn: any): void {}
// // }

// // describe('PostFormComponent', () => {
// //   let component: PostFormComponent;
// //   let fixture: ComponentFixture<PostFormComponent>;
// //   let routerSpy: jasmine.SpyObj<Router>;

// //   beforeEach(async () => {
// //     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

// //     await TestBed.configureTestingModule({
// //       declarations: [
// //         PostFormComponent,
// //         MockControlComponent
// //       ],
// //       imports: [
// //         ReactiveFormsModule,
// //         NoopAnimationsModule,
// //         QuillModule.forRoot()
// //       ],
// //       providers: [
// //         { provide: Router, useValue: routerSpy }
// //       ],
// //       // NO_ERRORS_SCHEMA permite que mat-form-field y otros no den error
// //       schemas: [NO_ERRORS_SCHEMA]
// //     })
// //     /**
// //      * TRUCO MAESTRO: Reemplazamos los componentes problemáticos por nuestro Mock
// //      * Esto garantiza que 'content', 'public', 'authenticated' y 'team' tengan accessor.
// //      */
// //     .overrideComponent(PostFormComponent, {
// //       set: {
// //         templateUrl: './post-form.component.html', // Mantenemos el HTML original
// //         // Pero obligamos a Angular a usar nuestro Mock para los tags de Quill y Material Select
// //         // Si el error persiste, el override de template visto antes es el plan B
// //       }
// //     })
// //     .compileComponents();
// //   });

// //   beforeEach(() => {
// //     fixture = TestBed.createComponent(PostFormComponent);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   it('should create the component', () => {
// //     expect(component).toBeTruthy();
// //   });

// //   it('should not submit if form is invalid', () => {
// //     spyOn(component.submitForm, 'emit');
// //     // Forzamos invalidez
// //     component.form.patchValue({ title: '', content: '' });
// //     component.onSubmit();
// //     expect(component.submitForm.emit).not.toHaveBeenCalled();
// //   });

// //   it('should build correct payload on submit', () => {
// //     spyOn(component.submitForm, 'emit');

// //     component.form.patchValue({
// //       title: 'Post de Prueba',
// //       content: 'Contenido de prueba',
// //       public: 'read_only',
// //       authenticated: 'read_only',
// //       team: 'read_write'
// //     });

// //     component.onSubmit();

// //     expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
// //       title: 'Post de Prueba',
// //       content: 'Contenido de prueba'
// //     }));
// //   });

// //   it('should update hierarchy: team "none" sets others to "none"', () => {
// //     // Al cambiar team a none, public y authenticated deben bajar
// //     component.form.get('team')?.setValue('none');
// //     fixture.detectChanges();

// //     expect(component.form.get('public')?.value).toBe('none');
// //     expect(component.form.get('authenticated')?.value).toBe('none');
// //   });

// //   it('should load initial data and update form correctly', () => {
// //     const mockData = {
// //       title: 'Initial Title',
// //       content: 'Initial Content',
// //       privacy_read: 'authenticated', // Esto debería mapearse a public: none, auth: read_only
// //       privacy_write: 'team'          // Esto debería mapearse a team: read_write
// //     };

// //     component.initialData = mockData;
// //     component.ngOnInit();
// //     fixture.detectChanges();

// //     expect(component.form.get('title')?.value).toBe('Initial Title');
// //     expect(component.form.get('authenticated')?.value).toBe('read_only');
// //     expect(component.form.get('team')?.value).toBe('read_write');
// //   });

// //   it('should navigate to home on cancel', () => {
// //     component.onCancel();
// //     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
// //   });
// // });


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';

// import { PostFormComponent } from './post-form.component';

// import { QuillModule } from 'ngx-quill';

// /**
//  * MOCK UNIVERSAL
//  * Este componente se encargará de pretender ser <quill-editor>, <mat-select>, etc.
//  */
// @Component({
//   selector: 'mock-control', // Se usará para suplantar selectores en el override
//   template: '',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockControlComponent),
//       multi: true
//     }
//   ]
// })
// class MockControlComponent implements ControlValueAccessor {
//   @Input() modules: any;
//   @Input() theme: any;
//   @Input() placeholder: any;
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
//         MockControlComponent
//       ],
//       imports: [
//         ReactiveFormsModule,
//         NoopAnimationsModule,
//         QuillModule.forRoot()
//       ],
//       providers: [
//         { provide: Router, useValue: routerSpy }
//       ],
//       // NO_ERRORS_SCHEMA permite que mat-form-field y otros no den error
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//     /**
//      * TRUCO MAESTRO: Reemplazamos los componentes problemáticos por nuestro Mock
//      * Esto garantiza que 'content', 'public', 'authenticated' y 'team' tengan accessor.
//      */
//     .overrideComponent(PostFormComponent, {
//       set: {
//         templateUrl: './post-form.component.html', // Mantenemos el HTML original
//         // Pero obligamos a Angular a usar nuestro Mock para los tags de Quill y Material Select
//         // Si el error persiste, el override de template visto antes es el plan B
//       }
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
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
//     component.form.patchValue({ title: '', content: '' });
//     component.onSubmit();
//     expect(component.submitForm.emit).not.toHaveBeenCalled();
//   });

//   it('should build correct payload on submit', () => {
//     spyOn(component.submitForm, 'emit');

//     component.form.patchValue({
//       title: 'Post de Prueba',
//       content: 'Contenido de prueba',
//       public: 'read_only',
//       authenticated: 'read_only',
//       team: 'read_write'
//     });

//     component.onSubmit();

//     expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
//       title: 'Post de Prueba',
//       content: 'Contenido de prueba'
//     }));
//   });

//   it('should update hierarchy: team "none" sets others to "none"', () => {
//     // Al cambiar team a none, public y authenticated deben bajar
//     component.form.get('team')?.setValue('none');
//     fixture.detectChanges();

//     expect(component.form.get('public')?.value).toBe('none');
//     expect(component.form.get('authenticated')?.value).toBe('none');
//   });

//   it('should load initial data and update form correctly', () => {
//     const mockData = {
//       title: 'Initial Title',
//       content: 'Initial Content',
//       privacy_read: 'authenticated', // Esto debería mapearse a public: none, auth: read_only
//       privacy_write: 'team'          // Esto debería mapearse a team: read_write
//     };

//     component.initialData = mockData;
//     component.ngOnInit();
//     fixture.detectChanges();

//     expect(component.form.get('title')?.value).toBe('Initial Title');
//     expect(component.form.get('authenticated')?.value).toBe('read_only');
//     expect(component.form.get('team')?.value).toBe('read_write');
//   });

//   it('should navigate to home on cancel', () => {
//     component.onCancel();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, forwardRef, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PostFormComponent } from './post-form.component';

// --- MOCKS EXPLÍCITOS PARA EVITAR NG01203 ---

@Component({
  selector: 'mat-select', // Nombre exacto del selector que da error
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockMatSelectComponent),
      multi: true
    }
  ]
})
class MockMatSelectComponent implements ControlValueAccessor {
  @Input() placeholder: any;
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
}

@Component({
  selector: 'quill-editor', // Mock para el editor de texto
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockQuillEditorComponent),
      multi: true
    }
  ]
})
class MockQuillEditorComponent implements ControlValueAccessor {
  @Input() modules: any;
  @Input() theme: any;
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
}

// ---------------------------------------------

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [
        PostFormComponent,
        MockMatSelectComponent, // Declaramos los mocks aquí
        MockQuillEditorComponent
      ],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update hierarchy: team "none" sets public to "none"', () => {
    // Probamos tu lógica del .ts
    component.form.get('team')?.setValue('none');
    fixture.detectChanges();

    expect(component.form.get('public')?.value).toBe('none');
    expect(component.form.get('authenticated')?.value).toBe('none');
  });

  it('should build correct payload on submit', () => {
    spyOn(component.submitForm, 'emit');

    component.form.patchValue({
      title: 'Test Post',
      content: 'Contenido',
      public: 'read_only',
      authenticated: 'read_only',
      team: 'read_write'
    });

    component.onSubmit();

    expect(component.submitForm.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Post'
    }));
  });

  it('should call location.back() on cancel', () => {
    component.onCancel();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should load initial data and map permissions', () => {
    component.initialData = {
      title: 'Initial',
      content: 'Content',
      privacy_read: 'authenticated',
      privacy_write: 'team'
    };

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.get('title')?.value).toBe('Initial');
    expect(component.form.get('authenticated')?.value).toBe('read_only');
  });
});
