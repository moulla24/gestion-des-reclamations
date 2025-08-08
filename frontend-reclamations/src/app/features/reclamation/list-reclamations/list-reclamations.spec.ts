import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReclamationsComponent } from './list-reclamations.component';

describe('ListReclamations', () => {
  let component: ListReclamationsComponent;
  let fixture: ComponentFixture<ListReclamationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReclamationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
