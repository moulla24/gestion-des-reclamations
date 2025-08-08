import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReclamationComponent } from './detail-reclamation';

describe('DetailReclamation', () => {
  let component: DetailReclamationComponent;
  let fixture: ComponentFixture<DetailReclamationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReclamationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
