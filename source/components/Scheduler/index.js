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

export default class Scheduler extends Component {
    state = {
        isSpinning: false,
        tasks:      [{
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

    _removeTaskAsync = (id) => {
        console.log(`remove task with id: ${id}`);
    }

    _updateTaskAsync = (task) => {
        console.log(task);
    }

    render () {
        const { isSpinning, tasks } = this.state;

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
                <Spinner isSpinning = { isSpinning } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { '' }
                        />
                    </header>
                    <section>
                        <form>
                            <input
                                className = { Styles.createTask }
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = ''
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
                        <Checkbox />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
