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

    constructor (props) {
        super(props);
        this.taskInput = React.createRef();
        this.state = {
            isTaskEditing: false,
            newMessage:    props.message,
        };
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

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();
        }
        this._setTaskEditingState(!isTaskEditing);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        console.log(event.key);
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (newMessage) {
                    this._updateTask();
                }
                break;
            case 'Escape':
                event.preventDefault();
                this._cancelUpdatingTaskMessage();
                break;
            default:
                break;
        }
    };

    _cancelUpdatingTaskMessage = () => {};

    _setTaskEditingState = (isEditing) => {
        this.setState({
            isTaskEditing: isEditing,
        });
        if (isEditing) {
            this.taskInput.current.focus();
        }
    };

    _toggleTaskCompletedState = () => {
        const { completed, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({
            completed: !completed,
        });

        _updateTaskAsync(task);
    };

    _toggleTaskFavoriteState = () => {
        const { favorite, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({
            favorite: !favorite,
        });

        _updateTaskAsync(task);
    };

    render () {
        const { completed } = this.props;
        const { newMessage, isTaskEditing } = this.state;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyPress = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        className = { Styles.toggleTaskFavoriteState }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        className = { Styles.updateTaskMessageOnClick }
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
