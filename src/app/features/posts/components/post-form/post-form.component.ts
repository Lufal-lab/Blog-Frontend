import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';

import { noWhitespaceValidator} from 'src/app/shared/validators/no-with-space.validators'

import { Location } from '@angular/common';

export type PermissionOption = 'none' | 'read_only' | 'read_write';
type PermissionKeys = 'public' | 'authenticated' | 'team' | 'author';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  @Input() initialData: any | null = null;
  @Output() submitForm = new EventEmitter<any>();

  quillConfig = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // Negrita, cursiva, etc.
    ['blockquote', 'code-block'],                    // <--- ESTE ES EL CUADRO DE CÓDIGO

    // [{ header: [1, 2, 3, 4, 5, 6, false] }],             // Títulos
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    // [{ 'script': 'sub'}, { 'script': 'super' }],      // Subíndice/Superíndice
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // Sangría
    // [{ 'direction': 'rtl' }],                         // Dirección de texto

    [{ 'size': ['small', false, 'large', 'huge'] }],  // Tamaño de fuente
    [{ color: [] }, { background: [] }],
    // [{ 'font': [] }],
    // [{ 'align': [] }],

    // ['link', 'image', 'video'],                       // Multimedia
    // ['code'],                                         // <--- ESTE ES EL BOTÓN </> (Inline)
    ['clean']                                         // Borrar formato
  ]
};

  private readonly levels: PermissionKeys[] = [
    'public',
    'authenticated',
    'team',
    'author'
  ];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, noWhitespaceValidator]],
    content: ['', [Validators.required, noWhitespaceValidator]],

    public: ['read_only' as PermissionOption],
    authenticated: ['read_only' as PermissionOption],
    team: ['read_write' as PermissionOption],
    author: this.fb.control(
      { value: 'read_write' as PermissionOption, disabled: true }
    )
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location

  ) {}

  ngOnInit(): void {
    if (this.initialData) {
      this.loadInitialData();
    }

    this.handleHierarchy();
  }

  private loadInitialData() {
    this.form.patchValue({
      title: this.initialData.title,
      content: this.initialData.content,
      ...this.rebuildPermissions(
        this.initialData.privacy_read,
        this.initialData.privacy_write
      )
    });
  }

  private rebuildPermissions(
    read: PrivacyLevel,
    write: PrivacyLevel
  ): Record<PermissionKeys, PermissionOption> {

    const result: Record<PermissionKeys, PermissionOption> = {
      public: 'none',
      authenticated: 'none',
      team: 'none',
      author: 'read_write'
    };

    const hierarchy: PermissionKeys[] = [
      'public',
      'authenticated',
      'team',
      'author'
    ];

    for (const level of hierarchy) {
      if (hierarchy.indexOf(level) >= hierarchy.indexOf(read as PermissionKeys)) {
        result[level] = 'read_only';
      }
      if (hierarchy.indexOf(level) >= hierarchy.indexOf(write as PermissionKeys)) {
        result[level] = 'read_write';
      }
    }

    return result;
  }

private handleHierarchy() {
  const hierarchy: PermissionKeys[] = ['public', 'authenticated', 'team', 'author'];

  hierarchy.forEach((key, index) => {
    this.form.get(key)?.valueChanges.subscribe(newValue => {
      console.log(`%c Cambio detectado en: ${key} -> Nuevo valor: ${newValue}`, 'background: #222; color: #bada55; font-size: 12px');

      if (!newValue) return;

      if (newValue === 'none') {
        for (let j = 0; j < index; j++) {
          console.log(`   -> Forzando ${hierarchy[j]} a NONE porque ${key} es NONE`);
          this.form.get(hierarchy[j])?.patchValue('none', { emitEvent: false });
        }
      }

      if (newValue === 'read_write') {
        for (let j = index + 1; j < hierarchy.length; j++) {
          console.log(`   -> Forzando ${hierarchy[j]} a RW porque ${key} es RW`);
          this.form.get(hierarchy[j])?.patchValue('read_write', { emitEvent: false });
        }
      }

      if (newValue === 'read_only') {
        for (let j = index + 1; j < hierarchy.length; j++) {
          if (this.form.get(hierarchy[j])?.value === 'none') {
            console.log(`   -> Forzando ${hierarchy[j]} a RO porque ${key} es RO y el actual era NONE`);
            this.form.get(hierarchy[j])?.patchValue('read_only', { emitEvent: false });
            }
        }
      }
    });
  });
}

  private buildPayload() {
    const permissions = this.form.getRawValue();

    let privacyRead: PrivacyLevel = PrivacyLevel.PUBLIC;
    let privacyWrite: PrivacyLevel = PrivacyLevel.TEAM;

    for (const level of this.levels) {
      const value = permissions[level];

      if (value === 'read_only' || value === 'read_write') {
        privacyRead = level as PrivacyLevel;
        break;
      }
    }

    for (const level of this.levels) {
      const value = permissions[level];

      if (value === 'read_write') {
        privacyWrite = level as PrivacyLevel;
        break;
      }
    }

    return {
      title: permissions.title,
      content: permissions.content,
      privacy_read: privacyRead,
      privacy_write: privacyWrite
    };
  }


  onSubmit() {
    if (this.form.invalid) return;

    this.submitForm.emit(this.buildPayload());
  }

  onCancel(){
  // this.router.navigate(['']);
    this.location.back();
}


}
