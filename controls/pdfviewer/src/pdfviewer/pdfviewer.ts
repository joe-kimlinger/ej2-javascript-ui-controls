/* eslint-disable */
// eslint-disable-next-line max-len
import { Component, INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, L10n, Collection, Complex, isBlazor } from '@syncfusion/ej2-base';
import { ModuleDeclaration, isNullOrUndefined, Property, Event, EmitType } from '@syncfusion/ej2-base';
// eslint-disable-next-line max-len
import { PdfViewerModel, HighlightSettingsModel, UnderlineSettingsModel, StrikethroughSettingsModel, LineSettingsModel, ArrowSettingsModel, RectangleSettingsModel, CircleSettingsModel, PolygonSettingsModel, StampSettingsModel, StickyNotesSettingsModel, CustomStampSettingsModel, VolumeSettingsModel, RadiusSettingsModel, AreaSettingsModel, PerimeterSettingsModel, DistanceSettingsModel, MeasurementSettingsModel, FreeTextSettingsModel, AnnotationSelectorSettingsModel, TextSearchColorSettingsModel, DocumentTextCollectionSettingsModel, TextDataSettingsModel, RectangleBoundsModel, SignatureFieldSettingsModel, InitialFieldSettingsModel, SignatureIndicatorSettingsModel, TextFieldSettingsModel, PasswordFieldSettingsModel, CheckBoxFieldSettingsModel, RadioButtonFieldSettingsModel, DropdownFieldSettingsModel, ListBoxFieldSettingsModel, ItemModel, SignatureDialogSettingsModel } from './pdfviewer-model';
import { ToolbarSettingsModel, ShapeLabelSettingsModel } from './pdfviewer-model';
// eslint-disable-next-line max-len
import { ServerActionSettingsModel, AjaxRequestSettingsModel, CustomStampModel, HandWrittenSignatureSettingsModel, AnnotationSettingsModel, TileRenderingSettingsModel, ScrollSettingsModel, FormFieldModel, InkAnnotationSettingsModel } from './pdfviewer-model';
import { IAnnotationPoint, IPoint, PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
// eslint-disable-next-line max-len
import { LinkTarget, InteractionMode, SignatureFitMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode, PrintMode, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, FormFieldType, AllowedInteraction, AnnotationDataFormat, SignatureType, CommentStatus, SignatureItem, FormDesignerToolbarItem, DisplayMode, VisibilityState } from './base/types';
import { Annotation } from './index';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { FormFields } from './index';
import { FormDesigner } from './index';
import { Print, CalibrationUnit } from './index';
// eslint-disable-next-line max-len
import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs, AjaxRequestSuccessEventArgs } from './index';
import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs, PageMouseoverEventArgs, AnnotationMouseLeaveEventArgs , ButtonFieldClickEventArgs} from './index';
// eslint-disable-next-line max-len
import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs, ExtractTextCompletedEventArgs, PrintStartEventArgs, PrintEndEventArgs } from './index';
// eslint-disable-next-line max-len
import { TextSearchStartEventArgs, TextSearchCompleteEventArgs, TextSearchHighlightEventArgs } from './index';
import { PdfAnnotationBase, PdfFormFieldBase, ZOrderPageTable } from './drawing/pdf-annotation';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './drawing/pdf-annotation-model';
import { Drawing, ClipBoardObject } from './drawing/drawing';
import { Selector } from './drawing/selector';
import { SelectorModel } from './drawing/selector-model';
import { PointModel, IElement, Rect, cornersPointsBeforeRotation, Point } from '@syncfusion/ej2-drawings';
import { renderAdornerLayer } from './drawing/dom-util';
import { ThumbnailClickEventArgs } from './index';
// eslint-disable-next-line max-len
import { ValidateFormFieldsArgs, BookmarkClickEventArgs, AnnotationUnSelectEventArgs, BeforeAddFreeTextEventArgs, FormFieldFocusOutEventArgs, CommentEventArgs, FormFieldClickArgs, FormFieldAddArgs, FormFieldRemoveArgs, FormFieldPropertiesChangeArgs, FormFieldMouseLeaveArgs, FormFieldMouseoverArgs, FormFieldMoveArgs, FormFieldResizeArgs, FormFieldSelectArgs, FormFieldUnselectArgs, FormFieldDoubleClickArgs, AnnotationMovingEventArgs } from './base';
// eslint-disable-next-line max-len
import { AddSignatureEventArgs, RemoveSignatureEventArgs, MoveSignatureEventArgs, SignaturePropertiesChangeEventArgs, ResizeSignatureEventArgs, SignatureSelectEventArgs } from './base';
import { ContextMenuSettingsModel } from './pdfviewer-model';
import { IFormField, IFormFieldBound } from './form-designer/form-designer';
import { PdfPageRotateAngle } from '@syncfusion/ej2-pdf-export'; 


/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Enable or disables the toolbar of PdfViewer.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public toolbarItems: ToolbarItem[];

    /**
     * Provide option to customize the annotation toolbar of the PDF Viewer.
     */
    @Property()
    public annotationToolbarItems: AnnotationToolbarItem[];

    /**
     * Customize the tools to be exposed in the form designer toolbar.
     */
    @Property()
    public formDesignerToolbarItems: FormDesignerToolbarItem[];
}

/**
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
 */
export class AjaxRequestSettings extends ChildProperty<AjaxRequestSettings> {

    /**
     * set the ajax Header values in the PdfViewer.
     */
    @Property()
    public ajaxHeaders: IAjaxHeaders[];

    /**
     * set the ajax credentials for the pdfviewer.
     */
    @Property(false)
    public withCredentials: boolean;
}

export interface IAjaxHeaders {

    /**
     * specifies the ajax Header Name of the PdfViewer.
     */
    headerName: string

    /**
     * specifies the ajax Header Value of the PdfViewer.
     */
    headerValue: string
}
/**
 * The `CustomStamp` module is used to provide the custom stamp added in stamp menu of the PDF Viewer toolbar.
 */
export class CustomStamp extends ChildProperty<CustomStamp> {
    /**
     * Defines the custom stamp name to be added in stamp menu of the PDF Viewer toolbar.
     */
    @Property('')
    public customStampName: string;

    /**
     * Defines the custom stamp images source to be added in stamp menu of the PDF Viewer toolbar.
     */
    @Property('')
    public customStampImageSource: string;
}

/**
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 */
export class AnnotationToolbarSettings extends ChildProperty<AnnotationToolbarSettings> {
    /**
     * Enable or disables the tooltip of the toolbar.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public annotationToolbarItem: AnnotationToolbarItem[];
}

/**
 * The `FormDesignerToolbarSettings` module is used to provide the Form designer toolbar settings of the PDF viewer.
 */
 export class FormDesignerToolbarSettings extends ChildProperty<FormDesignerToolbarSettings> {
    /**
     * Enable or disables the tooltip of the toolbar.
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * shows only the defined options in the PdfViewer.
     */
    @Property()
    public formDesignerToolbarItem: FormDesignerToolbarItem[];
}

/**
 * The `SignatureFieldSettings` module is used to set the properties of signature field in PDF Viewer
 */
export class SignatureFieldSettings extends ChildProperty<SignatureFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;
     
    /**
     * Specifies whether the signature field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;
     
    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;
     
    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;
    
    /**
     * Get or set the boolean value to print the signature field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;
     
    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Specifies the properties of the signature Dialog Settings in the signature field.
     */
    @Property()
    public signatureDialogSettings: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    @Property()
    public signatureIndicatorSettings: SignatureIndicatorSettingsModel;
}

/**
 * The `InitialFieldSettings` module is used to set the properties of initial field in PDF Viewer
 */
export class InitialFieldSettings extends ChildProperty<InitialFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the initial field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the initial field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Gets or sets the initial field type of the signature field.
     */
    @Property(false)
    public isInitialField: boolean;

    /**
     * Get or set the signature dialog settings for initial field.
     */
    @Property()
    public initialDialogSettings: SignatureDialogSettingsModel;

    /**
     * Specifies the properties of the signature indicator in the initial field.
     */
    @Property()
    public initialIndicatorSettings: SignatureIndicatorSettingsModel;
}

/**
 * The `SignatureIndicatorSettings` module is used to provide the properties of signature Indicator in the signature field
 */
export class SignatureIndicatorSettings extends ChildProperty<SignatureIndicatorSettings> {

    /**
     * Specifies the opacity of the signature indicator.
     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the color of the signature indicator.
     */
    @Property('orange')
    public backgroundColor: string;

    /**
     * Specifies the width of the signature indicator. Maximum width is half the width of the signature field.
     * Minimum width is the default value.
     */
    @Property(19)
    public width: number;

    /**
     * Specifies the height of the signature indicator. Maximum height is half the height of the signature field.
     * Minimum height is the default value.
     */
    @Property(10)
    public height: number;

    /**
     * Specifies the signature Indicator's font size. The maximum size of the font is half the height of the signature field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * Specifies the text of the signature Indicator.
     */
    @Property(null)
    public text: string;

    /**
     * Specifies the color of the text of signature indicator.
     */
    @Property('black')
    public color: string;

}

/**
 * The `SignatureDialogSettings` module is used to customize the signature dialog box.
 */
export class SignatureDialogSettings extends ChildProperty<SignatureDialogSettings> {
    /**
     * Get or set the required signature options will be enabled in the signature dialog.
     */
    @Property(DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload)
    public displayMode: DisplayMode;

    /**
     * Get or set a boolean value to show or hide the save signature check box option in the signature dialog. FALSE by default.
     */
    @Property(false)
    public hideSaveSignature: boolean;
}
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 */
export class ServerActionSettings extends ChildProperty<ServerActionSettings> {
    /**
     * specifies the load action of PdfViewer.
     */
    @Property('Load')
    public load: string;

    /**
     * specifies the unload action of PdfViewer.
     */
    @Property('Unload')
    public unload: string;

    /**
     * specifies the render action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public renderPages: string;

    /**
     * specifies the print action of PdfViewer.
     */
    @Property('RenderPdfPages')
    public print: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('Download')
    public download: string;

    /**
     * specifies the download action of PdfViewer.
     */
    @Property('RenderThumbnailImages')
    public renderThumbnail: string;

    /**
     * specifies the annotation comments action of PdfViewer.
     */
    @Property('RenderAnnotationComments')
    public renderComments: string;

    /**
     * specifies the imports annotations action of PdfViewer.
     */
    @Property('ImportAnnotations')
    public importAnnotations: string;

    /**
     * specifies the export annotations action of PdfViewer.
     */
    @Property('ExportAnnotations')
    public exportAnnotations: string;

    /**
     * specifies the imports action of PdfViewer.
     */
    @Property('ImportFormFields')
    public importFormFields: string;

    /**
     * specifies the export action of PdfViewer.
     */
    @Property('ExportFormFields')
    public exportFormFields: string;

    /**
     * specifies the export action of PdfViewer.
     */
    @Property('RenderPdfTexts')
    public renderTexts: string;

}

