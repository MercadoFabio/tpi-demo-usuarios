import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosLib } from './usuarios-lib';

describe('UsuariosLib', () => {
  let component: UsuariosLib;
  let fixture: ComponentFixture<UsuariosLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosLib],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosLib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
