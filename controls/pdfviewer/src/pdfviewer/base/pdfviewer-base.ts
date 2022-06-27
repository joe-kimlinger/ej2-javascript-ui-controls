import { createElement, Browser, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PdfViewer, TextLayer, ContextMenu, Signature, AnnotationType, TileRenderingSettingsModel, PdfFormFieldBase } from '../index';
import { NavigationPane } from './navigation-pane';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { TextMarkupAnnotation, StampAnnotation, IPageAnnotations, Annotation, IPoint } from '../annotation';
import { AjaxHandler } from '../index';
import { IElement, Point, DrawingElement, PointModel, Rect, Matrix, identityMatrix, transformPointByMatrix, contains, Info, rotateMatrix } from '@syncfusion/ej2-drawings';
import { ToolBase, Actions, MouseEventArgs, SelectTool, MoveTool, ResizeTool, ConnectTool, NodeDrawingTool, PolygonDrawingTool, LineTool, RotateTool, StampTool, InkDrawingTool } from '../drawing/tools';
import { Selector } from '../drawing/selector';
import { ActiveElements, findActiveElement } from '../drawing/action';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from '../drawing/pdf-annotation-model';
import { renderAdornerLayer } from '../drawing/dom-util';
import { FreeTextAnnotation } from '../annotation/free-text-annotation';
import { AnnotationDataFormat, AnnotationResizerLocation } from './types';
import { cloneObject } from '../drawing/drawing-util';
import { IContextMenu, MouseDownEventArgs } from './interfaces';
import { BlazorContextMenu } from './blazor-context-menu';
import { createSpinner, showSpinner, hideSpinner } from './spinner';
import { BlazorUiAdaptor } from './blazor-ui-adaptor';
import { IFormField } from '../form-designer';
import { FormFieldModel } from '../pdfviewer-model';
import { FormFieldDoubleClickArgs } from './events-helper';
import { Print } from '../print';
import { TextSearch } from '../text-search';
import { BookmarkView } from '../bookmark-view';
import { ThumbnailView } from '../thumbnail-view';
import { Magnification } from '../magnification';
import { TextSelection } from '../text-selection';
import { FormFields } from '../form-fields';
/**
 * The `ISize` module is used to handle page size property of PDF viewer.
 *
 * @hidden
 */
export interface ISize {
    width: number
    height: number
    top: number
    rotation?: number
}

/**
 * The `IPinchZoomStorage` module is used to handle pinch zoom storage of PDF viewer.
 *
 * @hidden
 */
export interface IPinchZoomStorage {
    index: number
    pinchZoomStorage: object
}

/**
 * The `IAnnotationCollection` module is used to handle page size property of PDF viewer.
 *
 * @hidden
 */
export interface IAnnotationCollection {
    textMarkupAnnotation: object
    shapeAnnotation: object
    measureShapeAnnotation: object
    stampAnnotations: object
    stickyNotesAnnotation: object
    freeTextAnnotation: object
    signatureAnnotation?: object
    signatureInkAnnotation?: object
}
/**
 * @hidden
 */
interface ICustomStampItems {
    customStampName: string
    customStampImageSource: string
}
/**
 * The `PdfViewerBase` module is used to handle base methods of PDF viewer.
 *
 * @hidden
 */
export class PdfViewerBase {
    /**
     * @private
     */
    public viewerContainer: HTMLElement;
    /**
     * @private
     */
    public contextMenuModule: IContextMenu;
    /**
     * @private
     */
    public pageSize: ISize[] = [];
    /**
     * @private
     */
    public pageCount: number = 0;
    /**
     * @private
     */
   
    public isReRenderRequired: boolean = true;
    /**
     * @private
     */
    public currentPageNumber: number = 0;
    private previousZoomValue: number;
    /**
     * @private
     */
    public activeElements: ActiveElements = new ActiveElements();

    /**
     * @private
     */
    public mouseDownEvent: Event = null;

    /**
     * @private
     */
    public textLayer: TextLayer;
    /**
     * @private
     */
    public pdfViewer: PdfViewer;

    /**
     * @private
     */
    public blazorUIAdaptor: BlazorUiAdaptor;

