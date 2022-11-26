import { StateType } from "typesafe-actions";
import rootReducer from "../redux/reducers";
export type RootState = StateType<typeof rootReducer>;

export enum Status {
    IDLE,
    SEARCHING,
    PROCESSING,
    ERROR
}

// Please keep all types below this comment in alphabetical order

export interface Answer {
    text: string;
    next: string;
    key: string;
}

export interface Choice {
    to: string;
    text: string;
    position: number;
    choiceIndex: number;
    timestamp: string;
}

export interface ColumnSpecification {
    prop: string;
    displayProp: string;
    title: string;
}

export interface Dialogue {
    id: string;
    series: string;
    query: string | any;
    steps: ReadonlyArray<Step>;
    choices: ReadonlyArray<Choice>;
    problemSolved: boolean | any;
    dialogueFinished: boolean;
    stepBoosting: DialogueBoost;
}

export interface DialogueBoost {
    [key: string]: number;
}

export interface Doc {
    info_type: string;
    title_meta: string;
    score: number;
    snippet: string;
    title: string;
    id: string;
}

export interface Filter {
    field: string;
    values: ReadonlyArray<string>;
}

export interface Filters {
    applied: ReadonlyArray<Filter>;
    available: ReadonlyArray<FilterOptions>;
}

export interface FilterConfig {
    field: string;
    name: string;
    control: string;
    multivalued: boolean;
    values?: ReadonlyArray<string>;
    displayValues?: ReadonlyArray<string>;
}

export interface FilterOptions {
    field: string;
    values: ReadonlyArray<string>;
    counts: ReadonlyArray<number>;
}

export interface PartsBreakdown {
    title_meta: string;
    title: string;
    id: string;
    src: ReadonlyArray<string>;
    data: ReadonlyArray<ReadonlyArray<string>>;
}

export interface PdfView {
    id: string;
}

export interface Procedure extends Doc {
    title_links: ReadonlyArray<TitleLink>;
    data: S1000DType;
}

export interface RecentPage {
    name: string;
    path: string;
}

export interface Response {
    docs: any;
    pageCount: any;
    spellcheck: any;
    facets?: ReadonlyArray<FilterOptions>;
    mm: number | any;
}

export interface S1000DType {
    type: string;
    children: ReadonlyArray<S1000DType>;
    key: string;
    text?: string;
    anchor?: string;
    list_type?: string;
    src?: ReadonlyArray<string>;
}

export interface S3File {
    name: string;
    bucket: string;
}

export interface SavedSession {
    id: string;
    name: string;
    date: string;
    path: string;
    session: Session;
}

export interface SchematicDrawing {
    dmCode: string;
    title: string;
    key: number;
}

export interface SchematicIndex extends SchematicDrawing {
    data: ReadonlyArray<SchematicDrawing>;
}

export interface Session extends Response {
    query: string;
    filters: Filters;
    status: Status;
    page: number | any;
    activeDialogue: Dialogue | any;
    breadcrumbs: ReadonlyArray<string>;
    userInfo: UserInfo | any;
    workOrderColumns: ReadonlyArray<ColumnSpecification>;
    modalIsOpen: boolean;
    pdfView: PdfView | any;
    sessionLoadSidebar: boolean;
}

export interface Step {
    id: string;
    answers: ReadonlyArray<Answer>;
    end: boolean;
    action?: ReadonlyArray<string>;
    question?: string;
    link?: string;
}

export interface TitleLink {
    link: string;
    text: string;
    sublinks: ReadonlyArray<TitleLink>;
}

export interface UserInfo {
    username: string;
    authenticated: boolean;
    signupProcess: boolean;
    resetPasssword: boolean;
}

export interface WorkOrder extends Doc {
    description: string;
    date_value: Date;
    date_display: string;
    asset_id: string;
    file?: S3File;
    other?: ReadonlyArray<{
        type: string;
        text: string;
        link?: string;
    }>;
}

export interface FilterCount {
    value: string;
    count: number;
}

export interface TitleProps {
    index: number;
}