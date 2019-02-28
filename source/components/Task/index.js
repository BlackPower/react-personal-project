// Core
import React, { PureComponent } from 'react';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
import PropTypes from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: PropTypes.func.isRequired,
        _updateTaskAsync: PropTypes.func.isRequired,
        completed:        PropTypes.bool.isRequired,
        created:          PropTypes.string.isRequired,
        favorite:         PropTypes.bool.isRequired,
        id:               PropTypes.string.isRequired,
        message:          PropTypes.string.isRequired,
        modified:         PropTypes.string.isRequired,
    }

    state = {
        isTaskEditing: false,
        newMessage:    '',

    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;

        _removeTaskAsync(id);
    };

    _updateTask = () => {
        this._setTaskEditingState(false);
    };

    _updateNewTaskMessage = () => {};

    _updateTaskMessageOnClick = () => {};

    _updateTaskMessageOnKeyDown = () => {};

    _cancelUpdatingTaskMessage = () => {};

    _setTaskEditingState = ({ isEditing }) => {
        this.setState({
            isTaskEditing: isEditing,
        });
    };

    _toggleTaskCompletedState = () => {};

    _toggleTaskFavoriteState = () => {
        const { favorite, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({
            favorite: !favorite,
        });

        _updateTaskAsync(task);
    };

    render () {
        const task = this._getTaskShape(this.props);

        this.setState({
            newMessage: task.message,
        });

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox />
                    <input
                        disabled
                        maxLength = { 50 }
                        type = 'text'
                        value = { task.message }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        className = { Styles.toggleTaskFavoriteState }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit className = { Styles.updateTaskMessageOnClick } />
                    <Remove
                        className = { Styles.removeTask }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
