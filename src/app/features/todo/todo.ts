import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoStore } from './store/todos.store';
import { FormsModule } from '@angular/forms';
import { Snackbar } from '@abs-services/core/snackbar/snackbar';
// import { HeaderComponent } from '@codewithahsan/ng-cb-ui';

@Component({
  selector: 'app-todo',
  imports: [FormsModule, CommonModule, Snackbar], // imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
  standalone: true,
  providers: [TodoStore]
})
export class Todo {
  newTodoTitle = signal('');
  store = inject(TodoStore);
  // tasks = [
  //   { title: 'Buy milk', completed: false },
  //   { title: 'Read a book', completed: true },
  // ];

  // snackbar = viewChild(Snackbar);
  snackbar = viewChild.required(Snackbar);

  constructor() {
    effect(() => {
      console.log('Current filter:', this.store.filter());
      
      const allCompleted = this.store
      .todos()
      .every(todo => todo.completed);

      if (this.store.todos().length > 0 && allCompleted) {
        // this.snackbar()?.show();
        this.snackbar().show();
      } else {
        // this.snackbar()?.hide();
        this.snackbar().hide();        
      }
    });
  }

  submitNewTodo() { //   submitNewTodo(newTaskTitle: string) {
    this.store.addtodo(this.newTodoTitle());
    this.newTodoTitle.set('');
  }
}
