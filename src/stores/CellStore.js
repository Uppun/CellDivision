import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';

class CellStore extends ReduceStore {
    constructor() {
        super(Dispatcher)
    }

    getInitialState() {
        const startingState = JSON.parse(localStorage.getItem('cells'));
        if(!startingState) {
            const parentCell = {text: "This is a cell", parent: null, leftChild: null, rightChild: null, splitDirection: null, leftFlex: 1, rightFlex: 1};
            const cellBST = [parentCell];
            localStorage.setItem('cells', JSON.stringify(cellBST));
            return cellBST;
        }
        return startingState;
    }

    reduce(state, action) {
        switch(action.type) {
            case ActionTypes.SPLIT: {
                const cells = [...state];
                const {index, direction} = action; 
                cells[index] = {...cells[index], leftChild: (2*index + 1), rightChild: (2*index + 2), splitDirection: direction};
                cells[2*index+1] = { text: cells[index].text, parent: index, leftChild: null, rightChild: null, splitDirection: null, leftFlex: 1, rightFlex: 1}
                cells[2*index+2] = { text: null, parent: index, leftChild: null, rightChild: null, splitDirection: null, leftFlex: 1, rightFlex: 1};
                localStorage.setItem('cells', JSON.stringify(cells));
                return cells;
            }

            case ActionTypes.REMOVE: {
                const {index} = action;
                const cells = [...state];
                const parentIndex = cells[index].parent;
                const siblingIndex = cells[parentIndex].leftChild === index ? cells[parentIndex].rightChild : cells[parentIndex].leftChild;
                const left = cells[siblingIndex].leftChild;
                const right = cells[siblingIndex].rightChild;
                
                cells[parentIndex] = {...cells[siblingIndex], parent: cells[parentIndex].parent};
                cells[left] = {...cells[left], parent: parentIndex};
                cells[right] = {...cells[right], parent: parentIndex};
                delete cells[index];
                delete cells[siblingIndex];
                localStorage.setItem('cells', JSON.stringify(cells));
                return cells;
            }

            case ActionTypes.DRAG: {
                const cells = [...state];
                cells[action.index] = {...cells[action.index], leftFlex: action.leftPercent, rightFlex: action.rightPercent};
                localStorage.setItem('cells', JSON.stringify(cells));
                return cells;
            }

            case ActionTypes.TEXTUPDATE: {
                const cells = [...state];
                cells[action.index] = {...cells[action.index], text: action.text};
                localStorage.setItem('cells', JSON.stringify(cells));
                return cells;
            }

            default: {
                return state;
            }
        }
    }
}

export default new CellStore();