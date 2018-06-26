import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { MatCheckboxModule, MatExpansionModule } from "@angular/material";
import { FormsModule } from "@angular/forms";
import { SettingsService } from "../shared/services/settings.service";
import { PersistenceModule } from "angular-persistence";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MockedToasterService, ToasterService } from "../shared/services/toaster.service";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: SettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule, MatCheckboxModule, FormsModule,
        PersistenceModule, BrowserAnimationsModule ],
      providers: [
        SettingsService,
        { provide: ToasterService, useClass: MockedToasterService }
      ],
      declarations: [ SettingsComponent ]
    })
    .compileComponents();

    settingsService = TestBed.get(SettingsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get and save new settings', () => {
    const settings = {
      'crash_reports': true,
      'experimental_features': true
    };
    const getAll = spyOn(settingsService, 'getAll').and.returnValue(settings);
    const setAll = spyOn(settingsService, 'setAll');
    component.ngOnInit();
    expect(getAll).toHaveBeenCalled();
    expect(component.settings).toEqual(settings);
    component.settings.crash_reports = false;
    component.save();
    expect(setAll).toHaveBeenCalledWith(settings);
  });


});