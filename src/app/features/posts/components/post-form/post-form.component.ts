import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';


export type PermissionOption = 'none' | 'read_only' | 'read_write';
type PermissionKeys = 'public' | 'authenticated' | 'team' | 'author';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html'
})
export class PostFormComponent implements OnInit {

  @Input() initialData: any | null = null;
  @Output() submitForm = new EventEmitter<any>();

  private readonly levels: PermissionKeys[] = [
    'public',
    'authenticated',
    'team',
    'author'
  ];

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    content: ['', Validators.required],

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
    this.form.valueChanges.subscribe(values => {

      const hierarchy: PermissionKeys[] = [
        'public',
        'authenticated',
        'team',
        'author'
      ];

      for (let i = 0; i < hierarchy.length; i++) {
        const current = hierarchy[i];
        const value = values[current] as PermissionOption;

        if (value === 'none') {
          for (let j = 0; j < i; j++) {
            this.form.patchValue(
              { [hierarchy[j]]: 'none' },
              { emitEvent: false }
            );
          }
        }

        if (value === 'read_write') {
          for (let j = i; j < hierarchy.length; j++) {
            this.form.patchValue(
              { [hierarchy[j]]: 'read_write' },
              { emitEvent: false }
            );
          }
        }

        if (value === 'read_only') {
          for (let j = i + 1; j < hierarchy.length; j++) {
            if (this.form.get(hierarchy[j])?.value === 'none') {
              this.form.patchValue(
                { [hierarchy[j]]: 'read_only' },
                { emitEvent: false }
              );
            }
          }
        }
      }
    });
  }

  private buildPayload() {
    const permissions = this.form.getRawValue();

    let privacyRead: PrivacyLevel = PrivacyLevel.PUBLIC;
    let privacyWrite: PrivacyLevel = PrivacyLevel.AUTHOR;

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


}
