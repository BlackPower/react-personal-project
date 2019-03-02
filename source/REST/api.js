import { MAIN_URL, TOKEN } from './config';
import { BaseTaskModel } from 'instruments';
export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.ok) {
            const { data: tasks } = await response.json();

            return tasks;
        }

        return [];
    },

    async createTask (taskMessage) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: taskMessage }),
        });

        if (response.ok) {
            const { data: task } = await response.json();

            return task;
        }

        return [];
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([task]),
        });

        if (response.ok) {
            const { data: tasks } = await response.json();

            return tasks;
        }

        return [];
    },

    async removeTask (id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    async completeAllTasks (tasks) {
        const tastModels = tasks.map((task) =>
            new BaseTaskModel(
                task.id,
                true,
                task.favorite,
                task.message
            ));

        const fetchs = tastModels.map((task) => {
            fetch(MAIN_URL, {
                method:  'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  TOKEN,
                },
                body: JSON.stringify([task]),
            });
        });

        await Promise.all(fetchs);
    },
};
