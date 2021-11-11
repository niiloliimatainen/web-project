import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.observeBreakpoints([Breakpoints.HandsetPortrait]);
  }

  private observeBreakpoints(breakpoints: string[]): Observable<boolean> {
    return this.breakpointObserver.observe(breakpoints).pipe(
      map((result) => result.matches),
      // Caches last value and returns it for late subscribers
      shareReplay(1)
    );
  }
}
