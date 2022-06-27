/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement, isNullOrUndefined} from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { ExportType } from '../utils/enum';
import { PdfPageOrientation, PdfDocument, PdfBitmap } from '@syncfusion/ej2-pdf-export';


/**
 * This module enables the export to PDF functionality in Maps control.
 *
 * @hidden
 */
export class PdfExport {
    private control: Maps;

    /**
     * Constructor for Maps
     *
     * @param {Maps} control Specifies the instance of the map
     */
    constructor(control: Maps) {
        this.control = control;
    }

    /**
     * To export the file as image/svg format
     *
     * @param {ExportType} type - Specifies the type of the document
     * @param {string} fileName - Specifies the file name of the document
     * @param {boolean} allowDownload - Specifies whether to download the document or not
     * @param {PdfPageOrientation} orientation - Specifies the orientation of the PDF document to export the component
     * @returns {Promise<string>} - Returns the promise string
     * @private
     */
    public export(type: ExportType, fileName: string, allowDownload?: boolean, orientation?: PdfPageOrientation): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
            const canvasElement: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            const svgParent: HTMLElement = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgData: string;
            const exportElement: HTMLElement = this.control.svgObject.cloneNode(true) as HTMLElement;
            const backgroundElement: HTMLElement = exportElement.childNodes[0] as HTMLElement;
            const backgroundColor: string = backgroundElement.getAttribute('fill');
            if ((this.control.theme === 'Tailwind' || this.control.theme === 'TailwindDark' || this.control.theme === 'Bootstrap5' || this.control.theme === 'Bootstrap5Dark'
                || this.control.theme === 'Fluent' || this.control.theme === 'FluentDark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                (exportElement.childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
            }
            const url: string = window.URL.createObjectURL(
                new Blob(
                    type === 'SVG' ? [svgData] :
                        [(new XMLSerializer()).serializeToString(exportElement)],
                    { type: 'image/svg+xml' }
                )
            );
            const pdfDocument: PdfDocument = new PdfDocument();
            const image: HTMLImageElement = new Image();
            const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d');
            if (!this.control.isTileMap) {
                image.onload = (() => {
                    ctx.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (type === 'PDF') {
                        let imageString: string = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                        pdfDocument.pageSettings.orientation = orientation;
                        imageString = imageString.slice(imageString.indexOf(',') + 1);
                        pdfDocument.pages.add().graphics.drawImage(
                            new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                        );
                        if (allowDownload) {
                            pdfDocument.save(fileName + '.pdf');
                            pdfDocument.destroy();
                        } else {
                            resolve(null);
                        }
                    }
                });
                image.src = url;
            } else {
                const svgParentElement: HTMLElement = document.getElementById(this.control.element.id + '_MapAreaBorder');
                let top: number = parseFloat(svgParentElement.getAttribute('y'));
                let left: number = parseFloat(svgParentElement.getAttribute('x'));
                const xHttp: XMLHttpRequest = new XMLHttpRequest();
                const tileLength: number = this.control.mapLayerPanel.tiles.length;
                for (let i: number = 0; i <= tileLength + 1; i++) {
                    const tile: HTMLElement = document.getElementById(this.control.element.id + '_tile_' + (i - 1));
                    const tileImg: HTMLImageElement = new Image();
                    tileImg.crossOrigin = 'Anonymous';
                    ctx.fillStyle = this.control.background ? this.control.background : '#FFFFFF';
                    ctx.fillRect(0, 0, this.control.availableSize.width, this.control.availableSize.height);
                    ctx.font = this.control.titleSettings.textStyle.size + ' Arial';
                    let titleElement: HTMLElement = document.getElementById(this.control.element.id + '_Map_title');
                    if (!isNullOrUndefined(titleElement)) {
                        ctx.fillStyle = titleElement.getAttribute('fill');
                        ctx.fillText(
                            this.control.titleSettings.text, parseFloat(titleElement.getAttribute('x')),
                            parseFloat(titleElement.getAttribute('y')));
                    }
                    tileImg.onload = (() => {
                        if (i === 0 || i === tileLength + 1) {
                            if (i === 0) {
                                ctx.setTransform(1, 0, 0, 1, 0, 0);
                                ctx.rect(0, top, parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                ctx.clip();
                            } else {
                                ctx.setTransform(1, 0, 0, 1, left, top);
                            }
                        } else {
                            const tileParent: HTMLElement = document.getElementById(this.control.element.id + '_tile_parent');
                            ctx.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + left, parseFloat(tile.style.top) + top);
                        }
                        ctx.drawImage(tileImg, 0, 0);
                        if (i === tileLength + 1) {
                            if (type === 'PDF') {
                                localStorage.setItem('saved-image-example', canvasElement.toDataURL('image/jpeg'));
                                let x: string = localStorage.getItem('saved-image-example');
                                pdfDocument.pageSettings.orientation = orientation;
                                x = x.slice(x.indexOf(',') + 1);
                                pdfDocument.pages.add().graphics.drawImage(
                                    new PdfBitmap(x), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height
                                );
                                if (allowDownload) {
                                    pdfDocument.save(fileName + '.pdf');
                                    pdfDocument.destroy();
                                } else {
                                    resolve(null);
                                }
                            }
                        }
                    });
                    if (i === 0 || i === tileLength + 1) {
                        if (i === 0) {
                            tileImg.src = url;
                        } else {
                            setTimeout(() => {
                                let tileSvg: Element = document.getElementById(this.control.element.id + '_Tile_SVG');
                                tileImg.src = window.URL.createObjectURL(new Blob(
                                    [(new XMLSerializer()).serializeToString(tileSvg)],
                                    { type: 'image/svg+xml' }));
                            }, 300);
                        }
                    } else {
                        xHttp.open('GET', tile.children[0].getAttribute('src'), true);
                        xHttp.send();
                        tileImg.src = tile.children[0].getAttribute('src');
                    }
                }
            }
        });
        return promise;
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'PdfExport';
    }

    /**
     * To destroy the PdfExports.
     *
     * @param {Maps} maps - Specifies the instance of the maps.
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
