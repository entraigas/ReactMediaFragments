import { CHANGE_VIDEO_PROPS } from "./actionsTypes"

export function actionChangeVideoProps(props){
  return dispatch => {
    dispatch({
      type: CHANGE_VIDEO_PROPS,
      props: props
    });
  }
}

export function actionResetFormValues(mode = null, index = -1){
  return dispatch => {
    dispatch({
      type: CHANGE_VIDEO_PROPS,
      props: {formMode: mode, formId: index}
    });
  }
}
