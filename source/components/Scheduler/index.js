// Core
import React, { Component } from 'react';

import Spinner from 'components/Spinner';
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import { BaseTaskModel } from 'instruments';
// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { async } from 'q';
import { testMessage1 } from './tests/setup';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [{
            id:        '1',
            completed: false,
            favorite:  false,
            message:   'task 1',
        }, {
            id:        '2',
            completed: true,
            favorite:  true,
            message:   'task 2',
        }],

    }

    componentDidMount () {
        // const { currentUserFirstName, currentUserLastName } = this.props;

        // this._fetchPosts();

        // socket.emit('join', GROUP_ID);

        // socket.on('create', (postJSON) => {
        //     const { data: createdPost, meta } = JSON.parse(postJSON);

        //     if (
        //         `${currentUserFirstName} ${currentUserLastName}`
        //         !== `${meta.authorFirstName} ${meta.authorLastName}`
        //     ) {
        //         this.setState(({ posts }) => ({
        //             posts: [ createdPost, ...posts ],
        //         }));
        //     }
        // });

        // socket.on('remove', (postJSON) => {
        //     const { data: removedPost, meta } = JSON.parse(postJSON);

        //     if (
        //         `${currentUserFirstName} ${currentUserLastName}`
        //         !== `${meta.authorFirstName} ${meta.authorLastName}`
        //     ) {
        //         this.setState(({ posts }) => ({
        //             posts: posts.filter((post) => post.id !== removedPost.id),
        //         }));
        //     }
        // });

        // socket.on('like', (postJSON) => {
        //     const { data: likedPost, meta } = JSON.parse(postJSON);

        //     if (
        //         `${currentUserFirstName} ${currentUserLastName}`
        //         !== `${meta.authorFirstName} ${meta.authorLastName}`
        //     ) {
        //         this.setState(({ posts }) => ({
        //             posts: posts.map(
        //                 (post) => post.id === likedPost.id ? likedPost : post,
        //             ),
        //         }));
        //     }
        // });
    }

    componentWillUnmount () {
        //socket.removeListener('create');
    }

    _removeTaskAsync = (id) => {
        this._setTasksFetchingState(true);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    }

    _updateTaskAsync = (task) => {
        this._setTasksFetchingState(true);

        this._setTasksFetchingState(false);
    }

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLocaleLowerCase(),
        });
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    }

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    }

    _setTasksFetchingState = (isFetching) => {
        this.setState({
            isTasksFetching: isFetching,
        });
    }

    _fetchTasksAsync = () => {
        this._setTasksFetchingState(true);

        this._setTasksFetchingState(false);
    }

    _createTaskAsync = (event) => {
        const { newTaskMessage } = this.state;

        event.preventDefault();
        if (newTaskMessage) {
            this._setTasksFetchingState(true);

            this._setTasksFetchingState(false);
            this.setState({
                newTaskMessage: '',
            });
        }

        return null;
    }

    _completeAllTasksAsync = () => {
        const isAllCompleted = this._getAllCompleted;

        if (!isAllCompleted) {
            this._setTasksFetchingState(true);
            this._setTasksFetchingState(false);
        }

        return null;
    }

    render () {
        const {
            isTasksFetching,
            tasks,
            newTaskMessage,
            tasksFilter } = this.state;

        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                    key = { task.id }
                    { ...task }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay } >
                            <ul>
                                { tasksJSX }
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <Checkbox onClick = { this._completeAllTasks } />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
