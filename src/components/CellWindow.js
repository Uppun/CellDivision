import React from 'react';
import CellStore from '../stores/CellStore';
import {Container} from 'flux/utils';
import Cell from './Cell';
import CellActions from '../actions/CellActions';
import '../css/main.css';

class CellWindow extends React.Component {
    state = {
        visibility: 'hidden',
        deleteIndex: 0,
    };

    static getStores() {
        return [CellStore];
    }

    static calculateState(prevState) {
        return {...prevState, cells: CellStore.getState()};
    }

    updateVis = (event, data) => {
        const deleteIndex = data ? data.index : 0;
        const modalVis = this.state.visibility === 'hidden' ? 'visible' : 'hidden';
        this.setState({visibility: modalVis, deleteIndex});
    }

    handleDelete = (event) => {
        if(this.state.deleteIndex > 0) {
            CellActions.remove(this.state.deleteIndex);
        }
        this.setState({visibility: 'hidden', deleteIndex: 0});
    }

    render() {
        const {cells} = this.state;
        
        return(
            <div className='fullContainer'>
                <div className = 'deleteModal' style={this.state} onClick={this.updateVis}>
                    <div className='modalContent'>
                        <span className='close' onClick={this.updateVis}>&times;</span>
                        <p>{this.state.deleteIndex === 0 ? 'Error: Can not delete root cell' : 'Are you sure you want to delete this cell?'}</p>
                        <button className='deleteBtn' style={{visibility: this.state.deleteIndex === 0 ? 'hidden' : 'visible'}} 
                                                      onClick={this.handleDelete}>
                                                      Delete</button>
                        <button className='cancelBtn' onClick={this.updateVis}>Cancel</button>
                    </div>
                </div>
                <div className = "root">
                    <Cell cells={cells} index={0} flex={1} modalControl={this.updateVis}/>
                </div>
            </div>
        )
    }
}

export default Container.create(CellWindow);