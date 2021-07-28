/// <reference types="react-scripts" />

declare module '@solid/query-ldflex';
declare module 'meld-clients-core/lib/reducers';
declare module 'selectable-score/lib/submit-button.js';
declare module 'selectable-score/lib/selectable-score';
declare module 'selectable-score/lib/next-page-button.js';
declare module 'selectable-score/lib/prev-page-button.js';
declare module 'trompa-multimodal-component';

type AnnotationSolidResponse = any

type AnnotationBody = {
    id: string
    type?: string
    value?: any
    // used in the "playlist" type
    seconds?: string
}
type AnnotationTarget = any

type Annotation = {
    '@id'?: string
    '@context': string
    target: AnnotationTarget[] | AnnotationTarget
    type: "Annotation",
    body: AnnotationBody[]
    motivation: string
    created: string
    creator: string
}