    // eslint-disable-next-line
    private unload: any;
    /**
     * @private
     */
    public isDocumentLoaded: boolean = false;
    /**
     * @private
     */
    public documentId: string;
    /**
     * @private
     */
    public jsonDocumentId: string;
    /**
     * @private
     */
    public renderedPagesList: number[] = [];
    /**
     * @private
     */
    public pageGap: number = 8;
    /**
     * @private
     */
    public signatureAdded: boolean = false;
    /**
     * @private
     */
    public loadedData: string;
    /**
     * @private
     */
    public isFreeTextSelected: boolean;
    /**
     * @private
     */
    // eslint-disable-next-line
    public formfieldvalue: any;
    private pageLeft: number = 5;
    private sessionLimit: number = 1000;
    private pageStopValue: number = 300;
    /**
     * @private
     */
    public toolbarHeight: number = 56;
    private pageLimit: number = 0;
    private previousPage: number = 0;
    private isViewerMouseDown: boolean = false;
    private isViewerMouseWheel: boolean = false;
    private scrollPosition: number = 0;
    private sessionStorage: string[] = [];
    /**
     * @private
     */
    public pageContainer: HTMLElement;
    /**
     * @private
     */
    public isLoadedFormFieldAdded: boolean = false;
    // eslint-disable-next-line
    private scrollHoldTimer: any;
    private isFileName: boolean;
    private pointerCount: number = 0;
    private pointersForTouch: PointerEvent[] = [];
    private corruptPopup: Dialog;
    private passwordPopup: Dialog;
    private goToPagePopup: Dialog;
    /**
     * @private
     */
    public isPasswordAvailable: boolean = false;
    private document: string;
    /**
     * @private
     */
    public passwordData: string = '';
    /**
     * @private
     */
    public reRenderedCount: number = 0;
    private passwordInput: HTMLElement;
    private promptElement: HTMLElement;
    /**
     * @private
     */
    public navigationPane: NavigationPane;
    private mouseX: number = 0;
    private mouseY: number = 0;
    /**
     * @private
     */
    public mouseLeft: number = 0;
    /**
     * @private
     */
    public mouseTop: number = 0;
    /**
     * @private
     */
    public hashId: string;
    private documentLiveCount: number;
    /**
     * @private
     */
    public mainContainer: HTMLElement;
    /**
     * @private
     */
    public viewerMainContainer: HTMLElement;
    private printMainContainer: HTMLElement;
    /**
     * @private
     */
    public mobileScrollerContainer: HTMLElement;
    /**
     * @private
     */
    public mobilePageNoContainer: HTMLElement;
    /**
     * @private
     */
    public mobileSpanContainer: HTMLElement;
    /**
     * @private
     */
    public mobilecurrentPageContainer: HTMLElement;
    private mobilenumberContainer: HTMLElement;
    private mobiletotalPageContainer: HTMLElement;
    private touchClientX: number = 0;
    private touchClientY: number = 0;
    private previousTime: number = 0;
    private currentTime: number = 0;
    private isTouchScrolled: boolean = false;
    private goToPageInput: HTMLElement;
    /**
     * @private
     */
    public pageNoContainer: HTMLElement;
    private goToPageElement: HTMLElement;
    private isLongTouchPropagated: boolean = false;
    // eslint-disable-next-line
    private longTouchTimer: any = null;
    private isViewerContainerDoubleClick: boolean = false;
    // eslint-disable-next-line
    private dblClickTimer: any = null;
    /**
     * @private
     */
    public pinchZoomStorage: IPinchZoomStorage[] = [];
    private isPinchZoomStorage: boolean;
    /**
     * @private
     */
    public isTextSelectionDisabled: boolean = false;
    /**
     * @private
     */
    public isPanMode: boolean = false;
    private dragX: number = 0;
    private dragY: number = 0;
    private isScrollbarMouseDown: boolean = false;
    private scrollX: number = 0;
    private scrollY: number = 0;
    private ispageMoved: boolean = false;
    private isThumb: boolean = false;
    private isTapHidden: boolean = false;
    // eslint-disable-next-line
    private singleTapTimer: any = null;
    private tapCount: number = 0;
    private inputTapCount: number = 0;
    /**
     * @private
     */
    public isInitialLoaded: boolean = false;
    private loadRequestHandler: AjaxHandler;
    private unloadRequestHandler: AjaxHandler;
    private dowonloadRequestHandler: AjaxHandler;
    private pageRequestHandler: AjaxHandler;
    private virtualLoadRequestHandler: AjaxHandler;
    private exportAnnotationRequestHandler: AjaxHandler;
    private importAnnotationRequestHandler: AjaxHandler;
    private exportFormFieldsRequestHandler: AjaxHandler;
    private importFormFieldsRequestHandler: AjaxHandler;
    private annotationPageList: number[] = [];
    private importPageList: number[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public importedAnnotation: any;
    /**
     * @private
     */
    public isImportAction: boolean = false;
    private isImportedAnnotation: boolean = false;
    /**
     * @private
     */
    public isAnnotationCollectionRemoved: boolean = false;
    /**
     * @private
     */
    public tool: ToolBase = null;
    // eslint-disable-next-line
    public action: | any = 'Select';
    /**
     * @private
     */
    public eventArgs: MouseEventArgs = null;
    /**
     * @private
     */
    public inAction: boolean = false;
    /**
     * @private
     */
    public isMouseDown: boolean = false;
    /**
     * @private
     */
    public isStampMouseDown: boolean = false;
    /**
     * @private
     */
    public currentPosition: PointModel;
    /**
     * @private
     */
    public prevPosition: PointModel;
    private initialEventArgs: MouseEventArgs;
    /**
     * @private
     */
    public stampAdded: boolean = false;
    /**
     * @private
     */
    public customStampCount: number = 0;
    /**
     * @private
     */
    public isDynamicStamp: boolean = false;
    /**
     * @private
     */
    public isMixedSizeDocument: boolean = false;
    /**
     * @private
     */
    public highestWidth: number = 0;
    /**
     * @private
     */
    public highestHeight: number = 0;
    /**
     * @private
     */
    public customStampCollection: ICustomStampItems[] = [];
    /**
     * @private
     */
    public isAlreadyAdded: boolean = false;
    /**
     * @private
     */
    public isWebkitMobile: boolean = false;
    /**
     * @private
     */
    public isFreeTextContextMenu: boolean = false;
    /**
     * @private
     */
    public signatureModule: Signature;
    /**
     * @private
     */
    public isSelection: boolean = false;
    /**
     * @private
     */
    public isAddAnnotation: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public annotationComments: any = null;
    /**
     * @private
     */
    public isToolbarSignClicked: boolean = false;
    /**
     * @private
     */
    public signatureCount: number = 0;
    /**
     * @private
     */
    public isSignatureAdded: boolean = false;
    /**
     * @private
     */
    public isNewSignatureAdded: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public currentSignatureAnnot: any;
    /**
     * @private
     */
    public isInitialPageMode: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public ajaxData: any;
    /**
     * @private
     */
    // eslint-disable-next-line
    public documentAnnotationCollections: any = null;
    /**
     * @private
     */
    public annotationRenderredList: number[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public annotationStorage: any = {};
    /**
     * @private
     */
    // eslint-disable-next-line
    public formFieldStorage: any = {};
    /**
     * @private
     */
    public isStorageExceed: boolean = false;
    /**
     * @private
     */
    public isNewStamp: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public downloadCollections: any = {};
    /**
     * @private
     */
    public isAnnotationAdded: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public annotationEvent: any = null;
    /**
     * @private
    */
    public isAnnotationDrawn: boolean = false;
    /**
     * @private
     */
    public isAnnotationSelect: boolean = false;
    /**
     * @private
     */
    public isAnnotationMouseDown: boolean = false;
    /**
     * @private
     */
    public isAnnotationMouseMove: boolean = false;
    /**
     * @private
     */
    public validateForm: boolean = false;
    /**
     * @private
     */
    public isMinimumZoom: boolean = false;
    /**
     * @private
     */
    public documentLoaded: boolean = false;
    private tileRenderCount: number = 0;
    private tileRequestCount: number = 0;
    /**
     * @private
     */
    public isTileImageRendered: boolean = false;
    private isDataExits: boolean = false;
    private requestLists: string[] = [];
    private tilerequestLists: string[] = [];
    /**
     * @private
     */
    public isToolbarInkClicked: boolean;
    /**
     * @private
     */
    public isInkAdded: boolean = false;
    /**
     * @private
     */
    public inkCount: number = 0;
    /**
     * @private
     */
    public isAddedSignClicked: boolean = false;
    /**
     * @private
     */
    public imageCount: number = 0;
    /**
     * @private
     */
    public isMousedOver: boolean = false;
    /**
     * @private
     */
    public isFormFieldSelect: boolean = false;
    /**
     * @private
     */
    public isFormFieldMouseDown: boolean = false;
    /**
     * @private
     */
    public isFormFieldMouseMove: boolean = false;
    /**
     * @private
     */
    public isFormFieldMousedOver: boolean = false;
    /**
     * @private
     */
    public isPassword: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public restrictionList: any;
    private isDrawnCompletely: boolean = false;
    /**
     * @private
     */
    public isAddComment: boolean = false;
    /**
     * @private
     */
    public isCommentIconAdded: boolean;
    /**
     * @private
     */
    // eslint-disable-next-line
    public currentTarget: any;
    /**
     * @private
     */
    private fromTarget: any;
    /**
     * @private
     */
    public drawSignatureWithTool: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public formFieldCollection: any[] = [];
    /**
     * @private
     */
    // eslint-disable-next-line
    public nonFillableFields: any = {};
    /**
     * @private
     */
    public isInitialField: boolean = false;
    /**
     * @private
     */
    public isTouchDesignerMode: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public designerModetarget: any;
    /**
     * @private
     */
    public isPrint: boolean = false;
    /**
     * @private
     */
    public isJsonImported: boolean = false;
    /**
     * @private
     */
    public isJsonExported: boolean = false;
    /**
     * @private
     */
    public isPageRotated: boolean = false;
    private downloadFileName: string = '';
    /**
     * @private
     */
    // eslint-disable-next-line
    public isFocusField: boolean = false;
    /**
     * @private
     */
    // eslint-disable-next-line
    public focusField: any = [];
    private isMoving: boolean;

    /**
     * Initialize the constructor of PDFViewerBase
     *
     * @param { PdfViewer } viewer - Specified PdfViewer class.
     */
    public constructor(viewer: PdfViewer) {
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
        this.signatureModule = new Signature(this.pdfViewer, this);
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1);

    }
    /**
     * @private
     * @returns {void}
     */
    public initializeComponent(): void {
        const element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            this.blazorUIAdaptor = isBlazor() ? new BlazorUiAdaptor(this.pdfViewer, this) : null;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            const controlWidth: string = '100%';
            let toolbarDiv: HTMLElement;
            this.viewerMainContainer = isBlazor() ? element.querySelector('.e-pv-viewer-main-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            this.viewerContainer = isBlazor() ? element.querySelector('.e-pv-viewer-container') : createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container', attrs: { 'aria-label': 'pdfviewer scroll view' } });
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.createMobilePageNumberContainer();
            }
            // eslint-disable-next-line
            (this.viewerContainer as any).tabIndex = 0;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
            this.mainContainer = isBlazor() ? element.querySelector('.e-pv-main-container') : createElement('div', { id: this.pdfViewer.element.id + '_mainContainer', className: 'e-pv-main-container' });
            this.mainContainer.appendChild(this.viewerMainContainer);
            element.appendChild(this.mainContainer);
            this.applyViewerHeight(this.mainContainer);
            if (this.pdfViewer.toolbarModule) {
                this.navigationPane.initializeNavigationPane();
                toolbarDiv = this.pdfViewer.toolbarModule.intializeToolbar(controlWidth);
            } else {
                if (isBlazor()) {
                    this.navigationPane.initializeNavigationPane();
                    toolbarDiv = this.pdfViewer.element.querySelector('.e-pv-toolbar');
                    if (!this.pdfViewer.enableToolbar) {
                        this.toolbarHeight = 0;
                        toolbarDiv.style.display = 'none';
                    }
                    if (!this.pdfViewer.enableNavigationToolbar && ((Browser.isDevice && this.pdfViewer.enableDesktopMode) || (!Browser.isDevice))) {
                        this.navigationPane.sideBarToolbar.style.display = 'none';
                        this.navigationPane.sideBarToolbarSplitter.style.display = 'none';
                        if (this.navigationPane.isBookmarkOpen || this.navigationPane.isThumbnailOpen) {
                            this.navigationPane.updateViewerContainerOnClose();
                        }
                    }
                }
            }
            if (toolbarDiv) {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            } else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            let viewerWidth: number = this.pdfViewer.element.clientWidth;
            if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                viewerWidth = viewerWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0) -
                    (this.navigationPane.commentPanelContainer ? this.navigationPane.getViewerContainerRight() : 0);
            }
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(this.mobileScrollerContainer.style.width)) + 'px';
                this.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(this.mobilePageNoContainer.style.width) / 2) + 'px';
                this.mobilePageNoContainer.style.top = (this.pdfViewer.element.clientHeight / 2) + 'px';
                this.mobilePageNoContainer.style.display = 'none';
                this.mobilePageNoContainer.appendChild(this.mobilecurrentPageContainer);
                this.mobilePageNoContainer.appendChild(this.mobilenumberContainer);
                this.mobilePageNoContainer.appendChild(this.mobiletotalPageContainer);
                this.viewerContainer.appendChild(this.mobilePageNoContainer);
                this.viewerMainContainer.appendChild(this.mobileScrollerContainer);
                this.mobileScrollerContainer.appendChild(this.mobileSpanContainer);
            }
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container', attrs: { 'tabindex': '0', 'aria-label': 'pdfviewer Page View' } });
            if (this.pdfViewer.enableRtl) {
                this.pageContainer.style.direction = 'ltr';
            }
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            this.createPrintPopup();
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.createGoToPagePopup();
            }
            const waitingPopup: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(waitingPopup);
            createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(waitingPopup);
            if (isBlazor()) {
                this.contextMenuModule = new BlazorContextMenu(this.pdfViewer, this);
                // eslint-disable-next-line
                const spinnerElement: any = document.getElementsByClassName(this.pdfViewer.element.id + '_spinner');
                if (spinnerElement && spinnerElement[0] && (!spinnerElement[0].classList.contains('e-spin-hide'))) {
                    spinnerElement[0].classList.remove('e-spin-show');
                    spinnerElement[0].classList.add('e-spin-hide');
                }
            } else {
                this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            }
            this.contextMenuModule.createContextMenu();
            this.createFileInputElement();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                if (isBlazor())
                {
                    this.pdfViewer._dotnetInstance.invokeMethodAsync('LoadDocumentFromClient', this.pdfViewer.documentPath);   
                } else {
                    this.pdfViewer.load(this.pdfViewer.documentPath, null);
                }
            }
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.initializeCollection();
            }
        }
    }

    private createMobilePageNumberContainer(): void {
        this.mobilePageNoContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilepagenoContainer', className: 'e-pv-mobilepagenoscroll-container' });
        this.mobilecurrentPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilecurrentpageContainer', className: 'e-pv-mobilecurrentpage-container' });
        this.mobilenumberContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiledashedlineContainer', className: 'e-pv-mobiledashedline-container' });
        this.mobiletotalPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiletotalpageContainer', className: 'e-pv-mobiletotalpage-container' });
        this.mobileScrollerContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilescrollContainer', className: 'e-pv-mobilescroll-container' });
        this.mobileSpanContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilespanContainer', className: 'e-pv-mobilespanscroll-container' });
        this.mobileSpanContainer.innerHTML = '1';
        this.mobilecurrentPageContainer.innerHTML = '1';
        this.mobilenumberContainer.innerHTML = '&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;';
        this.mobileScrollerContainer.style.cssFloat = 'right';
        this.mobileScrollerContainer.style.width = '40px';
        this.mobileScrollerContainer.style.height = '32px';
        this.mobileScrollerContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.width = '120px';
        this.mobilePageNoContainer.style.height = '100px';
        this.mobilePageNoContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.position = 'fixed';
        this.mobileScrollerContainer.addEventListener('touchstart', this.mobileScrollContainerDown.bind(this));
        this.mobileScrollerContainer.addEventListener('touchend', this.mobileScrollContainerEnd.bind(this));
        this.mobileScrollerContainer.style.display = 'none';
    }

    /**
     * @private
     * @param  {string} documentData - file name or base64 string.
     * @param {string} password - password of the PDF document.
     * @returns {void}
     */
    public initiatePageRender(documentData: string, password: string): void {
        this.loadedData = documentData;
        this.documentId = this.createGUID();
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = 0;
        }
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        if (this.pdfViewer.downloadFileName) {
            this.downloadFileName = this.pdfViewer.downloadFileName;
        } else {
            this.downloadFileName = this.pdfViewer.fileName;
        }
        const jsonObject: object = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    }
    /**
     * @private
     */
    public initiateLoadDocument(documentId: string, isFileName: boolean, fileName: string): void {
        if (documentId) {
            this.documentId = documentId;
        }
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = 0;
        }
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = isFileName;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        this.setFileName();
        if (this.pdfViewer.fileName === null) {
            if (isFileName && fileName) {
                this.pdfViewer.fileName = fileName;
                this.jsonDocumentId = this.pdfViewer.fileName;
            } else {
                this.pdfViewer.fileName = 'undefined.pdf';
                this.jsonDocumentId = null;
            }
        }
        if (this.pdfViewer.downloadFileName) {
           this.downloadFileName = this.pdfViewer.downloadFileName;
        } else {
           this.downloadFileName = this.pdfViewer.fileName;
        }
    }

    /**
     * @private
     */
    public loadSuccess(documentDetails: any, password?: string): void {
        // eslint-disable-next-line
        let data: any = documentDetails;
        if (data) {
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                } catch (error) {
                    this.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                    data = null;
                }
            }
            if (data) {
                while (typeof data !== 'object') {
                    data = JSON.parse(data);
                    // eslint-disable-next-line
                    if (typeof parseInt(data) === 'number' && !isNaN(parseInt(data))) {
                        // eslint-disable-next-line
                        data = parseInt(data);
                        break;
                    }
                }
                if (data.StatusText && (data.StatusText === 'File Does not Exist')) {
                    this.showLoadingIndicator(false);
                }
                // eslint-disable-next-line
                if (data.uniqueId === this.documentId || (typeof parseInt(data) === 'number' && !isNaN(parseInt(data)))) {
                    this.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.load, data);
                    this.requestSuccess(data, null, password);
                }
            }
        }
    }

    // eslint-disable-next-line
    private mobileScrollContainerDown(event: any) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            // eslint-disable-next-line max-len
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                const pageNumber: number = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    }

    /**
     * @private
     * @param {MouseEvent} e - default mouse event.
     * @returns {PointModel} - retuns the bounds.
     */
    public relativePosition(e: MouseEvent): PointModel {
        // eslint-disable-next-line
        let currentRect: any = this.viewerContainer.getBoundingClientRect();
        const left: number = e.clientX - currentRect.left;
        const top: number = e.clientY - currentRect.top;
        return { x: left, y: top };
    }
    // eslint-disable-next-line
    private setMaximumHeight(element: any): void {
        // eslint-disable-next-line
        let currentRect: any = element.getBoundingClientRect();
        if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) || (currentRect && currentRect.height === 0)) {
            element.style.minHeight = '500px';
        }
        this.updateWidth();
        this.updateHeight();
    }
    // eslint-disable-next-line
    private applyViewerHeight(element: any): void {
        // eslint-disable-next-line
        let currentRect: any = element.getBoundingClientRect();
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && currentRect && currentRect.height === 0) {
            element.style.minHeight = '500px';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateWidth(): void {
        if (this.pdfViewer.width.toString() !== 'auto') {
            // eslint-disable-next-line
            (this.pdfViewer.element as any).style.width = this.pdfViewer.width;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateHeight(): void {
        if (this.pdfViewer.height.toString() !== 'auto') {
            // eslint-disable-next-line
            (this.pdfViewer.element as any).style.height = this.pdfViewer.height;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateViewerContainer(): void {
        const sideBarContentContainer: HTMLElement = this.getElement('_sideBarContentContainer');
        if (sideBarContentContainer && sideBarContentContainer.style.display === 'none') {
            this.navigationPane.updateViewerContainerOnClose();
        } else if (sideBarContentContainer && sideBarContentContainer.style.display === 'block') {
            this.navigationPane.updateViewerContainerOnExpand();
        } else {
            this.updateViewerContainerSize();
        }
        // eslint-disable-next-line
        let toolbarModule: any = this.pdfViewer.toolbarModule;
        if (toolbarModule) {
            if (isBlazor()) {
                if (this.pdfViewer.enableToolbar || this.pdfViewer.enableAnnotationToolbar) {
                    this.pdfViewer._dotnetInstance.invokeMethodAsync('RefreshToolbarItems');
                }
            } else {
                if (this.pdfViewer.enableToolbar) {
                    toolbarModule.toolbar.refreshOverflow();
                }
                if (this.pdfViewer.enableAnnotationToolbar && toolbarModule.annotationToolbarModule) {
                    toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
                }
            }
        }
    }

    private updateViewerContainerSize(): void {
        this.viewerContainer.style.width = this.pdfViewer.element.clientWidth + 'px';
        this.pageContainer.style.width = this.viewerContainer.offsetWidth + 'px';
        this.updateZoomValue();
    }

    // eslint-disable-next-line
    private mobileScrollContainerEnd(event: any) {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
    }

    // eslint-disable-next-line
    private createAjaxRequest(jsonObject: any, documentData: string, password: string): void {
        let proxy: PdfViewerBase = null;
        proxy = this;
        if (this.pdfViewer.serverActionSettings) {
            this.loadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load;
            this.loadRequestHandler.responseType = 'json';
            this.loadRequestHandler.mode = true;
            // eslint-disable-next-line
            jsonObject['action'] = 'Load';
            // eslint-disable-next-line
            jsonObject['elementId'] = this.pdfViewer.element.id;
            this.loadRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            this.loadRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                        } catch (error) {
                            proxy.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                            data = null;
                        }
                    }
                    if (data) {
                        while (typeof data !== 'object') {
                            data = JSON.parse(data);
                            // eslint-disable-next-line
                            if (typeof parseInt(data) === 'number' && !isNaN(parseInt(data))) {
                                // eslint-disable-next-line
                                data = parseInt(data);
                                break;
                            }
                        }
                        // eslint-disable-next-line
                        if (data.uniqueId === proxy.documentId || (typeof parseInt(data) === 'number' && !isNaN(parseInt(data)))) {
                            proxy.pdfViewer.fireAjaxRequestSuccess(this.pdfViewer.serverActionSettings.load, data);
                            proxy.requestSuccess(data, documentData, password);
                        }
                    }
                } else {
                    proxy.showLoadingIndicator(false);
                }
            };
            // eslint-disable-next-line
            this.loadRequestHandler.onFailure = function (result: any) {
                const statusString: string = result.status.toString().split('')[0];
                if (statusString === '4') {
                    proxy.openNotificationPopup('Client error');
                } else {
                    proxy.openNotificationPopup();
                }
                proxy.showLoadingIndicator(false);
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
            // eslint-disable-next-line
            this.loadRequestHandler.onError = function (result: any) {
                proxy.openNotificationPopup();
                proxy.showLoadingIndicator(false);
                // eslint-disable-next-line
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
        }
    }

    /**
     * @private
     * @param {string} errorString - The message to be displayed.
     * @returns {void}
     */
    public openNotificationPopup(errorString?: string): void {
        if (this.pdfViewer.showNotificationDialog) {
            if (errorString === 'Client error') {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Clienterror');
                    promise.then((value: string) => {
                        this.textLayer.createNotificationPopup(value);
                    });
                } else {
                    this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Client error'));
                }
            } else {
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_Servererror');
                    promise.then((value: string) => {
                        this.textLayer.createNotificationPopup(value);
                    });
                } else {
                    this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
                }
            }
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    /**
     * @private
     * @param {string} errorString - The message to be shown.
     * @returns {void}
     */
    public showNotificationPopup(errorString: string): void {
        if (!this.pdfViewer.showNotificationDialog && errorString !== '') {
            this.textLayer.createNotificationPopup(errorString);
            if (this.getElement('_notify')) {
                this.getElement('_notify').classList.add('e-pv-notification-large-content');
            }
        }
    }

    // eslint-disable-next-line
    private requestSuccess(data: any, documentData: string, password: string): void {
        if (data && data.pageCount !== undefined) {
            if (isBlazor() && this.isPassword) {
                this.isPassword = false;
                this.isPasswordAvailable = false;
                this.pdfViewer._dotnetInstance.invokeMethodAsync('ClosePasswordDialog');
            }
            if (password && password != '') {
                this.passwordData = password;
            }
            this.pdfViewer.allowServerDataBinding = false;
            this.pageCount = data.pageCount;
            this.pdfViewer.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.isAnnotationCollectionRemoved = false;
            this.saveDocumentHashData();
            this.saveFormfieldsData(data);
            this.pdfViewer.allowServerDataBinding = true;
            this.pageRender(data);
            // eslint-disable-next-line
            let pageData: any = { pageCount: data.pageCount, pageSizes: data.pageSizes };
            window.sessionStorage.setItem(this.documentId + '_pagedata', JSON.stringify(pageData));
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = '';
                // eslint-disable-next-line
                let toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
                this.mobileScrollerContainer.style.top = (toolbarHeight) + 'px';
            }
            this.restrictionList = data.RestrictionSummary;
            this.RestrictionEnabled(this.restrictionList, false);
        } else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            if (data === 4) {
                if (!isBlazor()) {                    
                    // 4 is error code for encrypted document.
                    this.renderPasswordPopup(documentData, password);
                }
            } else if (data === 3) {
                if (!isBlazor()) {
                    // 3 is error code for corrupted document.
                    this.renderCorruptPopup();
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateToolbarItems();
            }
        }
        // eslint-disable-next-line
        let annotationModule: any = this.pdfViewer.annotationModule;
        // eslint-disable-next-line max-len
        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            annotationModule.textMarkupAnnotationModule.createAnnotationSelectElement();
        }
    }
    // eslint-disable-next-line
    private RestrictionEnabled(restrictionSummary: any, isEnable: boolean): void {
        if (restrictionSummary) {
            for (let i: number = 0; i < restrictionSummary.length; i++) {
                this.EnableRestriction(restrictionSummary[i], isEnable);
                if (!isBlazor()) {
                    if (this.pdfViewer.toolbarModule) {
                        this.pdfViewer.toolbarModule.DisableToolbarItems(restrictionSummary[i], isEnable);
                    }
                } else {
                    if (this.pdfViewer.toolbarModule) {
                        this.pdfViewer._dotnetInstance.invokeMethodAsync('RestrictToolbarItems', restrictionSummary, isEnable);
                    }
                }
            }
        }
    }
    // eslint-disable-next-line
    private EnableRestriction(restrictionSummary: any, isEnable: boolean): void {
        switch (restrictionSummary) {
            case 'Print':
                this.pdfViewer.enablePrint = isEnable;
                break;
            case 'CopyContent':
                this.pdfViewer.enableTextSelection = isEnable;
                break;
            case 'FillFields':
                this.pdfViewer.enableFormFields = isEnable;
                this.enableFormFieldButton(isEnable);
                break;
            case 'EditAnnotations':
                this.pdfViewer.enableAnnotation = isEnable;
                break;
        }
    }
    // eslint-disable-next-line
    private pageRender(data: any): void {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        const pageIndex: number = 0;
        this.initPageDiv(data);
        this.currentPageNumber = pageIndex + 1;
        this.pdfViewer.currentPageNumber = pageIndex + 1;
        this.previousZoomValue = this.pdfViewer.zoomValue;
        let isZoomMode: boolean = false;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            if (this.pdfViewer.zoomValue && this.pdfViewer.zoomValue > 0) {
                if (this.pdfViewer.zoomValue !== 100) {
                    isZoomMode = true;
                }
                this.isInitialPageMode = true;
                this.pdfViewer.magnification.zoomTo(this.pdfViewer.zoomValue);
            }
            if (this.pdfViewer.zoomMode === 'FitToWidth') {
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToWidth();
            } else if (this.pdfViewer.zoomMode === 'FitToPage') {
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToPage();
            }
            this.documentLoaded = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.documentLoaded = false;
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        // eslint-disable-next-line
        let viewPortWidth: any = 816;
        // eslint-disable-next-line radix
        viewPortWidth = parseInt(viewPortWidth);
        const pageWidth: number = this.pageSize[pageIndex].width;
        if (this.renderedPagesList.indexOf(pageIndex) === -1 && !isZoomMode) {
            this.createRequestForRender(pageIndex);
            let pageNumber: number = pageIndex + 1;
            if (pageNumber < this.pageCount) {
                this.createRequestForRender(pageNumber);
                pageNumber = pageNumber + 1;
            }
            if (this.pageSize[pageNumber]) {
                let pageTop: number = this.getPageTop(pageNumber);
                const viewerHeight: number = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[pageNumber]) {
                        this.renderPageElement(pageNumber);
                        this.createRequestForRender(pageNumber);
                        pageTop = this.getPageTop(pageNumber);
                        pageNumber = pageNumber + 1;
                    } else {
                        break;
                    }
                }
            }
        }
        this.showLoadingIndicator(false);
        if (!isBlazor()) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.uploadedDocumentName = null;
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
                this.pdfViewer.toolbarModule.updateToolbarItems();
                if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                    this.pdfViewer.toolbar.annotationToolbarModule.enableAnnotationAddTools(true);
                }
                // eslint-disable-next-line max-len
                this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
    }

    private renderPasswordPopup(documentData: string, password: string): void {
        if (!isBlazor()) {
            if (!this.isPasswordAvailable) {
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.isPasswordAvailable = true;
                this.createPasswordPopup();
                this.pdfViewer.fireDocumentLoadFailed(true, null);
                this.passwordPopup.show();
            } else {
                this.pdfViewer.fireDocumentLoadFailed(true, password);
                this.promptElement.classList.add('e-pv-password-error');
                this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Invalid Password');
                this.promptElement.focus();
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.passwordPopup.show();
            }
        } else {
            // eslint-disable-next-line
            let promptElement: any = document.getElementById(this.pdfViewer.element.id + '_prompt');
            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_EnterPassword');
            promise.then((value: string) => {
                promptElement.textContent = value;
            });
            // eslint-disable-next-line
            let passwordInput: any = document.querySelector('#' + this.pdfViewer.element.id + '_password_input');
            passwordInput.addEventListener('keyup', () => {
                if ((passwordInput as HTMLInputElement).value === '') {
                    this.passwordDialogReset();
                }
            });
            passwordInput.addEventListener('focus', () => {
                passwordInput.parentElement.classList.add('e-input-focus');
            });
            passwordInput.addEventListener('blur', () => {
                passwordInput.parentElement.classList.remove('e-input-focus');
            });
            if (!this.isPasswordAvailable) {
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
                this.isPasswordAvailable = true;
                this.pdfViewer.fireDocumentLoadFailed(true, null);
            } else {
                this.pdfViewer.fireDocumentLoadFailed(true, password);
                promptElement.classList.add('e-pv-password-error');
                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_InvalidPassword');
                promise.then((value: string) => {
                    promptElement.textContent = value;
                });
                promptElement.focus();
                if (this.isFileName) {
                    this.document = documentData;
                } else {
                    this.document = 'data:application/pdf;base64,' + documentData;
                }
            }
            this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenPasswordDialog');
        }
    }

    private renderCorruptPopup(): void {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.documentId = null;
        if (this.pdfViewer.showNotificationDialog) {
            if (!isBlazor()) {
                this.createCorruptedPopup();
                this.corruptPopup.show();
            } else {
                this.pdfViewer._dotnetInstance.invokeMethodAsync('OpenCorruptedDialog');
            }
        }
    }
    private constructJsonObject(documentData: string, password: string): object {
        let jsonObject: object;
        if (password) {
            this.isPasswordAvailable = true;
            this.passwordData = password;
            // eslint-disable-next-line max-len
            jsonObject = { document: documentData, password: password, zoomFactor: "1", isFileName: this.isFileName.toString(), uniqueId: this.documentId };
        } else {
            this.isPasswordAvailable = false;
            this.passwordData = '';
            jsonObject = { document: documentData, zoomFactor: "1", isFileName: this.isFileName.toString(), uniqueId: this.documentId };
        }
        return jsonObject;
    }
    private checkDocumentData(documentData: string): string {
        let base64String: string = documentData.split('base64,')[1];
        if (base64String === undefined) {
            this.isFileName = true;
            this.jsonDocumentId = documentData;
            if (this.pdfViewer.fileName === null) {
                // eslint-disable-next-line max-len
                const documentStringArray: string[] = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                this.jsonDocumentId = this.pdfViewer.fileName;
                base64String = documentData;
            }
        } else {
            this.jsonDocumentId = null;
        }
        return base64String;
    }

    private setFileName(): void {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
                this.jsonDocumentId = this.pdfViewer.fileName;
            } else {
                this.pdfViewer.fileName = 'undefined.pdf';
                this.jsonDocumentId = null;
            }
        }
    }
    private saveDocumentInfo(): void {
        window.sessionStorage.setItem('currentDocument', this.documentId);
        window.sessionStorage.setItem('serviceURL', this.pdfViewer.serviceUrl);
        if (this.pdfViewer.serverActionSettings) {
            window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
        }
    }
    private saveDocumentHashData(): void {
        let hashId: string = '';
        if (Browser.isIE || Browser.info.name === 'edge') {
            hashId = encodeURI(this.hashId);
        } else {
            hashId = this.hashId;
        }
        window.sessionStorage.setItem('hashId', hashId);
        if (this.documentLiveCount) {
            window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
        }
    }
    // eslint-disable-next-line
    private saveFormfieldsData(data: any): void {
        this.pdfViewer.isFormFieldDocument = false;
        this.enableFormFieldButton(false);
        if (data && data.PdfRenderedFormFields && data.PdfRenderedFormFields.length > 0) {
            if (this.formfieldvalue) {
                if (this.pdfViewer.formFieldsModule) {
                    this.setItemInSessionStorage(this.formfieldvalue, '_formfields');
                }
                this.formfieldvalue = null;
            } else if (this.pdfViewer.formFieldsModule) {
                for (let i: number = 0; i < data.PdfRenderedFormFields.length; i++) {
                    if (data.PdfRenderedFormFields[i].FieldName == '') {
                        data.PdfRenderedFormFields.splice(i, 1);
                    }
                }
                this.setItemInSessionStorage(data.PdfRenderedFormFields, '_formfields');
            }
            if (this.pdfViewer.enableFormFields && this.pdfViewer.formFieldsModule) {
                this.pdfViewer.formFieldsModule.formFieldCollections();
            }
            if (this.pdfViewer.formFieldCollections.length > 0) {
                this.pdfViewer.isFormFieldDocument = true;
                this.enableFormFieldButton(true);
            }
        }
    }
    /**
     * @param {boolean} isEnable - Enable or disable the toolbar itema.
     * @returns {void}
     * @private
     */
    public enableFormFieldButton(isEnable: boolean): void {
        if (isEnable) {
            this.pdfViewer.isFormFieldDocument = true;
        }
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.submitItem) {
            this.pdfViewer.toolbarModule.toolbar.enableItems(this.pdfViewer.toolbarModule.submitItem.parentElement, isEnable);
        }
    }
    private updateWaitingPopup(pageNumber: number): void {
        if (this.pageSize[pageNumber].top != null) {
            // eslint-disable-next-line max-len
            const pageCurrentRect: ClientRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            const waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild as HTMLElement;
            if (pageCurrentRect.top < 0) {
                if (this.toolbarHeight + (this.viewerContainer.clientHeight / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                    waitingPopup.style.top = ((this.viewerContainer.clientHeight / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                } else {
                    if (this.toolbarHeight + (pageCurrentRect.bottom / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                        waitingPopup.style.top = ((pageCurrentRect.bottom / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                    }
                }
            } else {
                waitingPopup.style.top = this.viewerContainer.clientHeight / 2 + 'px';
            }
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = (this.viewerContainer.clientWidth / 2) + (this.viewerContainer.scrollLeft) + 'px';
            } else if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = this.viewerContainer.clientWidth / 2 + 'px';
            } else {
                waitingPopup.style.left = pageCurrentRect.width / 2 + 'px';
            }
        }
    }

    /**
     * @private
     * @returns {number} - returned the page value.
     */
     public getActivePage(isPageNumber ?: boolean): number {
        if (this.activeElements && !isNullOrUndefined(this.activeElements.activePageID)) {
            if (isPageNumber) {
                return this.activeElements.activePageID + 1;
            } else {
                return this.activeElements.activePageID;
            }
        } else {
            if (isPageNumber) {
                return this.currentPageNumber;
            } else {
                return this.currentPageNumber - 1;
            }
        }
    }

    private createWaitingPopup(pageNumber: number): void {
        // eslint-disable-next-line max-len
        const waitingPopup: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (waitingPopup) {
            createSpinner({ target: waitingPopup });
            this.setLoaderProperties(waitingPopup);
        }
    }

    private showLoadingIndicator(isShow: boolean): void {
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup) {
            if (isShow) {
                waitingPopup.style.display = 'block';
                showSpinner(waitingPopup);
            } else {
                waitingPopup.style.display = 'none';
                hideSpinner(waitingPopup);
            }
        }
    }

    private showPageLoadingIndicator(pageIndex: number, isShow: boolean): void {
        const waitingPopup: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
        if (waitingPopup != null) {
            if (isShow) {
                showSpinner(waitingPopup);
            } else {
                hideSpinner(waitingPopup);
            }
            this.updateWaitingPopup(pageIndex);
        }
    }
    /**
     * @param {boolean} isShow - Show or hide print loading indicator.
     * @returns {void}
     * @private
     */
    public showPrintLoadingIndicator(isShow: boolean): void {
        const printWaitingPopup: HTMLElement = this.getElement('_printLoadingIndicator');
        if (printWaitingPopup != null) {
            if (isShow) {
                this.printMainContainer.style.display = 'block';
                showSpinner(printWaitingPopup);
            } else {
                this.printMainContainer.style.display = 'none';
                hideSpinner(printWaitingPopup);
            }
        }
    }

    private setLoaderProperties(element: HTMLElement): void {
        const spinnerElement: HTMLElement = (element.firstChild.firstChild.firstChild as HTMLElement);
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
    }
    /**
     * @param {number} pageNumber - Specify the pageNumber.
     * @returns {void}
     * @private
     */
    public updateScrollTop(pageNumber: number): void {
        // eslint-disable-next-line
        if (this.pageSize[pageNumber] != null) {
            this.renderElementsVirtualScroll(pageNumber);
            this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
            setTimeout(
                () => {
                    const currentPageNumber: number = pageNumber + 1;
                    if (currentPageNumber !== this.currentPageNumber) {
                        this.pdfViewer.currentPageNumber = currentPageNumber;
                        this.currentPageNumber = currentPageNumber;
                        if (this.pdfViewer.toolbarModule) {
                            this.pdfViewer.toolbarModule.updateCurrentPage(currentPageNumber);
                        }
                    }
                },
            100);
        }
    }
    /**
     * @private
     * @returns {number} - Returns the zoom factor value.
     */
    public getZoomFactor(): number {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.zoomFactor;
        } else {
            // default value
            return 1;
        }
    }
    /**
     * @private
     * @returns {boolean} - Returns whether the pinch zoom is performed or not.
     */
    public getPinchZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchZoomed;
        } else {
            // default value
            return false;
        }
    }
    /**
     * @private
     * @returns {boolean} -Returns whether the zoom is performed or not.
     */
    public getMagnified(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isMagnified;
        } else {
            // default value
            return false;
        }
    }

    private getPinchScrolled(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchScrolled;
        } else {
            // default value
            return false;
        }
    }

    private getPagesPinchZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagePinchZoomed;
        } else {
            // default value
            return false;
        }
    }

    private getPagesZoomed(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagesZoomed;
        } else {
            // default value
            return false;
        }
    }

    private getRerenderCanvasCreated(): boolean {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isRerenderCanvasCreated;
        } else {
            // default value
            return false;
        }
    }
    /**
     * @private
     * @returns {string} - retrun the docuumentid.
     */
    public getDocumentId(): string {
        return this.documentId;
    }
    /**
     * @private
     * @returns {void}
     */
    public download(): void {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    }

    /**
     * @private
     * @returns {promise<Blob>} - Returns the blob object.
     */
    public saveAsBlob(): Promise<Blob> {
        if (this.pageCount > 0) {
            return new Promise((resolve: Function, reject: Function) => {
                this.saveAsBlobRequest().then((value: Blob) => {
                    resolve(value);
                });
            });
        }
        return null;
    }

    private saveAsBlobRequest(): Promise<Blob> {
        let proxy: PdfViewerBase = null;
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // eslint-disable-next-line
            let jsonObject: any = proxy.constructJsonDownload();
            this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
            this.dowonloadRequestHandler.responseType = 'text';
            this.dowonloadRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            this.dowonloadRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                        data = null;
                    }
                    if (data) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                        const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                        resolve(blobUrl);
                    }
                }
            };
            // eslint-disable-next-line
            this.dowonloadRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
            // eslint-disable-next-line
            this.dowonloadRequestHandler.onError = function (result: any) {
                proxy.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
        });
        return promise;
    }

    /**
     * @param {boolean} isTriggerEvent - check to trigger the event.
     * @returns {void}
     * @private
     */
    public clear(isTriggerEvent: boolean): void {
        let proxy: PdfViewerBase = this;
        let pdfViewer: PdfViewer = proxy.pdfViewer;
        let printModule: Print = pdfViewer.printModule;
        let textSearchModule: TextSearch =  pdfViewer.textSearchModule;
        let bookmarkViewModule: BookmarkView = pdfViewer.bookmarkViewModule;
        let thumbnailViewModule: ThumbnailView = pdfViewer.thumbnailView;
        let annotationModule: Annotation = pdfViewer.annotation;
        let magnificationModule: Magnification = pdfViewer.magnificationModule;
        let textSelectionModule: TextSelection = pdfViewer.textSelectionModule;
        let formFieldsModule: FormFields = pdfViewer.formFieldsModule;
        let signatureModule: Signature = proxy.signatureModule;
        proxy.isPasswordAvailable = false;
        proxy.isDocumentLoaded = false;
        proxy.isInitialLoaded = false;
        proxy.isImportAction = false;
        proxy.annotationPageList = [];
        proxy.annotationComments = null;
        pdfViewer.annotationCollection = [];
        pdfViewer.signatureCollection = [];
        pdfViewer.formFieldCollection = [];
        proxy.isAnnotationCollectionRemoved = false;
        proxy.documentAnnotationCollections = null;
        proxy.isDrawnCompletely = false;
        proxy.annotationRenderredList = [];
        proxy.isImportAction = false;
        proxy.isImportedAnnotation = false;
        proxy.importedAnnotation = [];
        proxy.isStorageExceed = false;
        proxy.annotationStorage = {};
        proxy.formFieldStorage = {};
        proxy.downloadCollections = {};
        proxy.annotationEvent = null;
        proxy.highestWidth = 0;
        proxy.highestHeight = 0;
        proxy.requestLists = [];
        proxy.tilerequestLists = [];
        proxy.isToolbarInkClicked = false;
        pdfViewer.formFieldCollections = [];
        proxy.passwordData = '';
        proxy.isFocusField = false;
        proxy.focusField = [];
        proxy.updateDocumentEditedProperty(false);
        if (pdfViewer.formDesignerModule) {
            pdfViewer.formDesignerModule.formFieldIndex = 0;
            if (proxy.activeElements) {
                pdfViewer.clearSelection(proxy.activeElements.activePageID);
            }
            pdfViewer.zIndexTable = [];
        }
        proxy.initiateTextSelectMode();
        proxy.RestrictionEnabled(proxy.restrictionList, true);
        proxy.restrictionList = null;
        if (!Browser.isDevice || pdfViewer.enableDesktopMode) {
            if (proxy.navigationPane.sideBarToolbar) {
                proxy.navigationPane.clear();
            }
        }
        if (!isBlazor() && Browser.isDevice || !pdfViewer.enableDesktopMode) {
            proxy.navigationPane.clear();
        }
        if (thumbnailViewModule) {
            thumbnailViewModule.clear();
        }
        if (bookmarkViewModule) {
            bookmarkViewModule.clear();
        }
        if (magnificationModule) {
            magnificationModule.isMagnified = false;
            magnificationModule.clearIntervalTimer();
        }
        if (textSelectionModule) {
            textSelectionModule.clearTextSelection();
        }
        if (textSearchModule) {
            textSearchModule.resetTextSearch();
        }
        if (annotationModule) {
            annotationModule.clear();
            annotationModule.initializeCollection();
        }
        if (formFieldsModule) {
            formFieldsModule.readOnlyCollection = [];
            formFieldsModule.signatureFieldCollection = [];
            formFieldsModule.currentTarget = null;
        }
        if (signatureModule) {
            signatureModule.signaturecollection = [];
            signatureModule.outputcollection = [];
        }
        if (proxy.pageSize) {
            proxy.pageSize = [];
        }
        if (proxy.renderedPagesList) {
            proxy.renderedPagesList = [];
        }
        if (proxy.pageContainer) {
            while (proxy.pageContainer.hasChildNodes()) {
                proxy.pageContainer.removeChild(proxy.pageContainer.lastChild);
            }
        }
        if (proxy.pageCount > 0) {
            proxy.unloadDocument(proxy);
            // eslint-disable-next-line
            proxy.textLayer.characterBound = new Array();
            proxy.loadRequestHandler && proxy.loadRequestHandler.clear();
            proxy.virtualLoadRequestHandler && proxy.virtualLoadRequestHandler.clear();
            proxy.pageRequestHandler && proxy.pageRequestHandler.clear();
            proxy.dowonloadRequestHandler && proxy.dowonloadRequestHandler.clear();
            proxy.importAnnotationRequestHandler && proxy.importAnnotationRequestHandler.clear();
            proxy.exportAnnotationRequestHandler && proxy.exportAnnotationRequestHandler.clear();
            proxy.importFormFieldsRequestHandler && proxy.importFormFieldsRequestHandler.clear();
            proxy.exportFormFieldsRequestHandler && proxy.exportFormFieldsRequestHandler.clear();
            if (printModule && printModule.printRequestHandler) {
                printModule.printRequestHandler.clear();
            }
        }
        proxy.windowSessionStorageClear();
        if (proxy.pinchZoomStorage) {
            proxy.pinchZoomStorage = [];
        }
        if ((proxy.previousZoomValue || proxy.previousZoomValue === 0) && proxy.previousZoomValue !== pdfViewer.zoomValue) {
            pdfViewer.zoomValue = proxy.previousZoomValue;
        }
        if (isTriggerEvent && proxy.pageCount > 0) {
            pdfViewer.fireDocumentUnload(this.pdfViewer.fileName);            
        }
        this.pdfViewer.fileName = null;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode ? this.pageContainer.parentNode.removeChild(this.pageContainer) : null;
        this.viewerContainer.parentNode ? this.viewerContainer.parentNode.removeChild(this.viewerContainer) : null;
        if (this.contextMenuModule) {
            let contextMenuElement : any = this.contextMenuModule.contextMenuElement;
            contextMenuElement && contextMenuElement.ej2_instances && contextMenuElement.ej2_instances.length > 0 ? this.contextMenuModule.destroy() : null;
        }
        if (this.pdfViewer.toolbarModule) {
            this.navigationPane.destroy();
        }
        let measureElement: HTMLElement = document.getElementById('measureElement');
        if (measureElement) {
            measureElement = undefined;
        }
    }
    /**
     * @param {PdfViewerBase} proxy - PdfviewerBase class.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    public unloadDocument(proxy: PdfViewerBase): void {
        let documentId: string = '';
        if (Browser.isIE || Browser.info.name === 'edge') {
            documentId = decodeURI(window.sessionStorage.getItem('hashId'));
        } else {
            documentId = window.sessionStorage.getItem('hashId');
        }
        const documentLiveCount: string = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            // eslint-disable-next-line max-len
            const jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: proxy.pdfViewer.element.id };
            const actionName: string = window.sessionStorage.getItem('unload');
            if (window.sessionStorage.getItem('serviceURL') && window.sessionStorage.getItem('serviceURL') !== 'undefined') {
                try {
                    // eslint-disable-next-line
                    let browserSupportsKeepalive: any = 'keepalive' in new Request('');
                    if (browserSupportsKeepalive) {
                        // eslint-disable-next-line
                        let headerValue: any = this.setUnloadRequestHeaders();
                        const credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                        fetch(window.sessionStorage.getItem('serviceURL') + '/' + actionName, {
                            method: 'POST',
                            credentials: credentialsData,
                            headers: headerValue,
                            body: JSON.stringify(jsonObject)
                        });
                    }
                } catch (error) {
                    this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
                    this.unloadRequestHandler.send(jsonObject);
                }
            } else if (isBlazor()) {
                this.clearCache(actionName, jsonObject, proxy);              
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.zoomFactor = 1;
        }
        this.formFieldCollection = [];
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
        if (this.documentId) {
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_formDesigner');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        }
    }

    private clearCache(actionName: string, jsonObject: any, proxy: PdfViewerBase): void {
        this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.unloadRequestHandler.url = window.sessionStorage.getItem('serviceURL') + '/' + actionName;
        this.unloadRequestHandler.mode = false;
        this.unloadRequestHandler.responseType = null;
        this.unloadRequestHandler.send(jsonObject);
        // eslint-disable-next-line
        this.unloadRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    if (data.indexOf('Document') === -1) {
                        proxy.onControlError(500, data, actionName);
                        data = null;
                    }
                }
                if (data) {
                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.unload, data);
                }
            }
        };
        // eslint-disable-next-line
        this.unloadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
        };
        // eslint-disable-next-line
        this.unloadRequestHandler.onError = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, actionName);
        };
    }

    // eslint-disable-next-line
    private setUnloadRequestHeaders(): any {
        // eslint-disable-next-line
        let myHeaders: any = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=UTF-8');
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // eslint-disable-next-line max-len
            myHeaders.append(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
        return myHeaders;
    }

    private windowSessionStorageClear(): void {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        for (let i: number = 0; i < this.sessionStorage.length; i++) {
            window.sessionStorage.removeItem(this.sessionStorage[i]);
        }
    }

    private updateCommentPanel(): void {
        // eslint-disable-next-line
        let moreOptionsButton: any = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
        for (let i: number = 0; i < moreOptionsButton.length; i++) {
            moreOptionsButton[i].style.visibility = 'hidden';
        }
        // eslint-disable-next-line
        let commentTextBox: any = document.querySelectorAll('.e-pv-new-comments-div');
        for (let j: number = 0; j < commentTextBox.length; j++) {
            commentTextBox[j].style.display = 'none';
        }
        // eslint-disable-next-line
        let commentContainer: any = document.querySelectorAll('.e-pv-comments-border');
        for (let j: number = 0; j < commentContainer.length; j++) {
            commentContainer[j].classList.remove('e-pv-comments-border');
        }
        // eslint-disable-next-line
        let editableElement: any = document.querySelectorAll('.e-editable-inline');
        for (let j: number = 0; j < editableElement.length; j++) {
            editableElement[j].style.display = 'none';
        }
        // eslint-disable-next-line
        let commentSelect: any = document.querySelectorAll('.e-pv-comments-select');
        for (let z: number = 0; z < commentSelect.length; z++) {
            commentSelect[z].classList.remove('e-pv-comments-select');
        }
        // eslint-disable-next-line
        let commentsDiv: any = document.querySelectorAll('.e-pv-comments-div');
        for (let j: number = 0; j < commentsDiv.length; j++) {
            commentsDiv[j].style.minHeight = 60 + 'px';
        }
    }
    /**
     * @param {boolean} isMouseDown - check whether the mouse down is triggered.
     * @returns {void}
     * @private
     */
    public focusViewerContainer(isMouseDown?: boolean): void {
        const scrollX: number = window.scrollX;
        const scrollY: number = window.scrollY;
        // eslint-disable-next-line
        let parentNode: any = this.getScrollParent(this.viewerContainer);
        let scrollNodeX: number = 0;
        let scrollNodeY: number = 0;
        if (parentNode !== null) {
            scrollNodeX = parentNode.scrollLeft;
            scrollNodeY = parentNode.scrollTop;
        }
        this.viewerContainer.focus();
        if (this.currentPageNumber > 0) {
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            this.updateCommentPanel();
        }
        // eslint-disable-next-line max-len
        if ((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1) && parentNode !== null) {
            parentNode.scrollLeft = scrollNodeX;
            parentNode.scrollTop = scrollNodeY;
        } else if (parentNode !== null) {
            parentNode.scrollTo(scrollNodeX, scrollNodeY);
        }
        window.scrollTo(scrollX, scrollY);
    }
    // eslint-disable-next-line
    private getScrollParent(node: any): any {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        const style: CSSStyleDeclaration = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        } else {
            return this.getScrollParent(node.parentNode);
        }
    }
    private createCorruptedPopup(): void {
        // eslint-disable-next-line max-len
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // eslint-disable-next-line max-len
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
            // eslint-disable-next-line max-len
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: (): void => {
                this.corruptPopup.destroy();
                this.getElement('_corrupted_popup').remove();
                this.corruptPopup = null;
                const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            // eslint-disable-next-line max-len
            this.corruptPopup.content = '<div id="templatertl" class="e-pv-notification-icon-rtl"> <div class="e-pv-corrupted-popup-content-rtl" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
            this.corruptPopup.enableRtl = true;
        } else {
            // eslint-disable-next-line max-len
            this.corruptPopup.content = '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
        }
        this.corruptPopup.appendTo(popupElement);
    }

    /**
     * @private
     * @returns {void}
     */
    public hideLoadingIndicator(): void {
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private closeCorruptPopup(): void {
        this.corruptPopup.hide();
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private createPrintPopup(): void {
        const element: HTMLElement = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container'
        });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        const printWaitingPopup: HTMLElement = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container'
        });
        this.printMainContainer.appendChild(printWaitingPopup);
        createSpinner({ target: printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(printWaitingPopup);
    }
    private createGoToPagePopup(): void {
        // eslint-disable-next-line max-len
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        const inputContainer: HTMLElement = createElement('span', { className: 'e-pv-text-input' });
        // eslint-disable-next-line max-len
        this.goToPageInput = createElement('input', { id: this.pdfViewer.element.id + '_page_input', className: 'e-input' });
        (this.goToPageInput as HTMLInputElement).type = 'text';
        (this.goToPageInput as HTMLInputElement).style.maxWidth = '80%';
        this.pageNoContainer = createElement('span', { className: '.e-pv-number-ofpages' });
        inputContainer.appendChild(this.goToPageInput);
        inputContainer.appendChild(this.pageNoContainer);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.goToPagePopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('GoToPage'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.GoToPageCancelClick.bind(this)
                },
                // eslint-disable-next-line max-len
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), disabled: true, cssClass: 'e-pv-gotopage-apply-btn', isPrimary: true },
                    click: this.GoToPageApplyClick.bind(this)
                }
            ], close: this.closeGoToPagePopUp.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.goToPagePopup.enableRtl = true;
        }
        this.goToPagePopup.appendTo(popupElement);
        if (!isBlazor()) {
            const goToPageTextBox: NumericTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
            goToPageTextBox.appendTo(this.goToPageInput);
        }
        this.goToPageInput.addEventListener('keyup', () => {
            // eslint-disable-next-line
            let inputValue: any = (this.goToPageInput as HTMLInputElement).value;
            if (inputValue !== '' && parseFloat(inputValue) > 0 && (this.pdfViewer.pageCount + 1) > parseFloat(inputValue)) {
                this.EnableApplyButton();
            } else {
                this.DisableApplyButton();
            }
        });
    }
    private closeGoToPagePopUp(): void {
        (this.goToPageInput as HTMLInputElement).value = '';
        this.DisableApplyButton();
    }

    private EnableApplyButton(): void {
        // eslint-disable-next-line
        let popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    }
    private DisableApplyButton(): void {
        // eslint-disable-next-line
        let popupElements: any = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    }
    private GoToPageCancelClick(): void {
        this.goToPagePopup.hide();
    }
    private GoToPageApplyClick(): void {
        this.goToPagePopup.hide();
        // eslint-disable-next-line
        let pageNumber: any = (this.goToPageInput as HTMLInputElement).value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    }
    /**
     * @private
     * @returns {void}
     */
    public updateMobileScrollerPosition(): void {
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.mobileScrollerContainer) {
            // eslint-disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // eslint-disable-next-line
            let differenceRatio: any = (this.viewerContainer.scrollTop) / ratio;
            // eslint-disable-next-line
            let toolbarHeight: any = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
            this.mobileScrollerContainer.style.top = (toolbarHeight + differenceRatio) + 'px';
        }
    }
    private createPasswordPopup(): void {
        // eslint-disable-next-line max-len
        const popupElement: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        const inputContainer: HTMLElement = createElement('span', { className: 'e-input-group e-pv-password-input' });
        // eslint-disable-next-line max-len
        this.passwordInput = createElement('input', { id: this.pdfViewer.element.id + '_password_input', className: 'e-input' });
        (this.passwordInput as HTMLInputElement).type = 'password';
        (this.passwordInput as HTMLInputElement).name = 'Required';
        inputContainer.appendChild(this.passwordInput);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.passwordPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: (): void => {
                this.passwordPopup.destroy();
                this.getElement('_password_popup').remove();
                this.passwordPopup = null;
                const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
            this.passwordPopup.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ];
        } else {
            this.passwordPopup.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.passwordPopup.enableRtl = true;
        }
        this.passwordPopup.appendTo(popupElement);
        this.passwordInput.addEventListener('keyup', () => {
            if ((this.passwordInput as HTMLInputElement).value === '') {
                this.passwordDialogReset();
            }
        });
        this.passwordInput.addEventListener('focus', () => {
            this.passwordInput.parentElement.classList.add('e-input-focus');
        });
        this.passwordInput.addEventListener('blur', () => {
            this.passwordInput.parentElement.classList.remove('e-input-focus');
        });
    }

    // eslint-disable-next-line
    private passwordCancel(args: any): void {
        if (args.isInteraction) {
            this.clear(false);
            this.passwordDialogReset();
            (this.passwordInput as HTMLInputElement).value = '';
        }
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private passwordCancelClick(): void {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        const waitingPopup: HTMLElement = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    }

    private passwordDialogReset(): void {
        if (!isBlazor()) {
            if (this.promptElement) {
                this.promptElement.classList.remove('e-pv-password-error');
                this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
                (this.passwordInput as HTMLInputElement).value = '';
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public applyPassword(): void {
        if (!isBlazor()) {
           const password: string = (this.passwordInput as HTMLInputElement).value;
           if (password !== '') {
                this.pdfViewer.load(this.document, password);
            }
        }
        this.focusViewerContainer();
    }

    private createFileInputElement(): void {
        if (Browser.isDevice || !this.pdfViewer.enableDesktopMode) {
            // eslint-disable-next-line max-len
            if (this.pdfViewer.enableAnnotationToolbar && this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.createCustomStampElement();
            }
            if (this.signatureModule) {
                this.signatureModule.createSignatureFileElement();
            }
        }
    }

    private wireEvents(): void {
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.addEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.addEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.addEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.addEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.addEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.addEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.addEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.addEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dblclick', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dragstart', this.viewerContainerOnDragStart);
        this.pdfViewer.element.addEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        this.unload = () => this.unloadDocument(this);
        window.addEventListener('unload', this.unload);
        window.addEventListener('beforeunload', this.clearSessionStorage);
        window.addEventListener('resize', this.onWindowResize);
        // eslint-disable-next-line max-len
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.addEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.addEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.addEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.addEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        } else {
            this.viewerContainer.addEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.addEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }

    private unWireEvents(): void {
        this.viewerContainer.removeEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.removeEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.removeEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.removeEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.removeEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.removeEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.removeEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.removeEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.removeEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.removeEventListener('dragstart', this.viewerContainerOnDragStart);
        this.viewerContainer.removeEventListener('contextmenu', this.viewerContainerOnContextMenuClick);
        this.pdfViewer.element.removeEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        window.removeEventListener('unload', this.unload);
        window.removeEventListener('resize', this.onWindowResize);
        // eslint-disable-next-line max-len
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.removeEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.removeEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.removeEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.removeEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        } else {
            this.viewerContainer.removeEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.removeEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    }
    /**
     * @returns {void}
     */
    private clearSessionStorage = (): void => {
        let documentId: string = '';
        if (Browser.isIE || Browser.info.name === 'edge') {
            documentId = decodeURI(window.sessionStorage.getItem('hashId'));
        } else {
            documentId = window.sessionStorage.getItem('hashId');
        }
        const documentLiveCount: string = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            // eslint-disable-next-line max-len
            const jsonObject: object = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: this.pdfViewer.element.id };
            const actionName: string = window.sessionStorage.getItem('unload');
            const serviceUrl: string = window.sessionStorage.getItem('serviceURL');
            if (serviceUrl && serviceUrl !== 'undefined') {
                // eslint-disable-next-line
                let browserSupportsKeepalive: any = 'keepalive' in new Request('');
                if (browserSupportsKeepalive) {
                    // eslint-disable-next-line
                    let headerValue: any = this.setUnloadRequestHeaders();
                    const credentialsData: RequestCredentials = this.pdfViewer.ajaxRequestSettings.withCredentials ? 'include' : 'omit';
                    fetch(serviceUrl + '/' + actionName, {
                        method: 'POST',
                        credentials: credentialsData,
                        headers: headerValue,
                        body: JSON.stringify(jsonObject)
                    });
                }
            } else if (isBlazor()) {
                this.clearCache(actionName,jsonObject,this);
            }
        }
        window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
        window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
        window.sessionStorage.removeItem(this.documentId + '_formfields');
        window.sessionStorage.removeItem(this.documentId + '_formDesigner');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
        window.sessionStorage.removeItem(this.documentId + '_pagedata');
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
    };
    /**
     * @private
     * @param {MouseEvent} event - Mouse event.
     * @returns {void}
     */
    public onWindowResize = (event?: MouseEvent): void => {
        let proxy: PdfViewerBase = null;
        proxy = this;
        if (this.pdfViewer.enableRtl) {
            // eslint-disable-next-line max-len
            proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // eslint-disable-next-line max-len
            proxy.viewerContainer.style.left = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        } else {
            // eslint-disable-next-line max-len
            proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
            // eslint-disable-next-line max-len
            proxy.viewerContainer.style.right = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
        }
        // eslint-disable-next-line
        let viewerElementWidth: any = (proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.style.width);
        // eslint-disable-next-line
        let viewerWidth: any = (viewerElementWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) - (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.getViewerContainerRight() : 0));
        proxy.viewerContainer.style.width = viewerWidth + 'px';
        if (proxy.pdfViewer.toolbarModule) {
            // eslint-disable-next-line
            let toolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-toolbar') : proxy.getElement('_toolbarContainer');
            let toolbarHeight: number = 0;
            let formDesignerToolbarHeight: number = 0;
            if (toolbarContainer) {
                toolbarHeight = toolbarContainer.getBoundingClientRect().height;
            }
            if (proxy.isAnnotationToolbarHidden() || (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                if (toolbarHeight === 0) {
                    if (this.navigationPane.isNavigationToolbarVisible) {
                        // eslint-disable-next-line
                        const navigationToolbar: any = proxy.getElement('_navigationToolbar');
                        toolbarHeight = navigationToolbar.getBoundingClientRect().height;
                    }
                }
                if (!proxy.isFormDesignerToolbarHidded()) {
                    const formDesignerToolbar: any = proxy.getElement('_formdesigner_toolbar');
                    formDesignerToolbarHeight = formDesignerToolbar ?  formDesignerToolbar.getBoundingClientRect().height : 0;
                }
                // eslint-disable-next-line max-len
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + formDesignerToolbarHeight);
            } else {
                // eslint-disable-next-line
                let annotationToolbarContainer: any = isBlazor() ? proxy.pdfViewer.element.querySelector('.e-pv-annotation-toolbar') : proxy.getElement('_annotation_toolbar');
                let annotationToolbarHeight: number = 0;
                if (annotationToolbarContainer) {
                    annotationToolbarHeight = annotationToolbarContainer.getBoundingClientRect().height;
                }
                // eslint-disable-next-line max-len
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
            }
        } else {
            proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
        }
        if (proxy.pdfViewer.bookmarkViewModule && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            const bookmarkContainer: HTMLElement = proxy.getElement('_bookmarks_container');
            if (bookmarkContainer) {
                bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
        }
        if (proxy.viewerContainer.style.height === '0px') {
            if (proxy.pdfViewer.height.toString() === 'auto') {
                proxy.pdfViewer.height = 500;
                proxy.viewerContainer.style.height = proxy.pdfViewer.height + 'px';
            } else {
                proxy.viewerContainer.style.height = proxy.pdfViewer.element.style.height;
            }
        }
        if (proxy.viewerContainer.style.width === '0px') {
            if (proxy.pdfViewer.width.toString() === 'auto') {
                proxy.pdfViewer.width = 500;
                proxy.viewerContainer.style.width = proxy.pdfViewer.width + 'px';
            } else {
                proxy.viewerContainer.style.width = proxy.pdfViewer.element.style.width;
            }
        }
        proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
        if (proxy.viewerContainer.clientWidth === 0) {
            proxy.pageContainer.style.width = proxy.pdfViewer.element.style.width;
        }
        if (!isBlazor()) {
            if (proxy.pdfViewer.toolbarModule) {
                // eslint-disable-next-line max-len
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
        }
        if (this.pdfViewer.enableToolbar && this.pdfViewer.thumbnailViewModule) {
            proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
        }
        if (proxy.pdfViewer.textSearchModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
        }
        if (viewerWidth !== 0) {
            if (!proxy.navigationPane.isBookmarkListOpen) {
                proxy.updateZoomValue();
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            proxy.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(proxy.mobileScrollerContainer.style.width)) + 'px';
            proxy.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(proxy.mobilePageNoContainer.style.width) / 2) + 'px';
            proxy.mobilePageNoContainer.style.top = (proxy.pdfViewer.element.clientHeight / 2) + 'px';
            proxy.updateMobileScrollerPosition();
        } else {
            proxy.navigationPane.setResizeIconTop();
            proxy.navigationPane.setCommentPanelResizeIconTop();
            if (event && event.type === 'resize') {
                proxy.signatureModule.updateCanvasSize();
            }
        }
        if (proxy.navigationPane.sideBarToolbar) {
            proxy.navigationPane.sideBarToolbar.style.height = proxy.viewerContainer.style.height;
        }
    };
    /**
     * @private
     * @returns {void}
     */
    public updateZoomValue(): void {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            } else if (this.pdfViewer.zoomMode !== 'FitToWidth' && this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            } else if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                this.pdfViewer.magnificationModule.fitToPage();
            }
        }
        for (let i: number = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    }
    /**
     * @private
     * @param {any} annotation - The annotation type of any.
     * @returns {void}
     */
    // eslint-disable-next-line
    public updateFreeTextProperties(annotation: any): void {
        if (this.pdfViewer.enableShapeLabel) {
            if (this.pdfViewer.shapeLabelSettings.fillColor) {
                annotation.labelFillColor = this.pdfViewer.shapeLabelSettings.fillColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontColor) {
                annotation.fontColor = this.pdfViewer.shapeLabelSettings.fontColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontSize) {
                annotation.fontSize = this.pdfViewer.shapeLabelSettings.fontSize;
            }
            if (this.pdfViewer.shapeLabelSettings.fontFamily) {
                annotation.fontFamily = this.pdfViewer.shapeLabelSettings.fontFamily;
            }
            if (this.pdfViewer.shapeLabelSettings.opacity) {
                annotation.labelOpacity = this.pdfViewer.shapeLabelSettings.opacity;
            }
            if (this.pdfViewer.shapeLabelSettings.labelContent) {
                annotation.labelContent = this.pdfViewer.shapeLabelSettings.labelContent;
            }
        }
    }
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMousedown = (event: MouseEvent): void => {
        this.isFreeTextContextMenu = false;
        let isUpdate: boolean = false;
        this.isSelection = true;
        if (event.button === 0 && !this.getPopupNoteVisibleStatus() && !this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
            // eslint-disable-next-line
            let target: any = event.target;
            if (event.detail === 1 && target.className !== 'e-pdfviewer-formFields' && target.className !== 'free-text-input') {
                isUpdate = true;
                this.focusViewerContainer(true);
            }
            this.scrollPosition = this.viewerContainer.scrollTop / this.getZoomFactor();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.mouseLeft = event.clientX;
            this.mouseTop = event.clientY;
            // eslint-disable-next-line
            let isIE: boolean = !!(document as any).documentMode;
            if (this.pdfViewer.textSelectionModule && !this.isClickedOnScrollBar(event, true) && !this.isTextSelectionDisabled) {
                if (!isIE && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pdfviewer-ListBox' && target.className !== 'e-pv-formfield-dropdown'
                    && target.className !== 'e-pv-formfield-listbox') {
                    event.preventDefault();
                }
                if (target.className !== 'e-pv-droplet') {
                    this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
        }
        if (this.isClickedOnScrollBar(event, false)) {
            this.isViewerMouseDown = true;
        }
        if (this.isPanMode) {
            this.dragX = event.pageX;
            this.dragY = event.pageY;
            // eslint-disable-next-line max-len
            if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                this.viewerContainer.style.cursor = 'grabbing';
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            this.diagramMouseDown(event);
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            if (!isUpdate) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isEditableElement = false;
                this.updateCommentPanel();
                isUpdate = true;
            }
        }
        if (isBlazor()) {
            this.mouseDownHandler(event);
        }
    };

    /**
     * @private
     * @param {MouseEvent} event - The mouse event.
     * @returns {void}
     */
    // eslint-disable-next-line
    public mouseDownHandler(event: MouseEvent): void {
        let isEnableDelete: boolean = false;
        let isCancel: boolean;
        const hidenItems: string[] = [];
        const disabledItems: string[] = [];
        if (event && event.target) {
            this.mouseDownEvent = event;
            this.contextMenuModule.currentTarget = event.target as HTMLElement;
        }
        if (this.pdfViewer.annotationModule) {
            isEnableDelete = this.pdfViewer.annotationModule.isEnableDelete();
        }
        if (!isEnableDelete) {
            disabledItems.push('DeleteContext');
        }
        if (this.pdfViewer.contextMenuOption === 'None') {
            isCancel = true;
        } else if (this.pdfViewer.textSelectionModule || this.isShapeBasedAnnotationsEnabled()) {
            if (event) {
                const isClickWithinSelectionBounds: boolean = this.isClickWithinSelectionBounds(event);
                // eslint-disable-next-line max-len
                if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
                    this.isFreeTextContextMenu = true;
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && !this.pdfViewer.annotation.freeTextAnnotationModule.isTextSelected) {
                        disabledItems.push('Cut');
                        disabledItems.push('Copy');
                    }
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.selectedText === '') {
                        disabledItems.push('Paste');
                    }
                    hidenItems.push('HighlightContext');
                    hidenItems.push('UnderlineContext');
                    hidenItems.push('StrikethroughContext');
                    hidenItems.push('ScaleRatio');
                    hidenItems.push('Properties');
                    hidenItems.push('Comment');
                    hidenItems.push('DeleteContext');
                } else if (isClickWithinSelectionBounds && this.pdfViewer.textSelectionModule) {
                    // eslint-disable-next-line max-len
                    if ((!(event.target as HTMLElement).classList.contains('e-pv-maintaincontent') && (event.target as HTMLElement).classList.contains('e-pv-text') || (event.target as HTMLElement).classList.contains('e-pv-text-layer'))) {
                        if (this.checkIsNormalText()) {
                            isCancel = true;
                        }
                        // eslint-disable-next-line max-len
                    } else if ((Browser.isIE || Browser.info.name === 'edge') && (event.target as HTMLElement).classList.contains('e-pv-page-container')) {
                        isCancel = true;
                    }
                    hidenItems.push('Cut');
                    hidenItems.push('Paste');
                    hidenItems.push('DeleteContext');
                    hidenItems.push('ScaleRatio');
                    hidenItems.push('Comment');
                    hidenItems.push('Properties');
                    // eslint-disable-next-line max-len
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
                    this.shapeMenuItems(hidenItems, disabledItems, false, true);
                    // eslint-disable-next-line max-len
                } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
                    this.shapeMenuItems(hidenItems, disabledItems, true);
                } else {
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((event.target as HTMLElement).classList.contains('e-pv-text-layer') ||
                        (event.target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        hidenItems.push('Properties');
                        this.shapeMenuItems(hidenItems, disabledItems, false);
                        // eslint-disable-next-line max-len
                    } else if (this.isCalibrateAnnotationModule() && this.pdfViewer.annotationModule.measureAnnotationModule.currentAnnotationMode) {
                        hidenItems.push('HighlightContext');
                        hidenItems.push('UnderlineContext');
                        hidenItems.push('StrikethroughContext');
                        hidenItems.push('Properties');
                        disabledItems.push('Cut');
                        disabledItems.push('Copy');
                        disabledItems.push('Paste');
                        disabledItems.push('DeleteContext');
                        disabledItems.push('Comment');
                        // eslint-disable-next-line max-len
                    } else if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        hidenItems.push('HighlightContext');
                        hidenItems.push('UnderlineContext');
                        hidenItems.push('StrikethroughContext');
                        hidenItems.push('Properties');
                        hidenItems.push('Cut');
                        hidenItems.push('Copy');
                        hidenItems.push('Paste');
                        hidenItems.push('ScaleRatio');
                    } else {
                        isCancel = true;
                    }
                }
            } else if (this.pdfViewer.textSelectionModule && (this.pdfViewer.contextMenuOption === 'MouseUp')) {
                hidenItems.push('Cut');
                hidenItems.push('Paste');
                hidenItems.push('DeleteContext');
                hidenItems.push('ScaleRatio');
                hidenItems.push('Comment');
                hidenItems.push('Properties');
            } else if (this.pdfViewer.selectedItems.annotations.length === 0) {
                hidenItems.push('Cut');
                hidenItems.push('Paste');
                hidenItems.push('DeleteContext');
                hidenItems.push('ScaleRatio');
                hidenItems.push('Properties');
            }
            if (!this.pdfViewer.enableCommentPanel) {
                disabledItems.push('Comment');
            }
        } else {
            isCancel = true;
        }
        const eventArgs: MouseDownEventArgs = { hidenItems: hidenItems, disabledItems: disabledItems, isCancel: isCancel };
        this.pdfViewer._dotnetInstance.invokeMethodAsync('MouseDownHandler', eventArgs);
    }
    /**
     * @private
     * @param {string} selectedMenu - The selected menu.
     * @returns {void}
     */
    // eslint-disable-next-line
    public OnItemSelected(selectedMenu: string): void {
        // eslint-disable-next-line
        let target: any = this.contextMenuModule.currentTarget;
        switch (selectedMenu) {
            case this.pdfViewer.localeObj.getConstant('Copy'):
                this.CopyItemSelected();
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                this.TextMarkUpSelected('Highlight');
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                this.TextMarkUpSelected('Underline');
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                this.TextMarkUpSelected('Strikethrough');
                break;
            case this.pdfViewer.localeObj.getConstant('Properties'):
                this.PropertiesItemSelected();
                break;
            case this.pdfViewer.localeObj.getConstant('Cut'):
                this.CutItemSelected(target);
                break;
            case this.pdfViewer.localeObj.getConstant('Paste'):
                this.pasteItemSelected(target);
                break;
            case this.pdfViewer.localeObj.getConstant('Delete Context'):
                this.DeleteItemSelected();
                break;
            case this.pdfViewer.localeObj.getConstant('Scale Ratio'):
                this.ScaleRatioSelected();
                break;
            case this.pdfViewer.localeObj.getConstant('Comment'):
                this.CommentItemSelected();
                break;
            default:
                break;
        }
    }
    private CommentItemSelected(): void {
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.showCommentsPanel();
            if (this.pdfViewer.selectedItems.annotations.length !== 0 ||
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                // eslint-disable-next-line
                let currentAnnotation: any;
                if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                    currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                } else {
                    currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                }
                // eslint-disable-next-line
                let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                if (accordionExpand) {
                    accordionExpand.ej2_instances[0].expandItem(true);
                }
                // eslint-disable-next-line
                let commentsDiv: any = document.getElementById(currentAnnotation.annotName);
                if (commentsDiv) {
                    if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                        commentsDiv.firstChild.click();
                    }
                }
            }
        }
    }
    private ScaleRatioSelected(): void {
        if (this.isCalibrateAnnotationModule()) {
            this.pdfViewer.annotation.measureAnnotationModule.createScaleRatioWindow();
        }
    }
    private DeleteItemSelected(): void {
        if (this.pdfViewer.formDesignerModule && this.pdfViewer.selectedItems.formFields.length !== 0) {
            this.pdfViewer.formDesignerModule.deleteFormField(this.pdfViewer.selectedItems.formFields[0].id);
        } else if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.deleteAnnotation();
        }
    }
    // eslint-disable-next-line
    private pasteItemSelected(target: any): void {
        // eslint-disable-next-line max-len
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
            this.pdfViewer.annotation.freeTextAnnotationModule.pasteSelectedText(target);
            this.contextMenuModule.close();
        } else {
            this.pdfViewer.paste();
            this.contextMenuModule.previousAction = 'Paste';
        }
    }
    // eslint-disable-next-line
    private CutItemSelected(target: any): void {
        // eslint-disable-next-line max-len
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
            this.pdfViewer.annotation.freeTextAnnotationModule.cutSelectedText(target);
            this.contextMenuModule.close();
        } else if (this.pdfViewer.selectedItems.annotations.length === 1) {
            const pageIndex: number = this.pdfViewer.selectedItems.annotations[0].pageIndex;
            this.pdfViewer.cut();
            this.contextMenuModule.previousAction = 'Cut';
        } else if (this.pdfViewer.selectedItems.formFields.length === 1) {
            this.pdfViewer.cut();
            this.contextMenuModule.previousAction = 'Cut';
        }
    }
    private CopyItemSelected(): void {
        let isSkip: boolean = false;
        // eslint-disable-next-line max-len
        if (this.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
            this.pdfViewer.annotation.freeTextAnnotationModule.copySelectedText();
            this.contextMenuModule.close();
            isSkip = true;
        } else if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.copyText();
            this.contextMenuModule.close();
        }
        if (this.pdfViewer.selectedItems.annotations.length && !isSkip) {
            this.pdfViewer.copy();
            this.contextMenuModule.previousAction = 'Copy';
        } else if (this.pdfViewer.selectedItems.formFields.length > 0) {
            this.pdfViewer.copy();
            this.contextMenuModule.previousAction = 'Copy';
        }
    }
    private PropertiesItemSelected(): void {
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
            this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
            this.pdfViewer.annotation.createPropertiesWindow();
            // eslint-disable-next-line max-len
        } else if (this.pdfViewer.selectedItems.formFields.length !== 0 && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType) {
            this.pdfViewer.formDesigner.createPropertiesWindow();
        }
    }
    private TextMarkUpSelected(type: string): void {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
            this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations(type);
            this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
            this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
            this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
        }
    }

    private shapeMenuItems(hidenItems: string[], disabledItems: string[], enableProperties: boolean, isSignature?: boolean): void {
        if (this.pdfViewer.annotation && !this.pdfViewer.annotation.isShapeCopied) {
            disabledItems.push('Paste');
        }
        hidenItems.push('HighlightContext');
        hidenItems.push('UnderlineContext');
        hidenItems.push('StrikethroughContext');
        hidenItems.push('ScaleRatio');
        if (enableProperties) {
            // eslint-disable-next-line max-len
            if (!(this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
                hidenItems.push('Properties');
            }
        } else if (isSignature) {
            hidenItems.push('Properties');
            hidenItems.push('Comment');
        } else {
            hidenItems.push('Cut');
            hidenItems.push('Copy');
            hidenItems.push('DeleteContext');
            hidenItems.push('Comment');
        }
    }

    private checkIsRtlText(text: string): boolean {
        // eslint-disable-next-line max-len
        const ltrChars: string = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
        const rtlChars: string = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
        // eslint-disable-next-line
        let rtlDirCheck: any = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
        return rtlDirCheck.test(text);
    }

    /**
     * @private
     * @param {any} event - Specifies the event.
     * @returns {boolean} - retruned the beolean value.
     */
    // eslint-disable-next-line
    public isClickWithinSelectionBounds(event: any): boolean {
        let isWithin: boolean = false;
        if (this.pdfViewer.textSelectionModule) {
            const bounds: ClientRect = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.currentPageNumber - 1);
            if (bounds) {
                const currentBound: ClientRect = bounds;
                if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                    event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                    this.getVerticalValue(currentBound.bottom) > event.clientY) {
                    isWithin = true;
                }
            }
            if ((Browser.isIE || Browser.info.name === 'edge') && bounds) {
                isWithin = true;
            }
        }
        return isWithin;
    }

    private getHorizontalClientValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    }

    private getVerticalClientValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    }

    private getHorizontalValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.left;
    }

    private getVerticalValue(value: number): number {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        const pageBounds: ClientRect = pageDiv.getBoundingClientRect();
        return (value * this.getZoomFactor()) + pageBounds.top;
    }

    /**
     * @private
     * @returns {boolean} - retruned the beolean value.
     */
    public checkIsNormalText(): boolean {
        let isText: boolean = true;
        let currentText: string = '';
        // eslint-disable-next-line
        let textSelectionModule: any = this.pdfViewer.textSelectionModule;
        if (textSelectionModule && textSelectionModule.selectionRangeArray && textSelectionModule.selectionRangeArray.length === 1) {
            currentText = textSelectionModule.selectionRangeArray[0].textContent;
        } else if (window.getSelection() && window.getSelection().anchorNode) {
            currentText = window.getSelection().toString();
        }
        if (currentText !== '' && this.checkIsRtlText(currentText)) {
            isText = false;
        }
        return isText;
    }
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseup = (event: MouseEvent): void => {
        if (!this.getPopupNoteVisibleStatus()) {
            if (this.isViewerMouseDown) {
                if (this.scrollHoldTimer) {
                    clearTimeout(this.scrollHoldTimer);
                    this.scrollHoldTimer = null;
                }
                if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
                    this.pageViewScrollChanged(this.currentPageNumber);
                }
            }
            let isSignatureFieldReadOnly: boolean = false;
            if(event.target)
            {
                if((event.target as HTMLElement).className == 'e-pv-show-designer-name' && (event.target as HTMLElement).id.split('_',1)as any !=''){
                    isSignatureFieldReadOnly = (document.getElementById((event.target as HTMLElement).id.split('_',1)as any) as any).disabled;
                }
                if((event.target as HTMLElement).className == 'foreign-object' && (event.target as HTMLElement).children[0]){
                    isSignatureFieldReadOnly = ((event.target as HTMLElement).children[0] as any).disabled;
                }
            }
            if(isSignatureFieldReadOnly && this.pdfViewer.annotation){
                this.pdfViewer.annotation.clearSelection();
            }
            if (this.isShapeBasedAnnotationsEnabled() && !isSignatureFieldReadOnly) {
                this.diagramMouseUp(event);
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.onAnnotationMouseUp();
                }
            }
            if (this.pdfViewer.selectedItems.formFields.length > 0) {
                // eslint-disable-next-line max-len
                if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule) && !Browser.isDevice) {
                    this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(true);
                }
            } else {
                // eslint-disable-next-line max-len
                if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule) && !Browser.isDevice) {
                    this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(false);
                }
            }
            this.isSelection = false;
            // eslint-disable-next-line max-len
            const commentElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_commantPanel');
            if (commentElement && commentElement.style.display === 'block') {
                if (this.pdfViewer.selectedItems) {
                    if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                        // eslint-disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // eslint-disable-next-line
                        let commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                }
            }
            if (event.button === 0 && !this.isClickedOnScrollBar(event, false)) {
                // 0 is for left button.
                const eventTarget: HTMLElement = event.target as HTMLElement;
                let offsetX: number = event.clientX;
                let offsetY: number = event.clientY;
                const zoomFactor: number = this.getZoomFactor();
                let pageIndex: number = this.currentPageNumber;
                if (eventTarget) {
                    // eslint-disable-next-line
                    let pageString: any = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
                    // eslint-disable-next-line
                    pageIndex = parseInt(pageString);
                }
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
                if (pageDiv) {
                    const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                    offsetX = (event.clientX - pageCurrentRect.left) / zoomFactor;
                    offsetY = (event.clientY - pageCurrentRect.top) / zoomFactor;
                }
                // eslint-disable-next-line max-len
                if (eventTarget && eventTarget.classList && !eventTarget.classList.contains('e-pv-hyperlink') && !eventTarget.classList.contains('e-pv-page-container')) {
                    // eslint-disable-next-line
                    this.pdfViewer.firePageClick(offsetX, offsetY, pageIndex + 1);
                    if (this.pdfViewer.formFieldsModule && !this.pdfViewer.formDesignerModule) {
                        this.pdfViewer.formFieldsModule.removeFocus();
                    }
                }
                if (this.isTextMarkupAnnotationModule() && !this.isToolbarInkClicked) {
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
                }
                if (this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule) {
                    this.pdfViewer.formDesignerModule.updateCanvas(pageIndex);
                }
                // eslint-disable-next-line max-len
                if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && this.isPanMode) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
            this.isViewerMouseDown = false;
        }
    };
    /**
     * @param {WheelEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseWheel = (event: WheelEvent): void => {
        this.isViewerMouseWheel = true;
        if (this.getRerenderCanvasCreated()) {
            event.preventDefault();
        }
        if (event.ctrlKey) {
            let zoomDifference: number = 25;
            if (this.pdfViewer.magnification.zoomFactor < 1) {
                zoomDifference = 10;
            }
            if (this.pdfViewer.magnification.zoomFactor >= 2) {
                zoomDifference = 50;
            }
            // eslint-disable-next-line
            if ((event as any).wheelDelta > 0) {
                this.pdfViewer.magnification.zoomTo((this.pdfViewer.magnification.zoomFactor * 100) + zoomDifference);
            } else {
                this.pdfViewer.magnification.zoomTo((this.pdfViewer.magnification.zoomFactor * 100) - zoomDifference);
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.pageRerenderOnMouseWheel();
            if (event.ctrlKey) {
                event.preventDefault();
            }
            this.pdfViewer.magnificationModule.fitPageScrollMouseWheel(event);
        }
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            if (this.isViewerMouseDown) {
                if (!(event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.pdfViewer.textSelectionModule.textSelectionOnMouseWheel(this.currentPageNumber - 1);
                }
            }
        }
    };
    /**
     * @param {KeyboardEvent} event - The KeyboardEvent.
     * @returns {void}
     */
     private onWindowKeyDown = (event: KeyboardEvent): void => {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        const isCommandKey: boolean = isMac ? event.metaKey : false;
        if ((this.isFreeTextAnnotationModule() && this.pdfViewer.annotationModule
            && (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                || this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
            return;
        }
        if (!event.ctrlKey || !isCommandKey) {
            switch (event.keyCode) {
                case 27:
                    if (this.pdfViewer.toolbar) {
                        this.pdfViewer.toolbar.addInkAnnotation();
                        this.pdfViewer.toolbar.deSelectCommentAnnotation();
                        this.pdfViewer.toolbar.updateStampItems();
                        if (this.pdfViewer.toolbar.annotationToolbarModule) {
                            if (isBlazor()) {
                                this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItemsInBlazor();
                            } else {
                                this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
                            }
                        }
                        this.pdfViewer.tool = '';
                        this.focusViewerContainer();
                    }
                    break;
                case 9:
                    if (event.target && (event.target as any).id && this.pdfViewer.formFields) {
                        for (var i = 0; i < this.pdfViewer.formFields.length; i++) {
                            let formField = this.pdfViewer.formFields[i];
                            if ((event.target as any).id === formField.id) {
                                // eslint-disable-next-line
                                let field = {
                                    value: (formField as any).value, fontFamily: formField.fontFamily, fontSize: formField.fontSize, fontStyle: (formField as any).fontStyle,
                                    // eslint-disable-next-line
                                    color: formField.color, backgroundColor: formField.backgroundColor, alignment: formField.alignment, isReadonly: (formField as any).isReadonly, visibility: (formField as any).visibility,
                                    // eslint-disable-next-line
                                    maxLength: (formField as any).maxLength, isRequired: (formField as any).isRequired, isPrint: formField.isPrint, rotation: (formField as any).rotateAngle, tooltip: (formField as any).tooltip,
                                    // eslint-disable-next-line
                                    options: (formField as any).options, isChecked: (formField as any).isChecked, isSelected: (formField as any).isSelected
                                };
                                this.pdfViewer.fireFocusOutFormField((field as any), (formField as any).pageIndex);
                            }
                        }
                    }
                    break;
            }
        }
    }
    /**
     * @param {KeyboardEvent} event - The KeyboardEvent.
     * @returns {void}
     */
    private viewerContainerOnKeyDown = (event: KeyboardEvent): void => {
        const isMac: boolean = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        const isCommandKey: boolean = isMac ? event.metaKey : false;
        if ((this.isFreeTextAnnotationModule() && this.pdfViewer.annotationModule
            && (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                || this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
            return;
        }
        if (event.ctrlKey || isCommandKey) {
            // add keycodes if shift key is used.
            if ((event.shiftKey && !isMac) || (isMac && !event.shiftKey)) {
                switch (event.keyCode) {
                    case 38: // up arrow
                    case 33: // page up
                        event.preventDefault();
                        if (this.currentPageNumber !== 1) {
                            this.updateScrollTop(0);
                        }
                        break;
                    case 40: // down arrow
                    case 34: // page down
                        event.preventDefault();
                        if (this.currentPageNumber !== this.pageCount) {
                            this.updateScrollTop(this.pageCount - 1);
                        }
                        break;
                    default:
                        break;
                }
            }
            switch (event.keyCode) {
                case 79: // o key
                    if (this.pdfViewer.toolbarModule && this.pdfViewer.enableToolbar) {
                        this.pdfViewer.toolbarModule.openFileDialogBox(event);
                    }
                    break;
                case 67: // c key
                    if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled) {
                        event.preventDefault();
                        this.pdfViewer.textSelectionModule.copyText();
                    }
                    if (this.pdfViewer.selectedItems.annotations.length || this.pdfViewer.selectedItems.formFields.length) {
                        this.pdfViewer.copy();
                        this.contextMenuModule.previousAction = 'Copy';
                    }
                    break;
                case 70: // f key
                    if (this.pdfViewer.textSearchModule && this.pdfViewer.enableTextSearch) {
                        event.preventDefault();
                        this.pdfViewer.toolbarModule.textSearchButtonHandler();
                    }
                    break;
                case 80: // p key
                    if (this.pdfViewer.printModule && this.pdfViewer.enablePrint) {
                        event.preventDefault();
                        this.pdfViewer.print.print();
                    }
                    break;
                case 90: //z key
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.undo();
                    }
                    break;
                case 88: //x key
                    if (this.pdfViewer.selectedItems.annotations.length || this.pdfViewer.selectedItems.formFields.length) {
                        this.pdfViewer.cut();
                        this.contextMenuModule.previousAction = 'Cut';
                    }
                    break;
                case 89: //y key
                    if (this.pdfViewer.annotationModule) {
                        this.pdfViewer.annotationModule.redo();
                    }
                    break;
                case 86: //v key
                    // eslint-disable-next-line max-len
                    if ((this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied) || (this.pdfViewer.formFields && this.pdfViewer.formDesigner.isShapeCopied)) {
                        this.pdfViewer.paste();
                        this.contextMenuModule.previousAction = 'Paste';
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 46:
                    this.DeleteKeyPressed(event);
                    break;
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
        }
    };
    private DeleteKeyPressed(event: KeyboardEvent): void {
        if (this.pdfViewer.formDesignerModule && this.pdfViewer.designerMode && this.pdfViewer.selectedItems.formFields.length !== 0) {
            this.pdfViewer.formDesignerModule.deleteFormField(this.pdfViewer.selectedItems.formFields[0].id);
        } else if (this.pdfViewer.annotation && !this.pdfViewer.designerMode) {
            if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.deleteAnnotation();
            }
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                // eslint-disable-next-line
                let annotation: any = this.pdfViewer.selectedItems.annotations[0];
                let isReadOnly: Boolean = true;
                let type: any = annotation.shapeAnnotationType;
                if (type === 'Path' || annotation.formFieldAnnotationType === 'SignatureField' || annotation.formFieldAnnotationType === 'InitialField' || type === 'HandWrittenSignature' || type === 'SignatureText' || type === 'SignatureImage') {
                    let inputFields: any = document.getElementById(annotation.id);
                    if (inputFields && inputFields.disabled) {
                        isReadOnly = true;
                    }
                }
                if (!isReadOnly) {
                    if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                            this.pdfViewer.remove(annotation);
                            this.pdfViewer.renderSelector(this.pdfViewer.annotation.getEventPageNumber(event));
                        }
                    } else {
                        this.pdfViewer.remove(annotation);
                        this.pdfViewer.renderSelector(this.pdfViewer.annotation.getEventPageNumber(event));
                    }
                }
            }
        }
    }
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMousemove = (event: MouseEvent): void => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        const target: HTMLElement = event.target as HTMLElement;
        if (this.action === 'Drag') {
            event.preventDefault();
        }
        // eslint-disable-next-line max-len
        if (this.isViewerMouseDown && !(this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'Line' || this.action === 'DrawTool' || this.action === 'Distance')) {
            // eslint-disable-next-line max-len
            if (this.pdfViewer.textSelectionModule && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && !this.getPopupNoteVisibleStatus()) {
                // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                // this region block the toc/hyperlink navigation on sometimes.
                // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                // }
                if (!isIE) {
                    if ((event.target as HTMLElement).className != 'e-pdfviewer-formFields')
                         event.preventDefault();
                    this.mouseX = event.clientX;
                    this.mouseY = event.clientY;
                    // eslint-disable-next-line
                    let annotationModule: any = this.pdfViewer.annotationModule;
                    // eslint-disable-next-line max-len
                    if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isDropletClicked && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                        annotationModule.textMarkupAnnotationModule.textSelect(event.target, this.mouseX, this.mouseY);
                    } else {
                        this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, this.mouseX, this.mouseY);
                    }
                } else {
                    const selection: Selection = window.getSelection();
                    if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                        this.pdfViewer.textSelectionModule.isTextSelection = true;
                    }
                }
            } else if (this.skipPreventDefault(target)) {
                event.preventDefault();
            }
        }
        if (this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseMove(event);
        }
        if (this.isPanMode) {
            this.panOnMouseMove(event);
        }

        if (this.isShapeBasedAnnotationsEnabled()) {
            let canvas: Rect;
            // eslint-disable-next-line max-len
            if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || ((event.target as HTMLElement).parentElement.classList.contains('foreign-object')) || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
                const diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                if (diagram) {
                    const canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                    const left: number = canvas1.x ? canvas1.x : canvas1.left;
                    const top: number = canvas1.y ? canvas1.y : canvas1.top;
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation && this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation.shapeAnnotationType === 'Image') {
                        canvas = new Rect(left, top, canvas1.width - 10, canvas1.height - 10);
                    } else {
                        canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
                    }
                }
            } else if (!this.pdfViewer.annotationModule && this.pdfViewer.formDesignerModule) {
                const pageIndex: number = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                const diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                if (diagram) {
                    const canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                    const left: number = canvas1.x ? canvas1.x : canvas1.left;
                    const top: number = canvas1.y ? canvas1.y : canvas1.top;
                    canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
                }
            }
            // eslint-disable-next-line max-len
            const stampModule: StampAnnotation = this.pdfViewer.annotationModule ? this.pdfViewer.annotationModule.stampAnnotationModule : null;
            if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && !(stampModule && stampModule.isStampAnnotSelected)) {
                this.diagramMouseMove(event);
                this.annotationEvent = event;
            } else {
                this.diagramMouseLeave(event);
                if (this.isAnnotationDrawn && this.action !== 'Ink') {
                    this.diagramMouseUp(event);
                    this.isAnnotationAdded = true;
                }
            }
            if (this.pdfViewer.enableStampAnnotations) {
                if (stampModule && stampModule.isStampAnnotSelected) {
                    this.pdfViewer.tool = 'Stamp';
                    this.tool = new StampTool(this.pdfViewer, this);
                    this.isMouseDown = true;
                    stampModule.isStampAnnotSelected = false;
                    stampModule.isNewStampAnnot = true;
                }
            }
            if (this.isSignatureAdded && this.pdfViewer.enableHandwrittenSignature) {
                this.pdfViewer.tool = 'Stamp';
                this.tool = new StampTool(this.pdfViewer, this);
                this.isMouseDown = true;
                this.isSignatureAdded = false;
                this.isNewSignatureAdded = true;
            }
        }

    };
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private panOnMouseMove = (event: MouseEvent): void => {
        let isStampMode: boolean = false;
        // eslint-disable-next-line max-len
        if (this.action === 'Ink' || this.action === "Line" || this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'DrawTool' || this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            isStampMode = true;
        }
        // eslint-disable-next-line max-len
        if (this.viewerContainer.contains(event.target as HTMLElement) && ((event.target as HTMLElement) !== this.viewerContainer) && ((event.target as HTMLElement) !== this.pageContainer) && !isStampMode) {
            if (this.isViewerMouseDown) {
                const deltaX: number = this.dragX - event.pageX;
                const deltaY: number = this.dragY - event.pageY;
                this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + deltaY;
                this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + deltaX;
                this.viewerContainer.style.cursor = 'move';
                this.viewerContainer.style.cursor = '-webkit-grabbing';
                this.viewerContainer.style.cursor = '-moz-grabbing';
                this.viewerContainer.style.cursor = 'grabbing';
                this.dragX = event.pageX;
                this.dragY = event.pageY;
            } else {
                if (!this.navigationPane.isNavigationPaneResized) {
                    this.viewerContainer.style.cursor = 'move';
                    this.viewerContainer.style.cursor = '-webkit-grab';
                    this.viewerContainer.style.cursor = '-moz-grab';
                    this.viewerContainer.style.cursor = 'grab';
                }
            }
        } else {
            if (!this.navigationPane.isNavigationPaneResized) {
                this.viewerContainer.style.cursor = 'auto';
            }
        }
    };

    /**
     * @private
     * @returns {void}
     */
    public initiatePanning(): void {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public initiateTextSelectMode(): void {
        this.isPanMode = false;
        if (this.viewerContainer) {
            this.viewerContainer.style.cursor = 'auto';
            if (this.pdfViewer.textSelectionModule) {
                this.textLayer.modifyTextCursor(true);
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if ((!Browser.isDevice || this.pdfViewer.enableDesktopMode) && !isBlazor()) {
                this.enableAnnotationAddTools(true);
            }
        }
    }

    /**
     * @private
     * @returns {void}
    */
    public initiateTextSelection(): void{
        if (this.pdfViewer.toolbar && !this.pdfViewer.toolbar.isSelectionToolDisabled) {
            this.initiateTextSelectMode();
            this.pdfViewer.toolbar.updateInteractionTools(true);
        }
    }

    private enableAnnotationAddTools(isEnable: boolean): void {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    }
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseLeave = (event: MouseEvent): void => {
        if (this.isViewerMouseDown) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
            }
        }
        if (this.pdfViewer.textSelectionModule && this.pdfViewer.textSelectionModule.isTextSelection) {
            event.preventDefault();
        }
    };
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseEnter = (event: MouseEvent): void => {
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.clear();
        }
    };
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnMouseOver = (event: MouseEvent): void => {
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (this.isViewerMouseDown) {
            if (!isIE) {
                event.preventDefault();
            }
        }
    };
    /**
     * @param {MouseEvent} event - The MouseEvent.
     * @returns {void}
     */
    private viewerContainerOnClick = (event: MouseEvent): void => {
        if (event.type === 'dblclick') {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getCurrentTextMarkupAnnotation()) {
                if ((event.target as HTMLElement).classList.contains('e-pv-text')) {
                    this.isViewerContainerDoubleClick = true;
                    if (!this.getTextMarkupAnnotationMode()) {
                        const pageNumber: number = parseFloat((event.target as HTMLElement).id.split('_')[2]);
                        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
                    }
                    this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                    if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                        this.pdfViewer.textSelectionModule.calculateContextMenuPosition(event.clientY, event.clientX);
                    }
                    if (!this.getTextMarkupAnnotationMode()) {
                        this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        this.dblClickTimer = setTimeout(
                            () => {
                                this.applySelection();
                            }, 100);
                        this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                    } else if (this.isTextMarkupAnnotationModule() && this.getTextMarkupAnnotationMode()) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                    }
                }
            } else if (this.getCurrentTextMarkupAnnotation()) {
                // this.pdfViewer.annotationModule.showAnnotationPopup(event);
            }
            if (this.action && (this.action === 'Perimeter' || this.action === 'Polygon') && this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, event, this.eventArgs.source);
                const ctrlKey: boolean = this.isMetaKey(event);
                const info: Info = { ctrlKey: event.ctrlKey, shiftKey: event.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = event.detail;
                (this.tool as PolygonDrawingTool).mouseUp(this.eventArgs, true);

            }
            if (this.pdfViewer.selectedItems ||
                (this.pdfViewer.annotation && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
                if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                    // eslint-disable-next-line
                    let currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                    // eslint-disable-next-line max-len
                    if (this.pdfViewer.annotationModule && !currentAnnotation.formFieldAnnotationType) {
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName, currentAnnotation.pageIndex, currentAnnotation, null, true);
                        if (this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                            if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true) {
                                const elmtPosition: PointModel = {};
                                elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                            } else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                                const elmtPosition: PointModel = {};
                                elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                            } else {
                                // eslint-disable-next-line
                                let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                                if (accordionExpand) {
                                    accordionExpand.ej2_instances[0].expandItem(true);
                                }
                                // eslint-disable-next-line
                                let commentsDiv: any = document.getElementById(this.pdfViewer.selectedItems.annotations[0].annotName);
                                if (commentsDiv) {
                                    if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                        commentsDiv.firstChild.click();
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // eslint-disable-next-line max-len
                    let annotation : any = this.pdfViewer.annotation;
                    let annotationModule : any = this.pdfViewer.annotationModule;
                    if (annotation && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // eslint-disable-next-line
                        let annotation: any = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        // eslint-disable-next-line max-len
                        this.pdfViewer.annotationModule.annotationSelect(annotation.annotName, this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage, annotation, null, true);
                        // eslint-disable-next-line
                        let accordionExpand: any = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // eslint-disable-next-line
                        let comments: any = document.getElementById(annotation.annotName);
                        if (comments) {
                            comments.firstChild.click();
                        }
                    }
                }
            }
            if (this.pdfViewer.designerMode && this.pdfViewer.selectedItems.formFields.length > 0) {
                let eventArgs: FormFieldDoubleClickArgs = { name: "formFieldDoubleClick", field: this.pdfViewer.selectedItems.formFields[0] as IFormField, cancel: false };
                this.pdfViewer.fireFormFieldDoubleClickEvent(eventArgs);
                if (!eventArgs.cancel) {
                    this.pdfViewer.formDesigner.createPropertiesWindow();
                }
            }
        } else {
            if (event.detail === 3) {
                if (this.isViewerContainerDoubleClick) {
                    clearTimeout(this.dblClickTimer);
                    this.isViewerContainerDoubleClick = false;
                }
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                    this.pdfViewer.textSelectionModule.selectEntireLine(event);
                    this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                    this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                    this.applySelection();
                }
            }
        }
    };

    private applySelection(): void {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    }
    /**
     * @param {DragEvent} event - The DragEvent.
     * @returns {void}
     */
    private viewerContainerOnDragStart = (event: DragEvent): void => {
        // eslint-disable-next-line
        let isIE: boolean = !!(document as any).documentMode;
        if (!isIE) {
            event.preventDefault();
        }
    };

    // eslint-disable-next-line
    private viewerContainerOnContextMenuClick = (event: any): void => {
        this.isViewerMouseDown = false;
    };

    // eslint-disable-next-line
    private onWindowMouseUp = (event: MouseEvent): any => {
        this.isFreeTextContextMenu = false;
        this.isNewStamp = false;
        this.signatureAdded = false;
        // eslint-disable-next-line
        let annotationModule: any = this.pdfViewer.annotationModule;
        // eslint-disable-next-line max-len
        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            // eslint-disable-next-line
            let modules: any = annotationModule.textMarkupAnnotationModule;
            modules.isLeftDropletClicked = false;
            modules.isDropletClicked = false;
            modules.isRightDropletClicked = false;
            if (!modules.currentTextMarkupAnnotation && window.getSelection().anchorNode === null) {
                modules.showHideDropletDiv(true);
            } else if (!modules.currentTextMarkupAnnotation && modules.currentTextMarkupAddMode === '') {
                modules.isTextMarkupAnnotationMode = false;
            }
        }
        if (!this.getPopupNoteVisibleStatus()) {
            if (event.button === 0) {
                // eslint-disable-next-line max-len
                if (this.isNewFreeTextAnnotation()) {
                    if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled && !this.getTextMarkupAnnotationMode()) {
                        // eslint-disable-next-line max-len
                        if (event.detail === 1 && !this.viewerContainer.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
                            if (window.getSelection().anchorNode !== null) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            }
                        }
                        // eslint-disable-next-line
                        let target: any = event.target;
                        if (this.viewerContainer.contains(event.target as HTMLElement) && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pv-formfield-input') {
                            if (!this.isClickedOnScrollBar(event, true) && !this.isScrollbarMouseDown) {
                                this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                            } else {
                                if (window.getSelection().anchorNode !== null) {
                                    this.pdfViewer.textSelectionModule.applySpanForSelection();
                                }
                            }
                        }
                    } else if (this.getTextMarkupAnnotationMode()) {
                        // eslint-disable-next-line
                        let viewerElement: any = this.pdfViewer.element;
                        // eslint-disable-next-line
                        let targetElement: any = event.target;
                        if (viewerElement && targetElement) {
                            if (viewerElement.id.split('_')[0] === targetElement.id.split('_')[0]) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                            }
                        }
                    }
                }
            } else if (event.button === 2) {
                if (this.viewerContainer.contains(event.target as HTMLElement) && this.skipPreventDefault(event.target as HTMLElement)) {
                    if (this.checkIsNormalText()) {
                        window.getSelection().removeAllRanges();
                    }
                }
            }
            if (this.isViewerMouseDown) {
                this.isViewerMouseDown = false;
                if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                    this.pdfViewer.textSelectionModule.clear();
                    this.pdfViewer.textSelectionModule.selectionStartPage = null;
                }
                event.preventDefault();
                event.stopPropagation();
                return false;
            } else {
                return true;
            }
        }
    };
    /**
     * @param {TouchEvent} event - The DragEvent.
     * @returns {void}
     */
    private onWindowTouchEnd = (event: TouchEvent): void => {
        this.signatureAdded = false;
        // eslint-disable-next-line max-len
        if (!this.pdfViewer.element.contains(event.target as HTMLElement) && !this.contextMenuModule.contextMenuElement.contains(event.target as HTMLElement)) {
            if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
            }
        }
    };
    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchStart = (event: TouchEvent): void => {
        const touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
        }
        const target: HTMLElement = event.target as HTMLElement;
        // eslint-disable-next-line max-len
        if (touchPoints.length === 1 && !(target.classList.contains('e-pv-hyperlink')) && this.skipPreventDefault(target)) {
            this.preventTouchEvent(event);
        }
        if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
            if (!this.isToolbarInkClicked) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
        this.touchClientX = touchPoints[0].clientX;
        this.touchClientY = touchPoints[0].clientY;
        this.scrollY = touchPoints[0].clientY;
        this.previousTime = new Date().getTime();
        // eslint-disable-next-line max-len
        if (touchPoints.length === 1 && !((event.target as HTMLElement).classList.contains('e-pv-touch-select-drop') || (event.target as HTMLElement).classList.contains('e-pv-touch-ellipse'))) {
            if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.pageCount > 0 && !this.isThumb && !((event.target as HTMLElement).classList.contains('e-pv-hyperlink'))) {
                this.handleTaps(touchPoints);
            }
            if (!isBlazor() || !Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                this.handleTextBoxTaps(touchPoints);
            }
            const designerMode: boolean = this.isDesignerMode(target);
            if (designerMode) {
                this.contextMenuModule.close();
                // event.preventDefault();
                if (!this.isLongTouchPropagated) {
                    this.longTouchTimer = setTimeout(
                        () => {
                            if (!this.isMoving) {
                                this.isTouchDesignerMode = true;
                                this.contextMenuModule.open(this.touchClientY, this.touchClientX, this.viewerContainer);
                            }
                        }, 1000);
                }
                this.isLongTouchPropagated = true;
                this.isMoving = false;
            }
            else if ((this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled)) {
                this.pdfViewer.textSelectionModule.clearTextSelection();
                this.contextMenuModule.close();
                // event.preventDefault();
                if (!this.isLongTouchPropagated) {
                    this.longTouchTimer = setTimeout(
                        () => {
                            this.viewerContainerOnLongTouch(event);
                        }, 1000);
                }
                this.isLongTouchPropagated = true;
            }
        }
        // eslint-disable-next-line
        let toolbarModule: any = this.pdfViewer.toolbarModule ? this.pdfViewer.toolbarModule.annotationToolbarModule : 'null';
        if (target.classList.contains('e-pv-text') && (!toolbarModule || !toolbarModule.textMarkupToolbarElement || toolbarModule.textMarkupToolbarElement.children.length === 0)) {
            target.classList.add('e-pv-text-selection-none');
        }
        this.diagramMouseDown(event);
        // eslint-disable-next-line max-len
        if (this.action === 'Perimeter' || this.action === 'Polygon' || this.action === 'DrawTool' || this.action === 'Drag' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
            event.preventDefault();
        }
    };
    // eslint-disable-next-line
    private isDesignerMode(target: any): boolean {
        let isDesignerMode: boolean = false;
        if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
            isDesignerMode = true;
            // eslint-disable-next-line max-len
        } else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
            isDesignerMode = true;
            // eslint-disable-next-line max-len
        } else if (this.pdfViewer.selectedItems.formFields.length !== 0 && this.pdfViewer.selectedItems.formFields[0].formFieldAnnotationType && this.pdfViewer.designerMode) {
            isDesignerMode = true;
        } else {
            // eslint-disable-next-line max-len
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && ((target as HTMLElement).classList.contains('e-pv-text-layer') ||
                // eslint-disable-next-line max-len
                (target as HTMLElement).classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                isDesignerMode = true;
                // eslint-disable-next-line max-len
            } else if (this.pdfViewer.formDesigner && this.pdfViewer.formDesigner.isShapeCopied && ((target as HTMLElement).classList.contains('e-pv-text-layer') ||
                (target as HTMLElement).classList.contains('e-pv-text'))) {
                isDesignerMode = true;
            }
        }
        this.designerModetarget = target;
        return isDesignerMode;
    }

    private handleTaps(touchPoints: TouchList): void {
        if (!this.singleTapTimer) {
            this.singleTapTimer = setTimeout(
                () => {
                    this.onSingleTap(touchPoints);
                    // eslint-disable-next-line
                }, 300);
            this.tapCount++;
        } else {
            if (this.pdfViewer.enablePinchZoom) {
                this.tapCount++;
                clearTimeout(this.singleTapTimer);
                this.singleTapTimer = null;
                this.onDoubleTap(touchPoints);
            }
        }
    }
    private handleTextBoxTaps(touchPoints: TouchList): void {
        setTimeout(
            () => {
                this.inputTapCount = 0;
            }, 300);
        this.inputTapCount++;
        // eslint-disable-next-line
        let timer: any = setTimeout(
            () => {
                this.onTextBoxDoubleTap(touchPoints);
            }, 200);
        if (this.inputTapCount > 2) {
            this.inputTapCount = 0;
        }
    }
    private onTextBoxDoubleTap(touches: TouchList): void {
        const target: HTMLElement = touches[0].target as HTMLElement;
        if (this.inputTapCount === 2) {
            if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                if (this.pdfViewer.annotationModule) {
                    let currentAnnotation: any = this.pdfViewer.selectedItems.annotations[0];
                    this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName, currentAnnotation.pageIndex, currentAnnotation, null, true);
                }
                if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true) {
                    const elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                } else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                    const elmtPosition: PointModel = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
            }
        }
    }
    private onSingleTap(touches: TouchList): void {
        const target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        this.singleTapTimer = null;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformfields'))) {
            isFormfields = true;
        }
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible && !isFormfields) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        if (isBlazor()) {
                            // eslint-disable-next-line max-len
                            this.viewerContainer.scrollTop -= this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            const dropDown: HTMLElement = this.getElement('_more_option-popup');
                            if (dropDown.firstElementChild) {
                                dropDown.classList.remove('e-popup-open');
                                dropDown.classList.add('e-popup-close');
                                dropDown.removeChild(dropDown.firstElementChild);
                            }
                        }
                    } else {
                        if (isBlazor()) {
                            // eslint-disable-next-line max-len
                            this.viewerContainer.scrollTop += this.pdfViewer.element.querySelector('.e-pv-mobile-toolbar').clientHeight * this.getZoomFactor();
                        }
                    }
                    if (this.isTapHidden && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();
                        // eslint-disable-next-line max-len
                    } else if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        if (!isBlazor()) {
                            if (this.pdfViewer.enableToolbar) {
                                this.pdfViewer.toolbarModule.showToolbar(true);
                            }
                        } else {
                            //this.pdfViewer._dotnetInstance.invokeMethodAsync('TapOnMobileDevice', this.isTapHidden);
                            this.blazorUIAdaptor.tapOnMobileDevice(this.isTapHidden);
                        }
                        this.isTapHidden = !this.isTapHidden;
                    }
                }
                this.tapCount = 0;
            }
        }
    }

    private onDoubleTap(touches: TouchList): void {
        const target: HTMLElement = touches[0].target as HTMLElement;
        let isFormfields: boolean = false;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformfields'))) {
            isFormfields = true;
        }
        if (this.tapCount === 2 && !isFormfields) {
            this.tapCount = 0;
            /**
             * Sometimes the values gets differ by some decimal points. So converted the decimal points values to Integer values.
             */
            // eslint-disable-next-line
            if ((this.touchClientX >= parseInt((touches[0].clientX - 10).toString())) && (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 30)) {
                if (this.pdfViewer.magnification && this.pdfViewer.selectedItems.annotations.length !== 1) {
                    this.pdfViewer.magnification.onDoubleTapMagnification();
                }
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, this.toolbarHeight);
                this.isTapHidden = false;
                clearTimeout(this.singleTapTimer);
            }
        }
    }
    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnLongTouch = (event: TouchEvent): void => {
        this.touchClientX = event.touches[0].clientX;
        this.touchClientY = event.touches[0].clientY;
        event.preventDefault();
        if (this.pdfViewer.textSelectionModule) {
            let target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains('e-pv-text-selection-none')) {
                target.classList.remove('e-pv-text-selection-none');
            }
            this.pdfViewer.textSelectionModule.initiateTouchSelection(event, this.touchClientX, this.touchClientY);
            if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                clearTimeout(this.singleTapTimer);
                this.tapCount = 0;
            }
        }
    };
    /**
     * @param {PointerEvent} event - The PointerEvent.
     * @returns {void}
     */
    private viewerContainerOnPointerDown = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            this.pointerCount++;
            if (this.pointerCount <= 2) {
                event.preventDefault();
                this.pointersForTouch.push(event);
                if (this.pointerCount === 2) {
                    this.pointerCount = 0;
                }
                if (this.pdfViewer.magnificationModule) {
                    this.pdfViewer.magnificationModule.setTouchPoints(event.clientX, event.clientY);
                }
            }
        }
    };

    private preventTouchEvent(event: TouchEvent): void {
        if (this.pdfViewer.textSelectionModule) {
            // eslint-disable-next-line max-len
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && this.getSelectTextMarkupCurrentPage() == null) {
                if (!(this.isWebkitMobile && (Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchMove = (event: TouchEvent): void => {
        if(this.action === 'Drag'){
          this.isMoving = true;
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            clearTimeout(this.singleTapTimer);
            this.tapCount = 0;
        }
        this.preventTouchEvent(event);
        if (this.isToolbarInkClicked) {
            event.preventDefault();
        }
        let touchPoints: TouchList = event.touches;
        if (this.pdfViewer.magnificationModule) {
            this.isTouchScrolled = true;
            if (touchPoints.length > 1 && this.pageCount > 0) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.isTouchScrolled = false;
                }
                if (this.pdfViewer.enablePinchZoom) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                }
            } else if (touchPoints.length === 1 && this.getPagesPinchZoomed()) {
                if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
                    this.isTouchScrolled = false;
                }
                this.pdfViewer.magnificationModule.pinchMoveScroll();
            }
        }
        this.mouseX = touchPoints[0].clientX;
        this.mouseY = touchPoints[0].clientY;
        let canvas: Rect;
        // eslint-disable-next-line max-len
        if (event.target && ((event.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (event.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (event.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
            if (diagram) {
                const canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                const left: number = canvas1.x ? canvas1.x : canvas1.left;
                const top: number = canvas1.y ? canvas1.y : canvas1.top;
                canvas = new Rect(left + 10, top + 10, canvas1.width - 10, canvas1.height - 10);
            }
        }
        if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY })) {
            this.diagramMouseMove(event);
            this.annotationEvent = event;
        } else {
            this.diagramMouseLeave(event);
            if (this.isAnnotationDrawn) {
                this.diagramMouseUp(event);
                this.isAnnotationAdded = true;
            }
        }
        touchPoints = null;
    };
    /**
     * @param {PointerEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnPointerMove = (event: PointerEvent): void => {
        if (event.pointerType === 'touch' && this.pageCount > 0) {
            event.preventDefault();
            if (this.pointersForTouch.length === 2) {
                for (let i: number = 0; i < this.pointersForTouch.length; i++) {
                    if (event.pointerId === this.pointersForTouch[i].pointerId) {
                        this.pointersForTouch[i] = event;
                        break;
                    }
                }
                if (this.pdfViewer.magnificationModule && this.pdfViewer.enablePinchZoom) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.magnificationModule.initiatePinchMove(this.pointersForTouch[0].clientX, this.pointersForTouch[0].clientY, this.pointersForTouch[1].clientX, this.pointersForTouch[1].clientY);
                }
            }
        }
    };
    /**
     * @param {TouchEvent} event - The TouchEvent.
     * @returns {void}
     */
    private viewerContainerOnTouchEnd = (event: TouchEvent): void => {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.pinchMoveEnd();
        }
        if (event.cancelable && !(event.target as HTMLElement).classList.contains('e-pv-touch-ellipse') && this.pdfViewer.textSelectionModule && this.pdfViewer.textSelectionModule.isTextSelection) {
            event.preventDefault();
        }
        this.isLongTouchPropagated = false;
        clearInterval(this.longTouchTimer);
        this.longTouchTimer = null;
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.isTouchScrolled) {
            this.currentTime = new Date().getTime();
            const duration: number = this.currentTime - this.previousTime;
            // eslint-disable-next-line
            let difference: any = this.scrollY - event.changedTouches[0].pageY;
            // eslint-disable-next-line
            let speed: any = (difference) / (duration);
            if (Math.abs(speed) > 1.5) {
                // eslint-disable-next-line
                let scrollTop: any = (difference) + ((duration) * speed);
                this.viewerContainer.scrollTop += scrollTop;
                this.updateMobileScrollerPosition();
            }
        }
        this.diagramMouseUp(event);
        this.renderStampAnnotation(event);
    };

    private renderStampAnnotation(event: TouchEvent): void {
        if (this.pdfViewer.annotation) {
            const zoomFactor: number = this.getZoomFactor();
            const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(event);
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (this.pdfViewer.enableStampAnnotations) {
                const stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
                if (stampModule && stampModule.isStampAnnotSelected) {
                    if (pageDiv) {
                        const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                        // eslint-disable-next-line max-len
                        if (Browser.isDevice && event.type === 'touchend' && this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation.shapeAnnotationType === 'Image') {
                            let currentStampObj: any = this.pdfViewer.annotationModule.stampAnnotationModule.currentStampAnnotation;
                            currentStampObj.pageIndex = pageIndex;
                            currentStampObj.bounds.x = (event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor;
                            currentStampObj.bounds.y = (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor;
                            stampModule.updateDeleteItems(pageIndex, currentStampObj, currentStampObj.opacity);
                            this.pdfViewer.add(currentStampObj);
                        } else {
                            // eslint-disable-next-line max-len
                            stampModule.renderStamp((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor, null, null, pageIndex, null, null, null, null);
                        }
                        stampModule.isStampAnnotSelected = false;
                    }
                }
                this.pdfViewer.annotation.onAnnotationMouseDown();
            }
            if (this.pdfViewer.enableHandwrittenSignature && this.isSignatureAdded && pageDiv) {
                const pageCurrentRect: ClientRect = pageDiv.getBoundingClientRect();
                this.currentSignatureAnnot.pageIndex = pageIndex;
                // eslint-disable-next-line max-len
                this.signatureModule.renderSignature((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor);
                this.isSignatureAdded = false;
            }
            if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
    }
    /**
     * @param {PointerEvent} event - The PointerEvent.
     * @returns {void}
     */
    private viewerContainerOnPointerEnd = (event: PointerEvent): void => {
        if (event.pointerType === 'touch') {
            event.preventDefault();
            if (this.pdfViewer.magnificationModule) {
                this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            this.pointersForTouch = [];
            this.pointerCount = 0;
        }
    };

    // eslint-disable-next-line
    private initPageDiv(pageValues: { pageCount: any, pageSizes: any }): void {
        if (!isBlazor()) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateTotalPage();
            }
        }
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && this.mobiletotalPageContainer) {
            this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
            this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
        }
        if (this.pageCount > 0) {
            let topValue: number = 0;
            let pageLimit: number = 0;
            this.isMixedSizeDocument = false;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            } else {
                pageLimit = this.pageCount;
            }
            let isPortrait: boolean = false;
            let isLandscape: boolean = false;
            let differentPageSize: boolean = false;
            for (let i: number = 0; i < pageLimit; i++) {
                if (typeof pageValues.pageSizes[i] !== 'object') {
                    const pageSize: string[] = pageValues.pageSizes[i].split(',');
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        const previousPageHeight: string = pageValues.pageSizes[i - 1].split(',');
                        topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                    } else {
                        topValue = this.pageGap;
                    }
                    const size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                    this.pageSize.push(size);
                } else {
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        // eslint-disable-next-line
                        let previousPageHeight: any = pageValues.pageSizes[i - 1];
                        topValue = this.pageGap + parseFloat(previousPageHeight.Height) + topValue;
                    } else {
                        topValue = this.pageGap;
                    }
                    const size: ISize = { width: pageValues.pageSizes[i].Width, height: pageValues.pageSizes[i].Height, top: topValue };
                    this.pageSize.push(size);
                }
                if (this.pageSize[i].height > this.pageSize[i].width) {
                    isPortrait = true;
                }
                if (this.pageSize[i].width > this.pageSize[i].height) {
                    isLandscape = true;
                }
                if (i > 0 && this.pageSize[i].width !== this.pageSize[i - 1].width) {
                    differentPageSize = true;
                }
                const pageWidth: number = this.pageSize[i].width;
                if (pageWidth > this.highestWidth) {
                    this.highestWidth = pageWidth;
                }
                const pageHeight: number = this.pageSize[i].height;
                if (pageHeight > this.highestHeight) {
                    this.highestHeight = pageHeight;
                }
            }
            if ((isPortrait && isLandscape) || differentPageSize) {
                this.isMixedSizeDocument = true;
            }
            const limit: number = this.pageCount < 10 ? this.pageCount : 10;
            for (let i: number = 0; i < limit; i++) {
                this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
            }
            // eslint-disable-next-line max-len
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    }

    private renderElementsVirtualScroll(pageNumber: number): void {
        let lowerLimit: number = 1;
        let higherLimit: number = 3;
        if (this.pageStopValue <= 200) {
            lowerLimit = 4;
            higherLimit = 4;
        } else {
            lowerLimit = 2;
            higherLimit = 3;
        }
        let pageValue: number = pageNumber + lowerLimit;
        if (pageValue > this.pageCount) {
            pageValue = this.pageCount;
        }
        for (let i: number = pageNumber - 1; i <= pageValue; i++) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        let lowerPageValue: number = pageNumber - 3;
        if (lowerPageValue < 0) {
            lowerPageValue = 0;
        }
        for (let i: number = pageNumber - 1; i >= lowerPageValue; i--) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        for (let j: number = 0; j < this.pageCount; j++) {
            if (!((lowerPageValue <= j) && (j <= pageValue))) {
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + j);
                const pageCanvas: HTMLElement = this.getElement('_pageCanvas_' + j);
                const textLayer: HTMLElement = this.getElement('_textLayer_' + j);
                if (pageCanvas) {
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    const indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    const indexInArray: number = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
        if (isBlazor())
            this.pdfViewer._dotnetInstance.invokeMethodAsync('UpdateCurrentPageNumber', this.currentPageNumber);
    }

    private renderPageElement(i: number): void {
        const pageDiv: HTMLElement = this.getElement('_pageDiv_' + i);
        const canvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + i) as HTMLCanvasElement;
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {
            // eslint-disable-next-line
            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    }

    private async renderPagesVirtually(): Promise<void> {
        // eslint-disable-next-line
        let proxy: any = this;
        setTimeout(
            () => {
                this.initiateRenderPagesVirtually(proxy);
            }, 500);
    }

    // eslint-disable-next-line
    private initiateRenderPagesVirtually(proxy: any): void {
        const jsonObject: object = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true, action: 'VirtualLoad', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId, password: proxy.passwordData };
        if (proxy.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).documentId = proxy.jsonDocumentId;
        }
        this.virtualLoadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.virtualLoadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load;
        this.virtualLoadRequestHandler.responseType = 'json';
        this.virtualLoadRequestHandler.mode = true;
        this.virtualLoadRequestHandler.send(jsonObject);
        // eslint-disable-next-line
        this.virtualLoadRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    } catch (error) {
                        proxy.onControlError(500, data, 'VirtualLoad');
                    }
                }
            }
            if (data) {
                while (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (proxy.documentId === data.uniqueId) {
                    proxy.pdfViewer.fireAjaxRequestSuccess('VirtualLoad', data);
                    // eslint-disable-next-line
                    let pageValues: { pageCount: any; pageSizes: any; } = data;
                    if (proxy.pageSize[proxy.pageLimit - 1]) {
                        let topValue: number = proxy.pageSize[proxy.pageLimit - 1].top;
                        for (let i: number = proxy.pageLimit; i < proxy.pageCount; i++) {
                            if (typeof(pageValues.pageSizes[i]) !== 'object') {
                                const pageSize: string[] = pageValues.pageSizes[i].split(',');
                                if (proxy.pageSize[i - 1] !== null && i !== 0) {
                                    const previousPageHeight: string = proxy.pageSize[i - 1].height;
                                    topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                                }
                                const size: ISize = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                                proxy.pageSize.push(size);
                            } else {
                                if (proxy.pageSize[i - 1] !== null && i !== 0) {
                                    const previousPageHeight: string = proxy.pageSize[i - 1].height;
                                    topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                                }
                                const size: ISize = { width: parseFloat(pageValues.pageSizes[i].Width), height: parseFloat(pageValues.pageSizes[i].Height), top: topValue };
                                proxy.pageSize.push(size);
                            }
                        }
                        // eslint-disable-next-line max-len
                        proxy.pageContainer.style.height = proxy.getPageTop(proxy.pageSize.length - 1) + proxy.getPageHeight(proxy.pageSize.length - 1) + 'px';
                        // eslint-disable-next-line
                        let pageData: any = window.sessionStorage.getItem(proxy.documentId + '_pagedata');
                        if (proxy.pageCount > 100) {
                            proxy.pdfViewer.fireDocumentLoad(pageData);
                            let linkAnnotationModule = proxy.pdfViewer.linkAnnotationModule;
                            if (linkAnnotationModule && linkAnnotationModule.linkAnnotation && linkAnnotationModule.linkAnnotation.length > 0 && linkAnnotationModule.linkPage.length > 0) {
                                linkAnnotationModule.renderDocumentLink(linkAnnotationModule.linkAnnotation, linkAnnotationModule.linkPage, linkAnnotationModule.annotationY, proxy.currentPageNumber - 1);
                            }
                        }
                    }
                }
            }
        };
        // eslint-disable-next-line
        this.virtualLoadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // eslint-disable-next-line
        this.virtualLoadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    }

    // eslint-disable-next-line
    private tileRenderPage(data: any, pageIndex: number): void {
        let proxy: PdfViewerBase = null;
        proxy = this;
        if (data && this.pageSize[pageIndex]) {
            const pageWidth: number = this.getPageWidth(pageIndex);
            const pageHeight: number = this.getPageHeight(pageIndex);
            // eslint-disable-next-line max-len
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            let tileX: number = data.tileX ? data.tileX : 0;
            let tileY: number = data.tileY ? data.tileY : 0;
            if (pageDiv) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.background = '#fff';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.background = '#fff';
            }
            
            let imageData: string = data['image'];
            let zoomFactor: number = this.retrieveCurrentZoomFactor();
            if (this.isReRenderRequired) {
                if (data.zoomFactor) {
                    zoomFactor = data.zoomFactor;
                }
                const currentString: string = this.documentId + '_' + pageIndex + '_' + zoomFactor + '_' + data.tileX + '_' + data.tileY;
                // eslint-disable-next-line max-len
                this.tilerequestLists.push(currentString);
                // eslint-disable-next-line
                let matrix: any = data['transformationMatrix'];
                // eslint-disable-next-line
                let width: any = data['width'];

                if (imageData) {
                    let tileX: number = data.tileX ? data.tileX : 0;
                    let tileY: number = data.tileY ? data.tileY : 0;
                    let scaleFactor: number = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                    let image: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_tileimg_' + pageIndex + '_' + this.getZoomFactor() + '_' + tileX + '_' + tileY);
                    if (!image) {
                        image = new Image();
                        image.id = this.pdfViewer.element.id + '_tileimg_' + pageIndex + '_' + this.getZoomFactor() + '_' + tileX + '_' + tileY;
                        if(pageDiv){
                        pageDiv.append(image);
                        }
                    }
                    (image as HTMLImageElement).src = imageData;
                    image.onload = (): void => {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                        proxy.tileRenderCount = proxy.tileRenderCount + 1;
                        if ((tileX === 0) && (tileY === 0)) {
                            if (pageIndex === 0 && this.isDocumentLoaded) {
                                proxy.renderPDFInformations();
                                proxy.isInitialLoaded = true;
                                // eslint-disable-next-line
                                let pageData: any = window.sessionStorage.getItem(proxy.documentId + '_pagedata');
                                if (proxy.pageCount <= 100) {
                                    proxy.pdfViewer.fireDocumentLoad(pageData);
                                }
                                proxy.isDocumentLoaded = false;
                                if (proxy.pdfViewer.textSearch && proxy.pdfViewer.isExtractText) {
                                    proxy.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                }
                            }
                        }
                        if (proxy.tileRenderCount === proxy.tileRequestCount) {
                            if (proxy.isTextMarkupAnnotationModule()) {
                                proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(pageIndex);
                            }
                            if(canvas){
                            canvas.style.display = 'none';
                            canvas.src = '#';
                            }
                            const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                            for (let i: number = 0; i < oldPageDiv.length; i++) {
                                pageDiv.removeChild(oldPageDiv[i]);
                            }
                            proxy.isTileImageRendered = false;
                            proxy.tileRenderCount = 0;
                            if (proxy.pdfViewer.magnificationModule) {
                                proxy.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                            proxy.isDrawnCompletely = true;
                        }
                    };
                    let currentImageWidth: number = (((width * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                    let matrixElements: any = matrix.Elements ? matrix.Elements : matrix.Values;
                    let currentImageTop: number = (((matrixElements[5] * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                    let currentImageLeft: number = (((matrixElements[4] * this.getZoomFactor()) / zoomFactor) / scaleFactor);
                    (image as HTMLImageElement).width = currentImageWidth;
                    (image as HTMLImageElement).style.width = currentImageWidth + 'px';    
                    image.style.top = currentImageTop + 'px';
                    image.style.left = currentImageLeft+'px'; 
                    image.style.position = 'absolute';
                }
                if ((tileX === 0) && (tileY === 0)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            } else {
                const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_tileimg_' + pageIndex + '_"]');
                for (let l: number = 0; l < oldCanvases.length; l++) {
                    let tileImgId: string[] = oldCanvases[l].id.split('_');
                    let zoomFactor = proxy.retrieveCurrentZoomFactor();
                    // eslint-disable-next-line
                    let tileData: any = JSON.parse(proxy.getWindowSessionStorageTile(pageIndex, parseFloat(tileImgId[tileImgId.length - 2]), parseFloat(tileImgId[tileImgId.length - 1]), zoomFactor));
                    if (tileData && tileData.zoomFactor) {
                        zoomFactor = tileData.zoomFactor;
                    }
                    if (parseFloat(tileImgId[tileImgId.length - 4]) === pageIndex) {
                        let node: Node = oldCanvases[l];
                        // Make sure it's really an Element
                        if (node.nodeType == Node.ELEMENT_NODE) {
                            (node as HTMLImageElement).onload = (): void => {
                                proxy.showPageLoadingIndicator(pageIndex, false);
                                proxy.tileRenderCount = proxy.tileRenderCount + 1;
                                if ((tileX === 0) && (tileY === 0)) {
                                    if (pageIndex === 0 && this.isDocumentLoaded) {
                                        this.renderPDFInformations();
                                        this.isInitialLoaded = true;
                                        // eslint-disable-next-line
                                        let pageData: any = window.sessionStorage.getItem(proxy.documentId + '_pagedata');
                                        if (proxy.pageCount <= 100) {
                                            proxy.pdfViewer.fireDocumentLoad(pageData);
                                        }
                                        proxy.isDocumentLoaded = false;
                                        if (proxy.pdfViewer.textSearch && proxy.pdfViewer.isExtractText) {
                                            proxy.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                        }
                                    }
                                }
                                if (proxy.tileRenderCount === proxy.tileRequestCount) {
                                    canvas.style.display = 'none';
                                    canvas.src = '#';
                                    if (proxy.isTextMarkupAnnotationModule()) {
                                        proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(pageIndex);
                                    }
                                    const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                                    for (let i: number = 0; i < oldPageDiv.length; i++) {
                                        pageDiv.removeChild(oldPageDiv[i]);
                                    }
                                    proxy.isTileImageRendered = false;
                                    proxy.tileRenderCount = 0;
                                    if (proxy.pdfViewer.magnificationModule) {
                                        proxy.pdfViewer.magnificationModule.rerenderCountIncrement();
                                    }
                                    proxy.isDrawnCompletely = true;
                                }
                            };
                            if (tileData)
                                (node as HTMLImageElement).src = tileData.image;
                        }
                    }
                }
                const tileX: number = data.tileX ? data.tileX : 0;
                const tileY: number = data.tileY ? data.tileY : 0;
                if ((tileX === 0) && (tileY === 0)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            }
        }
    }
    private renderTileCanvas(pageWidth: any, pageHeight: any, pageIndex: any, pageDiv: any, zoomFactor: any, scaleFactor: any): any {
        let pageCanvas: any = this.getElement('_pageTileCanvas_' + pageIndex);
        if (!pageCanvas) {
            pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageTileCanvas_' + pageIndex, className: 'e-pv-pageTile-canvas' }) as HTMLCanvasElement;
            pageCanvas.style.width = pageWidth + 'px';
            pageCanvas.style.height = pageHeight + 'px';
            pageCanvas.style.display = 'none';
            pageCanvas.style.backgroundColor = '#fff';
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
            pageDiv.appendChild(pageCanvas);
        }
        return pageCanvas;
    }

    private calculateImageWidth(pageWidth: number, zoomFactor: number, scaleFactor: number, imageWidth: number): number {
        const width: number = (pageWidth / this.getZoomFactor()) * zoomFactor * scaleFactor;
        // eslint-disable-next-line
        if ((parseInt(imageWidth.toString())) === (parseInt(width.toString()))) {
            imageWidth = width;
        }
        imageWidth = ((imageWidth * this.getZoomFactor()) / zoomFactor);
        return imageWidth;
    }

    // eslint-disable-next-line
    private renderPage(data: any, pageIndex: number): void {
        let proxy: PdfViewerBase = this;
        if (data && this.pageSize[pageIndex]) {
            const pageWidth: number = this.getPageWidth(pageIndex);
            const pageHeight: number = this.getPageHeight(pageIndex);
            // eslint-disable-next-line max-len
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLImageElement;
            const pageDiv: HTMLElement = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                pageDiv.style.width = pageWidth + 'px';
                pageDiv.style.height = pageHeight + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                } else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.background = '#fff';
                canvas.style.display = 'block';
                canvas.style.width = pageWidth + 'px';
                canvas.style.height = pageHeight + 'px';
                if (pageWidth < parseFloat(pageDiv.style.width)) {
                    pageDiv.style.boxShadow = 'none';
                }
                // eslint-disable-next-line
                let imageData: string = data['image'];
                if (imageData) {
                    canvas.onload = (): void => {
                        const oldCanvases: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_tileimg_' + pageIndex + '_"]');
                        const pageCanvas: HTMLElement = proxy.getElement('_pageDiv_' + pageIndex);
                        for (let i: number = 0; i < oldCanvases.length; i++) {
                            let tileImgId: string[] = oldCanvases[i].id.split('_');
                            if (parseFloat(tileImgId[tileImgId.length - 3]) != proxy.getZoomFactor())
                                pageCanvas.removeChild(oldCanvases[i]);
                        }
                        const oldPageDiv: NodeListOf<Element> = document.querySelectorAll('img[id*="' + proxy.pdfViewer.element.id + '_oldCanvas"]');
                        for (let i: number = 0; i < oldPageDiv.length; i++) {
                            pageDiv.removeChild(oldPageDiv[i]);
                        }
                        if (this.pdfViewer.magnificationModule) {
                            this.pdfViewer.magnificationModule.rerenderCountIncrement();
                        }
                        this.showPageLoadingIndicator(pageIndex, false);
                        if (pageIndex === 0 && this.isDocumentLoaded) {
                            this.renderPDFInformations();
                            this.isInitialLoaded = true;
                            // eslint-disable-next-line
                            let pageData: any = window.sessionStorage.getItem(this.documentId + '_pagedata');
                            if (this.pageCount <= 100) {
                                this.pdfViewer.fireDocumentLoad(pageData);
                            }
                            this.isDocumentLoaded = false;
                            if (this.pdfViewer.textSearch && this.pdfViewer.isExtractText) {
                                this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                            }
                        }
                        if (this.pdfViewer.magnificationModule) {
                            this.pdfViewer.magnificationModule.pushImageObjects(canvas);
                        }
                    };
                    canvas.src = imageData; 
                }
                this.onPageRender(data, pageIndex, pageDiv);
            }
        }
    }

    // eslint-disable-next-line
    private onPageRender(data: any, pageIndex: number, pageDiv: HTMLElement): void {
        // eslint-disable-next-line
        const aElement: any = pageDiv && pageDiv.getElementsByTagName('a');
        let isAnnotationRendered: boolean = false;
        if (aElement && aElement.length !== 0) {
            for (let index: number = aElement.length - 1; index >= 0; index--) {
                aElement[index].parentNode.removeChild(aElement[index]);
            }
        }
        if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
            this.renderTextContent(data, pageIndex);
        }
        if (this.pdfViewer.formFieldsModule && !this.pdfViewer.magnificationModule.isFormFieldPageZoomed) { 
               this.pdfViewer.formFieldsModule.renderFormFields(pageIndex);
        }
        if (this.pdfViewer.formDesignerModule && !this.isDocumentLoaded) {
            this.pdfViewer.formDesignerModule.rerenderFormFields(pageIndex);
        }
        if (this.pdfViewer.formDesignerModule && this.isDocumentLoaded && this.pdfViewer.magnificationModule.isFormFieldPageZoomed) {
            this.pdfViewer.formFieldsModule.renderFormFields(pageIndex);
            this.pdfViewer.magnificationModule.isFormFieldPageZoomed = false;
        }
        if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
            this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
        }
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
        }
        if (this.documentAnnotationCollections) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // eslint-disable-next-line
            let pageAnnotations: any = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isImportAction) {
            // eslint-disable-next-line
            let pageAnnotations: any = this.checkDocumentCollectionData(pageIndex);
            if (pageAnnotations) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                isAnnotationRendered = true;
            }
        }
        if (this.pdfViewer.annotationModule && (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled())) {
            if (this.isStampAnnotationModule()) {
                // eslint-disable-next-line
                let stampData: any = data['stampAnnotations'];
                if (isAnnotationRendered) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, null, true);
                } else {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
                }
            }
            if (isAnnotationRendered) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation, null, true);
            } else {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule) {
            this.pdfViewer.formDesignerModule.updateCanvas(pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            const canvas1: HTMLElement = this.getElement('_annotationCanvas_' + pageIndex);
            const commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;z-index:1000';
            if (canvas1) {
                const bounds: ClientRect = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex, this.pdfViewer.annotationSelectorSettings);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            if (isAnnotationRendered) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex, true);
            } else {
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
            }
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            // eslint-disable-next-line max-len
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, isAnnotationRendered);
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected && this.pdfViewer.annotationModule.annotationPageIndex === pageIndex) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
        this.isLoadedFormFieldAdded = false;
    }

    /**
     * @private
     * @param {number} pageIndex - page index for rendering the annotation.
     * @returns {void}
     */
    public renderAnnotations(pageIndex: number,isAddedProgrammatically?:boolean): void {
        // eslint-disable-next-line
        let data: any = {};
        if (this.documentAnnotationCollections) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // eslint-disable-next-line
            let pageAnnotations: any = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureAnnotation = pageAnnotations.signatureAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isAnnotationCollectionRemoved) {
            data.shapeAnnotation = [];
            data.measureShapeAnnotation = [];
            data.textMarkupAnnotation = [];
            data.freeTextAnnotation = [];
            data.stampAnnotations = [];
            data.stickyNotesAnnotation = [];
            data.signatureInkAnnotation = [];
        }
        if (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled()) {
            if (this.isStampAnnotationModule()) {
                // eslint-disable-next-line
                let stampData: any = data['stampAnnotations'];
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
            }
            // eslint-disable-next-line max-len
            this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isImportAction) {
            let isAnnotationAdded: boolean = false;
            for (let i: number = 0; i < this.annotationPageList.length; i++) {
                if (this.annotationPageList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            if (!isAnnotationAdded) {
                if (this.importedAnnotation) {
                    this.drawPageAnnotations(this.importedAnnotation, pageIndex, true);
                    this.annotationPageList[this.annotationPageList.length] = pageIndex;
                }
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            const canvas1: HTMLElement = this.getElement('_annotationCanvas_' + pageIndex);
            const commonStyle: string = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;z-index:1000';
            if (canvas1) {
                const bounds: ClientRect = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex,undefined, isAddedProgrammatically);
        }
        if (data && data.signatureAnnotation) {
            this.signatureModule.renderExistingSignature(data.signatureAnnotation, pageIndex, false);
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, false);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    }
    // eslint-disable-next-line
    private renderTextContent(data: any, pageIndex: number): void {
        // eslint-disable-next-line
        let texts: string[] = data['textContent'];
        // eslint-disable-next-line
        let bounds: any = data['textBounds'];
        // eslint-disable-next-line
        let rotation: any = data['rotation'];
        let textLayer: HTMLElement = this.getElement('_textLayer_' + pageIndex);
        if (!textLayer) {
            // eslint-disable-next-line max-len
            textLayer = this.textLayer.addTextLayer(pageIndex, this.getPageWidth(pageIndex), this.getPageHeight(pageIndex), this.getElement('_pageDiv_' + pageIndex));
        }
        if (textLayer && texts && bounds) {
            textLayer.style.display = 'block';
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation);
            } else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation, true);
            }
        }
    }

    private renderPageContainer(pageNumber: number, pageWidth: number, pageHeight: number, topValue: number): void {
        // eslint-disable-next-line max-len
        const pageDiv: HTMLElement = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
        pageDiv.style.width = pageWidth + 'px';
        pageDiv.style.height = pageHeight + 'px';
        if (this.pdfViewer.enableRtl) {
            pageDiv.style.right = this.updateLeftPosition(pageNumber) + 'px';
        } else {
            pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        }
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, 'block');
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && !this.isThumb) {
            this.updateMobileScrollerPosition();
        }
    }

    private renderPDFInformations(): void {
        if (this.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
        }
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.initializeAcccordionContainer();
            }
            if (this.pdfViewer.isCommandPanelOpen) {
                this.pdfViewer.annotation.showCommentsPanel();
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createRequestForComments();
        }
    }

    private orderPageDivElements(pageDiv: HTMLElement, pageIndex: number): void {
        const nextElement: HTMLElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (nextElement) {
            this.pageContainer.insertBefore(pageDiv, nextElement);
        } else {
            this.pageContainer.appendChild(pageDiv);
        }
    }
    /**
     * @param pageDiv
     * @param pageWidth
     * @param pageHeight
     * @param pageNumber
     * @param displayMode
     * @param pageDiv
     * @param pageWidth
     * @param pageHeight
     * @param pageNumber
     * @param displayMode
     * @param pageDiv
     * @param pageWidth
     * @param pageHeight
     * @param pageNumber
     * @param displayMode
     * @private
     */
    // eslint-disable-next-line
    public renderPageCanvas(pageDiv: HTMLElement, pageWidth: number, pageHeight: number, pageNumber: number, displayMode: string): any {
        if (pageDiv) {
            // eslint-disable-next-line
            let pageCanvas: any = this.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                pageCanvas.width = pageWidth;
                pageCanvas.height = pageHeight;
                pageCanvas.style.display = 'block';
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageCanvas.style.marginLeft = 'auto';
                    pageCanvas.style.marginRight = 'auto';
                }
            } else {
                // eslint-disable-next-line max-len
                pageCanvas = createElement('img', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' }) as HTMLImageElement;
                pageCanvas.width = pageWidth;
                pageCanvas.height = pageHeight;
                pageCanvas.style.display = displayMode;
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageCanvas.style.marginLeft = 'auto';
                    pageCanvas.style.marginRight = 'auto';
                }
                pageDiv.appendChild(pageCanvas);
            }
            if (this.pdfViewer.annotationModule && this.pdfViewer.annotation) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
            }
            if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
                this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
            }
            if (this.pdfViewer.formDesignerModule && !this.pdfViewer.annotationModule) {
                this.pdfViewer.formDesignerModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
            }
            return pageCanvas;
        }
    }

    /**
     * @private
     * @param {any} pageCanvas - The canvas for rendering the page.
     * @param {any} pageNumber - The page number for adding styles.
     * @returns {void}
     */
    // eslint-disable-next-line
    public applyElementStyles(pageCanvas: any, pageNumber: number): void {
        if (this.isMixedSizeDocument && pageCanvas) {
            const canvasElement: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
            const oldCanvas: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);
            if (pageCanvas && canvasElement && canvasElement.offsetLeft > 0) {
                pageCanvas.style.marginLeft = canvasElement.offsetLeft + 'px';
                pageCanvas.style.marginRight = canvasElement.offsetLeft + 'px';
            } else if (oldCanvas && oldCanvas.offsetLeft > 0) {
                pageCanvas.style.marginLeft = oldCanvas.offsetLeft + 'px';
                pageCanvas.style.marginRight = oldCanvas.offsetLeft + 'px';
            } else {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
        }
    }
    /**
     * @private
     * @param  {number} pageIndex - page index for updating positon.
     * @returns {void}
     */
    public updateLeftPosition(pageIndex: number): number {
        let leftPosition: number;
        let width: number = this.viewerContainer.getBoundingClientRect().width;
        if (width === 0) {
            width = parseFloat(this.pdfViewer.width.toString());
        }
        // eslint-disable-next-line max-len
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            if (this.viewerContainer.clientWidth > 0) {
                leftPosition = (this.viewerContainer.clientWidth - (this.highestWidth * this.getZoomFactor())) / 2;
            } else {
                leftPosition = (width - (this.highestWidth * this.getZoomFactor())) / 2;
            }
            let pageDiff: number = (this.highestWidth * this.getZoomFactor() - this.getPageWidth(pageIndex)) / 2;
            if (leftPosition > 0) {
                leftPosition += pageDiff;
            } else {
                leftPosition = pageDiff;
            }
        } else {
            if (this.viewerContainer.clientWidth > 0) {
                leftPosition = (this.viewerContainer.clientWidth - this.getPageWidth(pageIndex)) / 2;
            } else {
                leftPosition = (width - this.getPageWidth(pageIndex)) / 2;
            }
        }
        let isLandscape: boolean = false;
        if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
            isLandscape = true;
        }
        // eslint-disable-next-line max-len
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            const leftValue: number = leftPosition;
            if (leftPosition > 0 && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
                // eslint-disable-next-line
                leftPosition = leftValue;
            } else {
                leftPosition = this.pageLeft;
            }
            if ((leftPosition > 0) && this.isMixedSizeDocument) {
                if (leftValue > 0) {
                    leftPosition = leftValue;
                }
            }
        }
        return leftPosition;
    }
    /**
     * @private
     * @param {number} pageIndex - The page index for positon.
     * @returns {void}
     */
    public applyLeftPosition(pageIndex: number): void {
        let leftPosition: number;
        if (this.pageSize[pageIndex]) {
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                if (this.viewerContainer.clientWidth > 0) {
                    // eslint-disable-next-line max-len
                    leftPosition = (this.viewerContainer.clientWidth - (this.highestWidth * this.getZoomFactor())) / 2;
                } else {
                    // eslint-disable-next-line max-len
                    leftPosition = (this.viewerContainer.getBoundingClientRect().width - (this.highestWidth * this.getZoomFactor())) / 2;
                }
				let pageDiff: number = (this.highestWidth * this.getZoomFactor() - this.getPageWidth(pageIndex)) / 2;
                if (leftPosition > 0) {
                    leftPosition += pageDiff;
                } else {
                    leftPosition = pageDiff;
                }
            } else {
                if (this.viewerContainer.clientWidth > 0) {
                    // eslint-disable-next-line max-len
                    leftPosition = (this.viewerContainer.clientWidth - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
                } else {
                    // eslint-disable-next-line max-len
                    leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
                }
            }
            let isLandscape: boolean = false;
            if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
                isLandscape = true;
            }
            // eslint-disable-next-line max-len
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                const leftValue: number = leftPosition;
                leftPosition = this.pageLeft;
                // eslint-disable-next-line max-len
                if ((leftValue > 0) && this.isMixedSizeDocument) {
                    leftPosition = leftValue;
                }
            }
            // eslint-disable-next-line max-len
            const pageDiv: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (!this.pdfViewer.enableRtl) {
                    pageDiv.style.left = leftPosition + 'px';
                } else {
                    pageDiv.style.right = leftPosition + 'px';
                }
            }
        }
    }

    private updatePageHeight(viewerHeight: number, toolbarHeight: number): string {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    }
    // eslint-disable-next-line
    private viewerContainerOnScroll = (event: any): void => {
        let proxy: PdfViewerBase = null;
        proxy = this;
        let allowServerDataBind: boolean = proxy.pdfViewer.allowServerDataBinding;
        proxy.pdfViewer.enableServerDataBinding(false);
        let scrollposX: number = 0;
        let scrollposY: number = 0;
        if (event.touches && (Browser.isDevice && !this.pdfViewer.enableDesktopMode)) {
            // eslint-disable-next-line
            let ratio: any = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - this.toolbarHeight);
            if (this.isThumb) {
                this.ispageMoved = true;
                event.preventDefault();
                this.mobilePageNoContainer.style.display = 'block';
                scrollposX = event.touches[0].pageX - this.scrollX;
                scrollposY = event.touches[0].pageY - this.viewerContainer.offsetTop;
                this.viewerContainer.scrollTop = scrollposY * ratio;
                // eslint-disable-next-line
                let containerValue: any = event.touches[0].pageY;
                // eslint-disable-next-line
                let toolbarHeight: any = this.pdfViewer.toolbarModule ? 0 : 50;
                if (this.viewerContainer.scrollTop !== 0 && ((containerValue) <= (this.viewerContainer.clientHeight - toolbarHeight))) {
                    this.mobileScrollerContainer.style.top = containerValue + 'px';
                }
            } else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                if (!(this.isWebkitMobile && (Browser.isDevice && !this.pdfViewer.enableDesktopMode))) {
                    this.mobilePageNoContainer.style.display = 'none';
                    scrollposY = this.touchClientY - event.touches[0].pageY;
                    scrollposX = this.touchClientX - event.touches[0].pageX;
                    this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + (scrollposY);
                    this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + (scrollposX);
                }
                // eslint-disable-next-line
                this.updateMobileScrollerPosition();
                this.touchClientY = event.touches[0].pageY;
                this.touchClientX = event.touches[0].pageX;
            }
        }
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        const pageIndex: number = this.currentPageNumber;
        this.scrollHoldTimer = null;
        this.contextMenuModule.close();
        const verticalScrollValue: number = this.viewerContainer.scrollTop;
        // eslint-disable-next-line max-len
        for (let i: number = 0; i < this.pageCount; i++) {
            if (this.pageSize[i] != null) {
                const pageHeight: number = this.getPageHeight(i);
                if (pageHeight < 150) {
                    this.pageStopValue = 75;
                } else if (pageHeight >= 150 && pageHeight < 300) {
                    this.pageStopValue = 125;
                } else if (pageHeight >= 300 && pageHeight < 500) {
                    this.pageStopValue = 200;
                } else {
                    this.pageStopValue = 300;
                }
                // eslint-disable-next-line max-len
                if ((verticalScrollValue + this.pageStopValue) <= (this.getPageTop(i) + pageHeight)) {
                    this.currentPageNumber = i + 1;
                    this.pdfViewer.currentPageNumber = i + 1;
                    break;
                }
            }
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.magnificationModule && this.pdfViewer.magnificationModule.fitType === 'fitToPage' && this.currentPageNumber > 0) {
            if (this.pageSize[this.currentPageNumber - 1]) {
                if (!this.isPanMode && (!Browser.isDevice && this.pdfViewer.enableDesktopMode)) {
                    this.viewerContainer.scrollTop = this.pageSize[this.currentPageNumber - 1].top * this.getZoomFactor();
                }
            }
        }
        this.renderElementsVirtualScroll(this.currentPageNumber);
        // eslint-disable-next-line max-len
        if (!this.isViewerMouseDown && !this.getPinchZoomed() && !this.getPinchScrolled() && !this.getPagesPinchZoomed() || this.isViewerMouseWheel) {
            this.pageViewScrollChanged(this.currentPageNumber);
            this.isViewerMouseWheel = false;
        } else {
            this.showPageLoadingIndicator(this.currentPageNumber - 1, false);
        }
        if (this.pdfViewer.toolbarModule) {
            if (!isBlazor()) {
                this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            }
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
            if (!isBlazor()) {
                if (!Browser.isDevice || this.pdfViewer.enableDesktopMode) {
                    this.pdfViewer.toolbarModule.updateNavigationButtons();
                }
            }
        }
        if (Browser.isDevice && !this.pdfViewer.enableDesktopMode) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
        if (pageIndex !== this.currentPageNumber) {
            if (proxy.pdfViewer.thumbnailViewModule && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked = false;
            }
            this.pdfViewer.firePageChange(pageIndex);
        }
        if (this.pdfViewer.magnificationModule) {
            if (!this.isPanMode && (!Browser.isDevice && this.pdfViewer.enableDesktopMode)) {
                this.pdfViewer.magnificationModule.updatePagesForFitPage(this.currentPageNumber - 1);
            }
        }
        const currentPage: HTMLElement = this.getElement('_pageDiv_' + (this.currentPageNumber - 1));
        if (currentPage) {
            currentPage.style.visibility = 'visible';
        }
        if (this.isViewerMouseDown) {
            if (this.getRerenderCanvasCreated() && !this.isPanMode) {
                this.pdfViewer.magnificationModule.clearIntervalTimer();
            }
            // eslint-disable-next-line
            let data: any = this.getStoredData(this.currentPageNumber);
            if (data) {
                this.isDataExits = true;
                this.initiatePageViewScrollChanged();
                this.isDataExits = false;
            } else {
                // eslint-disable-next-line max-len
                const timer: number = this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll ? this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll : 100;
                this.scrollHoldTimer = setTimeout(
                    () => {
                        this.initiatePageViewScrollChanged();
                    }, timer);
            }
        }
        if (this.pdfViewer.annotation && this.navigationPane.commentPanelContainer) {
            this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelScrollTop(this.currentPageNumber);
        }
        // eslint-disable-next-line max-len
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && event.touches && event.touches[0].target.className !== 'e-pv-touch-ellipse') {
            setTimeout(
                () => {
                    this.updateMobileScrollerPosition();
                }, 500);
        }
        proxy.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    };

    /**
     * @private
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @returns {number}
     */
    public getPageNumberFromClientPoint(clientPoint: Point): number {
        let pointX: number = clientPoint.x + this.viewerContainer.scrollLeft;
        let pointY: number = clientPoint.y + this.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.pageCount; i++) {
            if (pointY < (this.pageSize[i].top + this.pageSize[i].height)) {
            let viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect(); 
            let pageLeft: number = ((viewerContainerBounds.width - this.pageSize[i].width) / 2) + (viewerContainerBounds as DOMRect).x;
            let verticalScrollPosition: number = 0;
            if(pointY > this.pageSize[i].top) {
                verticalScrollPosition = (pointY - this.pageSize[i].top );
            } else {
                verticalScrollPosition = (this.pageSize[i].top - pointY);
            }
            if (verticalScrollPosition > 0) {
                if (this.pageSize[i] != null) {
                    const pageHeight: number = this.getPageHeight(i);
                    if ((pointX < pageLeft) || (pointX > (pageLeft + (this.pageSize[i].width)))) {   
                        return -1;
                    }
                    if (verticalScrollPosition <= (this.getPageTop(i) + this.pageSize[i].height)) {
                        return i + 1;
                    }
                }
            }
          }
        }
        return -1;
    }

    /**
     * @private
     * @param {Point} clientPoint - The user should provide a x, y coordinates.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point}
     */
    public convertClientPointToPagePoint(clientPoint: Point, pageNumber: number): Point {
       if (pageNumber !== -1) {  
            let viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect(); 
            let pageLeft: number = ((viewerContainerBounds.width - this.pageSize[pageNumber - 1].width) / 2) + (viewerContainerBounds as DOMRect).x;
            let pagePoint: any = {x: (clientPoint.x + this.viewerContainer.scrollLeft) - pageLeft, y: (clientPoint.y + this.viewerContainer.scrollTop) - this.pageSize[pageNumber - 1].top};
            return pagePoint;
       }
       return null;
    }

    /**
     * @private
     * @param {Point} pagePoint - The user needs to provide a page x, y position.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point}
     */
    public convertPagePointToClientPoint(pagePoint: any, pageNumber: number): Point {
        if (pageNumber !== -1) {
            let viewerContainerBounds: DOMRect | ClientRect = this.getElement('_pageViewContainer').getBoundingClientRect(); 
            let pageLeft = ((viewerContainerBounds.width - this.pageSize[pageNumber - 1].width) / 2) + (viewerContainerBounds as DOMRect).x;
            let clientPoint: any = {x: pagePoint.x + pageLeft, y: pagePoint.y + this.pageSize[pageNumber - 1].top };
            return clientPoint;
        }
        return null;
    }

    /**
     * @private
     * @param {Point} pagePoint - The user needs to provide a page x, y position.
     * @param {number} pageNumber - We need to pass pageNumber.
     * @returns {Point}
     */
    public convertPagePointToScrollingPoint(pagePoint: any, pageNumber: number): Point {
        if (pageNumber !== -1) { 
            let scrollingPoint: any = { x: pagePoint.x + this.viewerContainer.scrollLeft, y: pagePoint.y + this.viewerContainer.scrollTop };
            return scrollingPoint;
        }
        return null;
    }

    private initiatePageViewScrollChanged(): void {
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        this.scrollHoldTimer = null;
        if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
            this.scrollPosition = this.viewerContainer.scrollTop;
            this.pageViewScrollChanged(this.currentPageNumber);
        }
    }

    private renderCountIncrement(): void {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.renderCountIncrement();
        }
    }
    /**
     * @private
     * @param {number} currentPageNumber - The current pagenumber.
     * @returns {void}
     */
    public pageViewScrollChanged(currentPageNumber: number): void {
        if (this.isPanMode) {
            if (this.renderedPagesList.indexOf(currentPageNumber - 1) === -1) {
                this.reRenderedCount = 0;
            }
        } else {
            this.reRenderedCount = 0;
        }
        const currentPageIndex: number = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            let isSkip: boolean = false;
            if (this.isDataExits && !this.getStoredData(currentPageIndex)) {
                isSkip = true;
            }
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified() && !isSkip) {
                this.renderCountIncrement();
                this.createRequestForRender(currentPageIndex);
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            const previous: number = currentPageIndex - 1;
            let isSkip: boolean = false;
            const canvas: HTMLImageElement = this.getElement('_pageCanvas_' + previous) as HTMLImageElement;
            if (this.isDataExits && !this.getStoredData(previous)) {
                isSkip = true;
            }
            if (canvas !== null && !isSkip) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.renderCountIncrement();
                    this.createRequestForRender(previous);

                }
            }
            if (this.isMinimumZoom) {
                this.renderPreviousPagesInScroll(previous);
            }
            let next: number = currentPageIndex + 1;
            let pageHeight: number = 0;
            if (next < this.pageCount) {
                pageHeight = this.getPageHeight(next);
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified() && pageHeight) {
                    this.createRequestForRender(next);
                    this.renderCountIncrement();
                    while (this.viewerContainer.clientHeight > pageHeight) {
                        next = next + 1;
                        if (next < this.pageCount) {
                            this.renderPageElement(next);
                            this.createRequestForRender(next);
                            pageHeight += this.getPageHeight(next);
                            this.renderCountIncrement();
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }

    private renderPreviousPagesInScroll(pageIndex: number): void {
        const next: number = pageIndex - 1;
        const pageNumber: number = next - 1;
        if (next > 0) {
            if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                this.createRequestForRender(next);
                this.renderCountIncrement();
            }
            if (pageNumber > 0) {
                if (this.renderedPagesList.indexOf(pageNumber) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(pageNumber);
                    this.renderCountIncrement();
                }
            }
        }
    }

    private downloadDocument(blobUrl: string): void {
        // eslint-disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        const anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                (anchorElement as HTMLAnchorElement).download = this.downloadFileName;
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                const padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    }

    private downloadExportAnnotationJson(blobUrl: string, isForm?: boolean): void {
        // eslint-disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        const anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                if (this.pdfViewer.exportAnnotationFileName !== null) {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json';
                } else {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName.split('.')[0] + '.json';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
            if (isForm) {
                this.pdfViewer.fireFormExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
            } else {
                this.pdfViewer.fireExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
            }
        } else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                const padCharacter: string = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
            if (isForm) {
                this.pdfViewer.fireFormExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + '.json');
            } else {
                this.pdfViewer.fireExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + '.json');
            }
        }
    }

    private downloadExportedXFdfAnnotation(blobUrl: string): void {
        // eslint-disable-next-line
        let Url: any = URL || webkitURL;
        blobUrl = Url.createObjectURL(blobUrl);
        const anchorElement: HTMLElement = createElement('a');
        if (anchorElement.click) {
            (anchorElement as HTMLAnchorElement).href = blobUrl;
            (anchorElement as HTMLAnchorElement).target = '_parent';
            if ('download' in anchorElement) {
                if (this.pdfViewer.exportAnnotationFileName !== null) {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + '.xfdf';
                } else {
                    (anchorElement as HTMLAnchorElement).download = this.pdfViewer.fileName.split('.')[0] + '.xfdf';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
            this.pdfViewer.fireExportSuccess(blobUrl, (anchorElement as HTMLAnchorElement).download);
        }
    }
    /**
     * @private
     * @param {string} path - The path for exporting the fields.
     * @returns {void}
     */
    public exportFormFields(path?: string): void {
        this.createRequestForExportFormfields(false, path);
    }

    /**
     * @param source
     * @private
     */
    // eslint-disable-next-line
    public importFormFields(source: any): void {
        this.createRequestForImportingFormfields(source);
    }

    /**
     * @param isObject
     * @param path
     * @private
     */
    // eslint-disable-next-line
    public createRequestForExportFormfields(isObject?: boolean, path?: string): any {
        let proxy: PdfViewerBase = null;
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // eslint-disable-next-line
            let jsonObject: any = proxy.createFormfieldsJsonData();
            proxy.pdfViewer.fireFormExportStarted(jsonObject.pdfAnnotation);
            jsonObject.action = 'ExportFormFields';
            // eslint-disable-next-line
            jsonObject['hashId'] = proxy.hashId;
            // eslint-disable-next-line
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
            if (path && path !== '' && !isObject) {
                // eslint-disable-next-line
                jsonObject['filePath'] = path;
            }
            // eslint-disable-next-line
            jsonObject['elementId'] = this.pdfViewer.element.id;
            // eslint-disable-next-line max-len
            if (proxy.jsonDocumentId) {
                // eslint-disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportFormFields;
            proxy.exportFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
            proxy.exportFormFieldsRequestHandler.url = url;
            proxy.exportFormFieldsRequestHandler.mode = true;
            proxy.exportFormFieldsRequestHandler.responseType = 'text';
            proxy.exportFormFieldsRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            proxy.exportFormFieldsRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                if (data) {
                    if (data) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.exportFormFields, data);
                        if (isObject) {
                            // eslint-disable-next-line
                            let annotationJson: any = decodeURIComponent(escape(atob(data.split(',')[1])));
                            resolve(annotationJson);
                            proxy.pdfViewer.fireFormExportSuccess(annotationJson, proxy.pdfViewer.fileName);
                        } else if (data.split('base64,')[1]) {
                            const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                            if (Browser.isIE || Browser.info.name === 'edge') {
                                window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                            } else {
                                proxy.downloadExportAnnotationJson(blobUrl, true);
                            }
                        }
                    }
                }
            };
            // eslint-disable-next-line
            proxy.exportFormFieldsRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // eslint-disable-next-line
            proxy.exportFormFieldsRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };

        });
        if (isObject) {
            return promise;
        } else {
            return true;
        }
    }

    /**
     * @param source
     * @private
     */
    // eslint-disable-next-line
    public createRequestForImportingFormfields(source: any): void {
        let proxy: PdfViewerBase = null;
        proxy = this;
        // eslint-disable-next-line
        let jsonObject: any = {};
        if (typeof source === 'object') {
            jsonObject.data = JSON.stringify(source);
        } else {
            jsonObject.data = source;
            if (source.split('.')[1] === 'json') {
                // eslint-disable-next-line
                jsonObject['fileName'] = proxy.pdfViewer.fileName;
            }
        }
        proxy.pdfViewer.fireFormImportStarted(source);
        // eslint-disable-next-line
        jsonObject.action = 'ImportFormFields';
        // eslint-disable-next-line
        jsonObject['hashId'] = proxy.hashId;
        // eslint-disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        // eslint-disable-next-line max-len
        if (proxy.jsonDocumentId) {
            // eslint-disable-next-line
            (jsonObject as any).document = proxy.jsonDocumentId;
        }
        const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importFormFields;
        proxy.importFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
        proxy.importFormFieldsRequestHandler.url = url;
        proxy.importFormFieldsRequestHandler.mode = true;
        proxy.importFormFieldsRequestHandler.responseType = 'text';
        proxy.importFormFieldsRequestHandler.send(jsonObject);
        // eslint-disable-next-line
        proxy.importFormFieldsRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
            let data: any = result.data;
            if (data && data !== 'null') {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                        if (typeof data !== 'object') {
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                            data = null;
                        }
                    } catch (error) {
                        proxy.pdfViewer.fireFormImportFailed(source, proxy.pdfViewer.localeObj.getConstant('File not found'));
                        if (isBlazor()) {
                            const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                            promise.then((value: string) => {
                                proxy.openImportExportNotificationPopup(value);
                            });
                        } else {
                            proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                        }
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                        data = null;
                    }

                }
                proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.importFormFields, data);
                proxy.pdfViewer.fireFormImportSuccess(source);
                window.sessionStorage.removeItem(this.documentId + '_formfields');
                this.pdfViewer.formFieldsModule.removeExistingFormFields();
                window.sessionStorage.removeItem(this.documentId + '_formDesigner');
                proxy.saveFormfieldsData(data);
                for (let i: number = 0; i < proxy.renderedPagesList.length; i++) {
                    this.pdfViewer.formFieldsModule.renderFormFields(i);
                }
            } else {
                proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                if (isBlazor()) {
                    const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                    promise.then((value: string) => {
                        proxy.openImportExportNotificationPopup(value);
                    });
                } else {
                    proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                }
            }
        };
        // eslint-disable-next-line
        proxy.importFormFieldsRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
        // eslint-disable-next-line
        proxy.importFormFieldsRequestHandler.onError = function (result: any) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
    }

    /**
     * @public
     * @returns {any} - Returns the Json data.
     */
    // eslint-disable-next-line
    public createFormfieldsJsonData(): any {
        // eslint-disable-next-line
        let jsonObject: any = {};
        if (this.pdfViewer.formDesignerModule) {
            const fieldsData: string = this.pdfViewer.formDesignerModule.downloadFormDesigner();
            // eslint-disable-next-line
            jsonObject['formDesigner'] = fieldsData;
        } else if (this.pdfViewer.formFieldsModule) {
            const fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // eslint-disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        return jsonObject;
    }

    // eslint-disable-next-line
    private constructJsonDownload(): any {
        // eslint-disable-next-line
        let jsonObject: any = { hashId: this.hashId };
        if (this.jsonDocumentId) {
            jsonObject.documentId = this.jsonDocumentId;
        }
        jsonObject.uniqueId = this.documentId;
        this.importPageList = [];
        if (this.pdfViewer.annotationModule) {
            this.saveImportedAnnotations();
        }
        if (this.isTextMarkupAnnotationModule()) {
            this.isJsonExported = false;
            // eslint-disable-next-line max-len
            const textMarkupAnnotationCollection: string = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            // eslint-disable-next-line
            jsonObject['textMarkupAnnotations'] = textMarkupAnnotationCollection;
        }
        if (this.isShapeAnnotationModule()) {
            this.isJsonExported = false;
            // eslint-disable-next-line max-len
            const shapeAnnotations: string = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
            // eslint-disable-next-line
            jsonObject['shapeAnnotations'] = shapeAnnotations;
        }
        if (this.isCalibrateAnnotationModule()) {
            this.isJsonExported = false;
            // eslint-disable-next-line max-len
            const calibrateAnnotations: string = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
            // eslint-disable-next-line
            jsonObject['measureShapeAnnotations'] = calibrateAnnotations;
        }
        if (this.isStampAnnotationModule()) {
            // eslint-disable-next-line max-len
            const stampAnnotationCollection: string = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
            // eslint-disable-next-line
            jsonObject['stampAnnotations'] = stampAnnotationCollection;
        }
        if (this.isCommentAnnotationModule()) {
            // eslint-disable-next-line max-len
            const stickyAnnotationCollection: string = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
            // eslint-disable-next-line
            jsonObject['stickyNotesAnnotation'] = stickyAnnotationCollection;
        }
        if (this.isImportAction) {
            const importList: string = JSON.stringify(this.importPageList);
            // eslint-disable-next-line
            jsonObject['importPageList'] = importList;
        }
        if (this.pdfViewer.formDesignerModule) {
            const fieldsData: string = this.pdfViewer.formDesignerModule.downloadFormDesigner();
            // eslint-disable-next-line
            jsonObject['formDesigner'] = fieldsData;
        } else if (this.pdfViewer.formFieldsModule) {
            const fieldsData: string = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // eslint-disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        const signatureData: string = this.signatureModule.saveSignature();
        // eslint-disable-next-line
        jsonObject['signatureData'] = signatureData;
        if (this.pdfViewer.isSignatureEditable) {
            // eslint-disable-next-line
            jsonObject['isSignatureEdited'] = this.pdfViewer.isSignatureEditable;
        }
        if (this.isFreeTextAnnotationModule()) {
            // eslint-disable-next-line max-len
            const freeTextAnnotationCollection: string = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations(false);
            // eslint-disable-next-line
            jsonObject['freeTextAnnotation'] = freeTextAnnotationCollection;
        }
        if (this.isInkAnnotationModule()) {
            const inkSignatureData: string = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
            // eslint-disable-next-line
            jsonObject['inkSignatureData'] = inkSignatureData;
        }
        // eslint-disable-next-line
        jsonObject['action'] = 'Download';
        // eslint-disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        return jsonObject;
    }
    /**
     * @private
     * @param {string} annotationID - The annotationID.
     * @returns {any} - Returns collection of type.
     */
    // eslint-disable-next-line
    public checkFormFieldCollection(annotationID: string): any {
        let isFormFieldAnnotation: boolean = false;
        // eslint-disable-next-line
        let formDesignerData: any = null;
        formDesignerData = this.getItemFromSessionStorage('_formDesigner');
        if (formDesignerData) {
            // eslint-disable-next-line
            const formFieldsData: any = JSON.parse(formDesignerData);
            for (let i: number = 0; i < formFieldsData.length; i++) {
                if (formFieldsData[i].FormField.formFieldAnnotationType === 'RadioButton') {
                    for (let j: number = 0; j < formFieldsData[i].FormField.radiobuttonItem.length; j++) {
                        if (annotationID === formFieldsData[i].FormField.radiobuttonItem[j].id.split('_')[0]) {
                            isFormFieldAnnotation = true;
                            break;
                        }
                    }
                } else if (formFieldsData[i].Key.split('_')[0] === annotationID) {
                    isFormFieldAnnotation = true;
                    break;
                }
            }
        }
        return isFormFieldAnnotation;
    }
    /**
     * @private
     * @returns {boolean} - Returns whether freetext module is enabled.
     */
    public isFreeTextAnnotationModule(): boolean {
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // eslint-disable-next-line
    private createRequestForDownload(): void {
        let proxy: PdfViewerBase = null;
        proxy = this;
        proxy.pdfViewer.fireDownloadStart(proxy.downloadFileName);
        // eslint-disable-next-line
        const jsonObject: any = this.constructJsonDownload();
        this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
        this.dowonloadRequestHandler.responseType = 'text';
        if (this.validateForm && this.pdfViewer.enableFormFieldsValidation) {
            this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
            this.validateForm = false;
        } else {
            this.dowonloadRequestHandler.send(jsonObject);
        }
        // eslint-disable-next-line
        this.dowonloadRequestHandler.onSuccess = function (result: any) {
            // eslint-disable-next-line
            let data: any = result.data;
            if (data) {
                if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                    data = null;
                }
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    if (proxy.pdfViewer.downloadFileName && (proxy.pdfViewer.downloadFileName !== proxy.downloadFileName)) {
                        proxy.downloadFileName = proxy.pdfViewer.downloadFileName;
                    }
                    proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.download, data);
                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.downloadFileName);
                    } else {
                        proxy.downloadDocument(blobUrl);
                    }
                    proxy.pdfViewer.fireDownloadEnd(proxy.downloadFileName, data);
                }
                proxy.updateDocumentAnnotationCollections();
            } else {
                proxy.pdfViewer.fireDownloadEnd(proxy.downloadFileName, 'PDF Document saved in server side successfully');
            }
        };
        // eslint-disable-next-line
        this.dowonloadRequestHandler.onFailure = function (result: any) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
        // eslint-disable-next-line
        this.dowonloadRequestHandler.onError = function (result: any) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
    }
    /**
     * @param pageWidth
     * @private
     */
    // eslint-disable-next-line
    public getTileCount(pageWidth: any): number {
        if (pageWidth && typeof pageWidth === 'number') {
            const defaultWidth: number = 816;
            let tileCount: number = 1;
            if (this.getZoomFactor() > 2 && pageWidth <= 1200) {
                tileCount = 2;
            } else {
                tileCount = pageWidth / defaultWidth;
            }
            // eslint-disable-next-line radix
            const tileValue: number = parseInt(tileCount.toFixed());
            if (tileValue <= 0) {
                return 1;
            } else {
                if (this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    return tileValue;
                } else {
                    return 1;
                }
            }
        } else {
            return 1;
        }
    }

    private createRequestForRender(pageIndex: number): void {
        let proxy: PdfViewerBase = null;
        proxy = this;
        const canvas: HTMLElement = proxy.getElement('_pageCanvas_' + pageIndex);
        const oldCanvas: HTMLElement = proxy.getElement('_oldCanvas_' + pageIndex);
        if (this.pageSize && this.pageSize[pageIndex]) {
            const pageWidth: number = this.pageSize[pageIndex].width;
            const pageHeight: number = this.pageSize[pageIndex].height;
            const tilecanvas: HTMLCanvasElement = this.getElement('_pageCanvas_' + pageIndex) as HTMLCanvasElement;
            // eslint-disable-next-line
            let viewPortWidth: any = 1200; // On diving the value greater than 1200 we will get the tile count as 2.
            // eslint-disable-next-line
            let viewPortHeight: any = proxy.pdfViewer.element.clientHeight > 0 ? proxy.pdfViewer.element.clientHeight : proxy.pdfViewer.element.style.height;
            // eslint-disable-next-line radix
            viewPortWidth = parseInt(viewPortWidth);
            // eslint-disable-next-line radix
            viewPortHeight = parseInt(viewPortHeight) ? parseInt(viewPortHeight) : 500; //we have applied minimum-height as 500.
            let noTileX: number;
            let noTileY: number;
            const tileCount: number = this.getTileCount(pageWidth);
            if (canvas) {
                if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                    if (proxy.isInitialLoaded) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    }
                }
                // eslint-disable-next-line
                let data: any = proxy.getStoredData(pageIndex);

                noTileX = noTileY = tileCount;
                const tileSettings: TileRenderingSettingsModel = proxy.pdfViewer.tileRenderingSettings;
                if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
                    if ((viewPortWidth < pageWidth || this.getZoomFactor() > 2)) {
                        noTileX = tileSettings.x;
                        noTileY = tileSettings.y;
                    }
                }
                proxy.tileRequestCount = noTileX * noTileY;
                const zoomFactor: number = this.retrieveCurrentZoomFactor();
                let isPageRequestSent: boolean;
                if (tileCount === 1) {
                    data = proxy.getStoredData(pageIndex);
                    isPageRequestSent = proxy.pageRequestSent(pageIndex, 0, 0);
                } else {
                    // eslint-disable-next-line
                    let tileData: any = JSON.parse(proxy.getWindowSessionStorageTile(pageIndex, 0, 0, zoomFactor));
                    if (tileData) {
                        data = tileData;
                    }
                }
                if (data && data.uniqueId === proxy.documentId) {
                    canvas.style.backgroundColor = '#fff';
                    if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !this.pageSize[pageIndex]) {
                        return;
                    }
                    const zoomFactor: number = this.retrieveCurrentZoomFactor();
                    if (zoomFactor > 2 && pageWidth <= 1200) {
                        viewPortWidth = 700;
                    } else {
                        viewPortWidth = 1200;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        viewPortWidth = 1200;
                    }
                    if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        proxy.renderPage(data, pageIndex);
                    } else {
                        proxy.isTileImageRendered = true;
                        proxy.tileRenderCount = 0;
                        proxy.tileRenderPage(data, pageIndex);
                        for (let k: number = 0; k < noTileX; k++) {
                            for (let l: number = 0; l < noTileY; l++) {
                                if (k === 0 && l === 0) {
                                    continue;
                                }
                                data = JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor));
                                if (data) {
                                    proxy.tileRenderPage(data, pageIndex);
                                }
                            }
                        }
                    }
                    data = null;
                } else if (data === null || !isPageRequestSent) {
                    if (this.getPagesPinchZoomed()) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    } else {
                        proxy.showPageLoadingIndicator(pageIndex, true);
                    }
                    if (proxy.getPagesZoomed()) {
                        if (proxy.isInitialLoaded) {
                            proxy.showPageLoadingIndicator(pageIndex, false);
                        }
                    }
                    if (proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) {
                        return;
                    }
                    if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                        noTileX = 1;
                        noTileY = 1;
                    }
                    proxy.tileRenderCount = 0;
                    proxy.isTileImageRendered = true;
                    for (let x: number = 0; x < noTileX; x++) {
                        for (let y: number = 0; y < noTileY; y++) {
                            let jsonObject: object = null;
                            const zoomFactor: number = this.retrieveCurrentZoomFactor();
                            if (zoomFactor > 2 && pageWidth <= 1200) {
                                viewPortWidth = 700;
                            } else {
                                viewPortWidth = 1200;
                            }
                            if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                viewPortWidth = 1200;
                            }
                            // eslint-disable-next-line max-len
                            jsonObject = {
                                xCoordinate: (x).toString(), yCoordinate: (y).toString(), viewPortWidth: (viewPortWidth).toString(), viewPortHeight: (viewPortHeight).toString(),
                                pageNumber: (pageIndex).toString(), hashId: proxy.hashId, tilecount: (tileCount).toString(), tileXCount: (noTileX).toString(), tileYCount: (noTileY).toString(),
                                // eslint-disable-next-line max-len
                                zoomFactor: (zoomFactor).toString(), action: 'RenderPdfPages', uniqueId: this.documentId, elementId: proxy.pdfViewer.element.id
                            };
                            if (this.jsonDocumentId) {
                                // eslint-disable-next-line
                                (jsonObject as any).documentId = this.jsonDocumentId;
                            }
                            proxy.pageRequestHandler = new AjaxHandler(this.pdfViewer);
                            // eslint-disable-next-line max-len
                            proxy.pageRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderPages;
                            proxy.pageRequestHandler.responseType = 'json';
                            proxy.pageRequestHandler.send(jsonObject);
                            proxy.requestLists.push(proxy.documentId + '_' + pageIndex + '_' + x + '_' + y + '_' + zoomFactor);
                            // eslint-disable-next-line
                            proxy.pageRequestHandler.onSuccess = function (result: any) {
                                // eslint-disable-next-line max-len
                                if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !proxy.pageSize[pageIndex]) {
                                    return;
                                }
                                // eslint-disable-next-line
                                let data: any = result.data;
                                if (data) {
                                    if (typeof data !== 'object') {
                                        try {
                                            data = JSON.parse(data);
                                        } catch (error) {
                                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderPages);
                                            data = null;
                                        }
                                    }
                                }
                                if (data) {
                                    while (typeof data !== 'object') {
                                        data = JSON.parse(data);
                                    }
                                    if (data.image && data.uniqueId === proxy.documentId) {
                                        let currentPageWidth: number = (data.pageWidth && data.pageWidth > 0) ? data.pageWidth : pageWidth;
                                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.renderPages, data);
                                        const pageNumber: number = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                        if ((viewPortWidth >= currentPageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                            proxy.storeWinData(data, pageNumber);
                                        } else {
                                            proxy.storeWinData(data, pageNumber, data.tileX, data.tileY);
                                        }
                                        if ((viewPortWidth >= currentPageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                            proxy.renderPage(data, pageNumber);
                                        } else {
                                            proxy.tileRenderPage(data, pageNumber);
                                        }
                                    }
                                }
                            };
                            // eslint-disable-next-line
                            this.pageRequestHandler.onFailure = function (result: any) {
                                // eslint-disable-next-line max-len
                                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                            };
                            // eslint-disable-next-line
                            this.pageRequestHandler.onError = function (result: any) {
                                proxy.openNotificationPopup();
                                // eslint-disable-next-line max-len
                                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                            };
                        }
                    }
                }
                proxy.renderedPagesList.push(pageIndex);
            }
        }
    }

    private pageRequestSent(pageIndex: number, tileX?: number, tileY?: number): boolean {
        const zoomFactor: number = this.retrieveCurrentZoomFactor();
        const currentString: string = this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor;
        if (this.requestLists && this.requestLists.indexOf(currentString) > -1) {
            return true;
        }
        return false;
    }

    /**
     * @private
     * @param {string} status - The status message.
     * @param {string} errorMessage - The error message.
     * @param {string} action - The action.
     * @returns {void}
     */
    public onControlError(status: number, errorMessage: string, action: string): void {
        this.openNotificationPopup();
        this.pdfViewer.fireAjaxRequestFailed(status, errorMessage, action);
    }

    /**
     * @param pageIndex
     * @private
     */
    // eslint-disable-next-line
    public getStoredData(pageIndex: number, isTextSearch?: boolean): any {
        let zoomFactor: number = this.retrieveCurrentZoomFactor();
        if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
            zoomFactor = 1;
        }
        // eslint-disable-next-line
        let storedData: any = this.getWindowSessionStorage(pageIndex, zoomFactor) ? this.getWindowSessionStorage(pageIndex, zoomFactor) : this.getPinchZoomPage(pageIndex);
        if (!storedData && isTextSearch) {
            // eslint-disable-next-line
            let storedTileData: any = this.getWindowSessionStorageTile(pageIndex, 0, 0, zoomFactor);
            if (storedTileData) {
                storedData = storedTileData;
            }
        }
        // eslint-disable-next-line
        let data: any = null;
        if (storedData) {
            // eslint-disable-next-line
            data = storedData;
            if (!this.isPinchZoomStorage) {
                data = JSON.parse(storedData);
            }
            this.isPinchZoomStorage = false;
        }
        return data;
    }
    /**
     * @private
     * @param  {any} data - The data.
     * @param {number} pageIndex - The pageIndex.
     * @param {number} tileX - The tileX.
     * @param {number} tileY - The tileY.
     * @returns {void}
     */
    // eslint-disable-next-line
    public storeWinData(data: any, pageIndex: number, tileX?: number, tileY?: number): void {
        // eslint-disable-next-line
        let blobObj: string = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        // eslint-disable-next-line
        let Url: any = URL || webkitURL;
        const blobUrl: string = Url.createObjectURL(blobObj);
        // eslint-disable-next-line
        let storeObject: any;
        if ((isNaN(tileX) && isNaN(tileY)) || (tileX === 0 && tileY === 0)) {
            storeObject = {
                // eslint-disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
                // eslint-disable-next-line
                textContent: data['textContent'], width: data['width'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation'], scaleFactor: data['scaleFactor'], uniqueId: data['uniqueId'], zoomFactor: data['zoomFactor'], tileX: tileX, tileY: tileY
            };
            if (this.pageSize[pageIndex]) {
                // eslint-disable-next-line
                this.pageSize[pageIndex].rotation = parseFloat(data['rotation']);
            }
            // eslint-disable-next-line
            this.textLayer.characterBound[pageIndex] = data['characterBounds'];
        } else {
            storeObject = {
                // eslint-disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], tileX: tileX, tileY: tileY, width: data['width'], zoomFactor: data['zoomFactor']
            };
        }
        // eslint-disable-next-line
        let viewPortWidth: any = 816;
        let pageWidth: number = 0;
        if (this.pageSize[pageIndex]) {
            pageWidth = this.pageSize[pageIndex].width;
        }
        this.manageSessionStorage(pageIndex, storeObject, tileX, tileY);
    }

    /**
     * @private
     * @param {XMLHttpRequest} request - The Xml request.
     * @returns {void}
     */
    public setCustomAjaxHeaders(request: XMLHttpRequest): void {
        for (let i: number = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // eslint-disable-next-line max-len
            request.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
    }

    /**
     * @private
     * @param {number} pageIndex - Page index.
     * @returns {object}
     */
    public getPinchZoomPage(pageIndex: number): object {
        // eslint-disable-next-line
        for (let key in this.pinchZoomStorage) {
            // eslint-disable-next-line
            if (this.pinchZoomStorage.hasOwnProperty(key)) {
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    }
    /**
     * @private
     * @param {number} pageIndex - current page index.
     * @param {number} zoomFactor - cuurent zoom factor
     * @returns {string}
     */
    public getWindowSessionStorage(pageIndex: number, zoomFactor: number): string {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
    }
    /**
     * @private
     * @param {number} pageIndex - current page index.
     * @param {number} tileX - cuurent tile x
     * @param {number} tileY - cuurent tile y
     * @param {number} zoomFactor - cuurent zoom factor
     * @returns {string}
     */
    public getWindowSessionStorageTile(pageIndex: number, tileX: number, tileY: number, zoomFactor: number): string {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
    }
    /**
     * @private
     * @returns {number}
     */
    public retrieveCurrentZoomFactor(): number {
        let zoomFactor: number = this.getZoomFactor();
        if (this.pdfViewer.enableZoomOptimization) {
            if ((zoomFactor) <= 1) {
                zoomFactor = 1;
            } else if ((zoomFactor) > 1 && zoomFactor <= 2) {
                zoomFactor = 2;
            } else if ((zoomFactor) > 2 && zoomFactor <= 3) {
                zoomFactor = 3;
            } else if ((zoomFactor) > 3 && zoomFactor <= 4) {
                zoomFactor = 4;
            }
            return zoomFactor;
        } else {
            if (zoomFactor <= 0) {
                zoomFactor = 1;
            }
            return zoomFactor;
        }
    }

    // eslint-disable-next-line
    private manageSessionStorage(pageIndex: number, storeObject: any, tileX?: number, tileY?: number): void {
        // eslint-disable-next-line
        let sessionSize: any = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        const maxSessionSize: number = 5000;
        if (sessionSize >= maxSessionSize) {
            if (!this.isStorageExceed) {
                // eslint-disable-next-line
                let annotationList: any = [];
                for (let i: number = 0; i < window.sessionStorage.length; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] === 'annotations') {
                            // eslint-disable-next-line max-len
                            this.annotationStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                            annotationList.push(window.sessionStorage.key(i));
                        }
                    }
                }
                if (annotationList) {
                    for (let i: number = 0; i < annotationList.length; i++) {
                        window.sessionStorage.removeItem(annotationList[i]);
                    }
                }
            }
            this.isStorageExceed = true;
            sessionSize = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
            if (sessionSize >= 5000) {
                let storageLength: number = window.sessionStorage.length;
                if (storageLength > 200) {
                    storageLength = 200;
                }
                for (let i: number = 0; i < storageLength; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] !== 'annotations') {
                            window.sessionStorage.removeItem(window.sessionStorage.key(i));
                        }
                    }
                }
            }
        }
        const zoomFactor: number = this.retrieveCurrentZoomFactor();
        if (isNaN(tileX) && isNaN(tileY)) {
            // eslint-disable-next-line max-len
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + zoomFactor, JSON.stringify(storeObject));
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + zoomFactor);
        } else {
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
            // eslint-disable-next-line max-len
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor, JSON.stringify(storeObject));
        }
    }

    private createBlobUrl(base64String: string, contentType: string): string {
        const sliceSize: number = 512;
        const byteCharacters: string = atob(base64String);
        // eslint-disable-next-line
        let byteArrays: any = [];
        for (let offset: number = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice: string = byteCharacters.slice(offset, offset + sliceSize);
            // eslint-disable-next-line
            let byteNumbers: any = new Array(slice.length);
            for (let i: number = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            // eslint-disable-next-line
            let byteArray: any = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        // eslint-disable-next-line
        let blob: any = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    private getRandomNumber(): string {
        // eslint-disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any): string {
            // eslint-disable-next-line
            let random: any = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    }

    private createGUID(): string {
        // eslint-disable-next-line max-len
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    }

    /**
     * @private
     * @param {MouseEvent} event - The mouse event.
     * @param {boolean} isNeedToSet - Is need to test.
     * @returns {boolean} - Returns true or false.
     */
    public isClickedOnScrollBar(event: MouseEvent, isNeedToSet?: boolean): boolean {
        let isScrollBar: boolean = false;
        if (isNeedToSet) {
            this.setScrollDownValue(event.type, false);
        }
        // eslint-disable-next-line max-len
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX && event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        // eslint-disable-next-line max-len
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY && event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        return isScrollBar;
    }

    private setScrollDownValue(eventType: string, boolValue: boolean): void {
        if (eventType === 'mousedown') {
            this.isScrollbarMouseDown = boolValue;
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public disableTextSelectionMode(): void {
        this.isTextSelectionDisabled = true;
        this.viewerContainer.classList.remove('e-enable-text-selection');
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.viewerContainer.classList.add('e-disable-text-selection');
        this.viewerContainer.addEventListener('selectstart', () => {
            return false;
        });
    }

    /**
     * @private
     * @param {string} idString - The Id string.
     * @returns {HTMLElement} - The html element.
     */
    public getElement(idString: string): HTMLElement {
        return document.getElementById(this.pdfViewer.element.id + idString);
    }
    /**
     * @private
     * @param {number} pageIndex - The pageIndex
     * @returns {number} - Returns number
     */
    public getPageWidth(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].width * this.getZoomFactor();
        } else {
            return 0;
        }
    }
    /**
     * @private
     * @param {number} pageIndex - The pageIndex
     * @returns {number} - Returns number
     */
    public getPageHeight(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].height * this.getZoomFactor();
        } else {
            return 0;
        }
    }
    /**
     * @private
     * @param {number} pageIndex - The pageIndex.
     * @returns {number} - Returns number
     */
    public getPageTop(pageIndex: number): number {
        if (this.pageSize[pageIndex]) {
            return this.pageSize[pageIndex].top * this.getZoomFactor();
        } else {
            return 0;
        }
    }

    private isAnnotationToolbarHidden(): boolean {
        if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden;
        } else {
            return true;
        }
    }

    private isFormDesignerToolbarHidded(): boolean {
        let formDesignerToolbar: any = this.pdfViewer.toolbarModule.formDesignerToolbarModule;
        if (formDesignerToolbar) {
            return formDesignerToolbar.isToolbarHidden;
        } else {
            return true;
        }
    }

    /**
     * @private
     * @returns {boolean} - Returns true or false.
     */
    public getTextMarkupAnnotationMode(): boolean {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        } else {
            return false;
        }
    }

    private isNewFreeTextAnnotation(): boolean {
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
            if (!this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    private getCurrentTextMarkupAnnotation(): boolean {
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {number} - Returns page number.
     */
    public getSelectTextMarkupCurrentPage(): number {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        } else {
            return null;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public getAnnotationToolStatus(): boolean {
        if (this.pdfViewer.toolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isAnnotationButtonsEnabled();
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public getPopupNoteVisibleStatus(): boolean {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.isPopupNoteVisible;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {TextMarkupAnnotation} - TextMarkupAnnotation.
     */
    public isTextMarkupAnnotationModule(): TextMarkupAnnotation {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        } else {
            return null;
        }
    }

    /**
     * @private
     * @returns {boolean} - Returns true or false.
     */
    public isShapeAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.shapeAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isFormDesignerModule(): boolean {
        if (this.pdfViewer.formDesignerModule) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isCalibrateAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.measureAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isStampAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isInkAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.inkAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isCommentAnnotationModule(): boolean {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @private
     * @returns {boolean} - Retunrs true or false.
     */
    public isShapeBasedAnnotationsEnabled(): boolean {
        // eslint-disable-next-line max-len
        if (this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule() || this.isStampAnnotationModule() || this.isCommentAnnotationModule() || this.isFormDesignerModule()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @param {MouseEvent | PointerEvent | TouchEvent} e - Returns event.
     * @returns {PointModel} - Returns points.
     */
    public getMousePosition(e: MouseEvent | PointerEvent | TouchEvent): PointModel {
        let touchArg: TouchEvent;
        let offsetX: number;
        let offsetY: number;
        let currentTarget: any = (e.target as HTMLElement).parentElement;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            if (this.pdfViewer.annotation) {
                const pageDiv: HTMLElement = this.getElement('_pageDiv_' + this.pdfViewer.annotation.getEventPageNumber(e));
                if (pageDiv) {
                    const pageCurrentRect: ClientRect =
                        pageDiv.getBoundingClientRect();

                    offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                    offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
                }
            }
        } else {
            if ((e.target as HTMLElement).classList.contains('e-pv-hyperlink')) {
                offsetX = (e as PointerEvent).offsetX + (e.target as HTMLElement).offsetLeft;
                offsetY = (e as PointerEvent).offsetY + (e.target as HTMLElement).offsetTop;
            } else if ((e.target as HTMLElement).classList.contains('e-pv-text') && currentTarget) {
                const targetParentRect: ClientRect = currentTarget.getBoundingClientRect();
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
                // eslint-disable-next-line
            } else if (e.target && (e && (e as any).path) && currentTarget && (currentTarget.classList.contains('foreign-object') || currentTarget.parentElement.classList.contains('foreign-object'))) {
                // eslint-disable-next-line
                let targetParentRect;
                if ((e as any).path[4].className === 'e-pv-page-div') {
                    targetParentRect = (e as any).path[4].getBoundingClientRect();
                }
                else {
                    for (let i = 0; i < (e as any).path.length; i++) {
                        if ((e as any).path[i].className === 'e-pv-page-div') {
                            targetParentRect = (e as any).path[i].getBoundingClientRect();
                            break;
                        }
                    }
                }
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
                // eslint-disable-next-line
            } else if (e.target && currentTarget && currentTarget.classList.contains('foreign-object')) {
                // eslint-disable-next-line
                const targetParentRect: ClientRect = (e.target as any).offsetParent.offsetParent.offsetParent.getBoundingClientRect();
                offsetX = (e as PointerEvent).clientX - targetParentRect.left;
                offsetY = (e as PointerEvent).clientY - targetParentRect.top;
                // eslint-disable-next-line
            }
            else {
                offsetX = (e as PointerEvent).offsetX;
                offsetY = (e as PointerEvent).offsetY;
            }
        }
        return { x: offsetX, y: offsetY };
    }
    private getMouseEventArgs(position: PointModel, args: MouseEventArgs, evt: MouseEvent | TouchEvent, source?: IElement): MouseEventArgs {
        args.position = position;
        let obj: IElement;
        let objects: IElement[];
        if (!source) {
            if (this.action === 'Drag' || this.action === 'ConnectorSourceEnd' || this.action === 'SegmentEnd' ||
                this.action === 'OrthoThumb' || this.action === 'BezierSourceThumb' || this.action === 'BezierTargetThumb' ||
                this.action === 'ConnectorTargetEnd' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
                obj = this.pdfViewer.selectedItems as IElement;
                if (this.action === 'Drag' && obj && this.pdfViewer.selectedItems.annotations.length > 0) {
                    obj = findActiveElement(evt, this, this.pdfViewer);
                } else if (this.action === 'Drag' && obj && this.pdfViewer.selectedItems.formFields.length > 0) {
                    obj = findActiveElement(evt, this, this.pdfViewer);
                }
            } else {
                obj = findActiveElement(evt, this, this.pdfViewer);
            }
        } else {
            //   objects = this.diagram.findObjectsUnderMouse(this.currentPosition, source);
            obj = findActiveElement(evt, this, this.pdfViewer);
        }
        let wrapper: DrawingElement;
        if (obj) {
            wrapper = obj.wrapper;
        }
        if (!source) {
            args.source = obj;
            args.sourceWrapper = wrapper;
        } else {
            args.target = obj;
            args.targetWrapper = wrapper;
        }
        args.actualObject = this.eventArgs.actualObject;
        //args.startTouches = this.touchStartList;
        //args.moveTouches = this.touchMoveList;
        return args;
    }
    /**
     * @private
     * @param {PdfAnnotationBaseModel} obj - The object.
     * @param {PointModel} position - The position.
     * @returns {Actions | string} - Returns the string.
     */
    public findToolToActivate(obj: PdfAnnotationBaseModel, position: PointModel): Actions | string {
        position = { x: position.x / this.getZoomFactor(), y: position.y / this.getZoomFactor() };

        const element: DrawingElement = this.pdfViewer.selectedItems.wrapper;
        if (element && obj) {
            const selectorBnds: Rect = element.bounds; //let handle: SelectorModel = diagram.selectedItems;
            let paddedBounds: Rect = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
            if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' ||
                obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
                const conn: PdfAnnotationBaseModel = this.pdfViewer.selectedItems.annotations[0];
                if (conn) {
                    for (let i: number = 0; i < conn.vertexPoints.length; i++) {
                        if (contains(position, conn.vertexPoints[i], 10) && conn.leaderHeight !== 0) {
                            return 'ConnectorSegmentPoint_' + i;
                        }
                    }
                }
            }

            if (obj.shapeAnnotationType === 'Distance') {
                let leaderCount: number = 0;
                let newPoint1: PointModel;
                if (obj && obj.wrapper) {
                    for (let i: number = 0; i < obj.wrapper.children.length; i++) {
                        const elementAngle: number = Point.findAngle(obj.sourcePoint, obj.targetPoint);
                        // eslint-disable-next-line
                        let segment: any = obj.wrapper.children[i];
                        if (segment.id.indexOf('leader') > -1) {
                            let centerPoint: PointModel = obj.wrapper.children[0].bounds.center;
                            if (leaderCount === 0) {
                                newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                                centerPoint = obj.sourcePoint;
                            } else {
                                newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                                centerPoint = obj.targetPoint;
                            }
                            const matrix: Matrix = identityMatrix();
                            rotateMatrix(matrix, elementAngle, centerPoint.x, centerPoint.y);
                            const rotatedPoint: PointModel = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                            if (contains(position, rotatedPoint, 10)) {
                                return 'Leader' + leaderCount;
                            }
                            leaderCount++;
                        }
                    }
                }
            }
            const ten: number = 10 / this.getZoomFactor();
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, obj.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            const x: number = element.offsetX - element.pivot.x * element.actualSize.width;
            const y: number = element.offsetY - element.pivot.y * element.actualSize.height;

            let rotateThumb: PointModel = {
                x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
                y: y - 30 / this.getZoomFactor()
            };
            rotateThumb = transformPointByMatrix(matrix, rotateThumb);
            if (obj.shapeAnnotationType === 'Stamp' && contains(position, rotateThumb, ten)) {
                return 'Rotate';
            }
            paddedBounds = this.inflate(ten, paddedBounds);
            if (paddedBounds.containsPoint(position, 0)) {
                const action: Actions = this.checkResizeHandles(this.pdfViewer, element, position, matrix, x, y);
                if (action) {
                    return action;
                }
            }
            if (this.pdfViewer.selectedItems.annotations.indexOf(obj) > -1) {
                return 'Drag';
            } else if (this.pdfViewer.selectedItems.formFields.indexOf(obj) > -1 && this.pdfViewer.designerMode) {
                return 'Drag';
            }

            return 'Select';
        }
        return this.pdfViewer.tool || 'Select';
    }

    private inflate(padding: number, bound: Rect): Rect {
        bound.x -= padding;
        bound.y -= padding;
        bound.width += padding * 2;
        bound.height += padding * 2;
        return bound;
    }
    public checkResizeHandles(
        diagram: PdfViewer, element: DrawingElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
        let action: Actions;

        if (!action) {
            action = this.checkForResizeHandles(diagram, element, position, matrix, x, y);
        }
        if (action) {
            return action;
        }
        return null;
    }
    
    public checkForResizeHandles(
        diagram: PdfViewer, element: DrawingElement, position: PointModel, matrix: Matrix, x: number, y: number): Actions {
        const forty: number = 40 / 1;
        let ten: number = 10 / 1;
        if (element.actualSize.width < 40 || element.actualSize.height < 40) {
            ten = 5 * this.getZoomFactor() / 1;
        }
        const selectedItems: Selector = diagram.selectedItems as Selector;
        let isStamp: boolean = false;
        let isSticky: boolean = false;
        let isNodeShape: boolean = false;
        let isInk: boolean = false;
        let resizerLocation: AnnotationResizerLocation = this.pdfViewer.annotationSelectorSettings.resizerLocation;
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3;
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) {
            isStamp = true;
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            isSticky = true;
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
            isInk = true;
        }
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle')) {
            isNodeShape = true;
        }
        if (!isSticky) {
            // eslint-disable-next-line max-len
            if ((isInk || isStamp || (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage')) || ((element.actualSize.width >= forty && element.actualSize.height >= forty) && isNodeShape && (resizerLocation === 1 || resizerLocation === 3)))) {
                if (contains(
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthWest';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y }), ten)) {
                    return 'ResizeNorthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y }), ten)) {
                    return 'ResizeNorthWest';
                }
            }
            // eslint-disable-next-line max-len
            if (isInk || !isNodeShape || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 || (!(element.actualSize.width >= forty && element.actualSize.height >= forty) && resizerLocation === 1)))) {
                if (contains(
                    // eslint-disable-next-line max-len
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeEast';
                }
                // eslint-disable-next-line max-len
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeWest';
                }
                if (contains(
                    // eslint-disable-next-line max-len
                    position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y + element.actualSize.height }), ten) && !isStamp) {
                    return 'ResizeSouth';
                }
                // eslint-disable-next-line max-len
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y }), ten) && !isStamp) {
                    return 'ResizeNorth';
                }
            }
        }
        return null;
    }

    /**
     * @private
     * @param {string} fieldID - The fieldID
     * @returns {boolean} - Returns true or false.
     */
    public checkSignatureFormField(fieldID: string): boolean {
        let isFormFieldSign: boolean = false;
        if (this.pdfViewer.formDesignerModule) {
            fieldID = fieldID.split('_')[0];
        }
        // eslint-disable-next-line
        const formField: any = (this.pdfViewer.nameTable as any)[fieldID];
        if (formField) {
            if (formField.formFieldAnnotationType === 'SignatureField' || formField.formFieldAnnotationType === 'InitialField' || formField.annotName === 'SignatureField') {
                isFormFieldSign = true;
            }
        }
        return isFormFieldSign;
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The event.
     * @returns {void}
     */
    public diagramMouseMove(evt: MouseEvent | TouchEvent): void {
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        this.currentPosition = this.getMousePosition(evt);
        this.pdfViewer.firePageMouseover(this.currentPosition.x, this.currentPosition.y);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        } else if (this.pdfViewer.formDesignerModule) {
            this.activeElements.activePageID = this.pdfViewer.formDesignerModule.getEventPageNumber(evt);
        }
        let obj: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
        if ((this.tool instanceof NodeDrawingTool) || (this.tool instanceof LineTool)) {
            obj = this.pdfViewer.drawingObject as IElement;
        }
        let target: PdfAnnotationBaseModel;
        let isFormFieldSign: boolean = this.pdfViewer.selectedItems.annotations.length > 0 ? this.checkSignatureFormField(this.pdfViewer.selectedItems.annotations[0].id) : false;
        if ((Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction)) {
            if (this.isMouseDown === false) {
                this.eventArgs = {};
                let sourceDrawingElement: DrawingElement = null;
                if (obj) {
                    this.tool = this.getTool(this.action);
                    if (obj.wrapper) {
                        sourceDrawingElement = obj.wrapper.children[0];
                        if (sourceDrawingElement) {
                            target = obj;
                        }
                    }
                }
                const eventTarget: HTMLElement = evt.target as HTMLElement;

                this.action = this.findToolToActivate(obj, this.currentPosition);
                // eslint-disable-next-line
                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = 'Select';
                        }
                    }
                    // eslint-disable-next-line max-len
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        // eslint-disable-next-line max-len
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = 'Select';
                        }
                    }
                }
                // eslint-disable-next-line max-len
                if (!this.pdfViewer.designerMode && ((!isNullOrUndefined(target) && (!isNullOrUndefined(target.formFieldAnnotationType))) || isFormFieldSign)) {
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        // eslint-disable-next-line max-len
                        this.action === 'ResizeNorth' || this.action === 'Drag' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        this.action = '';
                    }
                }
                this.tool = this.getTool(this.action);
                this.setCursor(eventTarget, evt);
                if(this.pdfViewer.linkAnnotationModule){
                    this.pdfViewer.linkAnnotationModule.disableHyperlinkNavigationUnderObjects(eventTarget, evt, this);
                }
            } else {
                if (!this.tool && this.action && this.action === 'Rotate') {
                    this.tool = this.getTool(this.action);
                    if (evt.target as HTMLElement) {
                        this.setCursor(evt.target as HTMLElement, evt);
                    }
                }
                // eslint-disable-next-line max-len
                if (!this.pdfViewer.designerMode && ((!isNullOrUndefined(target) && (!isNullOrUndefined(target.formFieldAnnotationType))) || isFormFieldSign)) {
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        // eslint-disable-next-line max-len
                        this.action === 'ResizeNorth' || this.action === 'Drag' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        this.action = '';
                        this.tool = null;
                    }
                }
                if (this.eventArgs && this.eventArgs.source) {
                    const eventTarget: HTMLElement = evt.target as HTMLElement;
                    this.updateDefaultCursor(this.eventArgs.source, eventTarget, evt);
                } else {
                    this.setCursor(evt.target as HTMLElement, evt);
                }
                this.diagramMouseActionHelper(evt as MouseEvent);

                if (this.tool) {
                    const currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                    if (currentObject && currentObject.shapeAnnotationType === 'FreeText') {
                        if (this.pdfViewer.freeTextSettings.allowEditTextOnly && this.action !== "Ink" &&
                            (this.eventArgs.source && (this.eventArgs.source as any).shapeAnnotationType === "FreeText")) {
                            const eventTarget: HTMLElement = event.target as HTMLElement;
                            eventTarget.style.cursor = 'default';
                            this.tool = null;
                        }
                    }
                    if (this.tool != null) {
                        const info: Info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                        this.eventArgs.info = info;
                        this.tool.mouseMove(this.eventArgs);
                    }
                }
            }
            if (this.pdfViewer.drawingObject && this.pdfViewer.drawingObject.formFieldAnnotationType && this.action !== 'Drag') {
                if (!(this.tool instanceof ResizeTool)) {
                    this.tool = this.getTool(this.action);
                    if (this.tool instanceof NodeDrawingTool) {
                        const obj: PdfFormFieldBaseModel = this.pdfViewer.drawingObject;
                        // eslint-disable-next-line
                        const bounds: any = this.pdfViewer.formDesignerModule.updateFormFieldInitialSize(obj as unknown as DrawingElement, (obj as PdfFormFieldBaseModel).formFieldAnnotationType);
                        const pageWidth: number = this.pageContainer.firstElementChild.clientWidth - bounds.width;
                        const pageHeight: number = this.pageContainer.firstElementChild.clientHeight - bounds.height;
                        if (this.pdfViewer.formDesignerModule && (obj as PdfFormFieldBaseModel).formFieldAnnotationType
                            && this.currentPosition.x < pageWidth && this.currentPosition.y < pageHeight) {
                            // eslint-disable-next-line
                            const formFieldElement: any = document.getElementById('FormField_helper_html_element');
                            if (!formFieldElement) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.formDesignerModule.drawHelper((obj as PdfFormFieldBaseModel).formFieldAnnotationType, obj, evt);
                            }
                           
                            else if (formFieldElement) {
                                let previousActivePage =formFieldElement.parentElement.id.split("_text_")[1]  ||formFieldElement.parentElement.id.split("_textLayer_")[1] || formFieldElement.parentElement.id.split("_annotationCanvas_")[1] ||formFieldElement.parentElement.id.split("_pageDiv_")[1]
                                      if(parseInt(previousActivePage)!==this.activeElements.activePageID){
                                        formFieldElement.remove("FormField_helper_html_element");
                                      }else{
									    // eslint-disable-next-line
                                        const point: any = this.getMousePosition(event as any);
                                      
                                        if (obj.formFieldAnnotationType === 'Checkbox') {
                                            (formFieldElement.firstElementChild.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'visible';
                                        } else if (obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
                                            (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'visible';
                                            (formFieldElement.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'visible';
                                        } else {
                                            (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'visible';
                                        }
                                        formFieldElement.setAttribute(
                                            'style', 'height:' + bounds.height + 'px; width:' + bounds.width + 'px;left:' + point.x + 'px; top:' + point.y + 'px;' +
                                        'position:absolute;opacity: 0.5;'
                                        );

                                      }
                                
                              
                               
                               
                            }
                           
                           

                           
                        } else if (this.currentPosition.x > pageWidth || this.currentPosition.y > pageHeight) {
                            // eslint-disable-next-line
                            const formFieldElement: any = document.getElementById('FormField_helper_html_element');
                            if (!formFieldElement) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.formDesignerModule.drawHelper((obj as PdfFormFieldBaseModel).formFieldAnnotationType, obj, evt);
                            } else if (formFieldElement) {
                                // eslint-disable-next-line
                                const point: any = this.getMousePosition(event as any);
                                formFieldElement.setAttribute('style', 'height:' + bounds.height + 'px; width:' + bounds.width + 'px;left:' + point.x + 'px; top:' + point.y + 'px;' +
                                    'position:absolute;opacity: 0.5;');
                                if (obj.formFieldAnnotationType === 'Checkbox') {
                                    (formFieldElement.firstElementChild.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'hidden';
                                } else if (obj.formFieldAnnotationType === 'SignatureField' || obj.formFieldAnnotationType === 'InitialField') {
                                    (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'hidden';
                                    (formFieldElement.firstElementChild.lastElementChild as HTMLElement).style.visibility = 'hidden';
                                } else {
                                    (formFieldElement.firstElementChild.firstElementChild as HTMLElement).style.visibility = 'hidden';
                                }
                            }
                        }
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }
    // eslint-disable-next-line
    private updateDefaultCursor(source: any, target: any, event: any): void {
        // eslint-disable-next-line max-len
        if (source && source.pageIndex !== undefined && source.pageIndex !== this.activeElements.activePageID && target) {
            // eslint-disable-next-line
            this.isPanMode ? target.style.cursor = 'grab' : target.style.cursor = 'default';
        } else {
            this.setCursor(target, event);
        }
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The event.
     * @returns {void}
     */
    public diagramMouseLeave(evt: MouseEvent | TouchEvent): void {
        this.currentPosition = this.getMousePosition(evt);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        const shapeElement: IElement = findActiveElement(evt as MouseEvent, this, this.pdfViewer);
        let mouseMoveforce: boolean = false; let target: PdfAnnotationBaseModel;
        if (Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction) {
            if (this.isMouseDown === false || mouseMoveforce) {
                this.eventArgs = {};
                let sourceElement: DrawingElement = null;
                if (shapeElement) {
                    sourceElement = shapeElement.wrapper.children[0];
                    if (sourceElement) {
                        target = shapeElement;
                    }
                    mouseMoveforce = false;
                }
            } else {
                this.diagramMouseActionHelper(evt as MouseEvent);
                // eslint-disable-next-line max-len
                if (this.tool && this.action !== 'Drag' && this.pdfViewer.tool !== 'Stamp' && (this.tool.currentElement as PdfAnnotationBaseModel) && (this.tool.currentElement as PdfAnnotationBaseModel).shapeAnnotationType !== 'Stamp') {
                    this.tool.mouseLeave(this.eventArgs);
                    this.tool = null;
                    if (this.pdfViewer.annotation) {
                        this.pdfViewer.annotationModule.renderAnnotations(this.previousPage, null, null, null);
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
    }

    private diagramMouseActionHelper(evt: MouseEvent): void {
        this.eventArgs.position = this.currentPosition;
        if (this.action === 'Drag' &&
            this.eventArgs.source instanceof Selector) {
            this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt as MouseEvent);
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt as MouseEvent, this.eventArgs.source);
        this.inAction = true;
        this.initialEventArgs = null;
    }

    // eslint-disable-next-line
    private setCursor(eventTarget: HTMLElement, event: any): void {
        // eslint-disable-next-line max-len
        const freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule ? this.pdfViewer.annotationModule.freeTextAnnotationModule : null;
        let cursorType: string;
        if (this.tool instanceof ResizeTool) {
            if (this.tool.corner === 'ResizeNorthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeNorthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'sw-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'se-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeNorth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'n-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'w-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'e-resize' : cursorType;
            } else if (this.tool.corner === 'ResizeSouth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 's-resize' : cursorType;
            }
        } else if (this.isCommentIconAdded && this.isAddComment) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.pdfViewer.enableHandwrittenSignature && this.isNewSignatureAdded && this.tool instanceof StampTool) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.tool instanceof MoveTool) {
            eventTarget.style.cursor = 'move';
            // eslint-disable-next-line max-len
        } else if (this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool || (freeTextAnnotModule && freeTextAnnotModule.isNewAddedAnnot) || this.tool instanceof InkDrawingTool) {
            eventTarget.style.cursor = 'crosshair';
        } else if (this.tool instanceof ConnectTool) {
            if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader0')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            } else if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader1')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            } else if (this.tool.endPoint && this.tool.endPoint.indexOf('ConnectorSegmentPoint')) {
                eventTarget.style.cursor = 'sw-resize';
            }
        } else {
            if (eventTarget.classList.contains('e-pv-text')) {
                eventTarget.style.cursor = 'text';
            } else if (eventTarget.classList.contains('e-pv-hyperlink')) {
                eventTarget.style.cursor = 'pointer';
            } else if (this.isPanMode) {
                if (this.isViewerMouseDown && event.type === 'mousemove') {
                    eventTarget.style.cursor = 'grabbing';
                } else {
                    const obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                    if (obj && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                        // eslint-disable-next-line max-len
                        const currentObject: PdfAnnotationBaseModel | PdfFormFieldBaseModel = obj as PdfAnnotationBaseModel | PdfFormFieldBaseModel;
                        // eslint-disable-next-line
                        let currentPosition: any = this.getMousePosition(event);
                        // eslint-disable-next-line
                        let relativePosition: any = this.relativePosition(event);
                        // eslint-disable-next-line
                        let viewerPositions: any = { left: relativePosition.x, top: relativePosition.y }
                        // eslint-disable-next-line
                        let mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                        // eslint-disable-next-line
                        let annotationSettings: any = { opacity: currentObject.opacity, fillColor: (currentObject as PdfAnnotationBaseModel).fillColor, strokeColor: (currentObject as PdfAnnotationBaseModel).strokeColor, thicknes: (currentObject as PdfAnnotationBaseModel).thickness, author: (currentObject as PdfAnnotationBaseModel).author, subject: (currentObject as PdfAnnotationBaseModel).subject, modifiedDate: (currentObject as PdfAnnotationBaseModel).modifiedDate };
                        // eslint-disable-next-line max-len
                        this.isMousedOver = true;
                        let isFormField: boolean = this.checkSignatureFormField(currentObject.id);
                        if (currentObject.formFieldAnnotationType) {
                            this.isFormFieldMousedOver = true;
                            const field: IFormField = {
                                // eslint-disable-next-line
                                value: (currentObject as any).value, fontFamily: currentObject.fontFamily, fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                                // eslint-disable-next-line max-len
                                color: (currentObject as PdfFormFieldBaseModel).color, backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor, borderColor: (currentObject as PdfFormFieldBaseModel).borderColor,
                                // eslint-disable-next-line
                                thickness: (currentObject as PdfFormFieldBaseModel).thickness, alignment: (currentObject as PdfFormFieldBaseModel).alignment, isReadonly: (currentObject as any).isReadonly, visibility: (currentObject as any).visibility,
                                // eslint-disable-next-line
                                maxLength: (currentObject as any).maxLength, isRequired: (currentObject as any).isRequired, isPrint: currentObject.isPrint, rotation: (currentObject as any).rotateAngle, tooltip: (currentObject as any).tooltip, options: (currentObject as any).options,
                                // eslint-disable-next-line
                                isChecked: (currentObject as any).isChecked, isSelected: (currentObject as any).isSelected
                            };
                            this.pdfViewer.fireFormFieldMouseoverEvent('formFieldMouseover', field, currentObject.pageIndex, relativePosition.x, relativePosition.y, currentPosition.x, currentPosition.y);
                        } else {
                            if (!isFormField)
                                // eslint-disable-next-line max-len
                                this.pdfViewer.fireAnnotationMouseover((currentObject as PdfAnnotationBaseModel).annotName, currentObject.pageIndex, (currentObject as PdfAnnotationBaseModel).shapeAnnotationType as AnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                        }
                    } else {
                        eventTarget.style.cursor = 'grab';
                        if (this.isMousedOver) {
                            let pageIndex: number;
                            if (this.pdfViewer.formDesignerModule) {
                                pageIndex = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                            } else {
                                pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                            }
                            if (this.isFormFieldMousedOver) {
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', null, pageIndex);
                            } else {
                                this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                            }
                            this.isMousedOver = false;
                            this.isFormFieldMousedOver = false;
                        }
                    }
                }
            } else {
                const obj: IElement = findActiveElement(event as MouseEvent, this, this.pdfViewer);
                if (obj && this.pdfViewer.selectedItems.annotations.length === 0 && event.type === 'mousemove') {
                    const currentObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                    // eslint-disable-next-line
                    let annotationObject: any = (this.pdfViewer.nameTable as any)[currentObject.id];
                    // eslint-disable-next-line max-len
                    if (annotationObject.shapeAnnotationType !== 'HandWrittenSignature' && annotationObject.shapeAnnotationType !== 'Ink' && annotationObject.annotationSettings && annotationObject.annotationSettings.isLock !== undefined) {
                        annotationObject.annotationSettings.isLock = JSON.parse(annotationObject.annotationSettings.isLock);
                    }
                    if (annotationObject.annotationSettings && annotationObject.annotationSettings.isLock) {
                        eventTarget.style.cursor = 'default';
                    } else {
                        eventTarget.style.cursor = 'pointer';
                    }
                    // eslint-disable-next-line
                    let currentPosition: any = this.getMousePosition(event);
                    // eslint-disable-next-line
                    let relativePosition: any = this.relativePosition(event);
                    // eslint-disable-next-line
                    let viewerPositions: any = { left: relativePosition.x, top: relativePosition.y };
                    // eslint-disable-next-line
                    let mousePositions: any = { left: currentPosition.x, top: currentPosition.y };
                    // eslint-disable-next-line
                    let annotationSettings: any = { opacity: currentObject.opacity, fillColor: currentObject.fillColor, strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness, author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                    // eslint-disable-next-line max-len
                    this.isMousedOver = true;
                    let isFormField: boolean = this.checkSignatureFormField(currentObject.id);
                    if (currentObject.formFieldAnnotationType) {
                        this.isFormFieldMousedOver = true;
                        const field: IFormField = {
                            // eslint-disable-next-line
                            value: (currentObject as any).value, fontFamily: currentObject.fontFamily, fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                            // eslint-disable-next-line max-len
                            color: (currentObject as PdfFormFieldBaseModel).color, backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor, borderColor: (currentObject as PdfFormFieldBaseModel).borderColor,
                            // eslint-disable-next-line
                            thickness: (currentObject as PdfFormFieldBaseModel).thickness, alignment: (currentObject as PdfFormFieldBaseModel).alignment, isReadonly: (currentObject as any).isReadonly, visibility: (currentObject as any).visibility,
                            // eslint-disable-next-line
                            maxLength: (currentObject as any).maxLength, isRequired: (currentObject as any).isRequired, isPrint: currentObject.isPrint, rotation: (currentObject as any).rotateAngle, tooltip: (currentObject as any).tooltip, options: (currentObject as any).options,
                            // eslint-disable-next-line
                            isChecked: (currentObject as any).isChecked, isSelected: (currentObject as any).isSelected
                        };
                        this.fromTarget = currentObject;
                        this.pdfViewer.fireFormFieldMouseoverEvent('formFieldMouseover', field, currentObject.pageIndex, relativePosition.x, relativePosition.y, currentPosition.x, currentPosition.y);
                    } else {
                        if (!isFormField)
                            // eslint-disable-next-line max-len
                            this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex, currentObject.shapeAnnotationType as AnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                    }
                } else {
                    if (this.isMousedOver) {
                        let pageIndex: number;
                        if (this.pdfViewer.formDesignerModule) {
                            pageIndex = this.pdfViewer.formDesignerModule.getEventPageNumber(event);
                        } else {
                            pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                        }
                        if (this.isFormFieldMousedOver) {
                            if(this.fromTarget){
                                const field: IFormField = {
                                    // eslint-disable-next-line
                                    name: (this.fromTarget as any).name, id: (this.fromTarget as any).id, value: (this.fromTarget as any).value, fontFamily: this.fromTarget.fontFamily, fontSize: this.fromTarget.fontSize, fontStyle: (this.fromTarget as any).fontStyle,
                                    // eslint-disable-next-line max-len
                                    color: (this.fromTarget as PdfFormFieldBaseModel).color, backgroundColor: (this.fromTarget as PdfFormFieldBaseModel).backgroundColor, borderColor: (this.fromTarget as PdfFormFieldBaseModel).borderColor,
                                    // eslint-disable-next-line
                                    thickness: (this.fromTarget as PdfFormFieldBaseModel).thickness, alignment: (this.fromTarget as PdfFormFieldBaseModel).alignment, isReadonly: (this.fromTarget as any).isReadonly, visibility: (this.fromTarget as any).visibility,
                                    // eslint-disable-next-line
                                    maxLength: (this.fromTarget as any).maxLength, isRequired: (this.fromTarget as any).isRequired, isPrint: this.fromTarget.isPrint, rotation: (this.fromTarget as any).rotateAngle, tooltip: (this.fromTarget as any).tooltip, options: (this.fromTarget as any).options,
                                    // eslint-disable-next-line
                                    isChecked: (this.fromTarget as any).isChecked, isSelected: (this.fromTarget as any).isSelected
                                };
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', field, pageIndex);
                            }
                            else{
                                this.pdfViewer.fireFormFieldMouseLeaveEvent('formFieldMouseLeave', null, pageIndex);
                            }
                        } else {
                            this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                        }
                        this.isMousedOver = false;
                        this.isFormFieldMousedOver = false;
                        eventTarget.style.cursor = 'default';
                    }
                    if (obj && this.pdfViewer.selectedItems.annotations.length === 1 && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                    } else {
                        eventTarget.style.cursor = 'default';
                    }
                }
            }
        }
    }
    private setResizerCursorType(): string {
        let cursorType: string;
        // eslint-disable-next-line max-len
        if (this.pdfViewer.selectedItems.annotations[0] && isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType)) {
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                // eslint-disable-next-line max-len
                cursorType = !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                // eslint-disable-next-line max-len
                cursorType = !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'SignatureImage') {
                // eslint-disable-next-line max-len
                cursorType = !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                // eslint-disable-next-line max-len
                cursorType = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerCursorType : null;
            } else if (!this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Polygon') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            } else if (this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].subject === 'Distance calculation') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Perimeter calculation') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Area calculation') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Radius calculation') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerCursorType : null;
                } else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Volume calculation') {
                    // eslint-disable-next-line max-len
                    cursorType = !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            }
        } else {
            if (this.pdfViewer.selectedItems.annotations[0]) {
                cursorType = this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType;
            }
        }
        if (!cursorType) {
            cursorType = this.pdfViewer.annotationSelectorSettings.resizerCursorType;
        }
        return cursorType;
    }

    /**
     * @private
     * @param {Actions | string} action - The actions.
     * @returns {ToolBase} - Returns tools.
     */
    public getTool(action: Actions | string): ToolBase {
        switch (action) {
            case 'Select':
                return new SelectTool(this.pdfViewer, this);
            case 'Drag':
                return new MoveTool(this.pdfViewer, this);
            case 'ResizeSouthEast':
            case 'ResizeSouthWest':
            case 'ResizeNorthEast':
            case 'ResizeNorthWest':
            case 'ResizeSouth':
            case 'ResizeNorth':
            case 'ResizeWest':
            case 'ResizeEast':
                return new ResizeTool(this.pdfViewer, this, action);
            case 'ConnectorSourceEnd':
            case 'ConnectorTargetEnd':
            case 'Leader':
            case 'ConnectorSegmentPoint':
                return new ConnectTool(this.pdfViewer, this, action);
            case 'DrawTool':
                return new NodeDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
            case 'Polygon':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Polygon');
            case 'Distance':
                return new LineTool(this.pdfViewer, this, 'Leader1', undefined);
            case 'Line':
                return new LineTool(this.pdfViewer, this, 'ConnectorSegmentPoint_1', this.pdfViewer.drawingObject);
            case 'Perimeter':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Perimeter');
            case 'Rotate':
                return new RotateTool(this.pdfViewer, this);
            case 'Stamp':
                return new StampTool(this.pdfViewer, this);
            case 'Ink':
                return new InkDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
        }
        if (action.indexOf('ConnectorSegmentPoint') > -1 || action.indexOf('Leader') > -1) {
            return new ConnectTool(this.pdfViewer, this, action);

        }
        return null;
    }

    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The events.
     * @returns {void}
     */
    public diagramMouseUp(evt: MouseEvent | TouchEvent): void {
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        let touches: TouchList;
        if (this.tool) {
            if (!this.inAction && (evt as MouseEvent).which !== 3) {
                if (this.action === 'Drag') {
                    this.action = 'Select';
                    const obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                    const isMultipleSelect: boolean = true;
                }
            }
            let isGroupAction: boolean;
            if (!(this.tool instanceof PolygonDrawingTool) && !(this.tool instanceof LineTool) && !(this.tool instanceof NodeDrawingTool)) {
                this.inAction = false;
                this.isMouseDown = false;
            }
            this.currentPosition = this.getMousePosition(evt);
            if (this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt, this.eventArgs.source);
                const ctrlKey: boolean = this.isMetaKey(evt);
                const info: Info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = evt.detail;
                this.tool.mouseUp(this.eventArgs);
                this.isAnnotationMouseDown = false;
                this.isFormFieldMouseDown = false;
                // eslint-disable-next-line max-len
                if ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) && !this.tool.dragging) {
                    this.inAction = false;
                    this.isMouseDown = false;
                }
                const obj: IElement = findActiveElement(evt, this, this.pdfViewer);
                // eslint-disable-next-line max-len
                if ((this.isShapeAnnotationModule() && this.isCalibrateAnnotationModule())) {
                    this.pdfViewer.annotation.onShapesMouseup(obj as PdfAnnotationBaseModel, evt);
                }
                this.isAnnotationDrawn = false;
            }
        }
        const target: HTMLElement = evt.target as HTMLElement;
        // eslint-disable-next-line max-len
        if (!touches && evt.cancelable && this.skipPreventDefault(target) && (!Browser.isDevice || this.pdfViewer.enableDesktopMode)) {
            evt.preventDefault();
        }
        this.eventArgs = {};
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }
    /**
     * @private
     * @param {HTMLElement} target - The target.
     * @returns {boolean} - Returns true or false.
     */
    public skipPreventDefault(target: HTMLElement): boolean {
        let isSkipped: boolean = false;
        let isSkip: boolean = false;
        // eslint-disable-next-line max-len
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
            isSkip = true;
        }
        // eslint-disable-next-line max-len
        if (target.parentElement && target.parentElement.className !== 'foreign-object' && !target.classList.contains('e-pv-radio-btn') && !target.classList.contains('e-pv-radiobtn-span') && !target.classList.contains('e-pv-checkbox-div') && !target.classList.contains('e-pdfviewer-formFields')
            && !target.classList.contains('e-pdfviewer-ListBox') && !target.classList.contains('e-pdfviewer-signatureformfields')
            && !((target).className === 'free-text-input' && (target).tagName === 'TEXTAREA')
            && !isSkip && !((target).className === 'e-pv-hyperlink')) {
            isSkipped = true;
        }
        return isSkipped;
    }
    private isMetaKey(evt: MouseEvent | TouchEvent | WheelEvent | KeyboardEvent): boolean {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    }
    /**
     * @private
     * @param {MouseEvent | TouchEvent} evt - The events.
     * @returns {void}
     */
    public diagramMouseDown(evt: MouseEvent | TouchEvent): void {
        if((evt as MouseEvent).which===3){
            this.diagramMouseUp(evt);
        }
        let allowServerDataBind: boolean = this.pdfViewer.allowServerDataBinding;
        this.pdfViewer.enableServerDataBinding(false);
        let touches: TouchList = null;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        this.isMouseDown = true;
        this.isAnnotationAdded = false;
        this.currentPosition = this.prevPosition = this.getMousePosition(evt);
        this.eventArgs = {};
        let isStamp: boolean = false;
        if (this.pdfViewer.tool === 'Stamp') {
            this.pdfViewer.tool = '';
            isStamp = true;
        }
        let target: PdfAnnotationBaseModel;
        if (Browser.isDevice && this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        const obj: IElement = findActiveElement(evt, this, this.pdfViewer);
        if ((Browser.isDevice && !this.pdfViewer.enableDesktopMode) && (obj && !(obj instanceof PdfFormFieldBase))) {
            evt.preventDefault();
        }
        if (this.pdfViewer.annotation && this.pdfViewer.enableStampAnnotations) {
            const stampModule: StampAnnotation = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isNewStampAnnot) {
                let stampObj: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
                if (!stampObj && this.pdfViewer.selectedItems.annotations[0]) {
                    stampObj = this.pdfViewer.selectedItems.annotations[0];
                }
                if (stampObj) {
                    this.isViewerMouseDown = false;
                    stampObj.opacity = this.pdfViewer.stampSettings.opacity;
                    this.isNewStamp = true;
                    let opacity: number;
                    if (stampObj.shapeAnnotationType === 'Image') {
                        opacity = this.pdfViewer.customStampSettings.opacity
                    } else {
                        opacity = this.pdfViewer.stampSettings.opacity;
                    }
                    // eslint-disable-next-line max-len
                    this.pdfViewer.nodePropertyChange(stampObj, { opacity: opacity });
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = false;
                    if (stampObj.shapeAnnotationType === 'Image' && !this.isAlreadyAdded) {
                        this.stampAdded = true;
                        let stampName: string = stampObj.id;
                        if (stampModule.currentStampAnnotation && stampModule.currentStampAnnotation.signatureName) {
                            stampName = stampModule.currentStampAnnotation.signatureName;
                        }
                        let isSkip: boolean = false;
                        for (let i: number = 0; i < this.customStampCollection.length; i++) {
                            if (this.customStampCollection[i].customStampName === stampName) {
                                isSkip = true;
                                break;
                            }
                        }
                        if (isSkip) {
                            stampName = stampObj.id;
                        }
                        stampName = stampModule.customStampName ? stampModule.customStampName : stampModule.currentStampAnnotation.signatureName;
                        this.customStampCollection.push({ customStampName: stampName, customStampImageSource: stampObj.data });
                        if (isBlazor()) {
                            this.pdfViewer._dotnetInstance.invokeMethodAsync("UpdateCustomStampCollection", stampName, stampObj.data);
                        }
                    }
                    if (this.pdfViewer.customStampSettings.enableCustomStamp && this.pdfViewer.customStampSettings.isAddToMenu) {
                        this.stampAdded = true;
                    }
                    this.isAlreadyAdded = false;
                    stampModule.updateDeleteItems(stampObj.pageIndex, stampObj, stampObj.opacity);
                    stampModule.resetAnnotation();
                    stampModule.isNewStampAnnot = false;
                }
            }
        }
        if (this.isNewSignatureAdded) {
            this.signatureCount++;
            this.currentSignatureAnnot = null;
            let signObject: PdfAnnotationBaseModel = obj as PdfAnnotationBaseModel;
            if (isNullOrUndefined(signObject) && this.pdfViewer.selectedItems.annotations[0]) {
                signObject = this.pdfViewer.selectedItems.annotations[0];
            }
            if (signObject) {
                this.signatureAdded = true;
                this.signatureModule.storeSignatureData(signObject.pageIndex, signObject);
                // eslint-disable-next-line
                let bounds: any = { left: signObject.bounds.x, top: signObject.bounds.y, width: signObject.bounds.width, height: signObject.bounds.height };
                // eslint-disable-next-line max-len
                this.pdfViewer.fireSignatureAdd(signObject.pageIndex, signObject.signatureName, signObject.shapeAnnotationType as AnnotationType, bounds, signObject.opacity, signObject.strokeColor, signObject.thickness, this.signatureModule.saveImageString);
            }
            this.isNewSignatureAdded = false;
        }
        if (this.pdfViewer.annotationModule) {
            const freeTextAnnotModule: FreeTextAnnotation = this.pdfViewer.annotationModule.freeTextAnnotationModule;
            let canvasPaddingLeft : number = 5, canvasPaddingWidth : number = 10;
            // eslint-disable-next-line
            if (freeTextAnnotModule.isNewFreeTextAnnot === true) {
                let canvas: Rect;
                // eslint-disable-next-line max-len
                if (evt.target && ((evt.target as PdfAnnotationBaseModel).id.indexOf('_text') > -1 || (evt.target as PdfAnnotationBaseModel).id.indexOf('_annotationCanvas') > -1 || (evt.target as HTMLElement).classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                    const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    const diagram: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                    if (diagram) {
                        const canvas1: Rect = diagram.getBoundingClientRect() as Rect;
                        const left: number = canvas1.x ? canvas1.x : canvas1.left;
                        const top: number = canvas1.y ? canvas1.y : canvas1.top;
                        canvas = new Rect(left + canvasPaddingLeft, top + canvasPaddingLeft, canvas1.width - canvasPaddingWidth, canvas1.height - canvasPaddingWidth);
                    }
                }
                if (touches) {
                    this.mouseX = touches[0].clientX;
                    this.mouseY = touches[0].clientY;
                }
                if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && freeTextAnnotModule.isNewAddedAnnot) {
                    const pageIndex: number = this.pdfViewer.annotation.getEventPageNumber(evt);
                    if (!this.pdfViewer.freeTextSettings.enableAutoFit) {
                        let zoomFactor: number = this.getZoomFactor();
                        let width: any = this.currentPosition.x + (freeTextAnnotModule.defautWidth * zoomFactor);
                        let pageWidth: number = this.getPageWidth(pageIndex);
                        if (width >= pageWidth) {
                            this.currentPosition.x = pageWidth - (freeTextAnnotModule.defautWidth * zoomFactor);
                            this.currentPosition.x <= 0 ? this.currentPosition.x = canvasPaddingLeft : this.currentPosition.x;
                            freeTextAnnotModule.defautWidth = (freeTextAnnotModule.defautWidth * zoomFactor) >= pageWidth ? pageWidth - canvasPaddingWidth : freeTextAnnotModule.defautWidth;
                        }
                    }
                    freeTextAnnotModule.addInuptElemet(this.currentPosition, null, pageIndex);
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                        // eslint-disable-next-line
                        let annotModule: any = this.pdfViewer.toolbar.annotationToolbarModule;
                        if (!isBlazor()) {
                            annotModule.primaryToolbar.deSelectItem(annotModule.freeTextEditItem);
                        }
                    }
                    evt.preventDefault();
                    freeTextAnnotModule.isNewAddedAnnot = false;
                }
            }
        }
        let sourceElement: DrawingElement = null;
        if (obj) {
            sourceElement = obj.wrapper.children[0];
            if (sourceElement) {
                target = obj;
            }
        }
        if (!this.tool || (this.tool && !(this.tool as PolygonDrawingTool).drawingObject)) {
            if (!isStamp) {
                this.action = this.findToolToActivate(obj, this.currentPosition);
                // eslint-disable-next-line
                if (obj && (obj as any).annotationSettings && (obj as any).annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = 'Select';
                        }
                    }
                    if (this.action === 'Rotate') { 
                        this.action = 'Select';
                    }
                    // eslint-disable-next-line max-len
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' || this.action === 'ResizeSouth' ||                    // eslint-disable-next-line max-len
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (!this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = 'Select';
                        }
                    }
                }
                this.tool = this.getTool(this.action);
                if (!this.tool) {
                    this.action = this.pdfViewer.tool || 'Select';
                    this.tool = this.getTool(this.action);
                }
            } else {
                this.action = 'Select';
                this.tool = this.getTool(this.action);
            }
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt);
        this.eventArgs.position = this.currentPosition;
        if (this.tool) {
            this.isAnnotationMouseDown = false;
            this.isFormFieldMouseDown = false;
            this.isAnnotationMouseMove = false;
            this.isFormFieldMouseMove = false;
            this.tool.mouseDown(this.eventArgs);
            this.isAnnotationDrawn = true;
            this.signatureAdded = true;
        }
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.onAnnotationMouseDown();
        }
        if (this.pdfViewer.selectedItems && this.pdfViewer.selectedItems.formFields.length === 1) {
            if (!isNullOrUndefined(this.pdfViewer.toolbar) && !isNullOrUndefined(this.pdfViewer.toolbar.formDesignerToolbarModule)) {
                this.pdfViewer.toolbar.formDesignerToolbarModule.showHideDeleteIcon(true);
            }
        }
        let signatureFieldAnnotation: any = this.pdfViewer.selectedItems.annotations.length === 1 ? (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id.split('_')[0] + '_content'] : null;
        if (!signatureFieldAnnotation) {
            signatureFieldAnnotation = this.pdfViewer.selectedItems.annotations.length === 1 ? (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id] : null;
        }
        // eslint-disable-next-line max-len
        if (this.eventArgs && this.eventArgs.source && ((this.eventArgs.source as PdfFormFieldBaseModel).formFieldAnnotationType || signatureFieldAnnotation) && !this.pdfViewer.designerMode) {
            let currentObject: any;
            if (signatureFieldAnnotation) {
                currentObject = (this.pdfViewer.nameTable as any)[this.pdfViewer.selectedItems.annotations[0].id.split('_')[0]];
            } else {
                currentObject = this.eventArgs.source;
            }
            if (!currentObject) {
                currentObject = this.pdfViewer.formFieldCollections[this.pdfViewer.formFieldCollections.findIndex(el => el.id === signatureFieldAnnotation.id)]
            }
            if (currentObject) {
                // eslint-disable-next-line
                const field: IFormField = {
                    // eslint-disable-next-line max-len
                    name: currentObject.name, id: currentObject.id, fontFamily: currentObject.fontFamily, fontSize: currentObject.fontSize, fontStyle: (currentObject as any).fontStyle,
                    // eslint-disable-next-line
                    color: (currentObject as PdfFormFieldBaseModel).color, value: currentObject.value, type: currentObject.formFieldAnnotationType ? currentObject.formFieldAnnotationType : currentObject.type, backgroundColor: (currentObject as PdfFormFieldBaseModel).backgroundColor, alignment: (currentObject as any).alignment
                };
                let target: any = document.getElementById(currentObject.id);
                target = target ? target : (document.getElementById(currentObject.id + '_content_html_element') ? document.getElementById(currentObject.id + '_content_html_element').children[0].children[0] : null);
                if (target) {
                    this.currentTarget = target;
                    this.pdfViewer.fireFormFieldClickEvent('formFieldClicked', field as unknown as FormFieldModel, false, (evt as any).button === 0);
                }
            }
        }
        this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
        this.initialEventArgs.position = this.currentPosition;
        this.initialEventArgs.info = this.eventArgs.info;
        this.pdfViewer.enableServerDataBinding(allowServerDataBind, true);
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public exportAnnotationsAsObject(): any {
        if (this.pdfViewer.annotationModule) {
            const isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                return new Promise((resolve: Function, reject: Function) => {
                    this.createRequestForExportAnnotations(true, AnnotationDataFormat.Json).then((value: object) => {
                        resolve(value);
                    });
                });
            }
        }
    }
    /**
     * @private
     * @param {string} type - The type.
     */
    // eslint-disable-next-line
    public getItemFromSessionStorage(type: string): any {
        if (this.isStorageExceed) {
            return this.formFieldStorage[this.documentId + type];
        } else {
            return window.sessionStorage.getItem(this.documentId + type);
        }
    }
    /**
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @param textDiv
     * @param left
     * @param top
     * @param fontHeight
     * @param width
     * @param height
     * @param isPrint
     * @private
     */
    // eslint-disable-next-line max-len
    public setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, fontHeight: number, width: number, height: number, isPrint: boolean): void {
        let zoomvalue: number = this.getZoomFactor();
        if (isPrint) {
            zoomvalue = 1;
            textDiv.style.position = 'absolute';
        }
        textDiv.style.left = left * zoomvalue + 'px';
        textDiv.style.top = top * zoomvalue + 'px';
        textDiv.style.height = height * zoomvalue + 'px';
        textDiv.style.width = width * zoomvalue + 'px';
        textDiv.style.margin = '0px';
        if (fontHeight > 0) {
            textDiv.style.fontSize = fontHeight * zoomvalue + 'px';
        }
    }

    /**
     * @param number
     * @private
     */
    // eslint-disable-next-line
    public ConvertPointToPixel(number: any): any {
        return (number * (96 / 72));
    }
    /**
     * @private
     */
    // eslint-disable-next-line
    public setItemInSessionStorage(formFieldsData: any, type: string): void {
        // eslint-disable-next-line
        const formFieldsSize: any = Math.round(JSON.stringify(formFieldsData).length / 1024);
        if (formFieldsSize > 4500) {
            this.isStorageExceed = true;
            if (this.pdfViewer.formFieldsModule) {
                this.pdfViewer.formFieldsModule.clearFormFieldStorage();
            }
        }

        if (this.isStorageExceed) {
            this.formFieldStorage[this.documentId + type] = JSON.stringify(formFieldsData);
        } else {
            window.sessionStorage.setItem(this.documentId + type, JSON.stringify(formFieldsData));
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public exportFormFieldsAsObject(): any {
        if (this.pdfViewer.formFieldsModule) {
            return new Promise((resolve: Function, reject: Function) => {
                this.createRequestForExportFormfields(true).then((value: object) => {
                    resolve(value);
                });
            });
        }
    }

    /**
     * @param importData
     * @param annotationDataFormat
     * @param isXfdf
     * @param importData
     * @param annotationDataFormat
     * @param isXfdf
     * @param importData
     * @param annotationDataFormat
     * @param isXfdf
     * @private
     */
    // eslint-disable-next-line
    public importAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat, isXfdf?: boolean): void {
        if (this.pdfViewer.annotationModule) {
            this.createRequestForImportAnnotations(importData, annotationDataFormat, isXfdf);
        }
    }

    /**
     * @private
     * @param {AnnotationDataFormat} annotationDataFormat - The annotationDataFormat.
     * @returns {void}
     */
    public exportAnnotations(annotationDataFormat?: AnnotationDataFormat): void {
        if (this.pdfViewer.annotationModule) {
            const isAnnotations: boolean = this.updateExportItem();
            if (isAnnotations) {
                this.createRequestForExportAnnotations(false, annotationDataFormat);
            }
        }
    }

    /**
     * @param isObject
     * @param annotationDataFormat
     * @param isBase64String
     * @private
     */
    // eslint-disable-next-line
    public createRequestForExportAnnotations(isObject?: boolean, annotationDataFormat?: AnnotationDataFormat, isBase64String?: boolean): any {
        let proxy: PdfViewerBase = null;
        proxy = this;
        const promise: Promise<Blob> = new Promise((resolve: Function, reject: Function) => {
            // eslint-disable-next-line
            let jsonObject: any;
            if (annotationDataFormat === 'Json') {
                // eslint-disable-next-line max-len
                jsonObject = { hashId: proxy.hashId, action: 'ExportAnnotations', pdfAnnotation: proxy.createAnnotationJsonData(), elementId: proxy.pdfViewer.element.id, annotationDataFormat: annotationDataFormat, uniqueId: proxy.documentId };
                proxy.pdfViewer.fireExportStart(jsonObject.pdfAnnotation);
            } else {
                jsonObject = this.constructJsonDownload();
                jsonObject.annotationDataFormat = annotationDataFormat;
                // eslint-disable-next-line
                jsonObject['action'] = 'ExportAnnotations';
                proxy.pdfViewer.fireExportStart(jsonObject);
            }
            if (proxy.jsonDocumentId) {
                // eslint-disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportAnnotations;
            proxy.exportAnnotationRequestHandler = new AjaxHandler(this.pdfViewer);
            proxy.exportAnnotationRequestHandler.url = url;
            proxy.exportAnnotationRequestHandler.mode = true;
            proxy.exportAnnotationRequestHandler.responseType = 'text';
            proxy.exportAnnotationRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            proxy.exportAnnotationRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data; 
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (data) {
                        let isCancel: boolean = proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.exportAnnotations, data);
                        if (isObject || (isBase64String && !isBlazor())) {
                            if (data.split('base64,')[1]) {
                                let exportObject: any = data; 
                                // eslint-disable-next-line 
                                let annotationJson: any = atob(data.split(',')[1]);
                                if (isObject) { 
                                   if (jsonObject.annotationDataFormat === 'Json') {
                                     exportObject = JSON.parse(annotationJson);
                                   } else {
                                     exportObject = annotationJson;
                                   }
                                }
                                if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.exportAnnotationFileName);
                                } else {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.fileName);
                                }
                                proxy.updateDocumentAnnotationCollections();
                                if (isBase64String) {
                                    resolve(data);
                                } else {
                                    resolve(annotationJson);
                                }
                            } else {
                                // eslint-disable-next-line max-len
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        } else {
                            if (annotationDataFormat === 'Json') {
                                if (data.split('base64,')[1]) {
                                  if (!isCancel) {
                                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                            // eslint-disable-next-line max-len
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json');
                                        } else {
                                            window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.json');
                                        }
                                    } else {
                                        proxy.downloadExportAnnotationJson(blobUrl);
                                    }
                                    proxy.updateDocumentAnnotationCollections();
                                 } else {
                                     return data;
                                 }
                                } else {
                                    if (isBlazor()) {
                                        const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                        promise.then((value: string) => {
                                            proxy.openImportExportNotificationPopup(value);
                                        });
                                    } else {
                                        proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                    }
                                    // eslint-disable-next-line max-len
                                    proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                            } else {
                                if (data.split('base64,')[1]) {
                                  if (!isCancel) {
                                    const blobUrl: string = proxy.createBlobUrl(data.split('base64,')[1], 'application/vnd.adobe.xfdf');
                                    if (Browser.isIE || Browser.info.name === 'edge') {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0] + '.xfdf');
                                    } else {
                                        proxy.downloadExportedXFdfAnnotation(blobUrl);
                                    } 
                                 } else {
                                     return data;
                                 }
                                } else {
                                    if (isBlazor()) {
                                        const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_ExportFailed');
                                        promise.then((value: string) => {
                                            proxy.openImportExportNotificationPopup(value);
                                        });
                                    } else {
                                        proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                    }
                                    // eslint-disable-next-line max-len
                                    proxy.pdfViewer.fireExportFailed(jsonObject, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                }
                            }
                        }
                    }

                    if (typeof data !== 'string') {
                        try {
                            if (typeof data === 'string') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                                data = null;
                            }
                        } catch (error) {
                            // eslint-disable-next-line max-len
                            proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                            data = null;
                        }
                    }
                } else {
                    let fileName: string;
                    if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                        fileName = proxy.pdfViewer.exportAnnotationFileName;
                    } else {
                        fileName = proxy.pdfViewer.fileName;
                    }
                    proxy.pdfViewer.fireExportSuccess('Exported data saved in server side successfully', fileName);
                }
            };
            // eslint-disable-next-line
            proxy.exportAnnotationRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // eslint-disable-next-line
            proxy.exportAnnotationRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
        });
        if (isObject || isBase64String) {
            return promise;
        } else {
            return true;
        }
    }

    // eslint-disable-next-line
    private createRequestForImportAnnotations(importData: any, annotationDataFormat?: AnnotationDataFormat, isXfdf?: boolean): void {
        let jsonObject: object;
        let proxy: PdfViewerBase = null;
        proxy = this; 
        if (typeof importData === 'string' && annotationDataFormat === 'Json' && importData.indexOf(".json") === -1) {
            importData = importData.split(',')[1] ? importData.split(',')[1]: importData.split(',')[0];
            importData = JSON.parse(decodeURIComponent(escape(atob(importData))));
        }
        if (typeof importData === 'object') {
            if (!isXfdf) {
                this.isJsonImported = true;
            } else {
                this.isJsonImported = false;
            }
            proxy.reRenderAnnotations(importData.pdfAnnotation);
            proxy.isImportedAnnotation = true;
            proxy.updateDocumentEditedProperty(true);
            if (!this.isAddAnnotation) {
                proxy.pdfViewer.fireImportSuccess(importData.pdfAnnotation);
            }
        } else {
            proxy.pdfViewer.fireImportStart(importData);
            if (annotationDataFormat === 'Json') {
                // eslint-disable-next-line max-len
                jsonObject = { fileName: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id, hashId: proxy.hashId, uniqueId: proxy.documentId };
            } else {
                if (!isXfdf) {
                    importData = btoa(importData);
                } 
                importData = importData.split(',')[1] ? importData.split(',')[1] : importData.split(',')[0];
                // eslint-disable-next-line max-len
                jsonObject = { importedData: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id, hashId: proxy.hashId, uniqueId: proxy.documentId };
            }
            if (proxy.jsonDocumentId) {
                // eslint-disable-next-line
                (jsonObject as any).document = proxy.jsonDocumentId;
            }
            const url: string = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importAnnotations;
            proxy.importAnnotationRequestHandler = new AjaxHandler(proxy.pdfViewer);
            proxy.importAnnotationRequestHandler.url = url;
            proxy.importAnnotationRequestHandler.mode = true;
            proxy.importAnnotationRequestHandler.responseType = 'text';
            proxy.importAnnotationRequestHandler.send(jsonObject);
            // eslint-disable-next-line
            proxy.importAnnotationRequestHandler.onSuccess = function (result: any) {
                // eslint-disable-next-line
                let data: any = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                            if (typeof data !== 'object') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                                data = null;
                            }
                        } catch (error) {
                            proxy.pdfViewer.fireImportFailed(importData, proxy.pdfViewer.localeObj.getConstant('File not found'));
                            if (isBlazor()) {
                                const promise: Promise<string> = this.pdfViewer._dotnetInstance.invokeMethodAsync('GetLocaleText', 'PdfViewer_FileNotFound');
                                promise.then((value: string) => {
                                    proxy.openImportExportNotificationPopup(value);
                                });
                            } else {
                                proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                            }
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                            data = null;
                        }
                    }
                    if (data) {
                        proxy.pdfViewer.fireAjaxRequestSuccess(proxy.pdfViewer.serverActionSettings.importAnnotations, data);
                        if (data.pdfAnnotation) {
                            proxy.reRenderAnnotations(data.pdfAnnotation);
                            proxy.isImportedAnnotation = true;
                            proxy.updateDocumentEditedProperty(true);
                            proxy.pdfViewer.fireImportSuccess(data.pdfAnnotation);
                        }
                    }
                }
            };
            // eslint-disable-next-line
            proxy.importAnnotationRequestHandler.onFailure = function (result: any) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
            // eslint-disable-next-line
            proxy.importAnnotationRequestHandler.onError = function (result: any) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
        }
    }

    /**
     * @private
     * @param {string} errorDetails - The error details.
     * @returns {void}
     */
    public openImportExportNotificationPopup(errorDetails: string): void {
        if (this.pdfViewer.showNotificationDialog) {
            this.textLayer.createNotificationPopup(errorDetails);
        }
    }

    // eslint-disable-next-line
    private reRenderAnnotations(annotation: any): any {
        if (annotation) {
            this.isImportAction = true;
            let count: number;
            if (this.isImportedAnnotation) {
                this.importedAnnotation = this.combineImportedData(this.importedAnnotation, annotation);
            } else {
                if (this.pageCount > 0) {
                    this.importedAnnotation = annotation;
                }
            }
            if (!this.isImportedAnnotation) {
                count = 0;
            }
            for (let i: number = 0; i < this.pageCount; i++) {
                if (annotation[i]) {
                    // eslint-disable-next-line
                    let importPageCollections: any = [];
                    // eslint-disable-next-line
                    let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                    // eslint-disable-next-line
                    let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                    // eslint-disable-next-line
                    let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                    // eslint-disable-next-line
                    let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                    // eslint-disable-next-line
                    let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                    // eslint-disable-next-line
                    let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                    // eslint-disable-next-line
                    let signatureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                    // eslint-disable-next-line
                    let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                    if (this.isStorageExceed) {
                        textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                        shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                        measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                        stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                        stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                        freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                        inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                    }
                    const annotationCanvas: HTMLElement = this.getElement('_annotationCanvas_' + i);
                    if (annotationCanvas) {
                        this.drawPageAnnotations(annotation[i], i);
                        if (this.isImportedAnnotation) {
                            let isAdded: boolean = false;
                            for (let j: number = 0; j < this.annotationPageList.length; j++) {
                                if (this.annotationPageList[j] === i) {
                                    isAdded = true;
                                }
                            }
                            if (isAdded) {
                                this.annotationPageList[count] = i;
                                count = count + 1;
                            }
                        } else {
                            this.annotationPageList[count] = i;
                            count = count + 1;
                        }
                    }
                    if (annotation[i].textMarkupAnnotation && annotation[i].textMarkupAnnotation.length !== 0) {
                        if (textMarkupObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                            // eslint-disable-next-line max-len
                            annotation[i].textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].textMarkupAnnotation, i);
                        }
                        annotation[i].textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation[i].textMarkupAnnotation, i);
                        importPageCollections.textMarkupAnnotation = annotation[i].textMarkupAnnotation;
                        if (annotation[i].textMarkupAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].textMarkupAnnotation, i);
                            for (let j: number = 0; j < annotation[i].textMarkupAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateTextMarkupAnnotationCollections(annotation[i].textMarkupAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].shapeAnnotation && annotation[i].shapeAnnotation.length !== 0) {
                        if (shapeObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(shapeObject);
                            annotation[i].shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].shapeAnnotation, i);
                        }
                        annotation[i].shapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].shapeAnnotation, i);
                        importPageCollections.shapeAnnotation = annotation[i].shapeAnnotation;
                        if (annotation[i].shapeAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].shapeAnnotation, i);
                            for (let j: number = 0; j < annotation[i].shapeAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.shapeAnnotationModule.updateShapeAnnotationCollections(annotation[i].shapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].measureShapeAnnotation && annotation[i].measureShapeAnnotation.length !== 0) {
                        if (measureShapeObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(measureShapeObject);
                            // eslint-disable-next-line max-len
                            annotation[i].measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].measureShapeAnnotation, i);
                        }
                        // eslint-disable-next-line max-len
                        annotation[i].measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].measureShapeAnnotation, i);
                        importPageCollections.measureShapeAnnotation = annotation[i].measureShapeAnnotation;
                        if (annotation[i].measureShapeAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].measureShapeAnnotation, i);
                            for (let j: number = 0; j < annotation[i].measureShapeAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.measureAnnotationModule.updateMeasureAnnotationCollections(annotation[i].measureShapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].stampAnnotations && annotation[i].stampAnnotations.length !== 0) {
                        if (stampObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(stampObject);
                            // eslint-disable-next-line max-len
                            annotation[i].stampAnnotations = this.checkAnnotationCollections(annotObject, annotation[i].stampAnnotations, i);
                        }
                        annotation[i].stampAnnotations = this.checkAnnotationCommentsCollections(annotation[i].stampAnnotations, i);
                        importPageCollections.stampAnnotations = annotation[i].stampAnnotations;
                        if (annotation[i].stampAnnotations.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stampAnnotations, i);
                            for (let j: number = 0; j < annotation[i].stampAnnotations.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stampAnnotationModule.updateStampAnnotationCollections(annotation[i].stampAnnotations[j], i));
                            }
                        }
                    }
                    if (annotation[i].stickyNotesAnnotation && annotation[i].stickyNotesAnnotation.length !== 0) {
                        if (stickyObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(stickyObject);
                            // eslint-disable-next-line max-len
                            annotation[i].stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].stickyNotesAnnotation, i);
                        }
                        // eslint-disable-next-line max-len
                        annotation[i].stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation[i].stickyNotesAnnotation, i);
                        importPageCollections.stickyNotesAnnotation = annotation[i].stickyNotesAnnotation;
                        if (annotation[i].stickyNotesAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stickyNotesAnnotation, i);
                            for (let j: number = 0; j < annotation[i].stickyNotesAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateStickyNotesAnnotationCollections(annotation[i].stickyNotesAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].freeTextAnnotation && annotation[i].freeTextAnnotation.length !== 0) {
                        if (freeTextObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                            // eslint-disable-next-line max-len
                            annotation[i].freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].freeTextAnnotation, i);
                        }
                        annotation[i].freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation[i].freeTextAnnotation, i);
                        importPageCollections.freeTextAnnotation = annotation[i].freeTextAnnotation;
                        if (annotation[i].freeTextAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].freeTextAnnotation, i);
                            for (let j: number = 0; j < annotation[i].freeTextAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].signatureAnnotation && annotation[i].signatureAnnotation.length !== 0) {
                        if (signatureObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(signatureObject);
                            // eslint-disable-next-line max-len
                            annotation[i].signatureAnnotation = this.checkSignatureCollections(annotObject, annotation[i].signatureAnnotation, i);
                        }
                        importPageCollections.signatureAnnotation = annotation[i].signatureAnnotation;
                        if (annotation[i].signatureAnnotation.length !== 0) {
                            for (let j: number = 0; j < annotation[i].signatureAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.signatureModule.updateSignatureCollections(annotation[i].signatureAnnotation[j], i), true);
                            }
                        }
                    }
                    if (annotation[i].signatureInkAnnotation && annotation[i].signatureInkAnnotation.length !== 0) {
                        if (inkObject) {
                            const annotObject: IPageAnnotations[] = JSON.parse(inkObject);
                            // eslint-disable-next-line max-len
                            annotation[i].signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].signatureInkAnnotation, i);
                        }
                        // eslint-disable-next-line max-len
                        annotation[i].signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation[i].signatureInkAnnotation, i);
                        importPageCollections.signatureInkAnnotation = annotation[i].signatureInkAnnotation;
                        if (annotation[i].signatureInkAnnotation.length !== 0) {
                            // eslint-disable-next-line max-len
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].signatureInkAnnotation, i);
                            for (let j: number = 0; j < annotation[i].signatureInkAnnotation.length; j++) {
                                // eslint-disable-next-line max-len
                                // this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    this.updateImportedAnnotationsInDocumentCollections(importPageCollections, i);
                }
            }
            if (this.pageCount > 0) {
                // eslint-disable-next-line max-len
                if (this.pdfViewer.annotationModule.stickyNotesAnnotationModule && !this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isAnnotationRendered) {
                    // eslint-disable-next-line
                    let annotationCollection: any = this.createAnnotationsCollection();
                    if (annotationCollection) {
                        // eslint-disable-next-line max-len
                        this.documentAnnotationCollections = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationsInDocumentCollections(this.importedAnnotation, annotationCollection);
                    }
                }
            }
        }
    }

    /**
     * @param importedAnnotations
     * @param pageNumber
     * @private
     */
    // eslint-disable-next-line
    private updateImportedAnnotationsInDocumentCollections(importedAnnotations: any, pageNumber: number): void {
        if (this.documentAnnotationCollections) {
            // eslint-disable-next-line
            let documentAnnotationCollection: any = this.documentAnnotationCollections;
            // eslint-disable-next-line
            let pageCollections: any = documentAnnotationCollection[pageNumber];
            if (pageCollections) {
                if (importedAnnotations.textMarkupAnnotation && importedAnnotations.textMarkupAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.textMarkupAnnotation.length; i++) {
                        pageCollections.textMarkupAnnotation.push(importedAnnotations.textMarkupAnnotation[i]);
                    }
                }
                if (importedAnnotations.shapeAnnotation && importedAnnotations.shapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.shapeAnnotation.length; i++) {
                        pageCollections.shapeAnnotation.push(importedAnnotations.shapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.measureShapeAnnotation && importedAnnotations.measureShapeAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.measureShapeAnnotation.length; i++) {
                        pageCollections.measureShapeAnnotation.push(importedAnnotations.measureShapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.stampAnnotations && importedAnnotations.stampAnnotations.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stampAnnotations.length; i++) {
                        pageCollections.stampAnnotations.push(importedAnnotations.stampAnnotations[i]);
                    }
                }
                if (importedAnnotations.stickyNotesAnnotation && importedAnnotations.stickyNotesAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.stickyNotesAnnotation.length; i++) {
                        pageCollections.stickyNotesAnnotation.push(importedAnnotations.stickyNotesAnnotation[i]);
                    }
                }
                if (importedAnnotations.freeTextAnnotation && importedAnnotations.freeTextAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.freeTextAnnotation.length; i++) {
                        pageCollections.freeTextAnnotation.push(importedAnnotations.freeTextAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureAnnotation && importedAnnotations.signatureAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureAnnotation.length; i++) {
                        pageCollections.signatureAnnotation.push(importedAnnotations.signatureAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureInkAnnotation && importedAnnotations.signatureInkAnnotation.length !== 0) {
                    for (let i: number = 0; i < importedAnnotations.signatureInkAnnotation.length; i++) {
                        pageCollections.signatureInkAnnotation.push(importedAnnotations.signatureInkAnnotation[i]);
                    }
                }
                this.documentAnnotationCollections[pageNumber] = pageCollections;
            }
        }
    }

    /**
     * @param pageIndex
     * @param pageCollections
     * @param pageIndex
     * @param pageCollections
     * @private
     */
    // eslint-disable-next-line
    public checkDocumentCollectionData(pageIndex: number, pageCollections?: any): any {
        // eslint-disable-next-line
        let importPageCollections: any;
        if (pageCollections) {
            importPageCollections = pageCollections;
        } else if (this.documentAnnotationCollections) {
            // eslint-disable-next-line
            let documetCollections: any = this.documentAnnotationCollections[pageIndex];
            if (documetCollections) {
                importPageCollections = cloneObject(documetCollections);
            }
        }
        if (importPageCollections) {
            // eslint-disable-next-line
            let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
            // eslint-disable-next-line
            let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
            // eslint-disable-next-line
            let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
            // eslint-disable-next-line
            let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
            // eslint-disable-next-line
            let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
            // eslint-disable-next-line
            let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
            // eslint-disable-next-line
            let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
            // eslint-disable-next-line
            let signatureObject = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
            if (this.isStorageExceed) {
                textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                signatureObject = this.annotationStorage[this.documentId + '_annotations_sign'];
            }
            if (importPageCollections.textMarkupAnnotation && importPageCollections.textMarkupAnnotation.length !== 0) {
                if (textMarkupObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(textMarkupObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.textMarkupAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.textMarkupAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.shapeAnnotation && importPageCollections.shapeAnnotation.length !== 0) {
                if (shapeObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(shapeObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.shapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.shapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.measureShapeAnnotation && importPageCollections.measureShapeAnnotation.length !== 0) {
                if (measureShapeObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(measureShapeObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.measureShapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.measureShapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.stampAnnotations && importPageCollections.stampAnnotations.length !== 0) {
                if (stampObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(stampObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.stampAnnotations = this.findImportedAnnotations(annotationObject, importPageCollections.stampAnnotations, pageIndex);
                    }
                }
            }
            if (importPageCollections.stickyNotesAnnotation && importPageCollections.stickyNotesAnnotation.length !== 0) {
                if (stickyObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(stickyObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.stickyNotesAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.stickyNotesAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.freeTextAnnotation && importPageCollections.freeTextAnnotation.length !== 0) {
                if (freeTextObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(freeTextObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.freeTextAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.freeTextAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureInkAnnotation && importPageCollections.signatureInkAnnotation.length !== 0) {
                if (inkObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(inkObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.signatureInkAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.signatureInkAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureAnnotation && importPageCollections.signatureAnnotation.length !== 0) {
                if (signatureObject) {
                    const annotationObject: IPageAnnotations[] = JSON.parse(inkObject);
                    if (annotationObject) {
                        // eslint-disable-next-line max-len
                        importPageCollections.signatureAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.signatureAnnotation, pageIndex);
                    }
                }
            }
            return importPageCollections;
        }
    }
    // eslint-disable-next-line
    private findImportedAnnotations(annotationCollection: any, importAnnotations: any, pageNumber: number) {
        // eslint-disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < importAnnotations.length; j++) {
                    if (pageCollections[i].annotName === importAnnotations[j].AnnotName) {
                        importAnnotations.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return importAnnotations;
    }

    // eslint-disable-next-line
    private drawPageAnnotations(annotation: any, pageIndex: number, isNewlyAdded?: boolean): void {
        if (isNewlyAdded) {
            annotation = annotation[pageIndex];
        }
        if (annotation) {
            if (annotation.textMarkupAnnotation && annotation.textMarkupAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    if (annotObject) {
                        // eslint-disable-next-line max-len
                        annotation.textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation.textMarkupAnnotation, pageIndex);
                    }
                }
                annotation.textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation.textMarkupAnnotation, pageIndex);
                if (annotation.textMarkupAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, null, annotation.textMarkupAnnotation, null, true);
                }
            }
            if (annotation.shapeAnnotation && annotation.shapeAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.shapeAnnotation, pageIndex);
                }
                annotation.shapeAnnotation = this.checkAnnotationCommentsCollections(annotation.shapeAnnotation, pageIndex);
                if (annotation.shapeAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, annotation.shapeAnnotation, null, null, null, true);
                }
            }
            if (annotation.measureShapeAnnotation && annotation.measureShapeAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // eslint-disable-next-line max-len
                    annotation.measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.measureShapeAnnotation, pageIndex);
                }
                annotation.measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation.measureShapeAnnotation, pageIndex);
                if (annotation.measureShapeAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, annotation.measureShapeAnnotation, null, null, true);
                }
            }
            if (annotation.stampAnnotations && annotation.stampAnnotations.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.stampAnnotations = this.checkAnnotationCollections(annotObject, annotation.stampAnnotations, pageIndex);
                }
                annotation.stampAnnotations = this.checkAnnotationCommentsCollections(annotation.stampAnnotations, pageIndex);
                if (annotation.stampAnnotations.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(annotation.stampAnnotations, pageIndex, null, true);
                }
            }
            if (annotation.stickyNotesAnnotation && annotation.stickyNotesAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // eslint-disable-next-line max-len
                    annotation.stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation.stickyNotesAnnotation, pageIndex);
                }
                annotation.stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation.stickyNotesAnnotation, pageIndex);
                if (annotation.stickyNotesAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(annotation.stickyNotesAnnotation, pageIndex);
                }
            }
            if (annotation.freeTextAnnotation && annotation.freeTextAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    annotation.freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation.freeTextAnnotation, pageIndex);
                }
                annotation.freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation.freeTextAnnotation, pageIndex);
                if (annotation.freeTextAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(annotation.freeTextAnnotation, pageIndex, true, true);
                }
            }
            if (annotation.signatureAnnotation && annotation.signatureAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                if (annotObject) {
                    annotation.signatureAnnotation = this.checkSignatureCollections(annotObject, annotation.signatureAnnotation, pageIndex);
                }
                this.signatureModule.renderExistingSignature(annotation.signatureAnnotation, pageIndex, true);
            }
            if (annotation.signatureInkAnnotation && annotation.signatureInkAnnotation.length !== 0) {
                // eslint-disable-next-line
                let storeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                }
                if (storeObject) {
                    const annotObject: IPageAnnotations[] = JSON.parse(storeObject);
                    // eslint-disable-next-line max-len
                    annotation.signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation.signatureInkAnnotation, pageIndex);
                }
                annotation.signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation.signatureInkAnnotation, pageIndex);
                if (annotation.signatureInkAnnotation.length !== 0) {
                    // eslint-disable-next-line max-len
                    this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(annotation.signatureInkAnnotation, pageIndex, true);
                }
            }
        }
    }
    // eslint-disable-next-line
    private checkSignatureCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[i].signatureName === annotation[j].SignatureName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }
    // eslint-disable-next-line
    private checkAnnotationCollections(annotationCollection: any, annotation: any, pageNumber: number): any {
        // eslint-disable-next-line
        let pageCollections: any = null;
        for (let a: number = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (let i: number = 0; i < pageCollections.length; i++) {
                for (let j: number = 0; j < annotation.length; j++) {
                    if (pageCollections[i].annotName === annotation[j].AnnotName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    }

    // eslint-disable-next-line
    private checkAnnotationCommentsCollections(annotation: any, pageNumber: number): any {
        if (this.annotationComments) {
            // eslint-disable-next-line
            let annotationCollections: any = this.annotationComments[pageNumber];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < annotation.length; j++) {
                        if (annotationCollections[i].AnnotName === annotation[j].AnnotName) {
                            annotation.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
            annotationCollections = null;
        }
        return annotation;
    }

    // eslint-disable-next-line
    private selectAnnotationCollections(pageAnnotations: any): void {
        // eslint-disable-next-line
        let pageCollections: any = [];
        if (pageAnnotations) {
            if (pageAnnotations.textMarkupAnnotation && pageAnnotations.textMarkupAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.textMarkupAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.textMarkupAnnotation[i]);
                }
            }
            if (pageAnnotations.shapeAnnotation && pageAnnotations.shapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.shapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.shapeAnnotation[i]);
                }
            }
            if (pageAnnotations.measureShapeAnnotation && pageAnnotations.measureShapeAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.measureShapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.measureShapeAnnotation[i]);
                }
            }
            if (pageAnnotations.stampAnnotations && pageAnnotations.stampAnnotations.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stampAnnotations.length; i++) {
                    pageCollections.push(pageAnnotations.stampAnnotations[i]);
                }
            }
            if (pageAnnotations.stickyNotesAnnotation && pageAnnotations.stickyNotesAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.stickyNotesAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.stickyNotesAnnotation[i]);
                }
            }
            if (pageAnnotations.freeTextAnnotation && pageAnnotations.freeTextAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.freeTextAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.freeTextAnnotation[i]);
                }
            }
            if (pageAnnotations.signatureInkAnnotation && pageAnnotations.signatureInkAnnotation.length !== 0) {
                for (let i: number = 0; i < pageAnnotations.signatureInkAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.signatureInkAnnotation[i]);
                }
            }
        }
        return pageCollections;
    }

    private saveImportedAnnotations(): void {
        // eslint-disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // eslint-disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // eslint-disable-next-line
        let measureShapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // eslint-disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // eslint-disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // eslint-disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        // eslint-disable-next-line
        let inkObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        // eslint-disable-next-line
        let signatureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
        if (this.isStorageExceed) {
            textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
            shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
            measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
            stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
            stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
            freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
            inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
            signatureObject = this.annotationStorage[this.documentId + '_annotations_sign'];
        }
        // eslint-disable-next-line max-len
        this.downloadCollections = { textMarkupObject: textMarkupObject, shapeObject: shapeObject, measureShapeObject: measureShapeObject, stampObject: stampObject, stickyObject: stickyObject, freeTextObject: freeTextObject, inkObject: inkObject, signatureObject: signatureObject };
        if (this.documentAnnotationCollections) {
            for (let i: number = 0; i < this.pageCount; i++) {
                if (this.documentAnnotationCollections[i]) {
                    // eslint-disable-next-line
                    let pageCollections: any = cloneObject(this.documentAnnotationCollections[i]);
                    pageCollections = this.checkDocumentCollectionData(i, pageCollections);
                    this.savePageAnnotations(pageCollections, i);
                }
            }
        }
    }

    // eslint-disable-next-line
    private savePageAnnotations(annotation: any, pageIndex: number): void {
        if (annotation.textMarkupAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.textMarkupAnnotation.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveImportedTextMarkupAnnotations(annotation.textMarkupAnnotation[s], pageIndex);
            }
        }
        if (annotation.shapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.shapeAnnotation.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.shapeAnnotationModule.saveImportedShapeAnnotations(annotation.shapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.measureShapeAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.measureShapeAnnotation.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.measureAnnotationModule.saveImportedMeasureAnnotations(annotation.measureShapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.stampAnnotations.length !== 0) {
            for (let s: number = 0; s < annotation.stampAnnotations.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.stampAnnotationModule.saveImportedStampAnnotations(annotation.stampAnnotations[s], pageIndex);
            }
        }
        if (annotation.stickyNotesAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.stickyNotesAnnotation.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveImportedStickyNotesAnnotations(annotation.stickyNotesAnnotation[s], pageIndex);
            }
        }
        if (annotation.freeTextAnnotation.length !== 0) {
            for (let s: number = 0; s < annotation.freeTextAnnotation.length; s++) {
                // eslint-disable-next-line max-len
                this.pdfViewer.annotationModule.freeTextAnnotationModule.saveImportedFreeTextAnnotations(annotation.freeTextAnnotation[s], pageIndex);
            }
        }
    }

    private updateDocumentAnnotationCollections(): void {
        window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
        window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
        window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        if (this.downloadCollections) {
            if (this.isStorageExceed) {
                this.annotationStorage[this.documentId + '_annotations_textMarkup'] = this.downloadCollections.textMarkupObject;
                this.annotationStorage[this.documentId + '_annotations_shape'] = this.downloadCollections.shapeObject;
                this.annotationStorage[this.documentId + '_annotations_shape_measure'] = this.downloadCollections.measureShapeObject;
                this.annotationStorage[this.documentId + '_annotations_stamp'] = this.downloadCollections.stampObject;
                this.annotationStorage[this.documentId + '_annotations_sticky'] = this.downloadCollections.stickyObject;
                this.annotationStorage[this.documentId + '_annotations_freetext'] = this.downloadCollections.freeTextObject;
                this.annotationStorage[this.documentId + '_annotations_ink'] = this.downloadCollections.inkObject;
            } else {
                if (this.downloadCollections.textMarkupObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_textMarkup', this.downloadCollections.textMarkupObject);
                }
                if (this.downloadCollections.shapeObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_shape', this.downloadCollections.shapeObject);
                }
                if (this.downloadCollections.measureShapeObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_shape_measure', this.downloadCollections.measureShapeObject);
                }
                if (this.downloadCollections.stampObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_stamp', this.downloadCollections.stampObject);
                }
                if (this.downloadCollections.stickyObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_sticky', this.downloadCollections.stickyObject);
                }
                if (this.downloadCollections.freeTextObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_freetext', this.downloadCollections.freeTextObject);
                }
                if (this.downloadCollections.inkObject) {
                    window.sessionStorage.setItem(this.documentId + '_annotations_ink', this.downloadCollections.inkObject);
                }
            }
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public createAnnotationJsonData(): any {
        // eslint-disable-next-line
        let annotationCollection: any = {};
        let textMarkupAnnotationCollection: string;
        let shapeAnnotations: string;
        let calibrateAnnotations: string;
        let stampAnnotationCollection: string;
        let stickyAnnotationCollection: string;
        let freeTextAnnotationCollection: string;
        let signaturCollection: string;
        let signaturInkCollection: string;
        this.saveImportedAnnotations();
        if (this.isTextMarkupAnnotationModule()) {
            this.isJsonExported = true;
            // eslint-disable-next-line max-len
            textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
        }
        if (this.isShapeAnnotationModule()) {
            this.isJsonExported = true;
            // eslint-disable-next-line max-len
            shapeAnnotations = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
        }
        if (this.isCalibrateAnnotationModule()) {
            this.isJsonExported = true;
            // eslint-disable-next-line max-len
            calibrateAnnotations = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
        }
        if (this.isStampAnnotationModule()) {
            // eslint-disable-next-line max-len
            stampAnnotationCollection = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
        }
        if (this.isCommentAnnotationModule()) {
            // eslint-disable-next-line max-len
            stickyAnnotationCollection = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
        }
        if (this.isFreeTextAnnotationModule()) {
            // eslint-disable-next-line max-len
            freeTextAnnotationCollection = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations(true);
        }
        if (this.isInkAnnotationModule()) {
            // eslint-disable-next-line
            signaturInkCollection = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
        }
        if (this.pdfViewer.isSignatureEditable) {
            // eslint-disable-next-line
            signaturCollection = this.signatureModule.saveSignature();
        } else {
            // eslint-disable-next-line
            let annotations: Array<any> = new Array();
            for (let j: number = 0; j < this.pageCount; j++) {
                annotations[j] = [];
            }
            signaturCollection = JSON.stringify(annotations);
        }
        for (let s: number = 0; s < this.pageCount; s++) {
            // eslint-disable-next-line max-len
            const annotation: IAnnotationCollection = {
                textMarkupAnnotation: JSON.parse(textMarkupAnnotationCollection)[s], shapeAnnotation: JSON.parse(shapeAnnotations)[s],
                measureShapeAnnotation: JSON.parse(calibrateAnnotations)[s], stampAnnotations: JSON.parse(stampAnnotationCollection)[s],
                // eslint-disable-next-line max-len
                stickyNotesAnnotation: JSON.parse(stickyAnnotationCollection)[s], freeTextAnnotation: JSON.parse(freeTextAnnotationCollection)[s], signatureAnnotation: JSON.parse(signaturCollection)[s], signatureInkAnnotation: JSON.parse(signaturInkCollection)[s]
            };
            annotationCollection[s] = annotation;
        }
        return JSON.stringify(annotationCollection);
    }

    // eslint-disable-next-line
    private combineImportedData(excistingImportAnnotation: any, newlyImportAnnotation: any): any {
        for (let i: number = 0; i < this.pageCount; i++) {
            if (newlyImportAnnotation[i]) {
                if (excistingImportAnnotation[i]) {
                    if (newlyImportAnnotation[i].textMarkupAnnotation && newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].textMarkupAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].textMarkupAnnotation = this.checkImportedData(excistingImportAnnotation[i].textMarkupAnnotation, newlyImportAnnotation[i].textMarkupAnnotation, i);
                            if (newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].textMarkupAnnotation = excistingImportAnnotation[i].textMarkupAnnotation.concat(newlyImportAnnotation[i].textMarkupAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].textMarkupAnnotation = newlyImportAnnotation[i].textMarkupAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].shapeAnnotation && newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].shapeAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].shapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].shapeAnnotation, newlyImportAnnotation[i].shapeAnnotation, i);
                            if (newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].shapeAnnotation = excistingImportAnnotation[i].shapeAnnotation.concat(newlyImportAnnotation[i].shapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].shapeAnnotation = newlyImportAnnotation[i].shapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].measureShapeAnnotation && newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].measureShapeAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].measureShapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].measureShapeAnnotation, newlyImportAnnotation[i].measureShapeAnnotation, i);
                            if (newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].measureShapeAnnotation = excistingImportAnnotation[i].measureShapeAnnotation.concat(newlyImportAnnotation[i].measureShapeAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].measureShapeAnnotation = newlyImportAnnotation[i].measureShapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].stampAnnotations && newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                        if (excistingImportAnnotation[i].stampAnnotations) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].stampAnnotations = this.checkImportedData(excistingImportAnnotation[i].stampAnnotations, newlyImportAnnotation[i].stampAnnotations, i);
                            if (newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].stampAnnotations = excistingImportAnnotation[i].stampAnnotations.concat(newlyImportAnnotation[i].stampAnnotations);
                            }
                        } else {
                            excistingImportAnnotation[i].stampAnnotations = newlyImportAnnotation[i].stampAnnotations;
                        }
                    }
                    if (newlyImportAnnotation[i].stickyNotesAnnotation && newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].stickyNotesAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].stickyNotesAnnotation = this.checkImportedData(excistingImportAnnotation[i].stickyNotesAnnotation, newlyImportAnnotation[i].stickyNotesAnnotation, i);
                            if (newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].stickyNotesAnnotation = excistingImportAnnotation[i].stickyNotesAnnotation.concat(newlyImportAnnotation[i].stickyNotesAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].stickyNotesAnnotation = newlyImportAnnotation[i].stickyNotesAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].freeTextAnnotation && newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].freeTextAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].freeTextAnnotation = this.checkImportedData(excistingImportAnnotation[i].freeTextAnnotation, newlyImportAnnotation[i].freeTextAnnotation, i);
                            if (newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].freeTextAnnotation = excistingImportAnnotation[i].freeTextAnnotation.concat(newlyImportAnnotation[i].freeTextAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].freeTextAnnotation = newlyImportAnnotation[i].freeTextAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].signatureInkAnnotation && newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].signatureInkAnnotation) {
                            // eslint-disable-next-line max-len
                            newlyImportAnnotation[i].signatureInkAnnotation = this.checkImportedData(excistingImportAnnotation[i].signatureInkAnnotation, newlyImportAnnotation[i].signatureInkAnnotation, i);
                            if (newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                                // eslint-disable-next-line max-len
                                excistingImportAnnotation[i].signatureInkAnnotation = excistingImportAnnotation[i].signatureInkAnnotation.concat(newlyImportAnnotation[i].signatureInkAnnotation);
                            }
                        } else {
                            excistingImportAnnotation[i].signatureInkAnnotation = newlyImportAnnotation[i].signatureInkAnnotation;
                        }
                    }
                } else {
                    // eslint-disable-next-line max-len
                    const annotation: IAnnotationCollection = {
                        // eslint-disable-next-line max-len
                        textMarkupAnnotation: newlyImportAnnotation[i].textMarkupAnnotation, shapeAnnotation: newlyImportAnnotation[i].shapeAnnotation,
                        // eslint-disable-next-line max-len
                        measureShapeAnnotation: newlyImportAnnotation[i].measureShapeAnnotation, stampAnnotations: newlyImportAnnotation[i].stampAnnotations,
                        // eslint-disable-next-line max-len
                        stickyNotesAnnotation: newlyImportAnnotation[i].stickyNotesAnnotation, freeTextAnnotation: newlyImportAnnotation[i].freeTextAnnotation,
                        signatureInkAnnotation: newlyImportAnnotation[i].signatureInkAnnotation
                    };
                    excistingImportAnnotation[i] = annotation;
                }
            }
        }
        return excistingImportAnnotation;
    }

    /**
     * @private
     * @returns {boolean} - Returns true or false.
     */
    public updateExportItem(): boolean {
        // eslint-disable-next-line
        let shapeObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // eslint-disable-next-line
        let measureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // eslint-disable-next-line
        let stampObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // eslint-disable-next-line
        let stickyObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // eslint-disable-next-line
        let textMarkupObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // eslint-disable-next-line
        let freeTextObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        let isSignatureEditable: boolean = false;
        // eslint-disable-next-line
        let inkAnnotationObjct: any = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        if (this.pdfViewer.isSignatureEditable) {
            // eslint-disable-next-line
            let signatureObject: any = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
            if (signatureObject) {
                isSignatureEditable = true;
            }
        }
        // eslint-disable-next-line max-len
        if (shapeObject || measureObject || stampObject || stickyObject || textMarkupObject || freeTextObject || this.isImportAction || this.isStorageExceed || isSignatureEditable || inkAnnotationObjct) {
            return true;
        } else {
            return false;
        }
    }
    private isFreeTextAnnotation(annotations: PdfAnnotationBaseModel[]): boolean {
        let resut: boolean = false;
        if (annotations && annotations.length > 0) {
            resut = annotations.some((s: PdfAnnotationBaseModel) => s.shapeAnnotationType === 'FreeText' && s.subject === 'Text Box');
        }
        return resut;
    }

    // eslint-disable-next-line
    private checkImportedData(existingCollection: any, newCollection: any, pageIndex?: number): any {
        for (let i: number = 0; i < existingCollection.length; i++) {
            for (let j: number = 0; j < newCollection.length; j++) {
                if (existingCollection[i].AnnotName === newCollection[j].AnnotName) {
                    newCollection.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        if (this.annotationComments) {
            // eslint-disable-next-line
            let annotationCollections: any = this.annotationComments[pageIndex];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (let i: number = 0; i < annotationCollections.length; i++) {
                    for (let j: number = 0; j < newCollection.length; j++) {
                        if (annotationCollections[i].AnnotName === newCollection[j].AnnotName) {
                            newCollection.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
        }
        return newCollection;
    }

    /**
     * @param points
     * @private
     */
    // eslint-disable-next-line
    public checkAnnotationWidth(points: any): object {
        let width: number = 0;
        let height: number = 0;
        let minWidth: number;
        let maxWidth: number;
        let minHeight: number;
        let maxHeight: number;
        for (let i: number = 0; i < points.length; i++) {
            if (!minWidth) {
                minWidth = points[i].x;
                maxWidth = points[i].x;
                minHeight = points[i].y;
                maxHeight = points[i].y;
            } else {
                if (minWidth > points[i].x) {
                    minWidth = points[i].x;
                } else if (maxWidth < points[i].x) {
                    maxWidth = points[i].x;
                }
                if (minHeight > points[i].y) {
                    minHeight = points[i].y;
                } else if (maxHeight < points[i].y) {
                    maxHeight = points[i].y;
                }
            }
        }
        width = maxWidth - minWidth;
        height = maxHeight - minHeight;
        return { width: width, height: height };
    }


    public deleteAnnotations(): void {
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotations = [];
            this.pdfViewer.zIndexTable = [];
            this.pdfViewer.annotationCollection = [];
            this.pdfViewer.signatureCollection = [];
            // eslint-disable-next-line
            let annotationCollection: any = this.createAnnotationsCollection();
            this.annotationComments = annotationCollection;
            this.documentAnnotationCollections = annotationCollection;
            this.annotationRenderredList = [];
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
            for (let i: number = 0; i < this.pageCount; i++) {
                this.pdfViewer.annotationModule.renderAnnotations(i, null, null, null);
                this.pdfViewer.renderDrawing(undefined, i);
                this.pdfViewer.clearSelection(i);
                const accordionContent: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (i + 1));
                if (accordionContent) {
                    accordionContent.remove();
                }
                // eslint-disable-next-line max-len
                const accordionContentContainer: HTMLElement = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
                if (accordionContentContainer) {
                    if (accordionContentContainer.childElementCount === 0) {
                        accordionContentContainer.style.display = 'none';
                        if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                            // eslint-disable-next-line max-len
                            this.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
                            document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'block';
                        }
                    }
                }
            }
            this.isImportedAnnotation = false;
            this.isImportAction = false;
            this.importedAnnotation = [];
            this.annotationPageList = [];
            this.pdfViewer.annotationModule.freeTextAnnotationModule.freeTextPageNumbers = [];
            this.pdfViewer.annotationModule.stampAnnotationModule.stampPageNumber = [];
            this.pdfViewer.annotation.inkAnnotationModule.inkAnnotationindex = [];
            this.isAnnotationCollectionRemoved = true;
        }
    }

    /**
     * @param pageNumber
     * @param isObject
     * @param pageNumber
     * @param isObject
     * @private
     */
    // eslint-disable-next-line
    public createAnnotationsCollection(pageNumber?: number, isObject?: boolean): any {
        // eslint-disable-next-line
        let annotationCollectionList: any = [];
        if (!isObject) {
            for (let i: number = 0; i < this.pageCount; i++) {
                const annotation: IAnnotationCollection = {
                    // eslint-disable-next-line max-len
                    textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [], stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: []
                };
                annotationCollectionList.push(annotation);
            }
        } else {
            annotationCollectionList = {};
            const annotation: IAnnotationCollection = {
                // eslint-disable-next-line max-len
                textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [], stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: []
            };
            annotationCollectionList[pageNumber] = annotation;
        }
        return annotationCollectionList;
    }

    /**
     * @param importAnnotation
     * @private
     */
    // eslint-disable-next-line
    public addAnnotation(importAnnotation: any): void {
        // eslint-disable-next-line
        let pdfAnnotation: any = {};
        // eslint-disable-next-line
        let documentCollections: any;
        if (importAnnotation) {
            let isAnnotationObject: boolean = false;
            let annotationCount: number = 1;
            if (importAnnotation.shapeAnnotationType || importAnnotation.author) {
                isAnnotationObject = true;
                documentCollections = this.createAnnotationsCollection(importAnnotation.pageNumber, true);
            } else {
                if (importAnnotation.length) {
                    annotationCount = importAnnotation.length;
                    documentCollections = this.createAnnotationsCollection();
                } else {
                    isAnnotationObject = true;
                    documentCollections = this.createAnnotationsCollection(importAnnotation.pageNumber, true);
                }
            }
            for (let a: number = 0; a < annotationCount; a++) {
                // eslint-disable-next-line
                let annotation: any;
                if (isAnnotationObject) {
                    annotation = importAnnotation;
                } else {
                    annotation = importAnnotation[a];
                }
                // eslint-disable-next-line
                let newAnnotation: any = {};
                newAnnotation.ShapeAnnotationType = annotation.shapeAnnotationType;
                newAnnotation.AnnotationAddMode = annotation.annotationAddMode;
                newAnnotation.Author = annotation.author;
                newAnnotation.AnnotationSelectorSettings = annotation.annotationSelectorSettings;
                newAnnotation.AnnotationSettings = annotation.annotationSettings;
                newAnnotation.PageNumber = annotation.pageNumber;
                newAnnotation.ModifiedDate = annotation.modifiedDate;
                newAnnotation.Subject = annotation.subject;
                newAnnotation.Note = annotation.note;
                newAnnotation.AnnotName = annotation.annotationId;
                newAnnotation.IsCommentLock = annotation.isCommentLock;
                newAnnotation.Comments = annotation.comments;
                if (annotation.comments && annotation.comments.length > 0) {
                    // eslint-disable-next-line
                    let comments: any = [];
                    for (let i: number = 0; i < annotation.comments.length; i++) {
                        comments.push(this.updateComments(annotation, annotation.comments[i]));
                    }
                    newAnnotation.Comments = comments;
                }
                if (annotation.review) {
                    newAnnotation.State = annotation.review.state;
                    newAnnotation.StateModel = annotation.review.stateModel;
                }
                newAnnotation.CustomData = annotation.customData;
                newAnnotation.Opacity = annotation.opacity;
                if (annotation.shapeAnnotationType === 'textMarkup') {
                    newAnnotation.AnnotType = 'textMarkup';
                    newAnnotation.Color = annotation.color;
                    newAnnotation.IsMultiSelect = annotation.isMultiSelect;
                    newAnnotation.TextMarkupAnnotationType = annotation.textMarkupAnnotationType;
                    newAnnotation.TextMarkupContent = annotation.textMarkupContent;
                    newAnnotation.TextMarkupStartIndex = annotation.textMarkupStartIndex;
                    newAnnotation.TextMarkupEndIndex = annotation.textMarkupEndIndex;
                    if (annotation.rect) {
                        newAnnotation.Rect = this.convertBounds(annotation.rect, true);
                    }
                    if (annotation.bounds && annotation.bounds.length >= 1) {
                        // eslint-disable-next-line
                        let bounds: Array<any> = new Array();
                        for (let i: number = 0; i < annotation.bounds.length; i++) {
                            bounds.push(this.convertBounds(annotation.bounds[i]));
                        }
                        newAnnotation.Bounds = bounds;
                    }
                    documentCollections[annotation.pageNumber].textMarkupAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'sticky') {
                    newAnnotation.AnnotType = 'sticky';
                    newAnnotation.Icon = 'Comment';
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.Color = annotation.color;
                    documentCollections[annotation.pageNumber].stickyNotesAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'FreeText') {
                    newAnnotation.AnnotType = 'freeText';
                    newAnnotation.Name = annotation.annotationId;
                    newAnnotation.MarkupText = annotation.dynamicText;
                    newAnnotation.Text = annotation.dynamicText;
                    newAnnotation.Note = annotation.dynamicText;
                    newAnnotation.TextAlign = annotation.textAlign;
                    newAnnotation.Thickness = annotation.thicknes;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.FontColor = annotation.fontColor;
                    newAnnotation.FontSize = annotation.fontSize;
                    newAnnotation.FontFamily = annotation.fontFamily;
                    newAnnotation.Rotate = annotation.rotateAngle;
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    // eslint-disable-next-line max-len
                    newAnnotation.Font = { 'Name': annotation.fontFamily, 'Size': annotation.fontSize, 'Bold': annotation.font.isBold, 'Italic': annotation.font.isItalic, 'Strikeout': annotation.font.isStrikeout, 'Underline': annotation.font.isUnderline };
                    documentCollections[annotation.pageNumber].freeTextAnnotation.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'stamp') {
                    newAnnotation.AnnotType = 'stamp';
                    newAnnotation.Icon = annotation.icon;
                    newAnnotation.isDynamic = false;
                    newAnnotation.Rect = this.convertBounds(annotation.bounds, false, true);
                    newAnnotation.RotateAngle = annotation.rotateAngle;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.StampAnnotationType = annotation.stampAnnotationType;
                    newAnnotation.CreationDate = annotation.creationDate;
                    if (annotation.stampAnnotationType === 'image') {
                        // eslint-disable-next-line
                        let apperarance: any = [];
                        // eslint-disable-next-line
                        let imageData: any = { 'imagedata': annotation.stampAnnotationPath };
                        apperarance.push(imageData);
                        newAnnotation.Apperarance = apperarance;
                    }
                    if (annotation.isDynamicStamp) {
                        newAnnotation.IsDynamic = true;
                        newAnnotation.StrokeColor = annotation.stampFillcolor;
                        // eslint-disable-next-line
                        let apperarance: any = [];
                        // eslint-disable-next-line
                        let imageData: any = { 'type': 'string', 'text': annotation.dynamicText, 'currentFontname': '95b303ab-d397-438a-83af-e2ff8a9900f1', 'baseFontName': 'Helvetica-BoldOblique', 'fontSize': 10, 'isImport': true };
                        apperarance.push(imageData);
                        newAnnotation.Apperarance = apperarance;
                    }
                    documentCollections[annotation.pageNumber].stampAnnotations.push(newAnnotation);
                } else if (annotation.shapeAnnotationType === 'Ink' || annotation.shapeAnnotationType === 'Signature') {
                    newAnnotation.StrokeColor = annotation.strokeColor;
                    newAnnotation.FillColor = annotation.fillColor;
                    newAnnotation.Thickness = annotation.thickness;
                    newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                    newAnnotation.PathData = annotation.data;
                    newAnnotation.pageIndex = annotation.pageNumber;
                    if (annotation.shapeAnnotationType === 'Ink') {
                        newAnnotation.AnnotType = 'Ink';
                        newAnnotation.IsPathData = true;
                        documentCollections[annotation.pageNumber].signatureInkAnnotation.push(newAnnotation);
                    }
                    if (annotation.shapeAnnotationType === 'Signature') {
                        newAnnotation.AnnotType = 'Signature';
                        newAnnotation.SignatureName = annotation.annotationId;
                        newAnnotation.IsSignature = true;
                        documentCollections[annotation.pageNumber].signatureAnnotation.push(newAnnotation);
                    }
                } else {
                    // eslint-disable-next-line max-len
                    if (annotation.shapeAnnotationType === 'Line' || annotation.shapeAnnotationType === 'LineWidthArrowHead' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Polygon' || annotation.shapeAnnotationType === 'Polyline' || annotation.shapeAnnotationType === 'Circle' || annotation.shapeAnnotationType === 'Oval' || annotation.shapeAnnotationType === 'Rectangle' || annotation.shapeAnnotationType === 'Square' || annotation.shapeAnnotationType === 'Ellipse') {
                        newAnnotation.AnnotType = 'shape';
                        newAnnotation.StrokeColor = annotation.strokeColor;
                        newAnnotation.FillColor = annotation.fillColor;
                        newAnnotation.Thickness = annotation.thickness;
                        newAnnotation.BorderStyle = annotation.borderStyle;
                        newAnnotation.BorderDashArray = annotation.borderDashArray;
                        newAnnotation.RotateAngle = annotation.rotateAngle;
                        newAnnotation.IsCloudShape = annotation.isCloudShape;
                        newAnnotation.CloudIntensity = annotation.cloudIntensity;
                        newAnnotation.RectangleDifference = annotation.rectangleDifference;
                        newAnnotation.LineHeadStart = annotation.lineHeadStart;
                        newAnnotation.LineHeadEnd = annotation.lineHeadEnd;
                        newAnnotation.IsLocked = annotation.isLocked;
                        newAnnotation.EnableShapeLabel = annotation.enableShapeLabel;
                        newAnnotation.LabelContent = annotation.labelContent;
                        newAnnotation.LabelFillColor = annotation.labelFillColor;
                        newAnnotation.LabelBorderColor = annotation.labelBorderColor;
                        newAnnotation.FontColor = annotation.fontColor;
                        newAnnotation.FontSize = annotation.fontSize;
                        newAnnotation.LabelBounds = this.convertBounds(annotation.labelBounds);
                        newAnnotation.LabelSettings = annotation.labelSettings;
                        newAnnotation.Bounds = this.convertBounds(annotation.bounds);
                        newAnnotation.LeaderLength = annotation.leaderLength;
                        newAnnotation.LeaderLineExtenstion = annotation.leaderLineExtension;
                        if (annotation.vertexPoints && annotation.vertexPoints.length >= 1) {
                            // eslint-disable-next-line
                            let points: Array<any> = new Array();
                            for (let i: number = 0; i < annotation.vertexPoints.length; i++) {
                                points.push(this.convertVertexPoints(annotation.vertexPoints[i]));
                            }
                            newAnnotation.VertexPoints = points;
                        }
                        newAnnotation.EnableShapeLabel = annotation.enableShapeLabel;
                        // eslint-disable-next-line max-len
                        if (annotation.subject === 'Distance calculation' || annotation.subject === 'Perimeter calculation' || annotation.subject === 'Area calculation' || annotation.subject === 'Radius calculation' || annotation.subject === 'Volume calculation') {
                            newAnnotation.AnnotType = 'shape_measure';
                            // eslint-disable-next-line
                            let calibrate: any = annotation.calibrate;
                            if (calibrate) {
                                // eslint-disable-next-line
                                newAnnotation.Calibrate = {
                                    'Ratio': calibrate.ratio, 'X': [{ 'Unit': calibrate.x[0].unit, 'ConversionFactor': calibrate.x[0].conversionFactor, 'FractionalType': calibrate.x[0].fractionalType, 'Denominator': calibrate.x[0].denominator, 'FormatDenominator': calibrate.x[0].formatDenominator }],
                                    // eslint-disable-next-line
                                    'Distance': [{ 'Unit': calibrate.distance[0].unit, 'ConversionFactor': calibrate.distance[0].conversionFactor, 'FractionalType': calibrate.distance[0].fractionalType, 'Denominator': calibrate.distance[0].denominator, 'FormatDenominator': calibrate.distance[0].formatDenominator }],
                                    // eslint-disable-next-line
                                    'Area': [{ 'Unit': calibrate.area[0].unit, 'ConversionFactor': calibrate.area[0].conversionFactor, 'FractionalType': calibrate.area[0].fractionalType, 'Denominator': calibrate.area[0].denominator, 'FormatDenominator': calibrate.area[0].formatDenominator }],
                                    // eslint-disable-next-line
                                    'Angle': null, 'Volume': null, 'TargetUnitConversion': calibrate.targetUnitConversion, 'Depth': calibrate.depth
                                };
                            }
                            newAnnotation.Indent = annotation.indent;
                            newAnnotation.Caption = annotation.caption;
                            newAnnotation.CaptionPosition = annotation.captionPosition;
                            newAnnotation.LeaderLineExtension = annotation.leaderLineExtension;
                            newAnnotation.LeaderLength = annotation.leaderLength;
                            newAnnotation.LeaderLineOffset = annotation.leaderLineOffset;
                            documentCollections[annotation.pageNumber].measureShapeAnnotation.push(newAnnotation);
                        } else {
                            documentCollections[annotation.pageNumber].shapeAnnotation.push(newAnnotation);
                        }
                    }
                }
            }
            pdfAnnotation.pdfAnnotation = documentCollections;
            this.pdfViewer.importAnnotation(pdfAnnotation);
        }
    }

    /**
     * @param bounds
     * @private
     */
    // eslint-disable-next-line
    public convertBounds(bounds: any, isRect?: boolean, isStamp?: boolean): any {
        if (bounds) {
            if (isRect) {
                const left: number = bounds.left ? bounds.left : bounds.Left ? bounds.Left : 0;
                const right: number = bounds.right ? bounds.right : bounds.Right ? bounds.Right : 0;
                const bottom: number = bounds.bottom ? bounds.bottom : bounds.Bottom ? bounds.Bottom : 0;
                const top: number = bounds.top ? bounds.top : bounds.Top ? bounds.Top : 0;
                return { left: left, right: right, bottom: bottom, top: top };
            } else {
                const x: number = bounds.x ? bounds.x : bounds.left ? bounds.left : bounds.Left ? bounds.Left : 0;
                const y: number = bounds.y ? bounds.y : bounds.top ? bounds.top : bounds.Top ? bounds.Top : 0;
                const width: number = bounds.width ? bounds.width : bounds.Width ? bounds.Width : 0;
                const height: number = bounds.height ? bounds.height : bounds.Height ? bounds.Height : 0;
                if (isStamp) {
                    return { X: this.ConvertPixelToPoint(x), Y: this.ConvertPixelToPoint(y), Left: this.ConvertPixelToPoint(x), Top: this.ConvertPixelToPoint(y), Height: this.ConvertPixelToPoint(height), Width: this.ConvertPixelToPoint(width) };
                } else {
                    return { X: x, Y: y, Left: x, Top: y, Height: height, Width: width };
                }
            }
        }
    }

    // eslint-disable-next-line
    private ConvertPixelToPoint(number: any): any {
        return (number * (72 / 96));
    }

    // eslint-disable-next-line
    private convertVertexPoints(points: any): any {
        if (points) {
            const x: number = points.x ? points.x : points.X ? points.X : 0;
            const y: number = points.y ? points.y : points.Y ? points.Y : 0;
            return { X: x, Y: y, Left: x, Top: y };
        }
    }

    // eslint-disable-next-line
    private updateComments(annotation: any, comments: any): any {
        if (annotation && comments) {
            // eslint-disable-next-line
            let newAnnotation: any = {};
            newAnnotation.ShapeAnnotationType = annotation.shapeAnnotationType;
            newAnnotation.Author = comments.author;
            newAnnotation.AnnotationSelectorSettings = annotation.annotationSelectorSettings;
            newAnnotation.AnnotationSettings = annotation.annotationSettings;
            newAnnotation.PageNumber = annotation.pageNumber;
            newAnnotation.ModifiedDate = comments.modifiedDate;
            newAnnotation.Subject = annotation.subject;
            newAnnotation.Note = comments.note;
            newAnnotation.AnnotName = comments.annotName;
            newAnnotation.Comments = comments.comments;
            newAnnotation.State = comments.review.state;
            newAnnotation.StateModel = comments.review.stateModel;
            newAnnotation.CustomData = annotation.customData;
            newAnnotation.IsLock = comments.isLock;
            return newAnnotation;
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public removeFocus(): any {
        if (isBlazor()) {
            // eslint-disable-next-line
            let currentPageContainer: any = this.pdfViewer.element.querySelector('#' + this.pdfViewer.element.id + '_totalPage');
            // eslint-disable-next-line max-len
            if (currentPageContainer && currentPageContainer.firstElementChild && currentPageContainer.firstElementChild.firstElementChild) {
                currentPageContainer.firstElementChild.firstElementChild.blur();
            }
        }
    }

    /**
     * @private
     */
    // eslint-disable-next-line
    public updateDocumentEditedProperty(isEdited: boolean): any {
        this.pdfViewer.allowServerDataBinding = true;
        this.pdfViewer.isDocumentEdited = isEdited;
        this.pdfViewer.allowServerDataBinding = false;
    }
    
    /**
    * @private
    */
    public getWindowDevicePixelRatio() : any {
        var devicePixelRatio = window.devicePixelRatio;
        if (!Browser.isDevice) {
            return devicePixelRatio;
        } else {
            return devicePixelRatio = 2;
        }
    }
    
    /**
    * @private
    */
    public getZoomRatio(zoom?: any): any {
        let zoomFactor : number = this.getZoomFactor();
        let zoomValue : any = zoom ? zoom : 1;
        let ratio: number;
        let devicePixelRatio: any = this.getWindowDevicePixelRatio();
        if (!Browser.isDevice || (Browser.isDevice && zoomFactor <= 0.7)) {
            ratio = zoomValue * devicePixelRatio;
        } else {
            ratio = zoomValue;
        }
        return ratio;
    }

    /**
    * @private
    */
    public importJsonForRotatedDocuments(Rotate: number, pageNumber: number, bounds: any, originalRotation?: number): any {
        // eslint-disable-next-line
        let rotateAngle: any = Math.abs(Rotate);
        var pageDetails = this.pageSize[pageNumber];
        //originalRotation = !isNullOrUndefined(originalRotation) ? originalRotation : pageDetails.rotation;
        if (originalRotation !== pageDetails.rotation) {
            rotateAngle = this.getRotationAngle(originalRotation, pageNumber);
            this.isPageRotated = true;
        } else {
            rotateAngle = 0;
            this.isPageRotated = false;
        }
        if (rotateAngle === 1) {
            return { X: pageDetails.width - bounds.Y - bounds.Height, Y: bounds.X, Height: bounds.Width, Width: bounds.Height };
        } else if (rotateAngle === 2) {
            return { X: pageDetails.width - bounds.X - bounds.Width, Y: pageDetails.height - bounds.Y - bounds.Height, Height: bounds.Height, Width: bounds.Width };
        } else if (rotateAngle === 3) {
            return { X: bounds.Y, Y: pageDetails.height - bounds.X - bounds.Width, Height: bounds.Width, Width: bounds.Height }
        } else {
            return bounds;
        }
    }

    public getRotationAngle(originalRotation: number, pageNumber: number): any {
        let pageDetails = this.pageSize[pageNumber];
        originalRotation = Math.abs(originalRotation);
        let rotateAngle: number;
        if (originalRotation === 0) {
            return rotateAngle = pageDetails.rotation;
        } else if (originalRotation === 1 || originalRotation === 90) {
            if (pageDetails.rotation == 0) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 2) {
                return rotateAngle = 1;
            } else if (pageDetails.rotation === 3) {
                return rotateAngle = 2;
            }
        } else if (originalRotation === 2 || originalRotation === 180) {
            if (pageDetails.rotation == 0) {
                return rotateAngle = 2;
            } else if (pageDetails.rotation === 1) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 3) {
                return rotateAngle = 1;
            }
        } else if (originalRotation === 3 || originalRotation === 270) {
            if (pageDetails.rotation == 0) {
                return rotateAngle = 1;
            } else if (pageDetails.rotation === 2) {
                return rotateAngle = 3;
            } else if (pageDetails.rotation === 1) {
                return rotateAngle = 2;
            }
        }
    }
    /**
   * @private
   */
    public calculateVertexPoints(Rotate: number, pageNumber: number, vertexPoints: any, originalRotation?: number): any {
        // eslint-disable-next-line
        let rotateAngle: any = Math.abs(Rotate);
        let vPoints: IPoint[] = [];
        var pageDetails = this.pageSize[pageNumber];
        let x: number;
        let y: number;
        let point: IPoint;
        //originalRotation = !isNullOrUndefined(originalRotation) ? originalRotation : pageDetails.rotation;
        if (originalRotation !== pageDetails.rotation) {
            rotateAngle = this.getRotationAngle(originalRotation, pageNumber);
        } else {
            rotateAngle = 0;
        }
        for (let j: number = 0; j < vertexPoints.length; j++) {
            if (rotateAngle === 1) {
                x = vertexPoints[j].Y ? pageDetails.width - vertexPoints[j].Y : pageDetails.width - vertexPoints[j].y;
                y = vertexPoints[j].X ? vertexPoints[j].X : vertexPoints[j].x;
                point = { x: x, y: y };
                vPoints.push(point);
            } else if (rotateAngle === 2) {
                x = vertexPoints[j].X ? pageDetails.width - vertexPoints[j].X : pageDetails.width - vertexPoints[j].x;
                y = vertexPoints[j].Y ? pageDetails.height - vertexPoints[j].Y : pageDetails.height - vertexPoints[j].y;
                const point: IPoint = { x: x, y: y };
                vPoints.push(point);
            } else if (rotateAngle== 3) {
                x = vertexPoints[j].Y ? vertexPoints[j].Y : vertexPoints[j].y;
                y = vertexPoints[j].X ? pageDetails.height - vertexPoints[j].X : pageDetails.height - vertexPoints[j].x;
                point = { x: x, y: y };
                vPoints.push(point);
            } else {
                x = vertexPoints[j].X ? vertexPoints[j].X : vertexPoints[j].x;
                y = vertexPoints[j].Y ? vertexPoints[j].Y : vertexPoints[j].y;
                const point: IPoint = { x: x, y: y };
                vPoints.push(point);
            }
        }
        return vPoints;
    }
}
