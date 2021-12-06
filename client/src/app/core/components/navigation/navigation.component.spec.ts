import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

import { NavigationComponent } from './navigation.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { CoreService } from '../../services/core.service';
import { of } from 'rxjs';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let loader: HarnessLoader;
  let de: DebugElement;

  // Creating spyObjects for needed services and functions
  const authServiceSpy = jasmine.createSpyObj('AuthService', {
    isLoggedIn: false,
    logout: () => {
      return;
    },
    getUserId: 'id',
  });

  const coreServiceSpy = jasmine.createSpyObj('CoreService', {
    openLogin: () => {
      return;
    },
    getUserImage: '/user',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      // Import all the needed modules
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatMenuModule,
        MatDialogModule,
        RouterTestingModule,
      ],
      // Provide spyObjects as a real service
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CoreService, useValue: coreServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    de = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load toolbar', async () => {
    const toolbars = await loader.getAllHarnesses(MatToolbarHarness);
    expect(toolbars.length).toBe(1);
  });

  it('should have header', async () => {
    expect(await de.query(By.css('.header')).nativeElement.innerText).toBe(
      'Rate my code'
    );
  });

  it('should load all buttons', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
  });

  describe('user is not logged in', () => {
    beforeEach(() => {
      authServiceSpy.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should have sign-in text', async () => {
      expect(
        await de.query(By.css('.sign-in-text')).nativeElement.innerText
      ).toBe('Sign in');
    });

    it('should call authService.openLogin() from sign-in button', async () => {
      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      await buttons[1].click();
      expect(coreServiceSpy.openLogin).toHaveBeenCalled();
    });
  });

  describe('user is logged in', () => {
    beforeEach(() => {
      authServiceSpy.isLoggedIn.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should not have sign-in text', async () => {
      expect(de.query(By.css('.sign-in-text'))).toBeNull();
    });

    it('should have user-icon', async () => {
      expect(de.query(By.css('.user-icon'))).toBeDefined();
    });

    it('should load user menu', async () => {
      const menus = await loader.getAllHarnesses(MatMenuHarness);
      expect(menus.length).toBe(1);
    });

    it('should have user menu closed as default', async () => {
      const menus = await loader.getAllHarnesses(MatMenuHarness);
      expect(await menus[0].isOpen()).toBeFalse();
    });

    it('should have right items in user menu', async () => {
      const menus = await loader.getAllHarnesses(MatMenuHarness);
      await menus[0].open();
      const items = await menus[0].getItems();
      expect(items.length).toBe(2);
      expect(await items[0].getText()).toEqual('View profile');
      expect(await items[1].getText()).toEqual('Log out');
    });

    describe('confirm dialog is confirmed', () => {
      beforeEach(() => {
        spyOn(component['dialog'], 'open').and.returnValue({
          afterClosed: () => of(true),
        } as MatDialogRef<unknown, unknown>);
      });

      it('should call authService.logout() from logout-item ', async () => {
        const menus = await loader.getAllHarnesses(MatMenuHarness);
        await menus[0].open();
        const items = await menus[0].getItems();
        await items[1].click();
        expect(authServiceSpy.logout).toHaveBeenCalled();
      });
    });

    describe('confirm dialog is not confirmed', () => {
      beforeEach(() => {
        spyOn(component['dialog'], 'open').and.returnValue({
          afterClosed: () => of(false),
        } as MatDialogRef<unknown, unknown>);
      });

      it('should not call authService.logout() from logout-item', async () => {
        authServiceSpy.logout.calls.reset();
        const menus = await loader.getAllHarnesses(MatMenuHarness);
        await menus[0].open();
        const items = await menus[0].getItems();
        await items[1].click();
        expect(authServiceSpy.logout).not.toHaveBeenCalled();
      });
    });
  });
});
