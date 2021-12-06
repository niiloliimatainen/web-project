import { Observable, Subject, defer } from 'rxjs';
import { finalize } from 'rxjs/operators';

// indicator that is used to show requests progress. If request is not yet finalized, the indicator will emit true to the loading subject.
// When request is finalized, the indicator emit false to loading subject.
export const prepare = <T>(callback: () => void) => {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
};

export const indicate = <T>(indicator: Subject<boolean>) => {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      prepare(() => indicator.next(true)),
      finalize(() => {
        indicator.next(false);
      })
    );
};