/**
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 */
export class StrikethroughSettings extends ChildProperty<StrikethroughSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;
    
    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
    public bounds: IAnnotationPoint[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#ff0000')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked strikethrough annotations.
     * IsLock can be configured using strikethrough settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
export class UnderlineSettings extends ChildProperty<UnderlineSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
     public bounds: IAnnotationPoint[];
    
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#00ff00')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked underline annotations.
     * IsLock can be configured using underline settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set bounds of the annotation.
     *
     * @default []
     */
     public bounds: IAnnotationPoint[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the color of the annotation.
     */
    @Property('#ffff00')
    public color: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using highlight settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `LineSettings` module is used to provide the properties to line annotation.
 */
export class LineSettings extends ChildProperty<LineSettings> {
    /**
     * Get or set offset of the annotation.
     */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head end style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using line settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `ArrowSettings` module is used to provide the properties to arrow annotation.
 */
export class ArrowSettings extends ChildProperty<ArrowSettings> {
    /**
     * Get or set offset of the annotation.
     */
    @Property({ x: 0, y: 0})
    public offset: IPoint;
 
    /**
      * Get or set page number of the annotation.
      */
    @Property(1)
    public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked arrow annotations.
     * IsLock can be configured using arrow settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `RectangleSettings` module is used to provide the properties to rectangle annotation.
 */
export class RectangleSettings extends ChildProperty<RectangleSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;
 
     /**
      * specifies the width of the annotation.
      */
     @Property(100)
     public width: number;
  
     /**
      * specifies the height of the annotation.
      */
     @Property(50)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked rectangle annotations.
     * IsLock can be configured using rectangle settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `CircleSettings` module is used to provide the properties to circle annotation.
 */
export class CircleSettings extends ChildProperty<CircleSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;
 
     /**
      * specifies the width of the annotation.
      */
     @Property(100)
     public width: number;
  
     /**
      * specifies the height of the annotation.
      */
     @Property(100)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked circle annotations.
     * IsLock can be configured using circle settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `ShapeLabelSettings` module is used to provide the properties to rectangle annotation.
 */
export class ShapeLabelSettings extends ChildProperty<ShapeLabelSettings> {
    /**
     * specifies the opacity of the label.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the label.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the border color of the label.
     */
    @Property('#000')
    public fontColor: string;
    /**
     * specifies the font size of the label.
     */
    @Property(16)
    public fontSize: number;
    /**
     * specifies the max-width of the label.
     */
    @Property('Helvetica')
    public fontFamily: string;
    /**
     * specifies the default content of the label.
     */
    @Property('Label')
    public labelContent: string;
    /**
     * specifies the default content of the label.
     */
    @Property('')
    public notes: string;
}

/**
 * The `PolygonSettings` module is used to provide the properties to polygon annotation.
 */
export class PolygonSettings extends ChildProperty<PolygonSettings> {
    /**
     * Get or set offset of the annotation.
     */
     @Property({ x: 0, y: 0})
     public offset: IPoint;
 
     /**
      * Get or set page number of the annotation.
      */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked polygon annotations.
     * IsLock can be configured using polygon settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `stampSettings` module is used to provide the properties to stamp annotation.
 */
export class StampSettings extends ChildProperty<StampSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
    @Property(150)
    public width: number;
 
    /**
     * specifies the height of the annotation.
     */
    @Property(50)
    public height: number;
     
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Provide option to define the required dynamic stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public dynamicStamps: DynamicStampItem[];

    /**
     * Provide option to define the required sign stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public signStamps: SignStampItem[];

    /**
     * Provide option to define the required standard business stamp items to be displayed in annotation toolbar menu.
     */
    @Property([])
    public standardBusinessStamps: StandardBusinessStampItem[];

    /**
     * Gets or sets the allowed interactions for the locked stamp annotations.
     * IsLock can be configured using stamp settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `CustomStampSettings` module is used to provide the properties to customstamp annotation.
 */
export class CustomStampSettings extends ChildProperty<CustomStampSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

    /**
     * Get or set page number of the annotation.
     */
    @Property(1)
    public pageNumber: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the width of the annotation.
     */
    @Property(0)
    public width: number;

    /**
     * specifies the height of the annotation.
     */
    @Property(0)
    public height: number;

    /**
     * specifies the left position of the annotation.
     */
    @Property(0)
    public left: number;
    /**
     * specifies the top position of the annotation.
     */
    @Property(0)
    public top: number;
    /**
     * Specifies to maintain the newly added custom stamp element in the menu items.
     */
    @Property(false)
    public isAddToMenu: boolean;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Define the custom image path and it's name to be displayed in the menu items.
     */
    @Property('')
    public customStamps: CustomStampModel[];

    /**
     * If it is set as false. then the custom stamp items won't be visible in the annotation toolbar stamp menu items.
     */
    @Property(true)
    public enableCustomStamp: boolean;

    /**
     * Gets or sets the allowed interactions for the locked custom stamp annotations.
     * IsLock can be configured using custom stamp settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `DistanceSettings` module is used to provide the properties to distance calibrate annotation.
 */
export class DistanceSettings extends ChildProperty<DistanceSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ff0000')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the leader length of the annotation.
     */
    @Property(40)
    public leaderLength: number;

    /**
     * Defines the cursor type for distance annotation.
     */
    @Property(CursorType.move)
    public resizeCursorType: CursorType;

    /**
     * Gets or sets the allowed interactions for the locked distance annotations.
     * IsLock can be configured using distance settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `PerimeterSettings` module is used to provide the properties to perimeter calibrate annotation.
 */
export class PerimeterSettings extends ChildProperty<PerimeterSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadStartStyle: LineHeadStyle;

    /**
     * specifies the line head start style of the annotation.
     */
    @Property('None')
    public lineHeadEndStyle: LineHeadStyle;

    /**
     * specifies the border dash array  of the annotation.
     */
    @Property(0)
    public borderDashArray: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked perimeter annotations.
     * IsLock can be configured using perimeter settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `AreaSettings` module is used to provide the properties to area calibrate annotation.
 */
export class AreaSettings extends ChildProperty<AreaSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked area annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `RadiusSettings` module is used to provide the properties to radius calibrate annotation.
 */
export class RadiusSettings extends ChildProperty<RadiusSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
     @Property(100)
     public width: number;
 
     /**
      * specifies the height of the annotation.
      */
     @Property(90)
     public height: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked radius annotations.
     * IsLock can be configured using area settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `VolumeSettings` module is used to provide the properties to volume calibrate annotation.
 */
export class VolumeSettings extends ChildProperty<VolumeSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;
    
    /**
     * Get or set vertex points of the annotation.
     *
     * @default []
     */
    public vertexPoints?: PointModel[];

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property('1')
    public thickness: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Gets or sets the allowed interactions for the locked volume annotations.
     * IsLock can be configured using volume settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}
/**
 * The `Ink` module is used to provide the properties to Ink annotation.
 */
export class InkAnnotationSettings extends ChildProperty<InkAnnotationSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the width of the annotation.
     */
     @Property(0)
     public width: number;
 
     /**
      * specifies the height of the annotation.
      */
     @Property(0)
     public height: number;

    /**
      * Gets or sets the path of the ink annotation.
      */
     @Property(0)
     public path: string;

    /**
     * Sets the opacity value for ink annotation.By default value is 1. It range varies from 0 to 1.
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets the stroke color for ink annotation.By default values is #FF0000.
     */
    @Property('#ff0000')
    public strokeColor: string;

    /**
     * Sets the thickness for the ink annotation. By default value is 1. It range varies from 1 to 10.
     */
    @Property(1)
    public thickness: number;

    /**
     * Define the default option to customize the selector for ink annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * If it is set as true, can't interact with annotation. Otherwise can interact the annotations. By default it is false.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * Gets or sets the allowed interactions for the locked ink annotations.
     * IsLock can be configured using ink settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
    /**
     * specifies the custom data of the annotation
     */
    @Property(null)
    public customData: object;

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

}
/**
 * The `stickyNotesSettings` module is used to provide the properties to sticky notes annotation.
 */
export class StickyNotesSettings extends ChildProperty<StickyNotesSettings> {

    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * specifies the lock action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * Gets or sets the allowed interactions for the locked sticky notes annotations.
     * IsLock can be configured using sticky notes settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;
}

/**
 * The `MeasurementSettings` module is used to provide the settings to measurement annotations.
 */
export class MeasurementSettings extends ChildProperty<MeasurementSettings> {
    /**
     * specifies the scale ratio of the annotation.
     */
    @Property(1)
    public scaleRatio: number;

    /**
     * specifies the unit of the annotation.
     */
    @Property('in')
    public conversionUnit: CalibrationUnit;

    /**
     * specifies the unit of the annotation.
     */
    @Property('in')
    public displayUnit: CalibrationUnit;

    /**
     * specifies the depth of the volume annotation.
     */
    @Property(96)
    public depth: number;
}

/**
 * The `FreeTextSettings` module is used to provide the properties to free text annotation.
 */
export class FreeTextSettings extends ChildProperty<FreeTextSettings> {
    /**
    * Get or set offset of the annotation.
    */
    @Property({ x: 0, y: 0})
    public offset: IPoint;

     /**
     * Get or set page number of the annotation.
     */
     @Property(1)
     public pageNumber: number;

    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the border color of the annotation.
     */
    @Property('#ffffff00')
    public borderColor: string;

    /**
     * specifies the border with of the annotation.
     */
    @Property(1)
    public borderWidth: number;

    /**
     * specifies the border style of the annotation.
     */
    @Property('solid')
    public borderStyle: string;

    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the background fill color of the annotation.
     */
    @Property('#ffffff00')
    public fillColor: string;

    /**
     * specifies the text box font size of the annotation.
     */
    @Property(16)
    public fontSize: number;
    /**
     * specifies the width of the annotation.
     */
    @Property(151)
    public width: number;

    /**
     * specifies the height of the annotation.
     */
    @Property(24.6)
    public height: number;

    /**
     * specifies the text box font color of the annotation.
     */
    @Property('#000')
    public fontColor: string;

    /**
     * specifies the text box font family of the annotation.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * setting the default text for annotation.
     */
    @Property('TypeHere')
    public defaultText: string;

    /**
     * applying the font styles for the text.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Aligning the text in the annotation.
     */
    @Property('Left')
    public textAlignment: TextAlignment;

    /**
     * specifies the allow text only action of the free text annotation.
     */
    @Property(false)
    public allowEditTextOnly: boolean;

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked free text annotations.
     * IsLock can be configured using free text settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];

    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    @Property(true)
    public isPrint: boolean;

    /**
     * Allow to edit the FreeText annotation. FALSE, by default.
     */
    @Property(false)
    public isReadonly: boolean;

    /**
     * Enable or disable auto fit mode for FreeText annotation in the Pdfviewer. FALSE by default.
     */
    @Property(false)
    public enableAutoFit: boolean;

}

/**
 * The `AnnotationSelectorSettings` module is used to provide the properties to annotation selectors.
 */
export class AnnotationSelectorSettings extends ChildProperty<AnnotationSelectorSettings> {
    /**
     * Specifies the selection border color.
     */
    @Property('')
    public selectionBorderColor: string;

    /**
     * Specifies the border color of the resizer.
     *
     * @ignore
     */
    @Property('black')
    public resizerBorderColor: string;

    /**
     * Specifies the fill color of the resizer.
     *
     * @ignore
     */
    @Property('#FF4081')
    public resizerFillColor: string;

    /**
     * Specifies the size of the resizer.
     *
     * @ignore
     */
    @Property(8)
    public resizerSize: number;

    /**
     * Specifies the thickness of the border of selection.
     */
    @Property(1)
    public selectionBorderThickness: number;

    /**
     * Specifies the shape of the resizer.
     */
    @Property('Square')
    public resizerShape: AnnotationResizerShape;

    /**
     * Specifies the border dash array of the selection.
     */
    @Property('')
    public selectorLineDashArray: number[];

    /**
     * Specifies the location of the resizer.
     */
    @Property(AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges)
    public resizerLocation: AnnotationResizerLocation;

    /**
     * specifies the cursor type of resizer
     */
    @Property(null)
    public resizerCursorType: CursorType;
}

/**
 * The `TextSearchColorSettings` module is used to set the settings for the color of the text search highlight.
 */
export class TextSearchColorSettings extends ChildProperty<TextSearchColorSettings> {
    /**
     * Gets or Sets the color of the current occurrence of the text searched string.
     */
    @Property('#fdd835')
    public searchHighlightColor: string;

    /**
     * Gets or Sets the color of the other occurrence of the text searched string.
     */
    @Property('#8b4c12')
    public searchColor: string;
}

/**
 * The `HandWrittenSignatureSettings` module is used to provide the properties to handwritten signature.
 */
export class HandWrittenSignatureSettings extends ChildProperty<HandWrittenSignatureSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    @Property(1)
    public opacity: number;

    /**
     * specifies the stroke color of the annotation.
     */
    @Property('#000000')
    public strokeColor: string;

    /**
     * specified the thickness of the annotation.
     */
    @Property(1)
    public thickness: number;

    /**
     * specified the width of the annotation.
     */
    @Property(150)
    public width: number;

    /**
     * specified the height of the annotation.
     */
    @Property(100)
    public height: number;

    /**
     * Gets or sets the save signature limit of the signature. By default value is 1 and maximum limit is 5.
     */
    @Property(1)
    public saveSignatureLimit: number;

    /**
     * Gets or sets the save initial limit of the initial. By default value is 1 and maximum limit is 5.
     */
    @Property(1)
    public saveInitialLimit: number;

    /** 
     * Provide option to define the required signature items to be displayed in signature menu.
     */
    @Property([])
    public signatureItem: SignatureItem[];

    /** 
     * Options to set the type signature font name with respective index and maximum font name limit is 4 so key value should be 0 to 3.
     */
    @Property()
    public typeSignatureFonts: { [key: number]: string };

    /**
     * specifies the annotation selector settings of the annotation.
     */
    @Property('')
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Get or set the Signature DialogSettings for Handwritten signature.
     */
    @Property()
    public signatureDialogSettings: SignatureDialogSettingsModel;
    
    /**
     * Get or set the initialDialogSettings for Handwritten initial.
     */
    @Property()
    public initialDialogSettings: SignatureDialogSettingsModel;

}

/**
 * The `AnnotationSettings` module is used to provide the properties to annotations.
 */
export class AnnotationSettings extends ChildProperty<AnnotationSettings> {
    /**
     * specifies the author of the annotation.
     */
    @Property('Guest')
    public author: string;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public minHeight: number;

    /**
     * specifies the minWidth of the annotation.
     */
    @Property(0)
    public minWidth: number;

    /**
     * specifies the minHeight of the annotation.
     */
    @Property(0)
    public maxHeight: number;

    /**
     * specifies the maxWidth of the annotation.
     */
    @Property(0)
    public maxWidth: number;

    /**
     * specifies the locked action of the annotation.
     */
    @Property(false)
    public isLock: boolean;

    /**
     * specifies whether the annotations are included or not in print actions.
     */
    @Property(false)
    public skipPrint: boolean;

    /**
     * specifies whether the annotations are included or not in download actions.
     */
    @Property(false)
    public skipDownload: boolean;

    /**
     * specifies the custom data of the annotation.
     */
    @Property(null)
    public customData: object;

    /**
     * Gets or sets the allowed interactions for the locked annotations.
     * IsLock can be configured using annotation settings.
     *
     * @default ['None']
     */
    @Property(['None'])
    public allowedInteractions: AllowedInteraction[];
}

/**
 * The `DocumentTextCollectionSettings` module is used to provide the properties to DocumentTextCollection.
 */
export class DocumentTextCollectionSettings extends ChildProperty<DocumentTextCollectionSettings> {
    /**
     * specifies the text data of the document.
     */
    @Property()
    public textData: TextDataSettingsModel[];
    /**
     * specifies the page text of the document.
     */
    @Property()
    public pageText: string;
    /**
     * specifies the page size of the document.
     */
    @Property()
    public pageSize: number;
}

/**
 * The `TextDataSettings` module is used to provide the properties of text data.
 */
export class TextDataSettings extends ChildProperty<TextDataSettings> {
    /**
     * specifies the bounds of the rectangle.
     */
    @Property()
    public bounds: RectangleBoundsModel;
    /**
     * specifies the text of the document.
     */
    @Property()
    public text: string;
}

/**
 * The `RectangleBounds` module is used to provide the properties of rectangle bounds.
 */
export class RectangleBounds extends ChildProperty<RectangleBounds> {
    /**
     * specifies the size of the rectangle.
     */
    @Property()
    public size: number;
    /**
     * specifies the x co-ordinate of the upper-left corner of the rectangle.
     */
    @Property()
    public x: number;
    /**
     * specifies the y co-ordinate of the upper-left corner of the rectangle.
     */
    @Property()
    public y: number;
    /**
     * specifies the width of the rectangle.
     */
    @Property()
    public width: number;
    /**
     * specifies the height of the rectangle.
     */
    @Property()
    public height: number;
    /**
     * specifies the left value of the rectangle.
     */
    @Property()
    public left: number;
    /**
     * specifies the top value of the rectangle.
     */
    @Property()
    public top: number;
    /**
     * specifies the right of the rectangle.
     */
    @Property()
    public right: number;
    /**
     * specifies the bottom value of the rectangle.
     */
    @Property()
    public bottom: number;
    /**
     * Returns true if height and width of the rectangle is zero.
     *
     * @default 'false'
     */
    @Property()
    public isEmpty: boolean;
}

/**
 * The `TileRenderingSettings` module is used to provide the tile rendering settings of the PDF viewer.
 */
export class TileRenderingSettings extends ChildProperty<TileRenderingSettings> {
    /**
     * Enable or disables tile rendering mode in the PDF Viewer.
     */
    @Property(true)
    public enableTileRendering: boolean;

    /**
     * specifies the tileX count of the render Page.
     */
    @Property(0)
    public x: number;

    /**
     * specifies the tileY count of the render Page.
     */
    @Property(0)
    public y: number;
}
/**
 * The `ScrollSettings` module is used to provide the settings of the scroll of the PDF viewer.
 */
export class ScrollSettings extends ChildProperty<ScrollSettings> {
    /**
     * Increase or decrease the delay time.
     */
    @Property(100)
    public delayPageRequestTimeOnScroll: number;
}
/**
 * The `FormField` is used to store the form fields of PDF document.
 */
export class FormField extends ChildProperty<FormField> {
    /**
     * Gets the name of the form field.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    @Property(false)
    public isChecked: boolean;
    
    /**
     * Specifies whether the radio button is in checked state or not.
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Gets the id of the form field.
     */
    @Property('')
    public id: string;

    /**
     * Gets or sets the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Gets the type of the form field.
     */
    @Property('')
    public type: FormFieldType;

    /**
     * If it is set as true, can't edit the form field in the PDF document. By default it is false.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * specifies the type of the signature.
     */
    @Property([''])
    public signatureType: SignatureType[];

    /**
     * specifies the fontName of the signature.
     */
    @Property('')
    public fontName: string;

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the font family of the form field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the form field.
     */
    @Property(10)
    public fontSize: number;
   
    /**
     * Get or set the font Style of form field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the form field in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the form field in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the text alignment of the form field.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * Gets or set the is Required of form field.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the form field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the form field items. This can be Dropdown items or Listbox items.
     */
    @Property('')
    public options: ItemModel[];

    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    @Property()
    public signatureIndicatorSettings: SignatureIndicatorSettingsModel;

    /**
     * Get or set the thickness of the form field.
     */
    @Property(1)
    public thickness: number;
     
    /**
     * Get or set the border color of the form field.
     */
    @Property('#303030')
    public borderColor: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
    @Property(false)
    public isMultiline: boolean;
    /**
     * Get the pageIndex of the form field. Default value is -1.
     */
    @Property(-1)
    public pageIndex: number;
}
/**
 * The `ContextMenuSettings` is used to show the context menu of PDF document.
 */
export class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Defines the context menu action.
     *
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuAction: ContextMenuAction;

    /**
     * Defines the context menu items should be visible in the PDF Viewer.
     *
     *  @default []
     */
    @Property([])
    public contextMenuItems: ContextMenuItem[];
}

/**
 * The `TextFieldSettings` is used to to show and customize the appearance of text box HTML element.
 */
export class TextFieldSettings extends ChildProperty<TextFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the textbox field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the textbox field.
     */
    @Property(10)
    public fontSize: number;
    
    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font Style of textbox field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the textbox in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the textbox in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the textbox field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the textbox field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the textbox field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the textbox field.
     */
    @Property('#303030')
    public borderColor: string;

    /**
     * Allows multiline input in the text field. FALSE, by default.
     */
     @Property(false)
     public isMultiline: boolean;
}

/**
 * The `PasswordFieldSettings` is used to to show and customize the appearance of password input HTML element.
 */
 export class PasswordFieldSettings extends ChildProperty<PasswordFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font family of the password field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the password field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * Get or set the font Style of password field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the password field in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the password field in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the password field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * Get or set the maximum character length.
     */
    @Property(0)
    public maxLength: number;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the password field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the password field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the password field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `CheckBoxFieldSettings` is used to to show and customize the appearance of check box element.
 */
 export class CheckBoxFieldSettings extends ChildProperty<CheckBoxFieldSettings> {
    
    /**
     * Get or set the form field bounds.
     */
    @Property({ x: 0, y: 0, width: 0, height: 0 })
    public bounds: IFormFieldBound;

    /**
     * Get or set the name of the check box.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the check box is in checked state or not.
     */
    @Property(false)
    public isChecked: boolean;

    /**
     * Get or set the background color of the check box in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Specifies whether the check box field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * Get or set the boolean value to print the check box field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the thickness of the check box field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the check box field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `RadioButtonFieldSettings` is used to to show and customize the appearance of radio button element.
 */
 export class RadioButtonFieldSettings extends ChildProperty<RadioButtonFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Specifies whether the radio button is in checked state or not.
     */
    @Property(false)
    public isSelected: boolean;

    /**
     * Get or set the background color of the radio button in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Specifies whether the radio button field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * Get or set the boolean value to print the radio button field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the thickness of the radio button field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the radio button field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `DropdownFieldSettings` is used to to show and customize the appearance of drop down element.
 */
 export class DropdownFieldSettings extends ChildProperty<DropdownFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the dropdown.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the dropdown field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the dropdown field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font style of dropdown field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the dropdown in hexadecimal string format..
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the dropdown in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the dropdown field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the dropdown field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tooltip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the dropdown items.
     */
    @Property('')
    public options: ItemModel[];

    /**
     * Get or set the thickness of the drop down field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the drop down field.
     */
    @Property('#303030')
    public borderColor: string;
}

/**
 * The `ListBoxFieldSettings` is used to to show and customize the appearance of list box element.
 */
export class ListBoxFieldSettings extends ChildProperty<ListBoxFieldSettings> {

    /**
     * Get or set the form field bounds.
     */
     @Property({ x: 0, y: 0, width: 0, height: 0 })
     public bounds: IFormFieldBound;

    /**
     * Get or set the name of the form field element.
     */
    @Property('')
    public name: string;

    /**
     * Get or set the value of the form field.
     */
    @Property('')
    public value: string;

    /**
     * Get or set the font family of the listbox field.
     */
    @Property('Helvetica')
    public fontFamily: string;

    /**
     * Get or set the font size of the listbox field.
     */
    @Property(10)
    public fontSize: number;

    /**
     * specifies the page number of the form field.
     */
    @Property(0)
    public pageNumber: number;

    /**
     * Get or set the font Style of listbox field.
     */
    @Property('None')
    public fontStyle: FontStyle;

    /**
     * Get or set the font color of the listbox in hexadecimal string format.
     */
    @Property('black')
    public color: string;

    /**
     * Get or set the background color of the listbox in hexadecimal string format.
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Get or set the alignment of the text.
     */
    @Property('Left')
    public alignment: TextAlignment;

    /**
     * Specifies whether the listbox field is in read-only or read-write mode. FALSE by default.
     */
    @Property(false)
    public isReadOnly: boolean;

    /**
     * Gets or set the visibility of the form field.
     */
    @Property('visible')
    public visibility: VisibilityState;

    /**
     * If it is set as true, consider as mandatory field in the PDF document. By default it is false.
     */
    @Property(false)
    public isRequired: boolean;

    /**
     * Get or set the boolean value to print the listbox field. TRUE by default.
     */
    @Property(false)
    public isPrint: boolean;

    /**
     * Get or set the text to be displayed as tool tip. By default it is empty.
     */
    @Property('')
    public tooltip: string;

    /**
     * Get or set the listbox items.
     */
    @Property([])
    public options: ItemModel[];

    /**
     * Get or set the thickness of the list box field.
     */
    @Property(1)
    public thickness: number;

    /**
     * Get or set the border color of the list box field.
     */
    @Property('#303030')
    public borderColor: string;
}

export class Item extends ChildProperty<Item> {
    /**
     * Get or set the name.
     */
     @Property('')
     public itemName: string;

    /**
     * Get or set the value.
     */
      @Property('')
      public itemValue: string;
}

