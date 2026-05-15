import { getState, patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { TodoItem } from './todos.model';
import { computed, effect } from '@angular/core';

const todoStorageKey = 'my-todo-app';

type TodoFilter = 'all' | 'active' | 'completed';

type TodoState = {
    todos: TodoItem[]; 
    filter: TodoFilter; 
}

const initialState: TodoState = {
    // todos: []
    todos: [
        // { id: '1', title: 'Buy milk', completed: false },
        // { id: '2', title: 'Read 2 books', completed: true },
    ],
    filter: 'all' as TodoFilter,
};

// export const TodoStore = signalStore(withState(initialState), {
//     addTodo: (state, title: string) => {
//         const newTodo: TodoItem = { id: Date.now().toString(), title, completed: false };
//         return { todos: [...state.todos, newTodo] };
//     }
// });

export const TodoStore = signalStore(
    // {providedIns: 'root'},  
    withState(initialState),
    withComputed(({todos, filter}) => ({
        completedTodos: computed(() => todos().filter(todo => todo.completed)),
        filteredTodos: computed(() => {
            switch (filter()) {
                case 'active':
                    return todos().filter(todo => !todo.completed);
                case 'completed':
                    return todos().filter(todo => todo.completed);
                default:
                    return todos();
            }
        })
    })),
    withMethods((store) => ({
        addtodo(newTodoTitle: string) {
        patchState(store, {
            todos: [
                {
                    id: Date.now().toString(),
                    title: newTodoTitle,
                    completed: false
                },
                ...store.todos(),
            ],  
        });
    },

    changeFilter(newFilter: TodoFilter) {
        console.log('Changing filter to:', newFilter);
        patchState(store, { filter: newFilter });
    },

    toggleTodo(todoId:string) {
        patchState(store, {
            todos: store.todos().map(todo =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            ),
        });
    }
})),
    withHooks({
        onInit(store) {
            const savedTodos = JSON.parse(localStorage.getItem(todoStorageKey) || '[]');
            console.log('TodoStore saved todos:', savedTodos);
            patchState(store, { todos: savedTodos });

            effect(() => {
                const state = getState(store);
                console.log('TodoStore initialized in effect with state:', state)
                localStorage.setItem(todoStorageKey, JSON.stringify(state.todos));   
                localStorage.setItem(todoStorageKey+'2', JSON.stringify(store.todos()));
            }),
            watchState(store, (state) => {   
                console.log('TodoStore initialized in watchState with state:', state)   
            });

            store.addtodo('new Item 1')
            store.addtodo('new Item 2')
            store.addtodo('new Item 3')


        },
    })
);