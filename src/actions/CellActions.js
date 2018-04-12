import ActionTypes from './ActionTypes';
import Dispatcher from '../Dispatcher';

export default {
    split(index, direction) {
        Dispatcher.dispatch({
            type: ActionTypes.SPLIT,
            index,
            direction,
        })
    },

    remove(index) {
        Dispatcher.dispatch({
            type: ActionTypes.REMOVE,
            index,
        })
    },

    drag(index, leftPercent, rightPercent) {
        Dispatcher.dispatch({
            type: ActionTypes.DRAG,
            index,
            leftPercent, 
            rightPercent,
        })
    },

    update(index, text) {
        Dispatcher.dispatch({
            type: ActionTypes.TEXTUPDATE,
            index,
            text,
        })
    }
};