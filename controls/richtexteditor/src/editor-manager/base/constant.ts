/**
 * Constant values for EditorManager
 */

/**
 * Image plugin events
 *
 * @hidden
 */
export const IMAGE: string = 'INSERT-IMAGE';

export const TABLE: string = 'INSERT-TABLE';

export const LINK: string = 'INSERT-LINK';

export const INSERT_ROW: string = 'INSERT-ROW';

export const INSERT_COLUMN: string = 'INSERT-COLUMN';

export const DELETEROW: string = 'DELETE-ROW';

export const DELETECOLUMN: string = 'DELETE-COLUMN';

export const REMOVETABLE: string = 'REMOVE-TABLE';

export const TABLEHEADER: string = 'TABLE-HEADER';

export const TABLE_VERTICAL_ALIGN: string = 'TABLE_VERTICAL_ALIGN';

export const TABLE_MERGE: string = 'TABLE_MERGE';

export const TABLE_VERTICAL_SPLIT: string = 'TABLE_VERTICAL_SPLIT';

export const TABLE_HORIZONTAL_SPLIT: string = 'TABLE_HORIZONTAL_SPLIT';

export const TABLE_MOVE: string = 'TABLE_MOVE';

/**
 * Alignments plugin events
 *
 * @hidden
 */
export const ALIGNMENT_TYPE: string = 'alignment-type';

/**
 * Indents plugin events
 *
 * @hidden
 */
export const INDENT_TYPE: string = 'indent-type';

/**
 * Constant tag names
 *
 * @hidden
 */
export const DEFAULT_TAG: string = 'p';

/**
 * @hidden
 */
export const BLOCK_TAGS: string[] = ['address', 'article', 'aside', 'audio', 'blockquote',
    'canvas', 'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
    'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul', 'video', 'body'];

/**
 * @hidden
 */
export const IGNORE_BLOCK_TAGS: string[] = ['td', 'th'];

/**
 * @hidden
 */
export const TABLE_BLOCK_TAGS: string[] = ['table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr'];

/**
 * Selection plugin events
 *
 * @hidden
 */
export const SELECTION_TYPE: string = 'selection-type';

/**
 * Insert HTML plugin events
 *
 * @hidden
 */
export const INSERTHTML_TYPE: string = 'inserthtml-type';

/**
 * Insert Text plugin events
 *
 * @hidden
 */
export const INSERT_TEXT_TYPE: string = 'insert-text-type';

/**
 * Clear Format HTML plugin events
 *
 * @hidden
 */
export const CLEAR_TYPE: string = 'clear-type';

/**
 * Self closing tags
 *
 * @hidden
 */
export const SELF_CLOSING_TAGS: string[] = ['area', 'base' ,'br', 'embed', 'hr', 'img', 'input', 'param', 'source', 'track', 'wbr', 'iframe', 'td'];
