import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { InicioGuard } from './guards/inicio.guard';



describe('introGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => InicioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
  
