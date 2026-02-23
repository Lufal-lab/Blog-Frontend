import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostFormComponent } from '../../components/post-form/post-form.component';
import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;

  // ----- MOCKS -----
  // Mapeo de PrivacyLevel a PermissionOption
  const privacyToPermission = {
    [PrivacyLevel.PUBLIC]: 'none',
    [PrivacyLevel.AUTHENTICATED]: 'read_only',
    [PrivacyLevel.TEAM]: 'read_write',
    [PrivacyLevel.AUTHOR]: 'read_write'
  } as const;

  const initialDataMock = {
    title: 'Test Post',
    content: 'Test Content',
    privacy_read: PrivacyLevel.AUTHENTICATED,
    privacy_write: PrivacyLevel.TEAM
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PostFormComponent],
      schemas: [NO_ERRORS_SCHEMA] // evita errores por componentes hijos
    }).compileComponents();

    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load initial data into the form', () => {
    component.initialData = initialDataMock;
    fixture.detectChanges();

    expect(component.form.get('title')?.value).toBe(initialDataMock.title);
    expect(component.form.get('content')?.value).toBe(initialDataMock.content);

    // mapear a PermissionOption
    expect(component.form.get('public')?.value).toBe(privacyToPermission[initialDataMock.privacy_read]);
    expect(component.form.get('team')?.value).toBe(privacyToPermission[initialDataMock.privacy_write]);
  });

  it('should build correct payload on submit', () => {
    fixture.detectChanges();

    // patchValue usando los valores que espera el formulario
    component.form.patchValue({
      title: 'New Title',
      content: 'New Content',
      public: 'none',          // PermissionOption
      authenticated: 'read_only',
      team: 'read_write'
    });

    let emittedPayload: any;
    component.submitForm.subscribe(payload => emittedPayload = payload);

    component.onSubmit();

    expect(emittedPayload).toEqual({
      title: 'New Title',
      content: 'New Content',
      privacy_read: PrivacyLevel.AUTHENTICATED, // mapped en onSubmit
      privacy_write: PrivacyLevel.TEAM
    });
  });

  it('should not submit if form is invalid', () => {
    fixture.detectChanges();
    component.form.patchValue({ title: '', content: '' });

    let emitted = false;
    component.submitForm.subscribe(() => emitted = true);

    component.onSubmit();
    expect(emitted).toBeFalse();
  });
});
