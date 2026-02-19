import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Paginated } from 'src/app/core/models/paginated.model';

interface DummyItem {
  id: number;
  name: string;
}

describe('PaginationService', () => {
  let service: PaginationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaginationService]
    });

    service = TestBed.inject(PaginationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getByUrl should make a GET request and return data', () => {
    const dummyResponse: Paginated<DummyItem> = {
      results: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      count: 2,
      next: '/api/items/?page=2',
      previous: null
    };

    service.getByUrl<DummyItem>('/api/items/').subscribe(res => {
      expect(res.results.length).toBe(2);
      expect(res.results[0].name).toBe('Item 1');
      expect(res.count).toBe(2);
    });

    const req = httpMock.expectOne('/api/items/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
