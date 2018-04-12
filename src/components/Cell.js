import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import CellActions from '../actions/CellActions'
import '../css/main.css';
import _ from 'underscore';

export default class Cell extends React.Component {

    cellRef = null;
    contextID = `contextID ${this.props.index}`;
    textAreaRef = null;

    handleSplit = (event, data) => {
        CellActions.split(data.index, data.direction);
    }


    dragStart = (event, className) => {

        const cellInfo = this.cellRef.getBoundingClientRect();
        const direction = this.cellRef.attributes.class.nodeValue;
        const topOffset = cellInfo.bottom - cellInfo.top;
        const leftOffset = cellInfo.right - cellInfo.left; 

        const CB = (e) => {
            
            let percent = direction === 'side' ? (e.clientX - cellInfo.left) / leftOffset : (e.clientY - cellInfo.top) / topOffset;
            if (percent < 0) percent = 0;
            if (percent > 1) percent = 1;

            CellActions.drag(this.props.index, percent, 1-percent);
        }

        document.addEventListener('mousemove', CB, false)
        document.addEventListener('mouseup', (e) => {
            document.removeEventListener('mousemove', CB, false);
        }, true);

    }

    handleKeyPress = _.debounce(() => {
        const {index} = this.props;
        CellActions.update(index, this.textAreaRef.value);
    },300)

    render() {

        const {cells, index, modalControl} = this.props;
        const cell = cells[index];
        const flex = {
            flexGrow: this.props.flex ? this.props.flex : 1,
        }

        if(cell.leftChild) {
            return (
                <div className={cell.splitDirection} style={flex} ref={node => {
                    this.cellRef = node;
                }}>
                    <Cell cells={cells} index={cell.leftChild} flex={cell.leftFlex} modalControl={modalControl}/>
                    <div className={cell.splitDirection === 'top' ? 'topBorder' : 'sideBorder'} onMouseDown={this.dragStart}></div>
                    <Cell cells={cells} index={cell.rightChild} flex={cell.rightFlex} modalControl={modalControl}/>
                </div>
            )
        }

        return(
            <div className="cellContainer" style={flex}>
                <ContextMenuTrigger id={this.contextID} className="context-menu-trigger">
                    <textarea className="cell" defaultValue={cell.text} onKeyPress={this.handleKeyPress} ref={node => {
                        this.textAreaRef = node;
                    }}></textarea>
                </ContextMenuTrigger>

                <ContextMenu id={this.contextID}>
                    <MenuItem data={{index: index, direction: 'side'}} onClick={this.handleSplit}>
                        Right Split
                    </MenuItem>
                    <MenuItem data={{index: index, direction: 'top'}} onClick={this.handleSplit}>
                        Bottom Split
                    </MenuItem>
                    <MenuItem data={{index: index}} onClick={this.props.modalControl}>
                        Delete Cell
                    </MenuItem>
                </ContextMenu>
            </div>
        )
    }
}