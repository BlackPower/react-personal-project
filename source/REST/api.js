import { MAIN_URL, TOKEN } from './config';
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

        return new []();
    },

    async createTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        console.log(response);
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        console.log(response);
    },

    async removeTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        console.log(response);
    },

    async completeAllTasks (tasks) {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        console.log(response);
    },
};
