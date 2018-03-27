import React from "react";
import { render } from "react-dom";
import "./styles.css";

class ToDoList extends React.Component {
  removeItem(key) {
    this.props.removeTodoItem(key);
  }
  editItem(key) {
    this.props.editTodoItem(key);
  }
  render() {
    return (
      <ul className="todo-list">
        {this.props.listElements.map((item, index) => (
          <li className="list-items" key={item.uniquekey}>
            {++index}. {item.text}
            {this.props.editState ? null : (
              <a
                className="deleteItem"
                onClick={() => this.removeItem(item.uniquekey)}
              >
                x
              </a>
            )}
            <a
              className="editItem"
              onClick={() => this.editItem(item.uniquekey)}
            >
              edit
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingItem: null,
      isEditState: false,
      isDuplicateState: false,
      listItems: [
        {
          text: "drive home",
          uniquekey: this.generateUID()
        },
        {
          text: "go to shopping",
          uniquekey: this.generateUID()
        }
      ]
    };
    this.addTodoItem = this.addTodoItem.bind(this);
    this.removeTodoItem = this.removeTodoItem.bind(this);
    this.checkDup = this.checkDup.bind(this);
    this.editTodoItem = this.editTodoItem.bind(this);
    this.editSubmit = this.editSubmit.bind(this);
  }

  checkDup() {
    let enteredText = this.textInput.value.trim();
    var t = this.state.listItems.filter(item => item.text == enteredText);
    if (t.length) {
      // value is duplicate
      this.setState({
        isDuplicateState: true
      });
    } else {
      // add value
      this.setState({
        isDuplicateState: false
      });
    }
  }

  generateUID() {
    return Math.floor(
      Math.random() *
        Date.now()
          .toString()
          .slice(7, 12)
    );
  }

  removeTodoItem(key) {
    let filteredItems = this.state.listItems.filter(
      item => item.uniquekey !== key
    );
    this.setState({
      listItems: filteredItems
    });
  }

  editTodoItem(key) {
    this.setState({
      isEditState: true
    });
    let filteredItems = this.state.listItems.filter(
      item => item.uniquekey == key
    );
    this.setState({
      editingItem: filteredItems[0].uniquekey
    });
    this.textInput.value = filteredItems[0].text;
  }

  editSubmit(e) {
    var self = this;
    this.setState({
      isEditState: false
    });
    let filteredItems = this.state.listItems.filter(
      item => item.uniquekey == this.state.editingItem
    );
    var newArray = this.state.listItems.map(function(item) {
      if (item.uniquekey == filteredItems[0].uniquekey) {
        item.text = self.textInput.value;
        return item;
      } else {
        return item;
      }
    });
    this.textInput.value = "";
    e.preventDefault();
  }

  addTodoItem(e) {
    if (!this.state.isDuplicateState) {
      let newItem = {
        text: this.textInput.value,
        uniquekey: this.generateUID()
      };
      this.setState(prevState => {
        return {
          listItems: prevState.listItems.concat(newItem)
        };
      });
      this.textInput.value = "";
    }
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>To-Do List</h2>
        <form>
          <input
            type="text"
            onChange={this.checkDup}
            ref={input => (this.textInput = input)}
          />
          {this.state.isEditState ? (
            <button onClick={this.editSubmit}>Save</button>
          ) : (
            <button onClick={this.addTodoItem}>Add</button>
          )}
        </form>
        <ToDoList
          listElements={this.state.listItems}
          removeTodoItem={this.removeTodoItem}
          editTodoItem={this.editTodoItem}
          editState={this.state.isEditState}
        />
      </div>
    );
  }
}
render(<TodoApp />, document.getElementById("root"));
