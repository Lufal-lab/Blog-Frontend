import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('startItem', () => {
    it('should return 0 if totalItems is 0', () => {
      component.totalItems = 0;
      component.currentPage = 1;
      component.pageSize = 10;
      expect(component.startItem).toBe(0);
    });

    it('should calculate correctly the start item', () => {
      component.totalItems = 50;
      component.currentPage = 2;
      component.pageSize = 10;
      expect(component.startItem).toBe(11);
    });
  });

  describe('endItem', () => {
    it('should not exceed totalItems', () => {
      component.totalItems = 15;
      component.currentPage = 2;
      component.pageSize = 10;
      expect(component.endItem).toBe(15); // 2*10 = 20, pero totalItems=15
    });

    it('should calculate correctly the end item within limits', () => {
      component.totalItems = 50;
      component.currentPage = 2;
      component.pageSize = 10;
      expect(component.endItem).toBe(20);
    });
  });

  describe('Output events', () => {
    it('should emit nextPage', () => {
      spyOn(component.nextPage, 'emit');
      component.nextPage.emit();
      expect(component.nextPage.emit).toHaveBeenCalled();
    });

    it('should emit previousPage', () => {
      spyOn(component.previousPage, 'emit');
      component.previousPage.emit();
      expect(component.previousPage.emit).toHaveBeenCalled();
    });
  });
});
