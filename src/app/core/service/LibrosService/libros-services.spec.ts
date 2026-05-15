import { TestBed } from '@angular/core/testing';
import { BooksService } from '../../core/service/LibrosService/libros-services.service'

describe('LibrosServicesService', () => {
  let service: BooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
