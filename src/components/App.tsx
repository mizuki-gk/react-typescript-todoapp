import React, { useEffect, useState } from 'react';
import './App.css';
import { ulid } from 'ulid';
import { stringify } from 'querystring';
import { setFlagsFromString } from 'v8';
import { Console } from 'console';
import axios from 'axios';
import TodoItem from './TodoItem';

function App() {
  const [inputText, setInputText] = useState('');
  //todo配列オブジェクトの更新用に用意。プロパティはinputValue, id, checkedの３つを更新する。
  const [todos, setTodos] = useState<Todo[]>([
    { text: 'やること1', id: ulid(), done: false },
    { text: 'やること2', id: ulid(), done: false },
  ]);
  const [flag, setFlag] = useState('');

  type Todo = {
    text: string;
    id: string; //keyを指定するため
    done: boolean;
  };

  useEffect(() => {
    axios
      .get('http://localhost:3100/todos')
      .then((response) => setTodos(response.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setInputText(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!inputText) {
      return;
    }

    //新しいTodo作成
    const newTodo: Todo = {
      text: inputText,
      id: ulid(),
      done: false,
    };
    axios.post('http://localhost:3100/todos', newTodo).then(() => {
      setTodos([...todos, newTodo]);
      console.log(inputText);
      setInputText(inputText);
    });
  };

  //todo編集
  const handleEdit = (id: string, targetValue: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.text = targetValue;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handle = (id: string, text: string) => {
    const newTodo = { id, text, done: true };
    axios.put(`http://localhost:3100/todos/${id}`, newTodo).then(() => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.text = text;
        }
        return todo;
      });
      setTodos(newTodos);
    });
  };

  //完了未完了
  const handleChecked = (id: string, done: boolean) => {
    /* ディープコピー(完全にコピーされた別の配列)に変えよう(ミューテートから守るため) */
    const deepCopy = todos.map((todo) => ({ ...todo }));
    // console.log(deepCopy);

    const newTodos = deepCopy.map((todo) => {
      if (todo.id === id) {
        //反転
        todo.done = !done;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  //削除
  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3100/todos/${id}`).then(() => {
      //idが正しくないのは残す。正しいと消す。
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    });
  };

  return (
    <div className="App">
      <div>
        <h2>先延ばしを防ぐTodoリストアプリ</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            className="inputText"
          />
          <input type="submit" value="追加" className="submitButton" />
        </form>
        {/* タスク設定が完了したら */}
        <ul className="todoList">
          {todos.map((todo) => {
            return (
              <>
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  flag={flag}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  handleChecked={handleChecked}
                  handle={handle}
                  setFlag={setFlag}
                />
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
