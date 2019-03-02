// Core
import React, { Component } from 'react';

import Spinner from 'components/Spinner';
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import { BaseTaskModel } from 'instruments';
// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    }

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    }

    _updateTaskAsync = async (task) => {
        this._setTasksFetchingState(true);
        const updatedTasks = await api.updateTask(task);

        console.log(updatedTasks);
        if (updatedTasks.length > 0) {
            const updatedTask = updatedTasks[0];

            console.log(updatedTask);
            this.setState(({ tasks }) => ({
                tasks: tasks.map((item) => item.id === updatedTask.id ? updatedTask : item),
            }));
        }
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

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
        });
        this._setTasksFetchingState(false);
    }

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        event.preventDefault();
        if (newTaskMessage) {
            this._setTasksFetchingState(true);
            const newTask = await api.createTask(newTaskMessage);

            this._setTasksFetchingState(false);
            this.setState(({ tasks }) => ({
                newTaskMessage: '',
                tasks:          [newTask, ...tasks],
            }));
        }

        return null;
    }

    _completeAllTasksAsync = async () => {
        const isAllCompleted = this._getAllCompleted();

        if (isAllCompleted) {
            return null;
        }
        this._setTasksFetchingState(true);
        const { tasks } = this.state;
        const completedTasks = tasks.filter((task) => task.completed);
        const uncomletedTasts = tasks.filter((task) => !task.completed);

        await api.completeAllTasks(uncomletedTasts);
        for (let index = 0; index < uncomletedTasts.length; index++) {
            uncomletedTasts[index].completed = true;
        }
        this.setState({
            tasks: [...uncomletedTasts, ...completedTasks],
        });
        this._setTasksFetchingState(false);
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
                        <Checkbox onClick = { this._completeAllTasksAsync } />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
