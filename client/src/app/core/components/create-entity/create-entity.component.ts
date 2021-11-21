import { StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointService } from '../../services/breakpoint.service';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss'],
})
export class CreateEntityComponent {
  firstStep: FormGroup;
  orientation: StepperOrientation = 'horizontal';
  breakpointSubscription: Subscription;
  textContent: string = '';
  codeSnippet: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointService: BreakpointService,
    private entityService: EntityService,
    private router: Router
  ) {
    this.firstStep = this._formBuilder.group({
      title: ['', Validators.required],
    });

    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandset) => {
        if (isHandset) this.orientation = 'vertical';
        else this.orientation = 'horizontal';
      }
    );
  }

  submit() {
    this.entityService
      .createEntity(
        this.firstStep.get('title')?.value,
        this.textContent,
        this.codeSnippet
      )
      .subscribe((res) => {
        if (res.success) this.router.navigate(['/']);
      });
  }

  ngOnDestroy() {
    this.breakpointSubscription.unsubscribe();
  }
}
