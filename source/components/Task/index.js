// Core
import React, { PureComponent } from 'react';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
import { func, bool, string } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        created:          string.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
        modified:         string.isRequired,
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
        const { message, _updateTaskAsync } = this.props;
        const { newMessage } = this.state;

        if (message.localeCompare(newMessage)) {
            const task = this._getTaskShape({
                message: newMessage,
            });

            _updateTaskAsync(task);
        }
        this._setTaskEditingState(false);

        return null;
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
        } else {
            this._setTaskEditingState(!isTaskEditing);
        }

        return null;
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        switch (event.key) {
            case 'Enter':
                if (newMessage) {
                    this._updateTask();
                }
                break;
            case 'Escape':
                this._cancelUpdatingTaskMessage();
                break;
            default:
                break;
        }

        return null;
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    };

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
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
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