/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class PdfViewer extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the service url of the PdfViewer control.
     */
    @Property()
    public serviceUrl: string;

    /**
     * gets the page count of the document loaded in the PdfViewer control.
     *
     * @default 0
     */
    @Property(0)
    public pageCount: number;

    /**
     * Checks whether the PDF document is edited.
     *
     * @asptype bool
     * @blazorType bool
     */
    @Property(false)
    public isDocumentEdited: boolean;

    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     *
     * @default 0
     */
    @Property(0)
    public currentPageNumber: number;

    /**
     * Sets the PDF document path for initial loading.
     */
    @Property()
    public documentPath: string;

    /**
     * Returns the current zoom percentage of the PdfViewer control.
     *
     * @asptype int
     * @blazorType int
     */
    public get zoomPercentage(): number {
        return this.magnificationModule.zoomFactor * 100;
    }

    /**
     * Get the Loaded document annotation Collections in the PdfViewer control.
     */
    // eslint-disable-next-line
    public annotationCollection: any[];

    /**
     * Get the Loaded document formField Collections in the PdfViewer control.
     * 
     * @private
     */
    // eslint-disable-next-line
    public formFieldCollection: any[];


    /**
     * Get the Loaded document signature Collections in the PdfViewer control.
     */
    // eslint-disable-next-line
    public signatureCollection: any[] = [];

    /**
     * Gets or sets the document name loaded in the PdfViewer control.
     */
    public fileName: string = null;

    /**
     * Gets or sets the export annotations JSON file name in the PdfViewer control.
     */
    @Property(null)
    public exportAnnotationFileName: string;

    /**
     * Gets or sets the download file name in the PdfViewer control.
     */
    @Property()
    public downloadFileName: string;

    /**
     * Defines the scrollable height of the PdfViewer control.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the scrollable width of the PdfViewer control.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

    /**
     * Enable or disables the toolbar of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableToolbar: boolean;

    /**
     * Specifies the retry count for the failed requests.
     *
     * @default 1
     */
    @Property(1)
    public retryCount: number;

    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     *
     * @default true
     */
    @Property(true)
    public showNotificationDialog: boolean;

    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableNavigationToolbar: boolean;

    /**
     * Enable or disables the Comment Panel of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableCommentPanel: boolean;

    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     *
     * @default false
     */
    @Property(false)
    public isCommandPanelOpen: boolean;

    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     *
     * @default false
     */
    @Property(false)
    public enableTextMarkupResizer: boolean;

    /**
     * Enable or disable the multi line text markup annotations in overlapping collections.
     *
     * @default false
     */
    @Property(false)
    public enableMultiLineOverlap: boolean;

    /**
     * Checks if the freeText value is valid or not. FALSE by default
     *
     * @default false
     */
    @Property(false)
    public isValidFreeText: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * @deprecated This property renamed into "isAnnotationToolbarVisible"
     * @default false
     */
    @Property(false)
    public isAnnotationToolbarOpen: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     *
     * @default false
     */
    @Property(false)
    public isAnnotationToolbarVisible: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially
     * and get the annotation Toolbar Visible status.
     *
     * @private
     * @default false
     */
    @Property(false)
    public isFormDesignerToolbarVisible: boolean;

    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     *
     * @default false
     */
    @Property(false)
    public enableMultiPageAnnotation: boolean;

    /**
     * Enable or disables the download option of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableDownload: boolean;

    /**
     * Enable or disables the print option of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enablePrint: boolean;

    /**
     * If it is set as FALSE, will suppress the page rotation of Landscape document on print action. By default it is TRUE.
     *
     * @default true
     */
    @Property(true)
    public enablePrintRotation: boolean;

    /**
     * Enables or disables the thumbnail view in the PDF viewer
     *
     * @default true
     */
    @Property(true)
    public enableThumbnail: boolean;

    /**
     * If it set as true, then the thumbnail view show at initial document loading in the PDF viewer
     *
     * @default false
     */
    @Property(false)
    public isThumbnailViewOpen: boolean;

    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     *
     * @default false
     */
    @Property(false)
    public isSignatureEditable: boolean;

    /**
     * Enables or disables the bookmark view in the PDF viewer
     *
     * @default true
     */
    @Property(true)
    public enableBookmark: boolean;

    /**
     * Enables or disables the bookmark styles in the PDF viewer
     *
     * @default false
     */
    @Property(false)
    public enableBookmarkStyles: boolean;

    /**
     * Enables or disables the hyperlinks in PDF document.
     *
     * @default true
     */
    @Property(true)
    public enableHyperlink: boolean;

    /**
     * Enables or disables the handwritten signature in PDF document.
     *
     * @default true
     */
    @Property(true)
    public enableHandwrittenSignature: boolean;
    /**
     * If it is set as false, then the ink annotation support in the PDF Viewer will be disabled. By default it is true.
     *
     * @default true
     */
    @Property(true)
    public enableInkAnnotation: boolean;
    /**
     * restrict zoom request.
     *
     * @default false
     */
    @Property(false)
    public restrictZoomRequest: boolean;
    /**
     * Specifies the open state of the hyperlink in the PDF document.
     *
     * @default CurrentTab
     */
    @Property('CurrentTab')
    public hyperlinkOpenState: LinkTarget;

    /**
     * Specifies the state of the ContextMenu in the PDF document.
     *
     * @default RightClick
     */
    @Property('RightClick')
    public contextMenuOption: ContextMenuAction;

    /**
     * enable or disable context menu Items
     *
     * @default []
     */
    @Property([])
    public disableContextMenuItems: ContextMenuItem[];

    /**
     * Gets the form fields present in the loaded PDF document. It used to get the form fields id, name, type and it's values.
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', id: '', type: '', isReadOnly: false, isSelected: false, isChecked: false, value: '', signatureType: [''], fontName: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', visibility: 'visible', maxLength: 0, isRequired: false, isPrint: false, tooltip: '', pageIndex: -1, options: [], signatureIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' } })
    public formFieldCollections: FormFieldModel[];

    /**
     * Enable or disables the Navigation module of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableNavigation: boolean;

    /**
     * Enable or disables the auto complete option in form documents.
     *
     * @default true
     */
    @Property(true)
    public enableAutoComplete: boolean;

    /**
     * Enable or disables the Magnification module of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableMagnification: boolean;

    /**
     * Enable or disables the Label for shapeAnnotations of PdfViewer.
     *
     * @default false
     */
    @Property(false)
    public enableShapeLabel: boolean;

    /**
     * Enable or disables the customization of measure values in PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableImportAnnotationMeasurement: boolean;

    /**
     * Enable or disables the Pinch zoom of PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enablePinchZoom: boolean;

    /**
     * Enable or disables the text selection in the PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableTextSelection: boolean;

    /**
     * Enable or disables the text search in the PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableTextSearch: boolean;

    /**
     * Enable or disable the annotation in the Pdfviewer.
     *
     * @default true
     */
    @Property(true)
    public enableAnnotation: boolean;

    /**
     * Enable or disable the form fields in the Pdfviewer.
     *
     * @default true
     */
    @Property(true)
    public enableFormFields: boolean;

    /**
     * Get or set a boolean value to enable or disable the form designer. TRUE by default.
     *
     * @default true
     */
    @Property(true)
    public enableFormDesigner: boolean;

    /**
     * Enable or disable the interaction of form fields in the Pdfviewer.
     *
     * @default false
     */
    @Property(false)
    public designerMode: boolean;

    /**
     * Enable or disable the form fields validation.
     *
     * @default false
     */
    @Property(false)
    public enableFormFieldsValidation: boolean;

    /**
     * Enable if the PDF document contains form fields.
     *
     * @default false
     */
    @Property(false)
    public isFormFieldDocument: boolean;

    /**
     * Gets or sets a boolean value to show or hide desktop toolbar in mobile devices. FALSE by default.
     *
     * @default false
     */
    @Property(false)
    public enableDesktopMode: boolean;

    /**
     * Gets or sets a boolean value to show or hide the save signature check box option in the signature dialog.
     * FALSE by default
     *
     * @default false
     * @deprecated
     */
    @Property(false)
    public hideSaveSignature: boolean;

    /**
     * Enable or disable the free text annotation in the Pdfviewer.
     *
     * @default true
     */
    @Property(true)
    public enableFreeText: boolean;

    /**
     * Enable or disables the text markup annotation in the PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableTextMarkupAnnotation: boolean;

    /**
     * Enable or disables the shape annotation in the PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableShapeAnnotation: boolean;

    /**
     * Enable or disables the calibrate annotation in the PdfViewer.
     *
     * @default true
     */
    @Property(true)
    public enableMeasureAnnotation: boolean;

    /**
     * Enables and disables the stamp annotations when the PDF viewer control is loaded initially.
     *
     * @default true
     */
    @Property(true)
    public enableStampAnnotations: boolean;

    /**
     * Enables and disables the stickyNotes annotations when the PDF viewer control is loaded initially.
     *
     * @default true
     */
    @Property(true)
    public enableStickyNotesAnnotation: boolean;

    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * @default true
     */
    @Property(true)
    public enableAnnotationToolbar: boolean;

    /**
     * Opens the form designer toolbar when the PDF document is loaded in the PDF Viewer control initially.
     *
     * @default true
     */
    @Property(true)
    public enableFormDesignerToolbar: boolean;

    /**
     * Gets or sets a boolean value to show or hide the bookmark panel while loading a document. FALSE by default.
     *
     * @default false
     */
    @Property(false)
    public isBookmarkPanelOpen: boolean;

    /**
     * Gets or sets a boolean value if initial field selected in form designer toolbar.
     *
     * @private
     * @default false
     */
    @Property(false)
    public isInitialFieldToolbarSelection: boolean;

    /**
     * Sets the interaction mode of the PdfViewer
     *
     * @default TextSelection
     */
    @Property('TextSelection')
    public interactionMode: InteractionMode;

    /**
     * Specifies the rendering mode in the PDF Viewer.
     *
     * @default Default
     */
    @Property('Default')
    public zoomMode: ZoomMode;

    /**
     * Specifies the signature mode in the PDF Viewer.
     *
     * @default Default
     */
    @Property('Default')
    public signatureFitMode: SignatureFitMode;

    /**
     * Specifies the print mode in the PDF Viewer.
     *
     * @default Default
     */
    @Property('Default')
    public printMode: PrintMode;

    /**
     * Sets the initial loading zoom value from 10 to 400 in PdfViewer Control.
     *
     * @default 0
     */
    @Property(0)
    public zoomValue: number;

    /**
     *  Enable or disable the zoom optimization mode in PDF Viewer.
     *
     * @default true
     */
    @Property(true)
    public enableZoomOptimization: boolean;

    /**
     * Enable or disables the get the document text collections.
     *
     * @default false
     */
    @Property(false)
    public isExtractText: boolean;

    /**
     * Maintain the selection of text markup annotation.
     *
     * @default false
     */
    @Property(false)
    public isMaintainSelection: boolean;

    /**
     * Customize desired date and time format
     */
    @Property('M/d/yyyy h:mm:ss a')
    public dateTimeFormat: string;

    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    // eslint-disable-next-line max-len
    @Property({ showTooltip: true, toolbarItems: ['OpenOption', 'UndoRedoTool', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'CommentTool', 'SubmitForm', 'AnnotationEditTool', 'FormDesignerEditTool', 'FreeTextAnnotationOption', 'InkAnnotationOption', 'ShapeAnnotationOption', 'StampAnnotation', 'SignatureOption', 'SearchOption', 'PrintOption', 'DownloadOption'], annotationToolbarItems: ['HighlightTool', 'UnderlineTool', 'StrikethroughTool', 'ColorEditTool', 'OpacityEditTool', 'AnnotationDeleteTool', 'StampAnnotationTool', 'HandWrittenSignatureTool', 'InkAnnotationTool', 'ShapeTool', 'CalibrateTool', 'StrokeColorEditTool', 'ThicknessEditTool', 'FreeTextAnnotationTool', 'FontFamilyAnnotationTool', 'FontSizeAnnotationTool', 'FontStylesAnnotationTool', 'FontAlignAnnotationTool', 'FontColorAnnotationTool', 'CommentPanelTool'], formDesignerToolbarItems: ['TextboxTool', 'PasswordTool', 'CheckBoxTool', 'RadioButtonTool', 'DropdownTool', 'ListboxTool', 'DrawSignatureTool', 'DeleteTool'] })
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Defines the ajax Request settings of the PdfViewer.
     */
    // eslint-disable-next-line max-len
    @Property({ ajaxHeaders: [], withCredentials: false })
    public ajaxRequestSettings: AjaxRequestSettingsModel;

    /**
     * Defines the stamp items of the PdfViewer.
     */
    // eslint-disable-next-line max-len

    @Property({ customStampName: '', customStampImageSource: '' })
    public customStamp: CustomStampModel[];

    /**
     * Defines the settings of the PdfViewer service.
     */
    // eslint-disable-next-line max-len
    @Property({ load: 'Load', renderPages: 'RenderPdfPages', unload: 'Unload', download: 'Download', renderThumbnail: 'RenderThumbnailImages', print: 'PrintImages', renderComments: 'RenderAnnotationComments', importAnnotations: 'ImportAnnotations', exportAnnotations: 'ExportAnnotations', importFormFields: 'ImportFormFields', exportFormFields: 'ExportFormFields', renderTexts: 'RenderPdfTexts' })
    public serverActionSettings: ServerActionSettingsModel;

    /**
     * Get or set the signature field settings.
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', signatureIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' }, signatureDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false } })
    public signatureFieldSettings: SignatureFieldSettingsModel;

    /**
     * Get or set the initial field settings.
     */
    // eslint-disable-next-line max-len
    @Property({ name: '', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', initialIndicatorSettings: { opacity: 1, backgroundColor: 'orange', width: 19, height: 10, fontSize: 10, text: null, color: 'black' }, initialDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false } })
    public initialFieldSettings: InitialFieldSettingsModel;

    /**
     * Defines the settings of highlight annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#FFDF56', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public highlightSettings: HighlightSettingsModel;

    /**
     * Defines the settings of strikethrough annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#ff0000', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public strikethroughSettings: StrikethroughSettingsModel;

    /**
     * Defines the settings of underline annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, color: '#00ff00', author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges }, isLock: false, enableMultiPageAnnotation: false, enableTextMarkupResizer: false, allowedInteractions: ['None'], isPrint: true })
    public underlineSettings: UnderlineSettingsModel;

    /**
     * Defines the settings of line annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'None', lineHeadEndStyle: 'None', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public lineSettings: LineSettingsModel;

    /**
     * Defines the settings of arrow annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public arrowSettings: ArrowSettingsModel;

    /**
     * Defines the settings of rectangle annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public rectangleSettings: RectangleSettingsModel;

    /**
     * Defines the settings of shape label.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ff0000', fontColor: '#000', fontSize: 16, labelHeight: 24.6, labelMaxWidth: 151, labelContent: 'Label' })
    public shapeLabelSettings: ShapeLabelSettingsModel;

    /**
     * Defines the settings of circle annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public circleSettings: CircleSettingsModel;

    /**
     * Defines the settings of polygon annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public polygonSettings: PolygonSettingsModel;

    /**
     * Defines the settings of stamp annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, author: 'Guest', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, dynamicStamps: [DynamicStampItem.Revised, DynamicStampItem.Reviewed, DynamicStampItem.Received, DynamicStampItem.Confidential, DynamicStampItem.Approved, DynamicStampItem.NotApproved], signStamps: [SignStampItem.Witness, SignStampItem.InitialHere, SignStampItem.SignHere, SignStampItem.Accepted, SignStampItem.Rejected], standardBusinessStamps: [StandardBusinessStampItem.Approved, StandardBusinessStampItem.NotApproved, StandardBusinessStampItem.Draft, StandardBusinessStampItem.Final, StandardBusinessStampItem.Completed, StandardBusinessStampItem.Confidential, StandardBusinessStampItem.ForPublicRelease, StandardBusinessStampItem.NotForPublicRelease, StandardBusinessStampItem.ForComment, StandardBusinessStampItem.Void, StandardBusinessStampItem.PreliminaryResults, StandardBusinessStampItem.InformationOnly], allowedInteractions: ['None'], isPrint: true })
    public stampSettings: StampSettingsModel;

    /**
     * Defines the settings of customStamp annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, author: 'Guest', width: 0, height: 0, left: 0, top: 0, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, enableCustomStamp: true, allowedInteractions: ['None'], isPrint: true })
    public customStampSettings: CustomStampSettingsModel;

    /**
     * Defines the settings of distance annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Closed', lineHeadEndStyle: 'Closed', annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, leaderLength: 40, resizeCursorType: CursorType.move, allowedInteractions: ['None'], isPrint: true })
    public distanceSettings: DistanceSettingsModel;

    /**
     * Defines the settings of perimeter annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, borderDashArray: 0, lineHeadStartStyle: 'Open', lineHeadEndStyle: 'Open', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public perimeterSettings: PerimeterSettingsModel;

    /**
     * Defines the settings of area annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public areaSettings: AreaSettingsModel;

    /**
     * Defines the settings of radius annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public radiusSettings: RadiusSettingsModel;

    /**
     * Defines the settings of volume annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', strokeColor: '#ff0000', author: 'Guest', thickness: 1, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], isPrint: true })
    public volumeSettings: VolumeSettingsModel;

    /**
     * Defines the settings of stickyNotes annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', opacity: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public stickyNotesSettings: StickyNotesSettingsModel;
    /**
     * Defines the settings of free text annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ opacity: 1, fillColor: '#ffffff00', borderColor: '#ffffff00', author: 'Guest', borderWidth: 1, width: 151, fontSize: 16, height: 24.6, fontColor: '#000', fontFamily: 'Helvetica', defaultText: 'Type Here', textAlignment: 'Left', fontStyle: FontStyle.None, allowTextOnly: false, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, allowedInteractions: ['None'], isPrint: true, isReadonly: false, enableAutoFit: false })
    public freeTextSettings: FreeTextSettingsModel;

    /**
     * Defines the settings of measurement annotation.
     */
    @Property({ conversionUnit: 'in', displayUnit: 'in', scaleRatio: 1, depth: 96 })
    public measurementSettings: MeasurementSettingsModel;

    /**
     * Defines the settings of annotation selector.
     */
    // eslint-disable-next-line max-len
    @Property({ selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null })
    public annotationSelectorSettings: AnnotationSelectorSettingsModel;

    /**
     * Sets the settings for the color of the text search highlight.
     */
    @Property({ searchHighlightColor: '#fdd835', searchColor: '#8b4c12' })
    public textSearchColorSettings: TextSearchColorSettingsModel;

    /**
     * Get or set the signature dialog settings for signature field.
     */
     @Property({ displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false })
    public signatureDialogSettings: SignatureDialogSettingsModel;

    /**
     * Get or set the signature dialog settings for initial field.
     */
    @Property({ displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false })
    public initialDialogSettings: SignatureDialogSettingsModel;

    /**
     * Defines the settings of handWrittenSignature.
     */
    // eslint-disable-next-line max-len
    @Property({ signatureItem: ['Signature', 'Initial'], saveSignatureLimit: 1, saveInitialLimit: 1, opacity: 1, strokeColor: '#000000', width: 150, height: 100, thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, allowedInteractions: ['None'], signatureDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false }, initialDialogSettings: { displayMode: DisplayMode.Draw | DisplayMode.Text | DisplayMode.Upload, hideSaveSignature: false} })
    public handWrittenSignatureSettings: HandWrittenSignatureSettingsModel;

    /**
     * Defines the ink annotation settings for PDF Viewer.It used to customize the strokeColor, thickness, opacity of the ink annotation.
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', opacity: 1, strokeColor: '#ff0000', thickness: 1, annotationSelectorSettings: { selectionBorderColor: '', resizerBorderColor: 'black', resizerFillColor: '#FF4081', resizerSize: 8, selectionBorderThickness: 1, resizerShape: 'Square', selectorLineDashArray: [], resizerLocation: AnnotationResizerLocation.Corners | AnnotationResizerLocation.Edges, resizerCursorType: null }, isLock: false, allowedInteractions: ['None'], isPrint: true })
    public inkAnnotationSettings: InkAnnotationSettingsModel;

    /**
     * Defines the settings of the annotations.
     */
    // eslint-disable-next-line max-len
    @Property({ author: 'Guest', minHeight: 0, minWidth: 0, maxWidth: 0, maxHeight: 0, isLock: false, skipPrint: false, skipDownload: false, allowedInteractions: ['None'] })
    public annotationSettings: AnnotationSettingsModel;

    /**
     * Defines the tile rendering settings.
     */
    @Property({ enableTileRendering: true, x: 0, y: 0 })
    public tileRenderingSettings: TileRenderingSettingsModel;

    /**
     * Defines the scroll settings.
     */
    @Property({ delayPageRequestTimeOnScroll: 100 })
    public scrollSettings: ScrollSettingsModel;

    /**
     * Get or set the text field settings.
     */
    @Property({ name: '', value: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', borderColor: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', maxLength: 0, isRequired: false, isPrint: true, tooltip: '', thickness: 1, isMultiline: false })
    public textFieldSettings: TextFieldSettingsModel;

    /**
     * Get or set the password field settings.
     */
    @Property({ name: '', value: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', borderColor: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', maxLength: 0, isRequired: false, isPrint: true, tooltip: '', thickness: 1 })
    public passwordFieldSettings: PasswordFieldSettingsModel;

    /**
     * Get or set the check box field settings.
     */
    @Property({ name: '', isChecked: false, backgroundColor: 'white', isReadOnly: false, visibility: 'visible', isPrint: true, tooltip: '', isRequired: false, thickness: 1, borderColor: 'black' })
    public checkBoxFieldSettings: CheckBoxFieldSettingsModel;

    /**
     * Get or set the radio button field settings.
     */
    @Property({ name: '', isSelected: false, backgroundColor: 'white', isReadOnly: false, visibility: 'visible', isPrint: true, tooltip: '', isRequired: false, thickness: 1, borderColor: 'black' })
    public radioButtonFieldSettings: RadioButtonFieldSettingsModel;

    /**
     * Get or set the dropdown field settings.
     */
    @Property({ name: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: true, tooltip: '', options: [], thickness: 1, borderColor: 'black' })
    public DropdownFieldSettings: DropdownFieldSettingsModel;

    /**
     * Get or set the listbox field settings.
     */
    @Property({ name: '', fontFamily: 'Helvetica', fontSize: 10, fontStyle: 'None', color: 'black', backgroundColor: 'white', alignment: 'Left', isReadOnly: false, visibility: 'visible', isRequired: false, isPrint: false, tooltip: '', options: [], thickness: 1, borderColor: 'black' })
    public listBoxFieldSettings: ListBoxFieldSettingsModel;

    /**
     * Defines the context menu settings.
     */
    // eslint-disable-next-line max-len
    @Property({ contextMenuAction: 'RightClick', contextMenuItems: [ContextMenuItem.Comment, ContextMenuItem.Copy, ContextMenuItem.Cut, ContextMenuItem.Delete, ContextMenuItem.Highlight, ContextMenuItem.Paste, ContextMenuItem.Properties, ContextMenuItem.ScaleRatio, ContextMenuItem.Strikethrough, ContextMenuItem.Underline] })
    public contextMenuSettings: ContextMenuSettingsModel;

    /**
     * @private
     */
    public viewerBase: PdfViewerBase;
    /**
     * @private
     */
    public drawing: Drawing;
    /**
     * @private
     */
    /**
     * Defines the collection of selected items, size and position of the selector
     *
     * @default {}
     */
    @Complex<SelectorModel>({}, Selector)
    public selectedItems: SelectorModel;
    /**
     * @private
     */
    public adornerSvgLayer: SVGSVGElement;

    /**
     * @private
     */
    public zIndex: number = -1;
    /**
     * @private
     */
    public nameTable: {} = {};
    /**   @private  */
    public clipboardData: ClipBoardObject = {};

    /**
     * @private
     */
    public zIndexTable: ZOrderPageTable[] = [];

    /**
     * @private
     */
    public navigationModule: Navigation;
    /**
     * @private
     */
    public toolbarModule: Toolbar;
    /**
     * @private
     */
    public magnificationModule: Magnification;
    /**
     * @private
     */
    public linkAnnotationModule: LinkAnnotation;
    /** @hidden */
    public localeObj: L10n;
    /**
     * @private
     */
    public thumbnailViewModule: ThumbnailView;
    /**
     * @private
     */
    public bookmarkViewModule: BookmarkView;
    /**
     * @private
     */
    public textSelectionModule: TextSelection;
    /**
     * @private
     */
    public textSearchModule: TextSearch;
    /**
     * @private
     */
    public printModule: Print;
    /**
     * @private
     */
    public annotationModule: Annotation;
    /**
     * @private
     */
    public formFieldsModule: FormFields;
    /**
     * @private
     */
    public formDesignerModule: FormDesigner;
    private isTextSelectionStarted: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public _dotnetInstance: any;
    /**
     * Gets the bookmark view object of the pdf viewer.
     *
     * @asptype BookmarkView
     * @blazorType BookmarkView
     * @returns { BookmarkView }
     */
    public get bookmark(): BookmarkView {
        return this.bookmarkViewModule;
    }

    /**
     * Gets the print object of the pdf viewer.
     *
     * @asptype Print
     * @blazorType Print
     * @returns { Print }
     */
    public get print(): Print {
        return this.printModule;
    }

    /**
     * Gets the magnification object of the pdf viewer.
     *
     * @asptype Magnification
     * @blazorType Magnification
     * @returns { Magnification }
     */
    public get magnification(): Magnification {
        return this.magnificationModule;
    }
    /**
     * Gets the navigation object of the pdf viewer.
     *
     * @asptype Navigation
     * @blazorType Navigation
     * @returns { Navigation }
     */
    public get navigation(): Navigation {
        return this.navigationModule;
    }

    /**
     * Gets the text search object of the pdf viewer.
     *
     * @asptype TextSearch
     * @blazorType TextSearch
     * @returns { TextSearch }
     */
    public get textSearch(): TextSearch {
        return this.textSearchModule;
    }

    /**
     * Gets the toolbar object of the pdf viewer.
     *
     * @asptype Toolbar
     * @blazorType Toolbar
     * @returns { Toolbar }
     */
    public get toolbar(): Toolbar {
        return this.toolbarModule;
    }

    /**
     * Gets the thumbnail-view object of the pdf viewer.
     *
     * @asptype ThumbnailView
     * @blazorType ThumbnailView
     * @returns { ThumbnailView }
     */
    public get thumbnailView(): ThumbnailView {
        return this.thumbnailViewModule;
    }

    /**
     * Gets the annotation object of the pdf viewer.
     *
     * @asptype Annotation
     * @blazorType Annotation
     * @returns { Annotation }
     */
    public get annotation(): Annotation {
        return this.annotationModule;
    }
    /**
     * Gets the FormDesigner object of the pdf viewer.
     *
     * @asptype FormDesigner
     * @blazorType FormDesigner
     * @returns { FormDesigner }
     */
    public get formDesigner(): FormDesigner {
        return this.formDesignerModule;
    }

    /**
     * Gets the TextSelection object of the pdf viewer.
     *
     * @asptype TextSelection
     * @blazorType TextSelection
     * @returns { TextSelection }
     */
    public get textSelection(): TextSelection {
        return this.textSelectionModule;
    }

    /**
     * Triggers while created the PdfViewer component.
     *
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<void>;

    /**
     * Triggers while loading document into PdfViewer.
     *
     * @event
     * @blazorProperty 'DocumentLoaded'
     */
    @Event()
    public documentLoad: EmitType<LoadEventArgs>;

    /**
     * Triggers while close the document
     *
     * @event
     * @blazorProperty 'DocumentUnloaded'
     */
    @Event()
    public documentUnload: EmitType<UnloadEventArgs>;

    /**
     * Triggers while loading document got failed in PdfViewer.
     *
     * @event
     * @blazorProperty 'DocumentLoadFailed'
     */
    @Event()
    public documentLoadFailed: EmitType<LoadFailedEventArgs>;

    /**
     * Triggers when the AJAX request is failed.
     *
     * @event
     * @blazorProperty 'AjaxRequestFailed'
     */
    @Event()
    public ajaxRequestFailed: EmitType<AjaxRequestFailureEventArgs>;

    /**
     * Event triggers on successful AJAX request 
     * 
     * @event
     */
     @Event()
     public ajaxRequestSuccess: EmitType<AjaxRequestSuccessEventArgs>;
     
    /**
     * Triggers when validation is failed.
     *
     * @event
     * @blazorProperty 'validateFormFields'
     */
    @Event()
    public validateFormFields: EmitType<ValidateFormFieldsArgs>;

    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'OnPageClick'
     */
    @Event()
    public pageClick: EmitType<PageClickEventArgs>;

    /**
     * Triggers when there is change in current page number.
     *
     * @event
     * @blazorProperty 'PageChanged'
     */
    @Event()
    public pageChange: EmitType<PageChangeEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is clicked
     *
     * @event
     * @blazorProperty 'OnHyperlinkClick'
     */
    @Event()
    public hyperlinkClick: EmitType<HyperlinkClickEventArgs>;

    /**
     * Triggers when hyperlink in the PDF Document is hovered
     *
     * @event
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    @Event()
    public hyperlinkMouseOver: EmitType<HyperlinkMouseOverArgs>;

    /**
     * Triggers when there is change in the magnification value.
     *
     * @event
     * @blazorProperty 'ZoomChanged'
     */
    @Event()
    public zoomChange: EmitType<ZoomChangeEventArgs>;

    /**
     * Triggers when an annotation is added over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationAdded'
     */
    @Event()
    public annotationAdd: EmitType<AnnotationAddEventArgs>;

    /**
     * Triggers when an annotation is removed from the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationRemoved'
     */
    @Event()
    public annotationRemove: EmitType<AnnotationRemoveEventArgs>;

    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    @Event()
    public annotationPropertiesChange: EmitType<AnnotationPropertiesChangeEventArgs>;

    /**
     * Triggers when an annotation is resized over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationResized'
     */
    @Event()
    public annotationResize: EmitType<AnnotationResizeEventArgs>;

    /**
     * Triggers when signature is added  over the page of the PDF document.
     *
     * @event
     */
    @Event()
    public addSignature: EmitType<AddSignatureEventArgs>;

    /**
     * Triggers when signature is removed over the page of the PDF document.
     *
     * @event
     */
    @Event()
    public removeSignature: EmitType<RemoveSignatureEventArgs>;

    /**
     * Triggers when an signature is moved over the page of the PDF document.
     *
     * @event
     */
    @Event()
    public moveSignature: EmitType<MoveSignatureEventArgs>;

    /**
     * Triggers when the property of the signature is changed in the page of the PDF document.
     *
     * @event
     */
    @Event()
    public signaturePropertiesChange: EmitType<SignaturePropertiesChangeEventArgs>;

    /**
     * Triggers when signature is resized over the page of the PDF document.
     *
     * @event
     */
    @Event()
    public resizeSignature: EmitType<ResizeSignatureEventArgs>;

    /**
     * Triggers when signature is selected over the page of the PDF document.
     *
     * @event
     */
    @Event()
    public signatureSelect: EmitType<SignatureSelectEventArgs>;

    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationSelected'
     */
    @Event()
    public annotationSelect: EmitType<AnnotationSelectEventArgs>;

    /**
     * Triggers when an annotation is unselected over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationUnSelect'
     */
    @Event()
    public annotationUnSelect: EmitType<AnnotationUnSelectEventArgs>;

    /**
     * Triggers an event when the annotation is double click.
     *
     * @event
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    @Event()
    public annotationDoubleClick: EmitType<AnnotationDoubleClickEventArgs>;

    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     *
     * @event
     * @blazorProperty 'AnnotationMoved'
     */
    @Event()
    public annotationMove: EmitType<AnnotationMoveEventArgs>;

    /**
     * Triggers while moving an annotation.
     *
     * @event
     * @blazorProperty 'AnnotationMoving'
     */
     @Event()
     public annotationMoving: EmitType<AnnotationMovingEventArgs>;
 
    /**
     * Triggers when mouse over the annotation object.
     *
     * @event
     */
    @Event()
    public annotationMouseover: EmitType<AnnotationMouseoverEventArgs>;

    /**
     * Triggers when mouse over the annotation object.
     *
     * @event
     */
    @Event()
    public annotationMouseLeave: EmitType<AnnotationMouseLeaveEventArgs>;

    /**
     * Triggers when mouse over the page.
     *
     * @event
     */
    @Event()
    public pageMouseover: EmitType<PageMouseoverEventArgs>;

    /**
     * Triggers when an imported annotations started in the PDF document.
     *
     * @event
     * @blazorProperty 'ImportStarted'
     */
    @Event()
    public importStart: EmitType<ImportStartEventArgs>;

    /**
     * Triggers when an exported annotations started in the PDF Viewer.
     *
     * @event
     * @blazorProperty 'ExportStarted'
     */
    @Event()
    public exportStart: EmitType<ExportStartEventArgs>;

    /**
     * Triggers when an imports annotations succeed in the PDF document.
     *
     * @event
     * @blazorProperty 'ImportSucceed'
     */
    @Event()
    public importSuccess: EmitType<ImportSuccessEventArgs>;

    /**
     * Triggers when an export annotations succeed in the PDF Viewer.
     *
     * @event
     * @blazorProperty 'ExportSucceed'
     */
    @Event()
    public exportSuccess: EmitType<ExportSuccessEventArgs>;

    /**
     * Triggers when an imports annotations failed in the PDF document.
     *
     * @event
     * @blazorProperty 'ImportFailed'
     */
    @Event()
    public importFailed: EmitType<ImportFailureEventArgs>;

    /**
     * Triggers when an export annotations failed in the PDF Viewer.
     *
     * @event
     * @blazorProperty 'ExportFailed'
     */
    @Event()
    public exportFailed: EmitType<ExportFailureEventArgs>;

    /**
     * Triggers when an text extraction is completed in the PDF Viewer.
     *
     * @event
     * @blazorProperty 'ExtractTextCompleted'
     */
    @Event()
    public extractTextCompleted: EmitType<ExtractTextCompletedEventArgs>;

    /**
     * Triggers an event when the thumbnail is clicked in the thumbnail panel of PDF Viewer.
     *
     * @event
     * @blazorProperty 'OnThumbnailClick'
     */
    @Event()
    public thumbnailClick: EmitType<ThumbnailClickEventArgs>;

    /**
     * Triggers an event when the bookmark is clicked in the bookmark panel of PDF Viewer.
     *
     * @event
     * @blazorProperty 'BookmarkClick'
     */
    @Event()
    public bookmarkClick: EmitType<BookmarkClickEventArgs>;

    /**
     * Triggers an event when the text selection is started.
     *
     * @event
     * @blazorProperty 'OnTextSelectionStart'
     */
    @Event()
    public textSelectionStart: EmitType<TextSelectionStartEventArgs>;

    /**
     * Triggers an event when the text selection is finished.
     *
     * @event
     * @blazorProperty 'OnTextSelectionEnd'
     */
    @Event()
    public textSelectionEnd: EmitType<TextSelectionEndEventArgs>;

    /**
     * Triggers an event when the download action is started.
     *
     * @event
     * @blazorProperty 'DownloadStart'
     */
    @Event()
    public downloadStart: EmitType<DownloadStartEventArgs>;

    /**
     * Triggers an event when the button is clicked.
     *
     * @deprecated This property renamed into "formFieldClick"
     * @event
     * @blazorProperty 'ButtonFieldClick'
     */
    @Event()
    public buttonFieldClick: EmitType<ButtonFieldClickEventArgs>;

    /**
     * Triggers an event when the form field is clicked.
     *
     * @event
     * @blazorProperty 'FormFieldClick'
     */
    @Event()
    public formFieldClick: EmitType<FormFieldClickArgs>;

    /**
     * Triggers an event when the download actions is finished.
     *
     * @event
     * @blazorProperty 'DownloadEnd'
     */
    @Event()
    public downloadEnd: EmitType<DownloadEndEventArgs>;

    /**
     * Triggers an event when the print action is started.
     *
     * @event
     * @blazorProperty 'PrintStart'
     */
    @Event()
    public printStart: EmitType<PrintStartEventArgs>;

    /**
     * Triggers an event when the print actions is finished.
     *
     * @event
     * @blazorProperty 'PrintEnd'
     */
    @Event()
    public printEnd: EmitType<PrintEndEventArgs>;

    /**
     * Triggers an event when the text search is started.
     *
     * @event
     * @blazorProperty 'OnTextSearchStart'
     */
    @Event()
    public textSearchStart: EmitType<TextSearchStartEventArgs>;

    /**
     * Triggers an event when the text search is completed.
     *
     * @event
     * @blazorProperty 'OnTextSearchComplete'
     */
    @Event()
    public textSearchComplete: EmitType<TextSearchCompleteEventArgs>;

    /**
     * Triggers an event when the text search text is highlighted.
     *
     * @event
     * @blazorProperty 'OnTextSearchHighlight'
     */
    @Event()
    public textSearchHighlight: EmitType<TextSearchHighlightEventArgs>;

    /**
     * Triggers before the data send in to the server.
     *
     * @event
     */
    @Event()
    public ajaxRequestInitiate: EmitType<AjaxRequestInitiateEventArgs>;

    /**
     * Triggers when the comment is added for the annotation in the comment panel.
     *
     * @event
     * @blazorProperty 'commentAdd'
     */
    @Event()
    public commentAdd: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment is edited for the annotation in the comment panel.
     *
     * @event
     * @blazorProperty 'commentEdit'
     */
    @Event()
    public commentEdit: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment is deleted for the annotation in the comment panel.
     *
     * @event
     * @blazorProperty 'commentDelete'
     */
    @Event()
    public commentDelete: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment is selected for the annotation in the comment panel.
     *
     * @event
     * @blazorProperty 'commentSelect
     */
    @Event()
    public commentSelect: EmitType<CommentEventArgs>;

    /**
     * Triggers when the comment for status is changed for the annotation in the comment panel.
     *
     * @event
     * @blazorProperty 'commentStatusChanged'
     */
    @Event()
    public commentStatusChanged: EmitType<CommentEventArgs>;

    /**
     * Triggers the event before adding a text in the freeText annotation.
     *
     * @event
     * @blazorProperty 'beforeAddFreeText'
     */
    @Event()
    public beforeAddFreeText: EmitType<BeforeAddFreeTextEventArgs>;

    /**
     * Triggers when focus out from the form fields.
     *
     * @event
     * @blazorProperty 'formFieldFocusOut'
     */
    @Event()
    public formFieldFocusOut: EmitType<FormFieldFocusOutEventArgs>;

    /**
     * The event is triggered when a form field is added.
     *
     * @event
     * @blazorProperty 'formFieldAdd'
     */
    @Event()
    public formFieldAdd: EmitType<FormFieldAddArgs>;

    /**
     * The event is triggered when a form field is removed.
     *
     * @event
     * @blazorProperty 'formFieldRemove'
     */
     @Event()
     public formFieldRemove: EmitType<FormFieldRemoveArgs>;

    /**
     * The event is triggered when a property of form field is changed.
     *
     * @event
     * @blazorProperty 'formFieldPropertiesChange'
     */
    @Event()
    public formFieldPropertiesChange: EmitType<FormFieldPropertiesChangeArgs>;

    /**
     * The event is triggered when a mouse cursor leaves form field.
     *
     * @event
     * @blazorProperty 'formFieldMouseLeave'
     */
    @Event()
    public formFieldMouseLeave: EmitType<FormFieldMouseLeaveArgs>;

    /**
     * The event is triggered when a mouse cursor is over a form field.
     *
     * @event
     * @blazorProperty 'formFieldMouseover'
     */
     @Event()
     public formFieldMouseover: EmitType<FormFieldMouseoverArgs>;

    /**
     * The event is triggered when a form field is moved.
     *
     * @event
     * @blazorProperty 'formFieldMove'
     */
     @Event()
     public formFieldMove: EmitType<FormFieldMoveArgs>;

    /**
     * The event is triggered when a form field is resized.
     *
     * @event
     * @blazorProperty 'formFieldResize'
     */
     @Event()
     public formFieldResize: EmitType<FormFieldResizeArgs>;

    /**
     * The event is triggered when a form field is selected.
     *
     * @event
     * @blazorProperty 'formFieldSelect'
     */
     @Event()
     public formFieldSelect: EmitType<FormFieldSelectArgs>;

    /**
     * The event is triggered when a form field is unselected.
     *
     * @event
     * @blazorProperty 'formFieldUnselect'
     */
    @Event()
    public formFieldUnselect: EmitType<FormFieldUnselectArgs>;

    /**
     * Triggers an event when the form field is double-clicked.
     *
     * @event
     * @blazorProperty 'formFieldDoubleClick'
     */
    @Event()
    public formFieldDoubleClick: EmitType<FormFieldDoubleClickArgs>;

    /**
     * PDF document annotation collection.
     *
     * @private
     * @deprecated
     */
    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * PDF document form fields collection.
     * 
     * @private
     * @deprecated
     */
    @Collection<PdfFormFieldBaseModel>([], PdfFormFieldBase)
    public formFields: PdfFormFieldBaseModel[];

    /**
     * @private
     * @deprecated
     */
    public tool: string;

    /**
     * store the drawing objects.
     *
     * @private
     * @deprecated
     */
    @Property()
    public drawingObject: PdfAnnotationBaseModel;


    constructor(options?: PdfViewerModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        this.viewerBase = new PdfViewerBase(this);
        this.drawing = new Drawing(this);
    }

    protected preRender(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }

    protected render(): void {
        this.viewerBase.initializeComponent();
        if (this.enableTextSelection && this.textSelectionModule) {
            this.textSelectionModule.enableTextSelectionMode();
        } else {
            this.viewerBase.disableTextSelectionMode();
        }
        this.drawing.renderLabels(this);
        this.renderComplete();
    }

    public getModuleName(): string {
        return 'PdfViewer';
    }

    /**
     * @private
     */
    public getLocaleConstants(): Object {
        return this.defaultLocale;
    }

    /**
     * To modify the Json Data in ajax request.
     *
     * @param jsonData
     * @returns void
     */
    // eslint-disable-next-line
    public setJsonData(jsonData: any): void {
        this.viewerBase.ajaxData = jsonData;
    }

    public onPropertyChanged(newProp: PdfViewerModel, oldProp: PdfViewerModel): void {
        let requireRefresh: boolean = false;
        if (this.isDestroyed) {
            return;
        }
        const properties: string[] = Object.keys(newProp);
        for (const prop of properties) {
            switch (prop) {
            case 'locale':
                if (this.viewerBase.loadedData) {
                    // eslint-disable-next-line
                    let data: any = null;
                    if (this.formFieldsModule) {
                        data = this.viewerBase.getItemFromSessionStorage('_formfields');
                    }
                    if (data) {
                        this.viewerBase.formfieldvalue = JSON.parse(data);
                        // eslint-disable-next-line
                        let annotCollection: any[] = this.annotationCollection;
                        const filename: string = this.viewerBase.jsonDocumentId;
                        super.refresh();
                        this.load(this.viewerBase.loadedData, null);
                        this.addAnnotation(annotCollection);
                        this.viewerBase.loadedData = null;
                        this.downloadFileName = filename;
                        this.fileName = filename;
                    }
                }
                break;
            case 'enableToolbar':
                this.notify('', { module: 'toolbar', enable: this.enableToolbar });
                requireRefresh = true;
                break;
            case 'enableCommentPanel':
                this.notify('', { module: 'annotation', enable: this.enableCommentPanel });
                requireRefresh = true;
                if (this.toolbarModule && this.toolbarModule.annotationToolbarModule) {
                    this.toolbarModule.annotationToolbarModule.enableCommentPanelTool(this.enableCommentPanel);
                }
                if (!this.enableCommentPanel) {
                    if (this.viewerBase.navigationPane) {
                        this.viewerBase.navigationPane.closeCommentPanelContainer();
                    }
                }
                break;
            case 'documentPath':
                if (!isBlazor()) {
                    this.load(newProp.documentPath, null);
                }
                else {
                    this._dotnetInstance.invokeMethodAsync('LoadDocumentFromClient', newProp.documentPath);
                }
                break;
            case 'interactionMode':
                this.interactionMode = newProp.interactionMode;
                if (newProp.interactionMode === 'Pan') {
                    this.viewerBase.initiatePanning();
                    if (this.toolbar) {
                        this.toolbar.updateInteractionTools(false);
                    }
                } else if (newProp.interactionMode === 'TextSelection') {
                    this.viewerBase.initiateTextSelectMode();
                    if (this.toolbar) {
                        this.toolbar.updateInteractionTools(true);
                    }
                }
                break;
            case 'height':
                this.height = newProp.height;
                this.viewerBase.updateHeight();
                this.viewerBase.onWindowResize();
                if (this.toolbar && this.toolbar.annotationToolbarModule) {
                    if (this.toolbar.annotationToolbarModule.isToolbarHidden) {
                        this.toolbar.annotationToolbarModule.adjustViewer(false);
                    } else {
                        this.toolbar.annotationToolbarModule.adjustViewer(true);
                    }
                }
                break;
            case 'width':
                this.width = newProp.width;
                this.viewerBase.updateWidth();
                this.viewerBase.onWindowResize();
                break;
            case 'customStamp':
                this.renderCustomerStamp(this.customStamp[0]);
                break;
            case 'customStampSettings':
                if (newProp.customStampSettings.customStamps) {
                    this.renderCustomerStamp(this.customStampSettings.customStamps[0]);
                }
                break;
            case 'enableFormFields':
                if (this.enableFormFields && this.formFieldsModule) {
                    for (let m: number = 0; m < this.pageCount; m++) {
                        this.formFieldsModule.renderFormFields(m);
                    }
                } else {
                    this.formFieldsModule = new FormFields(this, this.viewerBase);
                    this.formFieldsModule.formFieldsReadOnly(this.enableFormFields);
                }
                break;
            case 'designerMode':
                if(this.designerMode) {
                    this.formDesignerModule.setMode('designer');
                } else {
                    this.formDesignerModule.setMode('edit');
                }
                break;
            case 'highlightSettings':
            case 'underlineSettings':
            case 'strikethroughSettings':
                if (this.annotationModule && this.annotationModule.textMarkupAnnotationModule) {
                    this.annotationModule.textMarkupAnnotationModule.updateTextMarkupSettings(prop);
                }
                break;
            }
        }
    }

    // eslint-disable-next-line
    private renderCustomerStamp(customStamp: any) {
        this.annotation.stampAnnotationModule.isStampAddMode = true;
        this.annotationModule.stampAnnotationModule.isStampAnnotSelected = true;
        this.viewerBase.stampAdded = true;
        this.viewerBase.isAlreadyAdded = false;
        // eslint-disable-next-line max-len
        this.annotation.stampAnnotationModule.createCustomStampAnnotation(customStamp.customStampImageSource, customStamp.customStampName);
    }

    public getPersistData(): string {
        return 'PdfViewer';
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableMagnification) {
            modules.push({
                member: 'Magnification', args: [this, this.viewerBase]
            });
        }
        if (this.enableNavigation) {
            modules.push({
                member: 'Navigation', args: [this, this.viewerBase]
            });
        }
        if (this.enableToolbar || this.enableNavigationToolbar || this.enableAnnotationToolbar || this.enableFormDesignerToolbar) {
            modules.push({
                member: 'Toolbar', args: [this, this.viewerBase]
            });
        }
        if (this.enableHyperlink) {
            modules.push({
                member: 'LinkAnnotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableThumbnail) {
            modules.push({
                member: 'ThumbnailView', args: [this, this.viewerBase]
            });
        }
        if (this.enableBookmark) {
            modules.push({
                member: 'BookmarkView', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSelection) {
            modules.push({
                member: 'TextSelection', args: [this, this.viewerBase]
            });
        }
        if (this.enableTextSearch) {
            modules.push({
                member: 'TextSearch', args: [this, this.viewerBase]
            });
        }
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: [this, this.viewerBase]
            });
        }
        if (this.enableAnnotation) {
            modules.push({
                member: 'Annotation', args: [this, this.viewerBase]
            });
        }
        if (this.enableFormFields) {
            modules.push({
                member: 'FormFields', args: [this, this.viewerBase]
            });
        }
        if (this.enableFormDesigner && !isBlazor()) {
            modules.push({
                member: 'FormDesigner', args: [this, this.viewerBase]
            });
        }
        return modules;
    }
    /** @hidden */
    public defaultLocale: Object = {
        'PdfViewer': 'PDF Viewer',
        'Cancel': 'Cancel',
        'Download file': 'Download file',
        'Download': 'Download',
        'Enter Password': 'This document is password protected. Please enter a password.',
        'File Corrupted': 'File Corrupted',
        'File Corrupted Content': 'The file is corrupted and cannot be opened.',
        'Fit Page': 'Fit Page',
        'Fit Width': 'Fit Width',
        'Automatic': 'Automatic',
        'Go To First Page': 'Show first page',
        'Invalid Password': 'Incorrect Password. Please try again.',
        'Next Page': 'Show next page',
        'OK': 'OK',
        'Open': 'Open file',
        'Page Number': 'Current page number',
        'Previous Page': 'Show previous page',
        'Go To Last Page': 'Show last page',
        'Zoom': 'Zoom',
        'Zoom In': 'Zoom in',
        'Zoom Out': 'Zoom out',
        'Page Thumbnails': 'Page thumbnails',
        'Bookmarks': 'Bookmarks',
        'Print': 'Print file',
        'Password Protected': 'Password Required',
        'Copy': 'Copy',
        'Text Selection': 'Text selection tool',
        'Panning': 'Pan mode',
        'Text Search': 'Find text',
        'Find in document': 'Find in document',
        'Match case': 'Match case',
        'Apply': 'Apply',
        'GoToPage': 'Go to Page',
        // eslint-disable-next-line max-len
        'No matches': 'Viewer has finished searching the document. No more matches were found',
        'No Text Found': 'No Text Found',
        'Undo': 'Undo',
        'Redo': 'Redo',
        'Annotation': 'Add or Edit annotations',
        'FormDesigner': 'Add and Edit Form Fields',
        'Highlight': 'Highlight Text',
        'Underline': 'Underline Text',
        'Strikethrough': 'Strikethrough Text',
        'Delete': 'Delete annotation',
        'Opacity': 'Opacity',
        'Color edit': 'Change Color',
        'Opacity edit': 'Change Opacity',
        'Highlight context': 'Highlight',
        'Underline context': 'Underline',
        'Strikethrough context': 'Strikethrough',
        // eslint-disable-next-line max-len
        'Server error': 'Web-service is not listening. PDF Viewer depends on web-service for all it\'s features. Please start the web service to continue.',
        // eslint-disable-next-line max-len
        'Client error': 'Client-side error is found. Please check the custom headers provided in the AjaxRequestSettings property and web action methods in the ServerActionSettings property.',
        'Open text': 'Open',
        'First text': 'First Page',
        'Previous text': 'Previous Page',
        'Next text': 'Next Page',
        'Last text': 'Last Page',
        'Zoom in text': 'Zoom In',
        'Zoom out text': 'Zoom Out',
        'Selection text': 'Selection',
        'Pan text': 'Pan',
        'Print text': 'Print',
        'Search text': 'Search',
        'Annotation Edit text': 'Edit Annotation',
        'FormDesigner Edit text': 'Add and Edit Form Fields',
        'Line Thickness': 'Line Thickness',
        'Line Properties': 'Line Properties',
        'Start Arrow': 'Start Arrow',
        'End Arrow': 'End Arrow',
        'Line Style': 'Line Style',
        'Fill Color': 'Fill Color',
        'Line Color': 'Line Color',
        'None': 'None',
        'Open Arrow': 'Open',
        'Closed Arrow': 'Closed',
        'Round Arrow': 'Round',
        'Square Arrow': 'Square',
        'Diamond Arrow': 'Diamond',
        'Butt': 'Butt',
        'Cut': 'Cut',
        'Paste': 'Paste',
        'Delete Context': 'Delete',
        'Properties': 'Properties',
        'Add Stamp': 'Add Stamp',
        'Add Shapes': 'Add Shapes',
        'Stroke edit': 'Change Stroke Color',
        'Change thickness': 'Change Border Thickness',
        'Add line': 'Add Line',
        'Add arrow': 'Add Arrow',
        'Add rectangle': 'Add Rectangle',
        'Add circle': 'Add Circle',
        'Add polygon': 'Add Polygon',
        'Add Comments': 'Add Comments',
        'Comments': 'Comments',
        'SubmitForm': 'Submit Form',
        'No Comments Yet': 'No Comments Yet',
        'Accepted': 'Accepted',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled',
        'Rejected': 'Rejected',
        'Leader Length': 'Leader Length',
        'Scale Ratio': 'Scale Ratio',
        'Calibrate': 'Calibrate',
        'Calibrate Distance': 'Calibrate Distance',
        'Calibrate Perimeter': 'Calibrate Perimeter',
        'Calibrate Area': 'Calibrate Area',
        'Calibrate Radius': 'Calibrate Radius',
        'Calibrate Volume': 'Calibrate Volume',
        'Depth': 'Depth',
        'Closed': 'Closed',
        'Round': 'Round',
        'Square': 'Square',
        'Diamond': 'Diamond',
        'Edit': 'Edit',
        'Comment': 'Comment',
        'Comment Panel': 'Comment Panel',
        'Set Status': 'Set Status',
        'Post': 'Post',
        'Page': 'Page',
        'Add a comment': 'Add a comment',
        'Add a reply': 'Add a reply',
        'Import Annotations': 'Import annotations from JSON file',
        'Export Annotations': 'Export annotation to JSON file',
        'Export XFDF': 'Export annotation to XFDF file',
        'Import XFDF': 'Import annotations from XFDF file',
        'Add': 'Add',
        'Clear': 'Clear',
        'Bold': 'Bold',
        'Italic': 'Italic',
        'Strikethroughs': 'Strikethrough',
        'Underlines': 'Underline',
        'Superscript': 'Superscript',
        'Subscript': 'Subscript',
        'Align left': 'Align Left',
        'Align right': 'Align Right',
        'Center': 'Center',
        'Justify': 'Justify',
        'Font color': 'Font Color',
        'Text Align': 'Text Align',
        'Text Properties': 'Font Style',
        'SignatureFieldDialogHeaderText': 'Add Signature',
        'HandwrittenSignatureDialogHeaderText': 'Add Signature',
        'InitialFieldDialogHeaderText': 'Add Initial',
        'HandwrittenInitialDialogHeaderText': 'Add Initial',
        'Draw Ink': 'Draw Ink',
        'Create': 'Create',
        'Font family': 'Font Family',
        'Font size': 'Font Size',
        'Free Text': 'Free Text',
        'Import Failed': 'Invalid JSON file type or file name; please select a valid JSON file',
        'File not found': 'Imported JSON file is not found in the desired location',
        'Export Failed': 'Export annotations action has failed; please ensure annotations are added properly',
        'of': 'of ',
        'Dynamic': 'Dynamic',
        'Standard Business': 'Standard Business',
        'Sign Here': 'Sign Here',
        'Custom Stamp': 'Custom Stamp',
        'Enter Signature as Name': 'Enter your name',
        'Draw-hand Signature': 'DRAW',
        'Type Signature': 'TYPE',
        'Upload Signature': 'UPLOAD',
        'Browse Signature Image': 'BROWSE',
        'Save Signature': 'Save Signature',
        'Save Initial': 'Save Initial',
        'Textbox': 'Textbox',
        'Password': 'Password',
        'Check Box': 'Checkbox',
        'Radio Button': 'Radio Button',
        'Dropdown': 'Drop Down',
        'List Box': 'List Box',
        'Signature': 'Signature',
        'Delete FormField': 'Delete Form Field',
        'Textbox Properties': 'Textbox Properties',
        'Name': 'Name',
        'Tooltip': 'Tooltip',
        'Value': 'Value',
        'Form Field Visibility': 'Form Field Visibility',
        'Read Only': 'Read Only',
        'Required': 'Required',
        'Checked': 'Checked',
        'Show Printing': 'Show Printing',
        'Formatting': 'Format',
        'Fill': 'Fill',
        'Border': 'Border',
        'Border Color': 'Border Color',
        'Thickness': 'Thickness',
        'Max Length': 'Max Length',
        'List Item': 'Item Name',
        'Export Value': 'Item Value',
        'Dropdown Item List': 'Dropdown Item List',
        'List Box Item List': 'List Box Item List',
        'General': 'GENERAL',
        'Appearance': 'APPEARANCE',
        'Options': 'OPTIONS',
        'Delete Item': 'Delete',
        'Up': 'Up',
        'Down': 'Down',
        'Multiline': 'Multiline',
        'Revised': 'Revised',
        'Reviewed': 'Reviewed',
        'Received': 'Received',
        'Confidential': 'Confidential',
        'Approved': 'Approved',
        'Not Approved': 'Not Approved',
        'Witness': 'Witness',
        'Initial Here': 'Initial Here',
        'Draft': 'Draft',
        'Final': 'Final',
        'For Public Release': 'For Public Release',
        'Not For Public Release': 'Not For Public Release',
        'For Comment': 'For Comment',
        'Void': 'Void',
        'Preliminary Results': 'Preliminary Results',
        'Information Only': 'Information Only',
        'in': 'in',
        'm': 'm',
        'ft_in': 'ft_in',
        'ft': 'ft',
        'p': 'p',
        'cm': 'cm',
        'mm': 'mm',
        'pt': 'pt',
        'cu': 'cu',
        'sq': 'sq',
        'Initial': 'Initial'
    };

    /**
     * Loads the given PDF document in the PDF viewer control
     *
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
     * @returns void
     */
    public load(document: string, password: string): void {
        if (this.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.pageCount = 0;
        this.currentPageNumber = 0;
        if (!isBlazor()) {
            if (this.toolbarModule) {
                this.toolbarModule.resetToolbar();
            }
        } else {
            this.viewerBase.blazorUIAdaptor.resetToolbar();
        }
        this.viewerBase.initiatePageRender(document, password);
    }

    /**
     * Loads the given PDF document in the PDF viewer control
     * @private
     */
     public loadDocument(documentId: string, isFileName: boolean, fileName: string): void {
        if (this.pageCount !== 0) {
            this.viewerBase.clear(true);
        } else {
            this.viewerBase.clear(false);
        }
        this.pageCount = 0;
        this.currentPageNumber = 0;
        this.viewerBase.blazorUIAdaptor.resetToolbar();
        this.fileName = fileName;
        this.viewerBase.initiateLoadDocument(documentId, isFileName, fileName);
    }

    /**
     * Loads the PDF document with the document details in the PDF viewer control
    * @private
    */
    public loadSuccess(documentDetails: any, password?: string): void {
        this.viewerBase.loadSuccess(documentDetails, password);
    }

    /**
     * Set the focus of the given element
    * @private
    */
    public focusElement(elementId: string): void {
        let element: HTMLElement = document.getElementById(elementId);
        if (element != null) {
            element.focus();
        }
    }

    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     *
     * @returns void
     */
    public download(): void {
        if (this.enableDownload) {
            this.viewerBase.download();
        }
    }

    /**
     * Saves the PDF document being loaded in the PDF Viewer control as blob.
     *
     * @returns Promise<Blob>
     */
    public saveAsBlob(): Promise<Blob> {
        if (this.enableDownload) {
            return new Promise((resolve: Function, reject: Function) => {
                resolve(this.viewerBase.saveAsBlob());
            });
        } else {
            return null;
        }
    }

    /**
     * updates the PDF Viewer container width and height from externally.
     *
     * @returns void
     */
    public updateViewerContainer(): void {
        this.viewerBase.updateViewerContainer();
    }

    /**
     * Specifies the message to be displayed  in the popup.
     *
     * @param errorString
     * @returns void
     */
    public showNotificationPopup(errorString: string): void {
        this.viewerBase.showNotificationPopup(errorString);
    }

    /**
     * Focus a form field in a document by its field name or the field object.
     *
     * @returns void
     */
    public focusFormField(field: any): void {
        if (typeof(field) === "string") {
            let fieldCollections: any = this.retrieveFormFields();
            for (let i: number = 0; i < fieldCollections.length; i++) {
                if(fieldCollections[i].name === field) {
                    field = fieldCollections[i];
                }
            }
        }
        if (field) {
            this.viewerBase.isFocusField = true;
            this.viewerBase.focusField = field;
            let currentField: any = document.getElementById(field.id);
            if (this.formDesignerModule) {
                this.navigationModule.goToPage(field.pageIndex + 1);
            } else {
                let pageIndex: number = parseFloat(field.id.split('_')[1]);
                this.navigationModule.goToPage(pageIndex + 1);
            }
            if (currentField) {
                if ((field.type === "SignatureField" || field.type === "InitialField") && this.formDesignerModule) {
                    let y: number = field.bounds.y;
                    let height: number = this.viewerBase.getPageHeight(field.pageIndex);
                    this.bookmark.goToBookmark(field.pageIndex, height - y);
                } else {
                    currentField.focus();
                }
                this.viewerBase.isFocusField = false;
                this.viewerBase.focusField = [];
            }
        }
    }

    /**
     * Update the form field values from externally.
     *
     * @param fieldValue
     * @returns void
     */
    // eslint-disable-next-line
    public updateFormFieldsValue(fieldValue: any): void {
        // eslint-disable-next-line
        let target: any = document.getElementById(fieldValue.id);
        let isformDesignerModuleListBox: boolean = false;
        target= target? target: document.getElementById(fieldValue.id+'_content_html_element').children[0].children[0];
        if (target && fieldValue.type === 'Textbox' || fieldValue.type === 'Password') {
            target.value = fieldValue.value;
        } else if (fieldValue.type === 'Checkbox' || fieldValue.type === 'RadioButton' || fieldValue.type === 'CheckBox') {
            if (fieldValue.type === 'CheckBox') {
                target.style.appearance = 'auto';
            }
            if (this.formDesignerModule) {
                if (fieldValue.type === 'RadioButton') {
                    let radioButtonOption: any = {isSelected: fieldValue.isSelected};
                    this.formDesignerModule.updateFormField(fieldValue, radioButtonOption);
                } else {
                    let checkBoxOption: any = {isChecked: fieldValue.isChecked};
                    this.formDesignerModule.updateFormField(fieldValue, checkBoxOption);
                }
            } else {
                target.checked = fieldValue.value;
            }
        } else if (fieldValue.type === 'DropDown' || fieldValue.type === 'ListBox' || fieldValue.type === 'DropdownList') {
            if (this.formDesignerModule) {
                isformDesignerModuleListBox = true;
                let dropDownListOption: any = { options: fieldValue.value };
                this.formDesignerModule.updateFormField(fieldValue, dropDownListOption);
            } else {
                target.options[target.selectedIndex].text = fieldValue.value;
            }
        }
        if (fieldValue.type === 'SignatureField' || fieldValue.type === 'InitialField') {
            if (fieldValue.signatureType) {
                fieldValue.signatureType = fieldValue.signatureType[0];
            }
            fieldValue.fontName = fieldValue.fontName ? fieldValue.fontName: fieldValue.fontFamily;
            if ((target as any).classList.contains('e-pdfviewer-signatureformfields-signature')) {
                if (this.formDesignerModule)
                    this.annotation.deleteAnnotationById(fieldValue.id.split('_')[0] + '_content');
                else
                    this.annotation.deleteAnnotationById(fieldValue.id);
            }
            if (!fieldValue.signatureType)
                fieldValue.signatureType = (fieldValue.value.indexOf('base64')) > -1 ? 'Image' : ((fieldValue.value.startsWith('M') && fieldValue.split(',')[1].split(' ')[1].startsWith('L')) ? 'Path' : 'Type');
            this.formFieldsModule.drawSignature(fieldValue.signatureType, fieldValue.value, target, fieldValue.fontName);
        } else {
            if (!isformDesignerModuleListBox) {
                this.formFieldsModule.updateDataInSession(target);
            }
        }
    }

    /**
     * Perform undo action for the edited annotations
     *
     * @returns void
     */
    public undo(): void {
        if (this.annotationModule) {
            this.annotationModule.undo();
        }
    }

    /**
     * Perform redo action for the edited annotations
     *
     * @returns void
     */
    public redo(): void {
        if (this.annotationModule) {
            this.annotationModule.redo();
        }
    }

    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     *
     * @returns void
     */
    public unload(): void {
        this.viewerBase.clear(true);
        this.pageCount = 0;
        if (!isBlazor()) {
            if (this.toolbarModule) {
                this.viewerBase.pageCount = 0;
                this.toolbarModule.resetToolbar();
            }
        } else {
            this.viewerBase.blazorUIAdaptor.resetToolbar();
        }
        this.magnificationModule.zoomTo(100);
    }

    /**
     * Destroys all managed resources used by this object.
     */
    public destroy(): void {
        super.destroy();
        if (!isNullOrUndefined(this.element)) {
            if (!this.refreshing) {
                this.element.classList.remove('e-pdfviewer');
            }
            this.element.innerHTML = '';
        }
        if(this.viewerBase.navigationPane){
        this.viewerBase.navigationPane.restrictUpdateZoomValue = false;
        }
        this.viewerBase.destroy();
        if(this.viewerBase.navigationPane){
        this.viewerBase.navigationPane.restrictUpdateZoomValue = true;
        }
    }

    // eslint-disable-next-line
    /**
     * Perform imports annotations action in the PDF Viewer
     * @param  {any} importData - Specifies the data for annotation imports
     * @returns void
     */
    // eslint-disable-next-line
    public importAnnotation(importData: any, annotationDataFormat?: AnnotationDataFormat): void {
        if (this.annotationModule) {
            if (typeof (importData) === 'string') {
                let isXfdfFile: boolean =((importData.indexOf('.xfdf') > -1) || (annotationDataFormat.indexOf('Xfdf') > -1)) ? true : false;
                if (annotationDataFormat) {
                    if (importData.indexOf('</xfdf>') > -1) {
                        this.viewerBase.importAnnotations(importData, annotationDataFormat, false);
                    } else {
                        this.viewerBase.importAnnotations(importData, annotationDataFormat, isXfdfFile);
                    }
                } else {
                    if (importData.split('.')[1] === 'json') {
                        this.viewerBase.importAnnotations(importData, AnnotationDataFormat.Json);
                    } else {
                        this.viewerBase.importAnnotations(importData, AnnotationDataFormat.Xfdf, isXfdfFile);
                    }
                }
            } else {
                this.viewerBase.importAnnotations(importData);
            }
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     *
     * @param annotationDataFormat
     * @returns void
     */
    public exportAnnotation(annotationDataFormat?: AnnotationDataFormat): void {
        if (this.annotationModule) {
            if (annotationDataFormat && annotationDataFormat === 'Xfdf') {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Xfdf);
            } else {
                this.viewerBase.exportAnnotations(AnnotationDataFormat.Json);
            }
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     *
     * @returns Promise<object>
     */
    public exportAnnotationsAsObject(): Promise<object> {
        if (this.annotationModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportAnnotationsAsObject().then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * Export annotations and returns a base64 string for both Json and XFDF formats
     *
     * @returns Promise<string>
     */
    public exportAnnotationsAsBase64String(annotationDataFormat: AnnotationDataFormat): Promise<string> {
        if (this.annotationModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.createRequestForExportAnnotations(false, annotationDataFormat, true).then((value: string) => { 
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * Perform to add annotations in the PDF Viewer
     *
     * @param annotation
     * @returns void
     */
    // eslint-disable-next-line
    public addAnnotation(annotation: any): void {
        if (this.viewerBase) {
            this.viewerBase.addAnnotation(annotation);
        }
    }


    // eslint-disable-next-line
    /**
     * Perform  action in the PDF Viewer
     * @returns void
     */
    // eslint-disable-next-line
    public importFormFields(formFields: any): void {
        if (this.formFieldsModule) {
            this.viewerBase.importFormFields(formFields);
        }
    }

    /**
     * Perform export action in the PDF Viewer
     *
     * @param path
     * @returns void
     */
    public exportFormFields(path?: string): void {
        if (this.formFieldsModule) {
            this.viewerBase.exportFormFields(path);
        }
    }

    /**
     * Perform export annotations action in the PDF Viewer
     *
     * @returns Promise<object>
     */
    public exportFormFieldsAsObject(): Promise<object> {
        if (this.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.viewerBase.exportFormFieldsAsObject().then((value: object) => {
                    resolve(value);
                });
            });
        } else {
            return null;
        }
    }

    /**
     * reset all form fields data
     *
     * @returns void
     */
    public resetFormFields(): void {
        this.formFieldsModule.resetFormFields();
    }
    /**
     * Clears data from the form fields.
     * Parameter - Specifies the form field object.
     *
     * @param formField
     * @returns void
     */
    // eslint-disable-next-line
    public clearFormFields(formField?: any): void {
        this.formFieldsModule.clearFormFields(formField);
    }
    /**
     * To delete the annotation Collections in the PDF Document.
     *
     * @returns void
     */
    public deleteAnnotations(): void {
        if (this.annotationModule) {
            this.viewerBase.deleteAnnotations();
        }
    }

    /**
     * To retrieve the form fields in the PDF Document.
     *
     * @returns void
     */
    public retrieveFormFields(): FormFieldModel[] {
        return this.formFieldCollections;
    }

    /**
     * To update the form fields in the PDF Document.
     *
     * @param formFields
     * @returns void
     */
    // eslint-disable-next-line
    public updateFormFields(formFields: any): void {
        this.formFieldsModule.updateFormFieldValues(formFields);
    }

    /**
     * @param JsonData
     * @private
     */
    // eslint-disable-next-line
    public fireAjaxRequestInitiate(JsonData: any): void {
        const eventArgs: AjaxRequestInitiateEventArgs = { name: 'ajaxRequestInitiate', JsonData: JsonData };
        this.trigger('ajaxRequestInitiate', eventArgs);
    }
    /**
     * @param value
     * @param fieldName
     * @param id
     * @private
     */
    // eslint-disable-next-line
    public fireButtonFieldClickEvent(value: string, fieldName: string, id: string): void {
        const eventArgs: ButtonFieldClickEventArgs = { name: 'buttonFieldClicked', buttonFieldValue: value, buttonFieldName: fieldName, id: id };
        this.trigger('buttonFieldClick', eventArgs);
    }

    /**
     * @param name
     * @param field
     * @param cancel
     * @param name
     * @param field
     * @param cancel
     * @param isLeftClick - becomes true on signature panel left click.
     * @private
     */
    public async fireFormFieldClickEvent(name: string, field: FormFieldModel, cancel?: boolean ,isLeftClick?: boolean): Promise<void> {
        let eventArgs: FormFieldClickArgs = { name: name, field: field, cancel: cancel };
        if (isBlazor()) {
            eventArgs = await this.triggerEvent('formFieldClick', eventArgs) as FormFieldClickArgs || eventArgs;
            eventArgs.field.type = field.type;
        } else {
            this.triggerEvent('formFieldClick', eventArgs);
        }
        if (field.type === 'SignatureField' || field.type === 'InitialField') {
            if (field.type === 'InitialField')
                this.viewerBase.isInitialField = true;
            else
                this.viewerBase.isInitialField = false;
            let target: any = document.getElementById(field.id);
            if(target.style.visibility === "hidden"){
                target.disabled = true;
            }
            target = target ? target : (document.getElementById(field.id + '_content_html_element') ? document.getElementById(field.id + '_content_html_element').children[0].children[0] : null);
            if (!this.signatureFieldSettings.isReadOnly && !eventArgs.cancel && target && !target.disabled && (target as any).classList.contains('e-pdfviewer-signatureformfields') && (isLeftClick || isNullOrUndefined(isLeftClick))) {
                this.viewerBase.signatureModule.showSignatureDialog(true);
            }
        }
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field add event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldAddEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldAddArgs = { name: name, field: field, pageIndex: pageIndex };
        this.viewerBase.isFormFieldSelect = false;
        this.trigger('formFieldAdd', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field remove event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldRemoveEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldRemoveArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldRemove', eventArgs);
    }

    /**
     * @param name - Returns the event name.
     * @param field - Returns the double-clicked form field object.
     * @param cancel - If TRUE, property panel of the form field does not open. FALSE by default.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldDoubleClickEvent(eventArgs: FormFieldDoubleClickArgs): FormFieldDoubleClickArgs {
        this.trigger('formFieldDoubleClick', eventArgs);
        return eventArgs;
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field properties change event.
     * @param pageIndex - Get the page number.
     * @param isAlignmentChanged - Specifies whether the text alignment of the form field is changed or not.
     * @param isBackgroundColorChanged - Specifies whether the background color of the form field is changed or not.
     * @param isBorderColorChanged - Specifies whether the border color of the form field is changed or not.
     * @param isBorderWidthChanged - Specifies whether the border width of the form field is changed or not.
     * @param isColorChanged - Specifies whether the font color of the form field is changed or not.
     * @param isFontFamilyChanged - Specifies whether the font family of the form field is changed or not.
     * @param isFontSizeChanged - Specifies whether the font size of the form field is changed or not.
     * @param isFontStyleChanged - Specifies whether the font style of the form field is changed or not.
     * @param isMaxLengthChanged - Specifies whether the max length of the form field is changed or not.
     * @param isPrintChanged - Specifies whether the print option of the form field is changed or not.
     * @param isReadOnlyChanged - Specifies the Read Only of Form field is changed or not.
     * @param isRequiredChanged - Specifies whether the is required option of the form field is changed or not.
     * @param isToolTipChanged - Specifies whether the tool tip property is changed or not.
     * @param isValueChanged - Specifies whether the form field value is changed or not.
     * @param isVisibilityChanged - Specifies whether the form field visibility is changed or not.
     * @param newValue - Specifies the new value of the form field.
     * @param oldValue - Specifies the old value of the form field.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldPropertiesChangeEvent(name: string, field: IFormField, pageIndex: number, isValueChanged: boolean, isFontFamilyChanged: boolean,
        isFontSizeChanged: boolean, isFontStyleChanged: boolean, isColorChanged: boolean, isBackgroundColorChanged: boolean, isBorderColorChanged: boolean, 
        isBorderWidthChanged: boolean, isAlignmentChanged: boolean, isReadOnlyChanged: boolean, isVisibilityChanged: boolean, isMaxLengthChanged: boolean, 
        isRequiredChanged: boolean, isPrintChanged: boolean, isToolTipChanged: boolean, oldValue?: any, newValue?: any, isNamechanged?: any): void {
        const eventArgs: FormFieldPropertiesChangeArgs = {
            name: name, field: field, pageIndex: pageIndex, isValueChanged: isValueChanged, isFontFamilyChanged: isFontFamilyChanged, isFontSizeChanged: isFontSizeChanged,
            isFontStyleChanged: isFontStyleChanged, isColorChanged: isColorChanged, isBackgroundColorChanged: isBackgroundColorChanged, isBorderColorChanged: isBorderColorChanged, 
            isBorderWidthChanged: isBorderWidthChanged, isAlignmentChanged: isAlignmentChanged, isReadOnlyChanged: isReadOnlyChanged, isVisibilityChanged: isVisibilityChanged, 
            isMaxLengthChanged: isMaxLengthChanged, isRequiredChanged: isRequiredChanged, isPrintChanged: isPrintChanged,
            isToolTipChanged: isToolTipChanged, oldValue: oldValue, newValue: newValue, isNameChanged: !isNullOrUndefined(isNamechanged) ? isNamechanged: false
        };
        this.trigger('formFieldPropertiesChange', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field mouse leave event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMouseLeaveEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldMouseLeaveArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldMouseLeave', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field mouse over event.
     * @param pageIndex - Get the page number.
     * @param pageX - Get the mouse over x position with respect to the page container.
     * @param pageY - Get the mouse over y position with respect to the page container.
     * @param X - Specifies the mouse over x position with respect to the viewer container.
     * @param Y - Specifies the mouse over y position with respect to the viewer container.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMouseoverEvent(name: string, field: IFormField, pageIndex: number, pageX: number, pageY: number, X: number, Y: number): void {
        const eventArgs: FormFieldMouseoverArgs = { name: name, field: field, pageIndex: pageIndex, pageX: pageX, pageY: pageY, X: X, Y: Y };
        this.trigger('formFieldMouseover', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field move event.
     * @param pageIndex - Get the page number.
     * @param previousPosition - Get the previous position of the form field in the page.
     * @param currentPosition - Current position of form field in the page.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldMoveEvent(name: string, field: IFormField, pageIndex: number, previousPosition: IFormFieldBound, currentPosition: IFormFieldBound): void {
        const eventArgs: FormFieldMoveArgs = { name: name, field: field, pageIndex: pageIndex, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('formFieldMove', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field resize event.
     * @param pageIndex - Get the page number.
     * @param previousPosition - Get the previous position of the form field in the page.
     * @param currentPosition - Current position of form field in the page.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldResizeEvent(name: string, field: IFormField, pageIndex: number, previousPosition: IFormFieldBound, currentPosition: IFormFieldBound): void {
        const eventArgs: FormFieldResizeArgs = { name: name, field: field, pageIndex: pageIndex, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('formFieldResize', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field select event.
     * @param pageIndex - Get the page number.
     * @param isProgrammaticSelection - Specifies whether the the form field is selected programmatically or by UI.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldSelectEvent(name: string, field: IFormField, pageIndex: number, isProgrammaticSelection: boolean): void {
        const eventArgs: FormFieldSelectArgs = { name: name, field: field, pageIndex: pageIndex, isProgrammaticSelection: isProgrammaticSelection };
        this.trigger('formFieldSelect', eventArgs);
    }

    /**
     * @param name - Get the name of the event.
     * @param field - Event arguments for the form field unselect event.
     * @param pageIndex - Get the page number.
     * @private
     */
    // eslint-disable-next-line
    public fireFormFieldUnselectEvent(name: string, field: IFormField, pageIndex: number): void {
        const eventArgs: FormFieldUnselectArgs = { name: name, field: field, pageIndex: pageIndex };
        this.trigger('formFieldUnselect', eventArgs);
    }

    /**
     * @param pageData
     * @private
     */
    // eslint-disable-next-line
    public fireDocumentLoad(pageData: any): void {
        const eventArgs: LoadEventArgs = { name: 'documentLoad', documentName: this.fileName, pageData: pageData };
        this.trigger('documentLoad', eventArgs);
        if (isBlazor()) {
            this._dotnetInstance.invokeMethodAsync('LoadDocument', null);
            this.viewerBase.blazorUIAdaptor.loadDocument();
        }
    }

    /**
     * @param fileName
     * @private
     */
    public fireDocumentUnload(fileName: string): void {
        const eventArgs: UnloadEventArgs = { name: 'documentUnload', documentName: fileName };
        this.trigger('documentUnload', eventArgs);
    }

    /**
     * @param isPasswordRequired
     * @param password
     * @param isPasswordRequired
     * @param password
     * @private
     */
    public fireDocumentLoadFailed(isPasswordRequired: boolean, password: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: LoadFailedEventArgs = { name: 'documentLoadFailed', documentName: this.fileName, isPasswordRequired: isPasswordRequired, password: password };
        this.trigger('documentLoadFailed', eventArgs);
    }

    /**
     * @param errorStatusCode
     * @param errorMessage
     * @param action
     * @param retryCount
     * @param errorStatusCode
     * @param errorMessage
     * @param action
     * @param retryCount
     * @param errorStatusCode
     * @param errorMessage
     * @param action
     * @param retryCount
     * @private
     */
    public fireAjaxRequestFailed(errorStatusCode: number, errorMessage: string, action: string, retryCount?: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: AjaxRequestFailureEventArgs = { name: 'ajaxRequestFailed', documentName: this.fileName, errorStatusCode: errorStatusCode, errorMessage: errorMessage, action: action };
        if (retryCount) {
            eventArgs.retryCount = true;
        }
        this.trigger('ajaxRequestFailed', eventArgs);
    }

    /**
     * @action
     * @data
     * @private
     */
    public fireAjaxRequestSuccess(action: string, data: any): any {
        const eventArgs: AjaxRequestSuccessEventArgs = { name: 'ajaxRequestSuccess', documentName: this.fileName, action: action, data: data, cancel: false };
        this.trigger('ajaxRequestSuccess', eventArgs);
        if(eventArgs.cancel){
            return true;
        } else {
           return false;
        }
    }
    /**
     * @param action
     * @private
     */
    public fireValidatedFailed(action: string): void {
        if (!isBlazor()) {
            // eslint-disable-next-line max-len
            const eventArgs: ValidateFormFieldsArgs = { formField: this.formFieldCollections, documentName: this.fileName, nonFillableFields: this.viewerBase.nonFillableFields };
            this.trigger('validateFormFields', eventArgs);
        }   else {
            // eslint-disable-next-line
            let eventArgs: any = {};
            eventArgs.documentName = this.fileName;
            eventArgs.formFields = this.formFieldCollections;
            eventArgs.nonFillableFields = this.viewerBase.nonFillableFields;
            this.trigger('validateFormFields', eventArgs);
        }
    }

    /**
     * @param x
     * @param y
     * @param pageNumber
     * @param x
     * @param y
     * @param pageNumber
     * @param x
     * @param y
     * @param pageNumber
     * @private
     */
    public firePageClick(x: number, y: number, pageNumber: number): void {
        const eventArgs: PageClickEventArgs = { name: 'pageClick', documentName: this.fileName, x: x, y: y, pageNumber: pageNumber };
        this.trigger('pageClick', eventArgs);
    }

    /**
     * @param previousPageNumber
     * @private
     */
    public firePageChange(previousPageNumber: number): void {
        // eslint-disable-next-line max-len
        const eventArgs: PageChangeEventArgs = { name: 'pageChange', documentName: this.fileName, currentPageNumber: this.currentPageNumber, previousPageNumber: previousPageNumber };
        this.trigger('pageChange', eventArgs);
        if (isBlazor()) {
            //this._dotnetInstance.invokeMethodAsync('OnPageChanged', this.currentPageNumber);
            this.viewerBase.blazorUIAdaptor.pageChanged(this.currentPageNumber);
        }
    }

    /**
     * @private
     */
    public fireZoomChange(): void {
        // eslint-disable-next-line max-len
        const eventArgs: ZoomChangeEventArgs = { name: 'zoomChange', zoomValue: this.magnificationModule.zoomFactor * 100, previousZoomValue: this.magnificationModule.previousZoomFactor * 100 };
        this.trigger('zoomChange', eventArgs);
    }

    /**
     * @param hyperlink
     * @param hyperlinkElement
     * @private
     */
    public async fireHyperlinkClick(hyperlink: string, hyperlinkElement: HTMLAnchorElement): Promise<boolean> {
        // eslint-disable-next-line max-len
        let eventArgs: HyperlinkClickEventArgs = { name: 'hyperlinkClick', hyperlink: hyperlink, hyperlinkElement: hyperlinkElement, cancel:false};
        if (isBlazor()) {
            eventArgs = await this.triggerEvent('hyperlinkClick', eventArgs) as HyperlinkClickEventArgs || eventArgs;
        } else { 
            this.triggerEvent('hyperlinkClick', eventArgs);
        }
        if(eventArgs.hyperlinkElement.href != eventArgs.hyperlink){
            hyperlinkElement.href = eventArgs.hyperlink;
        }
        if(eventArgs.cancel){
            return false;
        }else{
           return true;
        }
    }

    /**
     * @param hyperlinkElement
     * @private
     */
    public fireHyperlinkHover(hyperlinkElement: HTMLAnchorElement): void {
        // eslint-disable-next-line max-len
        const eventArgs: HyperlinkMouseOverArgs = { name: 'hyperlinkMouseOver', hyperlinkElement: hyperlinkElement };
        this.trigger('hyperlinkMouseOver', eventArgs);
    }

    /**
     * @param fieldName
     * @param value
     * @param fieldName
     * @param value
     * @private
     */
    public fireFocusOutFormField(fieldName: string, value: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: FormFieldFocusOutEventArgs = { name: 'formFieldFocusOut', fieldName: fieldName, value: value};
        // eslint-disable-next-line
        this.trigger('formFieldFocusOut', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationAdd(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any, customStampName?: string): void {
        const eventArgs: AnnotationAddEventArgs = { name: 'annotationAdd', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            if (isBlazor()) {
                eventArgs.annotationSettings.textMarkupContent = textMarkupContent;
                eventArgs.annotationSettings.textMarkupStartIndex = tmStartIndex;
                eventArgs.annotationSettings.textMarkupEndIndex = tmEndIndex;
            } else {
                eventArgs.textMarkupContent = textMarkupContent;
                eventArgs.textMarkupStartIndex = tmStartIndex;
                eventArgs.textMarkupEndIndex = tmEndIndex;
            }
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        if (type === 'Image') {
            eventArgs.customStampName = customStampName;
        }
        this.viewerBase.isAnnotationSelect = false;
        this.trigger('annotationAdd', eventArgs);
        if (isBlazor()) {
            // this._dotnetInstance.invokeMethodAsync('AnnotationAdd', null);
            this.viewerBase.blazorUIAdaptor.annotationAdd();
        }
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationRemoveEventArgs = { name: 'annotationRemove', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBounds: bounds };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationRemove', eventArgs);
    }

    /**
     * @param value
     * @private
     */
    // eslint-disable-next-line
    public fireBeforeAddFreeTextAnnotation(value: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: BeforeAddFreeTextEventArgs = { name: 'beforeAddFreeText', value: value };
        // eslint-disable-next-line
        this.trigger('beforeAddFreeText', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentAdd(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentAdd', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentAdd', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @param id
     * @param text
     * @param annotation
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentEdit(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentEdit', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentEdit', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentDelete(id: string, text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentDelete', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentDelete', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireCommentSelect(id: string ,text: string, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentSelect', id: id, text: text, annotation: annotation };
        // eslint-disable-next-line
        this.trigger('commentSelect', eventArgs);
    }

    /**
     * @param id
     * @param text
     * @param annotation
     * @param statusChange
     * @param id
     * @param text
     * @param annotation
     * @param statusChange
     * @param id
     * @param text
     * @param annotation
     * @param statusChange
     * @param id
     * @param text
     * @param annotation
     * @param statusChange
     * @private
     */
    // eslint-disable-next-line
    public fireCommentStatusChanged(id: string, text: string, annotation: any, statusChange: CommentStatus): void {
        // eslint-disable-next-line max-len
        const eventArgs: CommentEventArgs = { name: 'CommentStatusChanged', id: id, text: text, annotation: annotation, status: statusChange};
        // eslint-disable-next-line
        this.trigger('commentStatusChanged', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param isColorChanged
     * @param isOpacityChanged
     * @param isTextChanged
     * @param isCommentsChanged
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param isColorChanged
     * @param isOpacityChanged
     * @param isTextChanged
     * @param isCommentsChanged
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line max-len
    // eslint-disable-next-line
    public fireAnnotationPropertiesChange(pageNumber: number, index: string, type: AnnotationType, isColorChanged: boolean, isOpacityChanged: boolean, isTextChanged: boolean, isCommentsChanged: boolean, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationPropertiesChangeEventArgs = { name: 'annotationPropertiesChange', pageIndex: pageNumber, annotationId: index, annotationType: type, isColorChanged: isColorChanged, isOpacityChanged: isOpacityChanged, isTextChanged: isTextChanged, isCommentsChanged: isCommentsChanged };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationPropertiesChange', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param data
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param data
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureAdd(pageNumber: number, index: string, type: any, bounds: any, opacity: number, strokeColor?: string, thickness?: number, data?: string): void {
        const eventArgs: AddSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds, opacity: opacity };
        if (thickness) {
            eventArgs.thickness = thickness;
        }
        if (strokeColor) {
            eventArgs.strokeColor = strokeColor;
        }
        if (data) {
            eventArgs.data = data;
        }
        this.trigger('addSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any): void {
        const eventArgs: RemoveSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, bounds: bounds };
        this.trigger('removeSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureMove(pageNumber: number, id: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, previousPosition: object, currentPosition: object): void {
        const eventArgs: MoveSignatureEventArgs = { pageIndex: pageNumber, id: id, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('moveSignature', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param isStrokeColorChanged
     * @param isOpacityChanged
     * @param isThicknessChanged
     * @param oldProp
     * @param newProp
     * @param pageNumber
     * @param index
     * @param type
     * @param isStrokeColorChanged
     * @param isOpacityChanged
     * @param isThicknessChanged
     * @param oldProp
     * @param newProp
     * @param pageNumber
     * @param index
     * @param type
     * @param isStrokeColorChanged
     * @param isOpacityChanged
     * @param isThicknessChanged
     * @param oldProp
     * @param newProp
     * @param pageNumber
     * @param index
     * @param type
     * @param isStrokeColorChanged
     * @param isOpacityChanged
     * @param isThicknessChanged
     * @param oldProp
     * @param newProp
     * @private
     */
    // eslint-disable-next-line
    public fireSignaturePropertiesChange(pageNumber: number, index: string, type: AnnotationType, isStrokeColorChanged: boolean, isOpacityChanged: boolean, isThicknessChanged: boolean, oldProp: any, newProp: any): void {
        const eventArgs: SignaturePropertiesChangeEventArgs = { pageIndex: pageNumber, id: index, type: type, isStrokeColorChanged: isStrokeColorChanged, isOpacityChanged: isOpacityChanged, isThicknessChanged: isThicknessChanged, oldValue: oldProp, newValue: newProp };
        this.trigger('signaturePropertiesChange', eventArgs);
    }

    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param currentPosition
     * @param previousPosition
     * @param pageNumber
     * @param index
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param currentPosition
     * @param previousPosition
     * @param pageNumber
     * @param index
     * @param type
     * @param opacity
     * @param strokeColor
     * @param thickness
     * @param currentPosition
     * @param previousPosition
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureResize(pageNumber: number, index: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, currentPosition: any, previousPosition: any): void {
        const eventArgs: ResizeSignatureEventArgs = { pageIndex: pageNumber, id: index, type: type, opacity: opacity, strokeColor: strokeColor, thickness: thickness, currentPosition: currentPosition, previousPosition: previousPosition };
        this.trigger('resizeSignature', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param signature
     * @param id
     * @param pageNumber
     * @param signature
     * @private
     */
    // eslint-disable-next-line
    public fireSignatureSelect(id: string, pageNumber: number, signature: object) {
        const eventArgs: SignatureSelectEventArgs = { id: id, pageIndex: pageNumber, signature: signature };
        this.trigger('signatureSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @param annotationCollection
     * @param multiPageCollection
     * @param isSelected
     * @param annotationAddMode
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationSelect(id: string, pageNumber: number, annotation: any, annotationCollection?: any, multiPageCollection?: any, isSelected?: boolean, annotationAddMode?: string): void {
        // eslint-disable-next-line max-len
        let eventArgs: AnnotationSelectEventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        if (annotationCollection) {
            // eslint-disable-next-line max-len
            eventArgs = { name: 'annotationSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation, annotationCollection: annotationCollection };
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        if (isSelected) {
            eventArgs.isProgrammaticSelection = isSelected;
        }
        if (annotationAddMode) {
            eventArgs.annotationAddMode = annotationAddMode;
        }

        if (isBlazor()) {
            if (annotation.type === 'FreeText' ) {
                // eslint-disable-next-line
                let fontStyle: any  = { isBold : false, isItalic : false, isStrikeout : false, isUnderline : false };
                if (annotation.fontStyle === 1 ) {
                    fontStyle.isBold = true;
                } else if (annotation.fontStyle === 2) {
                    fontStyle.isItalic = true;
                } else if (annotation.fontStyle === 3) {
                    fontStyle.isStrikeout = true;
                } else if (annotation.fontStyle === 4) {
                    fontStyle.isUnderline = true;
                }
                annotation.fontStyle = fontStyle;
            }
            //this._dotnetInstance.invokeMethodAsync('AnnotationSelect', annotation.type);
            this.viewerBase.blazorUIAdaptor.annotationSelect(annotation.type);
        }
        this.trigger('annotationSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @param id
     * @param pageNumber
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationUnSelect(id: string, pageNumber: number, annotation: any): void {
        if (isBlazor()) {
            this.viewerBase.blazorUIAdaptor.annotationUnSelect();
        }
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationUnSelectEventArgs = { name: 'annotationUnSelect', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationUnSelect', eventArgs);
    }

    /**
     * @param id
     * @param pageNumber
     * @param annotation
     * @param id
     * @param pageNumber
     * @param annotation
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationDoubleClick(id: string, pageNumber: number, annotation: any): void {
        // eslint-disable-next-line max-len
        const eventArgs: AnnotationDoubleClickEventArgs = { name: 'annotationDblClick', annotationId: id, pageIndex: pageNumber, annotation: annotation };
        this.trigger('annotationDoubleClick', eventArgs);
    }

    /**
     * @param pageNumber
     * @private
     */
    public fireTextSelectionStart(pageNumber: number): void {
        this.isTextSelectionStarted = true;
        const eventArgs: TextSelectionStartEventArgs = { pageIndex: pageNumber };
        this.trigger('textSelectionStart', eventArgs);
    }

    /**
     * @param pageNumber
     * @param text
     * @param bound
     * @private
     */
    // eslint-disable-next-line
    public fireTextSelectionEnd(pageNumber: number, text: string, bound: any[]): void {
        if (this.isTextSelectionStarted) {
            const eventArgs: TextSelectionEndEventArgs = { pageIndex: pageNumber, textContent: text, textBounds: bound };
            this.trigger('textSelectionEnd', eventArgs);
            this.isTextSelectionStarted = false;
        }
    }

    /**
     * @param canvas
     * @param index
     * @private
     */
    public renderDrawing(canvas?: HTMLCanvasElement, index?: number): void {
        if (isNullOrUndefined(index) && this.viewerBase.activeElements.activePageID && !this.viewerBase.isPrint) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if (this.annotation) {
            this.annotation.renderAnnotations(index, null, null, null, canvas);
        } else if(this.formDesignerModule){
            this.formDesignerModule.updateCanvas(index, canvas);
        }
    }
    /**
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @param pageNumber
     * @param index
     * @param type
     * @param bounds
     * @param settings
     * @param textMarkupContent
     * @param tmStartIndex
     * @param tmEndIndex
     * @param labelSettings
     * @param multiPageCollection
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationResize(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void {
        const eventArgs: AnnotationResizeEventArgs = { name: 'annotationResize', pageIndex: pageNumber, annotationId: index, annotationType: type, annotationBound: bounds, annotationSettings: settings };
        if (textMarkupContent) {
            eventArgs.textMarkupContent = textMarkupContent;
            eventArgs.textMarkupStartIndex = tmStartIndex;
            eventArgs.textMarkupEndIndex = tmEndIndex;
        }
        if (labelSettings) {
            eventArgs.labelSettings = labelSettings;
        }
        if (multiPageCollection) {
            eventArgs.multiplePageCollection = multiPageCollection;
        }
        this.trigger('annotationResize', eventArgs);
    }
    /**
     * @param pageNumber
     * @param id
     * @param type
     * @param annotationSettings
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMoving(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void {
        const eventArgs: AnnotationMovingEventArgs = { name: 'annotationMoving', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMoving', eventArgs);
    }

     /**
     * @param pageNumber
     * @param id
     * @param type
     * @param annotationSettings
     * @param previousPosition
     * @param currentPosition
     * @param pageNumber
     * @param id
     * @param type
     * @param annotationSettings
     * @param previousPosition
     * @param currentPosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMove(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void {
        const eventArgs: AnnotationMoveEventArgs = { name: 'annotationMove', pageIndex: pageNumber, annotationId: id, annotationType: type, annotationSettings: annotationSettings, previousPosition: previousPosition, currentPosition: currentPosition };
        this.trigger('annotationMove', eventArgs);
    }
    /**
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @param id
     * @param pageNumber
     * @param annotationType
     * @param bounds
     * @param annotation
     * @param currentPosition
     * @param mousePosition
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMouseover(id: string, pageNumber: number, annotationType: AnnotationType, bounds: any, annotation: any, currentPosition: any, mousePosition: any) {
        const eventArgs: AnnotationMouseoverEventArgs = { name: 'annotationMouseover', annotationId: id, pageIndex: pageNumber, annotationType: annotationType, annotationBounds: bounds, annotation: annotation, pageX: currentPosition.left, pageY: currentPosition.top, X: mousePosition.left, Y: mousePosition.top };
        if (isBlazor()) {
            if (annotation.subject === 'Perimeter calculation') {
                eventArgs.annotationType = 'Perimeter';
            } else if (annotation.subject === 'Area calculation') {
                eventArgs.annotationType = 'Area';
            } else if (annotation.subject === 'Volume calculation') {
                eventArgs.annotationType = 'Volume';
            } else if (annotation.subject === 'Arrow') {
                eventArgs.annotationType = 'Arrow';
            } else if (annotation.subject === 'Circle') {
                eventArgs.annotationType = 'Circle';
            }
        }
        this.trigger('annotationMouseover', eventArgs);
    }
    /**
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public fireAnnotationMouseLeave(pageNumber: number) {
        const eventArgs: AnnotationMouseLeaveEventArgs = { name: 'annotationMouseLeave', pageIndex: pageNumber };
        this.trigger('annotationMouseLeave', eventArgs);
    }
    /**
     * @param pageX
     * @param pageY
     * @private
     */
    public firePageMouseover(pageX: number, pageY: number): void {
        const eventArgs: PageMouseoverEventArgs = { pageX: pageX, pageY: pageY };
        this.trigger('pageMouseover', eventArgs);
    }
    /**
     * @param fileName
     * @private
     */
    public fireDownloadStart(fileName: string): void {
        const eventArgs: DownloadStartEventArgs = { fileName: fileName };
        this.trigger('downloadStart', eventArgs);
    }
    /**
     * @param fileName
     * @param downloadData
     * @private
     */
    public fireDownloadEnd(fileName: string, downloadData: string): void {
        const eventArgs: DownloadEndEventArgs = { fileName: fileName, downloadDocument: downloadData };
        this.trigger('downloadEnd', eventArgs);
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public async firePrintStart(): Promise<void> {
        let eventArgs: PrintStartEventArgs = { fileName: this.downloadFileName, cancel: false };
        if (isBlazor) {
            eventArgs = await this.triggerEvent('printStart', eventArgs) as PrintStartEventArgs || eventArgs;
        } else {
            this.triggerEvent('printStart', eventArgs);
        }
        if (!eventArgs.cancel) {
            this.printModule.print();
        }
    }
    /**
     * @param eventName
     * @param args
     * @param eventName
     * @param args
     * @private
     */
    public async triggerEvent(eventName: string, args: object): Promise<void | object> {
        let eventArgs: void | object = await this.trigger(eventName, args);
        if (isBlazor && typeof eventArgs === 'string') {
            eventArgs = JSON.parse(eventArgs as string);
        }
        return eventArgs;
    }
    /**
     * @param fileName
     * @private
     */
    public firePrintEnd(fileName: string): void {
        const eventArgs: PrintEndEventArgs = { fileName: fileName };
        this.trigger('printEnd', eventArgs);
    }
    /**
     * @param pageNumber
     * @private
     */
    public fireThumbnailClick(pageNumber: number): void {
        const eventArgs: ThumbnailClickEventArgs = { name: 'thumbnailClick', pageNumber: pageNumber };
        this.trigger('thumbnailClick', eventArgs);
    }

    /**
     * @param pageNumber
     * @param position
     * @param text
     * @param fileName
     * @param pageNumber
     * @param position
     * @param text
     * @param fileName
     * @param pageNumber
     * @param position
     * @param text
     * @param fileName
     * @private
     */
    public fireBookmarkClick(pageNumber: number, position: number, text: string, fileName: string ): void {
        // eslint-disable-next-line
        let eventArgs: BookmarkClickEventArgs = { name: 'bookmarkClick', pageNumber: pageNumber , position: position, text: text, fileName: fileName};
        this.trigger('bookmarkClick', eventArgs);
    }
    /**
     * @param importData
     * @private
     */
    // eslint-disable-next-line
    public fireImportStart(importData: any): void {
        const eventArgs: ImportStartEventArgs = { name: 'importAnnotationsStart', importData: importData, formFieldData: null};
        this.trigger('importStart', eventArgs);
    }
    /**
     * @param exportData
     * @private
     */
    // eslint-disable-next-line
    public fireExportStart(exportData: any): void {
        const eventArgs: ExportStartEventArgs = { name: 'exportAnnotationsStart', exportData: exportData, formFieldData: null};
        this.trigger('exportStart', eventArgs);
    }
    /**
     * @param importData
     * @private
     */
    // eslint-disable-next-line
    public fireImportSuccess(importData: any): void {
        const eventArgs: ImportSuccessEventArgs = { name: 'importAnnotationsSuccess', importData: importData, formFieldData: null };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @param exportData
     * @param fileName
     * @param exportData
     * @param fileName
     * @private
     */
    // eslint-disable-next-line
    public fireExportSuccess(exportData: any, fileName: string): void {
        const eventArgs: ExportSuccessEventArgs = { name: 'exportAnnotationsSuccess', exportData: exportData, fileName: fileName, formFieldData: null };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireImportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ImportFailureEventArgs = { name: 'importAnnotationsFailed', importData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireExportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ExportFailureEventArgs = { name: 'exportAnnotationsFailed', exportData: data, errorDetails: errorDetails, formFieldData: null };
        this.trigger('exportFailed', eventArgs);
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportStarted(data: any): void {
        const eventArgs: ImportStartEventArgs = { name: 'importFormFieldsStart', importData: null, formFieldData: data };
        this.trigger('importStart', eventArgs);
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportStarted(data: any): void {
        const eventArgs: ExportStartEventArgs = { name: 'exportFormFieldsStart', exportData: null, formFieldData: data };
        this.trigger('exportStart', eventArgs);
    }
    /**
     * @param data
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportSuccess(data: any): void {
        const eventArgs: ImportSuccessEventArgs = { name: 'importFormFieldsSuccess', importData: data, formFieldData: data };
        this.trigger('importSuccess', eventArgs);
    }
    /**
     * @param data
     * @param fileName
     * @param data
     * @param fileName
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportSuccess(data: any, fileName: string): void {
        const eventArgs: ExportSuccessEventArgs = { name: 'exportFormFieldsSuccess', exportData: data, fileName: fileName, formFieldData: data };
        this.trigger('exportSuccess', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireFormImportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ImportFailureEventArgs = { name: 'importFormFieldsfailed', importData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('importFailed', eventArgs);
    }
    /**
     * @param data
     * @param errorDetails
     * @param data
     * @param errorDetails
     * @private
     */
    // eslint-disable-next-line
    public fireFormExportFailed(data: any, errorDetails: string): void {
        // eslint-disable-next-line max-len
        const eventArgs: ExportFailureEventArgs = { name: 'exportFormFieldsFailed', exportData: data, errorDetails: errorDetails, formFieldData: data };
        this.trigger('exportFailed', eventArgs);
    }

    /**
     * @param documentCollection
     * @private
     */
    // eslint-disable-next-line
    public fireTextExtractionCompleted(documentCollection: DocumentTextCollectionSettingsModel[][]): void {
        const eventArgs: ExtractTextCompletedEventArgs = { documentTextCollection: documentCollection };
        this.trigger('extractTextCompleted', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @param searchText
     * @param isMatchcase
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchStart(searchText: string, isMatchcase: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchStartEventArgs = { name: 'textSearchStart', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchStart', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchComplete(searchText: string, isMatchcase: boolean): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchCompleteEventArgs = { name: 'textSearchComplete', searchText: searchText, matchCase: isMatchcase };
        this.trigger('textSearchComplete', eventArgs);
    }
    /**
     * @param searchText
     * @param isMatchcase
     * @param bounds
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    public fireTextSearchHighlight(searchText: string, isMatchcase: boolean, bounds: RectangleBoundsModel, pageNumber: number): void {
        // eslint-disable-next-line max-len
        const eventArgs: TextSearchHighlightEventArgs = { name: 'textSearchHighlight', searchText: searchText, matchCase: isMatchcase, bounds: bounds, pageNumber: pageNumber };
        this.trigger('textSearchHighlight', eventArgs);
    }
    /**
     * @param bounds
     * @param commonStyle
     * @param cavas
     * @param index
     * @private
     */
    public renderAdornerLayer(bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number): void {
        renderAdornerLayer(bounds, commonStyle, cavas, index, this);
    }
    /**
     * @param index
     * @param currentSelector
     * @param index
     * @param currentSelector
     * @private
     */
    public renderSelector(index: number, currentSelector?: AnnotationSelectorSettingsModel): void {
        this.drawing.renderSelector(index, currentSelector);
    }
    /**
     * @param objArray
     * @param currentSelector
     * @param multipleSelection
     * @param preventUpdate
     * @param objArray
     * @param currentSelector
     * @param multipleSelection
     * @param preventUpdate
     * @param objArray
     * @param currentSelector
     * @param multipleSelection
     * @param preventUpdate
     * @param objArray
     * @param currentSelector
     * @param multipleSelection
     * @param preventUpdate
     * @private
     */
    // eslint-disable-next-line max-len
    public select(objArray: string[], currentSelector?: AnnotationSelectorSettingsModel, multipleSelection?: boolean, preventUpdate?: boolean): void {
        let allowServerDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        if (this.annotationModule) {
            const annotationSelect: number = this.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
            // eslint-disable-next-line
            let annotation: any = this.selectedItems.annotations[0];
            if (annotationSelect) {
                // eslint-disable-next-line
                let currentAnnot: any = this.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                this.annotationModule.textMarkupAnnotationModule.clearCurrentAnnotationSelection(annotationSelect, true);
                this.fireAnnotationUnSelect(currentAnnot.annotName, currentAnnot.pageNumber, currentAnnot);
            }
            if (!multipleSelection) {
                if (this.viewerBase.activeElements && this.viewerBase.activeElements.activePageID >= 0) {
                    if (!this.viewerBase.isNewStamp && annotation && annotation.shapeAnnotationType !== 'HandWrittenSignature' && annotation.shapeAnnotationType !== 'SignatureText' && annotation.shapeAnnotationType !== 'SignatureImage') {
                        this.fireAnnotationUnSelect(annotation.annotName, annotation.pageIndex, annotation);
                    }
                    this.clearSelection(this.viewerBase.activeElements.activePageID);
                }
            }
        }
        if(this.formDesignerModule){
            let formField: any = this.selectedItems.formFields[0];
            if (formField) {
                if (this.formDesignerModule && formField && formField.formFieldAnnotationType) {
                    let field: IFormField = {
                        name: (formField as any).name, id: (formField as any).id, value: (formField as any).value, fontFamily: formField.fontFamily, fontSize: formField.fontSize, fontStyle: (formField as any).fontStyle,
                        color: (formField as PdfFormFieldBaseModel).color, backgroundColor: (formField as PdfFormFieldBaseModel).backgroundColor, borderColor: (formField as PdfFormFieldBaseModel).borderColor, 
                        thickness: (formField as PdfFormFieldBaseModel).thickness, alignment: (formField as PdfFormFieldBaseModel).alignment, isReadonly: (formField as any).isReadonly, visibility: (formField as any).visibility,
                        maxLength: (formField as any).maxLength, isRequired: (formField as any).isRequired, isPrint: formField.isPrint, rotation: (formField as any).rotateAngle, tooltip: (formField as any).tooltip, options: (formField as any).options, 
                        isChecked: (formField as any).isChecked, isSelected: (formField as any).isSelected
                    };
                    this.fireFormFieldUnselectEvent("formFieldUnselect", field, formField.pageIndex);
                }
            }
        } 
        this.drawing.select(objArray, currentSelector, multipleSelection, preventUpdate);
        this.enableServerDataBinding(allowServerDataBind, true);
    }
    /**
     * @param pageId
     * @private
     */
    public getPageTable(pageId: number): ZOrderPageTable {
        return this.drawing.getPageTable(pageId);
    }
    /**
     * @param diffX
     * @param diffY
     * @param pageIndex
     * @param currentSelector
     * @param helper
     * @param diffX
     * @param diffY
     * @param pageIndex
     * @param currentSelector
     * @param helper
     * @param diffX
     * @param diffY
     * @param pageIndex
     * @param currentSelector
     * @param helper
     * @private
     */
    // eslint-disable-next-line max-len
    public dragSelectedObjects(diffX: number, diffY: number, pageIndex: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel): boolean {
        return this.drawing.dragSelectedObjects(diffX, diffY, pageIndex, currentSelector, helper);
    }
    /**
     * @param sx
     * @param sy
     * @param pivot
     * @private
     */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        return this.drawing.scaleSelectedItems(sx, sy, pivot);
    }
    /**
     * @param endPoint
     * @param obj
     * @param point
     * @param segment
     * @param target
     * @param targetPortId
     * @param currentSelector
     * @param endPoint
     * @param obj
     * @param point
     * @param segment
     * @param target
     * @param targetPortId
     * @param currentSelector
     * @param endPoint
     * @param obj
     * @param point
     * @param segment
     * @param target
     * @param targetPortId
     * @param currentSelector
     * @param endPoint
     * @param obj
     * @param point
     * @param segment
     * @param target
     * @param targetPortId
     * @param currentSelector
     * @private
     */
    // eslint-disable-next-line max-len
    public dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.dragConnectorEnds(endPoint, obj, point, segment, target, null, currentSelector);
    }
    /**
     * @param pageId
     * @private
     */
    public clearSelection(pageId: number): void {
        let allowServerDataBind: boolean = this.allowServerDataBinding;
        this.enableServerDataBinding(false);
        const selectormodel: SelectorModel = this.selectedItems;
        const node: PdfAnnotationBaseModel | PdfFormFieldBaseModel = selectormodel.annotations.length > 0 ? this.selectedItems.annotations[0]: this.selectedItems.formFields[0];
        if (selectormodel.annotations.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.annotations = [];
            selectormodel.wrapper = null;
        } else if(selectormodel.formFields.length > 0) {
            selectormodel.offsetX = 0;
            selectormodel.offsetY = 0;
            selectormodel.width = 0;
            selectormodel.height = 0;
            selectormodel.rotateAngle = 0;
            selectormodel.formFields = [];
            selectormodel.wrapper = null;
        }
        this.drawing.clearSelectorLayer(pageId);
        this.viewerBase.isAnnotationSelect = false;
        this.viewerBase.isFormFieldSelect = false;
        this.enableServerDataBinding(allowServerDataBind, true);
    } 

    /**
     * Get page number from the user coordinates x and y.
     *
     * @param {Point} clientPoint - The user will provide a x, y coordinates.
     * @returns number
     */

    public getPageNumberFromClientPoint(clientPoint: Point): number {
        let pageNumber: number = this.viewerBase.getPageNumberFromClientPoint(clientPoint);
        return pageNumber;
    }

    /**
     * Convert user coordinates to the PDF page coordinates.
     *
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertClientPointToPagePoint(clientPoint: Point, pageNumber: number): Point {
        let pagePoint: any = this.viewerBase.convertClientPointToPagePoint(clientPoint, pageNumber);
        return pagePoint;
    }

    /**
     * Convert page coordinates to the user coordinates.
     *
     * @param {Point} pagePoint - The user should provide a page x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertPagePointToClientPoint(pagePoint: Point, pageNumber: number): Point {
        let clientPoint: any = this.viewerBase.convertPagePointToClientPoint(pagePoint, pageNumber);
        return clientPoint;
    }

    /**
     * Convert page coordinates to the scrolling coordinates.
     *
     * @param {Point} pagePoint - The user should provide a page x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns Point
     */

    public convertPagePointToScrollingPoint(pagePoint: Point, pageNumber: number): Point {
        let scrollingPoint: any = this.viewerBase.convertPagePointToScrollingPoint(pagePoint, pageNumber);
        return scrollingPoint;
    }

    /**
     * Brings the given rectangular region to view and zooms in the document to fit the region in client area (view port).
     *
     * @param {Rect} rectangle - Specifies the region in client coordinates that is to be brought to view.
     */
    public zoomToRect(rectangle: Rect) : void {
        this.magnificationModule.zoomToRect(rectangle);   
    }

    /**
     * @param obj
     * @private
     */
    public add(obj: PdfAnnotationBase): PdfAnnotationBaseModel {
        return this.drawing.add(obj);
    }
    /**
     * @param obj
     * @private
     */
    public remove(obj: PdfAnnotationBaseModel): void {
        return this.drawing.remove(obj);
    }
    /**
     * @private
     */
    public copy(): Object {
        if(this.annotation)
          this.annotation.isShapeCopied = true;
        else if(this.formDesigner && this.designerMode)
          this.formDesigner.isShapeCopied = true;
        return this.drawing.copy();
    }
    /**
     * @param angle
     * @param currentSelector
     * @param angle
     * @param currentSelector
     * @private
     */
    public rotate(angle: number, currentSelector?: AnnotationSelectorSettingsModel): boolean {
        return this.drawing.rotate(this.selectedItems, angle, null, currentSelector);
    }
    /**
     * @param obj
     * @private
     */
    public paste(obj?: PdfAnnotationBaseModel[]): void {
        let index: number;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        return this.drawing.paste(obj, index || 0);
    }
    /**
     * @private
     */
    public refresh(): void {
        for (let i: number = 0; i < this.annotations.length; i++) {
            if (this.zIndexTable.length !== undefined) {
                const notFound: boolean = true;
                for (let i: number = 0; i < this.zIndexTable.length; i++) {
                    const objects: (PdfAnnotationBaseModel)[] = this.zIndexTable[i].objects;
                    for (let j: number = 0; j < objects.length; j++) {
                        objects.splice(j, 1);
                    }
                    delete this.zIndexTable[i];
                }
                if (this.annotations[i]) {
                    delete this.annotations[i];
                }
                if (this.selectedItems.annotations && this.selectedItems.annotations[i]) {
                    delete this.selectedItems.annotations[i];
                }
                this.zIndexTable = [];
                this.renderDrawing();
            }
            if (this.annotations && this.annotations.length !== 0) {
                this.annotations.length = 0;
                this.selectedItems.annotations.length = 0;
            }
        }
    }
    /**
     * @private
     */
    public cut(): void {
        let index: number;
        if (this.viewerBase.activeElements.activePageID) {
            index = this.viewerBase.activeElements.activePageID;
        }
        if(this.annotation)
          this.annotation.isShapeCopied = true;
        else if(this.formDesigner && this.designerMode)
          this.formDesigner.isShapeCopied = true;
        return this.drawing.cut(index || 0);
    }
    /**
     * @param actualObject
     * @param node
     * @private
     */
    public nodePropertyChange(
        actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void {
        this.drawing.nodePropertyChange(actualObject, node);
    }

    /**
     * enableServerDataBinding method \
     *
     * @returns { void }  enableServerDataBinding method .\
     * @param {boolean} enable - provide the node value.
     *
     * @private
     */
    public enableServerDataBinding(enable: boolean, clearBulkChanges: boolean = false): void {
        if (isBlazor()) {
            this.allowServerDataBinding = enable;
            if (clearBulkChanges) {
                this.bulkChanges = {};
            }
        }
    }

    /**
     * @param tx
     * @param ty
     * @param pageIndex
     * @param nodeBounds
     * @param isStamp
     * @param isSkip
     * @param tx
     * @param ty
     * @param pageIndex
     * @param nodeBounds
     * @param isStamp
     * @param isSkip
     * @param tx
     * @param ty
     * @param pageIndex
     * @param nodeBounds
     * @param isStamp
     * @param isSkip
     * @private
     */
    // eslint-disable-next-line max-len
    public checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean, isSkip?: boolean): boolean {
        return this.drawing.checkBoundaryConstraints(tx, ty, pageIndex, nodeBounds, isStamp, isSkip);
    }

}
