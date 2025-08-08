import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReclamationComponent } from './edit-reclamation';

describe('EditReclamation', () => {
  let component: EditReclamationComponent;
  let fixture: ComponentFixture<EditReclamationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReclamationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
