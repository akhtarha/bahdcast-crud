import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ListItem from "./ListItem";
import axios from "axios";
import loadingGif from "./loading.gif";

class App extends Component {
  constructor() {
    super();
    this.state = {
      notification: null,
      newTodo: "",
      editing: false,
      editingIndex: null,
      todos: [],
      loading: true

      /*{ id: 1, name: "Play golf" },
        { id: 2, name: "Buy some clothes" },
        { id: 3, name: "Write some code" },
        { id: 4, name: "Watch Bahdcasts" }
      ]*/
    };

    this.apiURL = "//5db89729177b350014ac7c7d.mockapi.io";
    this.addToDo = this.addToDo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    //this.generateTodoId = this.generateTodoId.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount() {
    console.log(`${this.apiURL}/todos`);
    const response = await axios.get(`${this.apiURL}/todos`);
    console.log(response);
    setTimeout(() => {
      this.setState({
        loading: false,
        todos: response.data
      });
    }, 1000);
  }
  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
    console.log(event.target.name, event.target.value);
  }

  /*generateTodoId() {
    const lastTodo = this.state.todos[this.state.todos.length - 1];
    if (lastTodo) {
      return lastTodo.id + 1;
    }
    return 1;
  }*/

  async addToDo(event) {
    /*const newToDo = {
      name: this.state.newTodo,
      id: this.generateTodoId()
    };*/

    const response = await axios.post(`${this.apiURL}/todos`, {
      name: this.state.newTodo
    });

    console.log(response);

    const todos = this.state.todos;
    todos.push(response.data);
    this.setState({
      todos: todos,
      newTodo: "",
      loading: true
    });
    this.alert("Todo added successfully");
    setTimeout(() => {
      this.setState({
        loading: false
      });
    });
  }

  async deleteTodo(index) {
    const todos = this.state.todos;
    const todo = todos[index];
    await axios.delete(`${this.apiURL}/todos/${todo.id}`);
    delete todos[index];
    this.setState({
      todos: todos,
      loading: true
    });
    this.alert("Todo deleted successfully");
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1000);
  }

  editTodo(index) {
    const todos = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todos.name,
      editingIndex: index
    });
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiURL}/todos/${todo.id}`, {
      name: this.state.newTodo
    });
    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    setTimeout(() => {
      this.setState({
        todos,
        editing: false,
        editingIndex: null,
        newTodo: "",
        loading: true
      });
    });
    this.alert("Todo updated successfully");

    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1000);
  }

  alert(notification) {
    this.setState({
      notification: notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Crud React</h1>
        </header>

        <div className="container">
          {this.state.notification && (
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          )}
          <input
            type="text"
            name="todo"
            className="my-4 format-control"
            placeholder="Add a new todo"
            onChange={this.handleChange}
            value={this.state.newTodo}
          />
          <button
            onClick={this.state.editing ? this.updateTodo : this.addToDo}
            className="btn-info mb-3 form-control"
            disabled={this.state.newTodo.length < 1}
          >
            {this.state.editing ? "Update Todo" : "Add todo"}
          </button>
          {this.state.loading && <img src={loadingGif} alt="" />}
          {(!this.state.editing || this.state.loading) && (
            <ul className="list-group">
              {this.state.todos.map((item, index) => {
                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    editTodo={() => this.editTodo(index)}
                    deleteTodo={() => this.deleteTodo(index)}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default App;
