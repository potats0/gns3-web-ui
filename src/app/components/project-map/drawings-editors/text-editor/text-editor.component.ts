import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Project } from '../../../../models/project';
import { Drawing } from '../../../../cartography/models/drawing';
import { Server } from '../../../../models/server';
import { MatDialogRef } from '@angular/material';
import { DrawingToMapDrawingConverter } from '../../../../cartography/converters/map/drawing-to-map-drawing-converter';
import { MapDrawingToSvgConverter } from '../../../../cartography/converters/map/map-drawing-to-svg-converter';
import { DrawingService } from '../../../../services/drawing.service';
import { DrawingsDataSource } from '../../../../cartography/datasources/drawings-datasource';
import { TextElement } from '../../../../cartography/models/drawings/text-element';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToasterService } from '../../../../services/toaster.service';
import { RotationValidator } from '../../../../validators/RotationValidator';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorDialogComponent implements OnInit {
  @ViewChild('textArea') textArea: ElementRef;

  server: Server;
  project: Project;
  drawing: Drawing;
  element: TextElement;
  formGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TextEditorDialogComponent>,
    private drawingToMapDrawingConverter: DrawingToMapDrawingConverter,
    private mapDrawingToSvgConverter: MapDrawingToSvgConverter,
    private drawingService: DrawingService,
    private drawingsDataSource: DrawingsDataSource,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private rotationValidator: RotationValidator
  ) {
    this.formGroup = this.formBuilder.group({
      rotation: new FormControl('', [Validators.required, rotationValidator.get])
    });
  }

  ngOnInit() {
    this.formGroup.controls['rotation'].setValue(this.drawing.rotation);
    this.element = this.drawing.element as TextElement;
    this.renderer.setStyle(this.textArea.nativeElement, 'color', this.element.fill);
    this.renderer.setStyle(this.textArea.nativeElement, 'font-family', this.element.font_family);
    this.renderer.setStyle(this.textArea.nativeElement, 'font-size', `${this.element.font_size}pt`);
    this.renderer.setStyle(this.textArea.nativeElement, 'font-weight', this.element.font_weight);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onYesClick() {
    if (this.formGroup.valid) {
      this.drawing.rotation = this.formGroup.get('rotation').value;
      this.drawing.element = this.element;
  
      let mapDrawing = this.drawingToMapDrawingConverter.convert(this.drawing);
      mapDrawing.element = this.drawing.element;
  
      this.drawing.svg = this.mapDrawingToSvgConverter.convert(mapDrawing);
  
      this.drawingService.update(this.server, this.drawing).subscribe((serverDrawing: Drawing) => {
        this.drawingsDataSource.update(serverDrawing);
        this.dialogRef.close();
      });
    } else {
      this.toasterService.error(`Entered data is incorrect`);
    }
  }

  changeTextColor(changedColor) {
    this.renderer.setStyle(this.textArea.nativeElement, 'color', changedColor);
  }
}
