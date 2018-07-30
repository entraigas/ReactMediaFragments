import { CHANGE_VIDEO_PROPS } from "./actionsTypes"

const initialState = {
    items: [],
    formId: -1,
    formMode: null,
    src: "https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4",
    title: "Sintel Trailer",
    duration: null,
    errors: '',
}

export default function videoReducer(state = initialState, action){
	switch (action.type) {
		case CHANGE_VIDEO_PROPS:
			return Object.assign({}, state, action.props);
		default:
			return state;
	}

}
