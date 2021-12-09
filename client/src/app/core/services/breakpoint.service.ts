import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
// This service is used to observe breakpoints and share them to components
export class BreakpointService {
  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    // You can add here as many breakpoints you like
    this.isHandset$ = this.observeBreakpoints([Breakpoints.HandsetPortrait]);
  }

  isMaxWidth(pixelValue: number) {
    return this.observeBreakpoints([`(max-width: ${pixelValue}px)`]);
  }

  // Return observable that shows if the breakpoint matches the screen size
  private observeBreakpoints(breakpoints: string[]): Observable<boolean> {
    return this.breakpointObserver.observe(breakpoints).pipe(
      map((result) => result.matches),
      // Caches last value and returns it for late subscribers
      shareReplay(1)
    );
  }
}
