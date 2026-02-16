import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostIdComponent } from './post-card.component';

describe('PostIdComponent', () => {
  let component: PostIdComponent;
  let fixture: ComponentFixture<PostIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
