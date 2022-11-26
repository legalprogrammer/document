import { Choice, Doc, Session, SavedSession, Status } from "../types";

const initState: Session = {
    query: "",
    docs: null,
    filters: {
        applied: [],
        available: []
    },
    page: null,
    pageCount: null,
    spellcheck: null,
    activeDialogue: null,
    status: Status.IDLE,
    breadcrumbs: ["/"],
    userInfo: null,
    modalIsOpen: true,
    workOrderColumns: [],
    pdfView: null,
    sessionLoadSidebar: false,
    mm: null
};

const DOCS_PER_PAGE: number = 10;

export function session(state: Session = initState, action: any): Session {
    switch (action.type) {
        case "UPDATE_QUERY": {
            return { ...state, query: action.query };
        }
        case "APPLY_FILTER": {
            // Applying a filter
            // The filters.applied array contains Filter objects, each of which
            // has a 'field' (Solr field to apply filtering to) and a 'values' list (values for the Solr filtering)
            // We need to ensure that the filters.applied list never contains more than ONE Filter
            // for each 'field' value.
            // To do this, we call filters.applied.filter() to remove any Filters that have the same
            // 'field' value as the Filter we are about to add
            return {
                ...state,
                filters: {
                    ...state.filters,
                    applied: [
                        ...state.filters.applied.filter(
                            (f) => f.field !== action.filter.field
                        ),
                        action.filter
                    ]
                }
            };
        }
        case "REMOVE_FILTER": {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    applied: [
                        ...state.filters.applied.filter(
                            (f) => f.field !== action.field
                        )
                    ]
                }
            };
        }
        case "RESET_FILTERS": {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    applied: []
                }
            };
        }
        case "SET_STATUS": {
            return { ...state, status: action.status };
        }
        case "STORE_ACTIVE_DIALOGUE": {
            return { ...state, activeDialogue: action.dialogue };
        }
        case "SELECT_DIALOGUE_CHOICE": {
            const { choice } = action;

            const newChoices: ReadonlyArray<Choice> =
                // If their selection is from a previous step
                choice.position < state.activeDialogue.choices.length ?
                    [...state.activeDialogue.choices.slice(0, choice.position), choice] :
                    [...state.activeDialogue.choices, choice];
            return {
                ...state,
                activeDialogue: {
                    ...state.activeDialogue,
                    choices: newChoices,
                    problemSolved: false,
                    dialogueFinished: false
                }
            };
        }
        case "SUBMIT_DIALOGUE": {
            return {
                ...state,
                activeDialogue: {
                    ...state.activeDialogue,
                    problemSolved: action.solved,
                    dialogueFinished: false
                }
            };
        }
        case "FINISH_DIALOGUE": {
            return {
                ...state,
                activeDialogue: {
                    ...state.activeDialogue,
                    dialogueFinished: true
                }
            };
        }
        case "CLEAR_CHOICES": {
            return {
                ...state,
                activeDialogue: {
                    ...state.activeDialogue,
                    choices: [],
                    problemSolved: false,
                    dialogueFinished: false
                }
            };
        }
        case "CLEAR_ACTIVE_DIALOGUE": {
            return {
                ...state,
                activeDialogue: null
            };
        }
        case "STORE_RESPONSE": {
            if (action.response === null) {
                return state;
            }
            const { docs, spellcheck, facets, mm } = action.response;
            return {
                ...state,
                page: 1,
                docs,
                pageCount: Math.floor((docs.length - 1) / DOCS_PER_PAGE) + 1,
                spellcheck,
                mm,
                filters: {
                    ...state.filters,
                    available: facets || state.filters.available
                }
            };
        }
        case "STORE_DOCS": {
            const { docs } = action;
            return {
                ...state,
                page: 1,
                pageCount: Math.floor((docs.length - 1) / DOCS_PER_PAGE) + 1,
                docs
            };
        }
        case "STORE_FILTERS": {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    available: action.filters
                }
            };
        }
        case "UPDATE_WORK_ORDER_COLUMNS": {
            return {
                ...state,
                workOrderColumns: action.columns
            };
        }
        case "JUMP_TO_PAGE": {
            return {
                ...state,
                page: action.page
            };
        }
        case "UPDATE_BREADCRUMBS": {
            return {
                ...state,
                breadcrumbs: action.breadcrumbs
            };
        }
        case "PDF_VIEW": {
            return {
                ...state,
                pdfView: {
                    ...state.pdfView,
                    id: action.id
                }
            };
        }
        case "UPDATE_USERNAME": {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    username: action.username,
                    authenticated: false,
                    signupProcess: action.signupProcess,
                    resetPasssword: action.resetPasssword
                }
            };
        }
        case "LOGIN": {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    username: action.username,
                    authenticated: true,
                    signupProcess: false,
                    resetPasssword: false
                }
            };
        }
        case "WELCOME_NOTE": {
            return {
                ...state,
                modalIsOpen: action.modalIsOpen
            };
        }
        case "LOGOUT": {
            return {
                ...state,
                userInfo: null,
                modalIsOpen: true
            };
        }
        case "SAVE_SESSION": {
            let savedSessions: Array<SavedSession> = JSON.parse(localStorage.getItem("lexx-saves") || "");

            if (savedSessions === null) {
                savedSessions = [{
                    id: (new Date()).getTime().toString(),
                    name: action.saveName,
                    date: (new Date()).toLocaleString(),
                    path: action.currentPath,
                    session: action.session
                }];
            } else {
                savedSessions = [...savedSessions, {
                    id: (new Date()).getTime().toString(),
                    name: action.saveName,
                    date: (new Date()).toLocaleString(),
                    path: action.currentPath,
                    session: action.session
                }];
            }
            localStorage.setItem("lexx-saves", JSON.stringify(savedSessions));
            // No state modifications when saving (as of yet)
            // If, ultimately, we don't need any state changes for saving, then saving
            // should be taken out of the reducer and just made into a plain Javascript fx
            return state;
        }
        case "LOAD_SESSION": {
            return {
                ...state,
                ...action.session
            };
        }
        case "UPDATE_LOADING_SESSION": {
            return {
                ...state,
                sessionLoadSidebar: action.sessionLoading
            };
        }
        case "DELETE_SAVED_SESSION": {
            const savedSessions: Array<SavedSession> = JSON.parse(localStorage.getItem("lexx-saves") || "");
            localStorage.setItem("lexx-saves", JSON.stringify(savedSessions.filter(
                (sess) => sess.id !== action.id))
            );
            return state;
        }
        case "RESET_SESSION": {
            return {
                ...initState,
                query: state.query,
                activeDialogue: state.activeDialogue,
                breadcrumbs: state.breadcrumbs,
                userInfo: state.userInfo,
                modalIsOpen: state.modalIsOpen
            };
        }
        default: {
            return state;
        }
    }
}