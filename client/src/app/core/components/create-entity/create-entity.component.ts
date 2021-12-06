import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Entity } from '../../models/entity.model';
import { BreakpointService } from '../../services/breakpoint.service';
import { CoreService } from '../../services/core.service';
import { EntityService } from '../../services/entity.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
  styleUrls: ['./create-entity.component.scss'],
})
export class CreateEntityComponent implements OnDestroy {
  editMode: boolean = false;
  firstStep: FormGroup;
  orientation: StepperOrientation = 'horizontal';
  breakpointSubscription: Subscription;
  textContent: string = '';
  codeSnippet: string = '';
  entity: Entity = {} as Entity;
  private routeSubscription: Subscription | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointService: BreakpointService,
    private entityService: EntityService,
    private router: Router,
    private route: ActivatedRoute,
    public coreService: CoreService,
    private location: Location
  ) {
    this.firstStep = this._formBuilder.group({
      title: ['', Validators.required],
    });

    // Identify component's state, edit or create new
    this.routeSubscription = this.route.url.subscribe((url) => {
      if (url[0].path === 'edit') {
        this.editMode = true;
        this.getEditableEntity();
      }
    });

    // Subscribe breakpoint observable and set orientation according to it
    this.breakpointSubscription = this.breakpointService.isHandset$.subscribe(
      (isHandset) => {
        if (isHandset) this.orientation = 'vertical';
        else this.orientation = 'horizontal';
      }
    );
  }

  // Create new entity and navigate to front page after success
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

  // Update entity and navigate back to entity view after success
  update() {
    this.entity.title = this.firstStep.get('title')?.value;
    this.entity.content = this.textContent;
    this.entity.codeSnippet = this.codeSnippet;

    this.entityService.updateEntity(this.entity).subscribe((res) => {
      if (res.success) this.location.back();
    });
  }

  private getEditableEntity() {
    this.entity = this.coreService.getActiveEntity();
    this.firstStep.controls['title'].setValue(this.entity.title);
    this.textContent = this.entity.content;
    this.codeSnippet = this.entity.codeSnippet;
  }

  ngOnDestroy() {
    this.breakpointSubscription.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}
