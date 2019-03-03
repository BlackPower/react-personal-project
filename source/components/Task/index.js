// Core
import React, { PureComponent } from 'react';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';
import { func, bool, string } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import cx from 'classnames';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
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
            const val = this.taskInput.current.value;

            this.taskInput.current.value = ''; //clear the value of the element
            this.taskInput.current.value = val; //set that value back.
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
        const { completed, favorite } = this.props;
        const { newMessage, isTaskEditing } = this.state;

        const taskStyle = cx(Styles.task, {
            [Styles.completed]: completed,
        });

        return (
            <li className = { taskStyle }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
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
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
