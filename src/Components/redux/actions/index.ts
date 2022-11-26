import { Action,AnyAction} from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Status,
    RootState } from "../types";

export interface PageJumpAction extends Action {
    page: number;
}
export interface StatusSetAction extends Action {
    status: Status;
}

export function statusSet(status: Status): StatusSetAction {
    return {
        type: "SET_STATUS",
        status
    };
}
export function pageJump(page: number): ThunkAction<void, RootState, void, AnyAction> | any {
    return async (dispatch: ThunkDispatch<RootState, null, AnyAction>) => {
        await dispatch(statusSet(Status.PROCESSING));
        await dispatch({
            type: "JUMP_TO_PAGE",
            page
        });
        await dispatch(statusSet(Status.IDLE));
        // Paging is all done front end for now, so no need for re-query
        // dispatch(searchTriggered());
    };
}

export type SessionAction =
PageJumpAction   