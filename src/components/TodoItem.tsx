import React from 'react';

function TodoItem(props: {
  todo: { id: string; text: string; done: boolean };
  flag: string;
  handleDelete: (id: string) => void;
  handleEdit: (id: string, text: string) => void;
  handle: (id: string, text: string) => void;
  handleChecked: (id: string, done: boolean) => void;
  setFlag: (id: string) => void;
}) {
  return (
    <li key={props.todo.id}>
      {props.flag === props.todo.id ? (
        <>
          <form onSubmit={() => props.setFlag('')}>
            <input
              type="checkbox"
              checked={props.todo.done}
              onChange={() =>
                props.handleChecked(props.todo.id, props.todo.done)
              }
            />
            <input
              type="text"
              value={props.todo.text}
              onChange={(e) => props.handleEdit(props.todo.id, e.target.value)}
              disabled={props.todo.done}
            />
            <button
              onClick={() => props.handle(props.todo.id, props.todo.text)} className="editbtn">完了</button>
            <button
              onClick={() => props.handleDelete(props.todo.id)} className="deletebtn">削除</button>
          </form>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={props.todo.done}
            onChange={() => props.handleChecked(props.todo.id, props.todo.done)}
          />
          {props.todo.text}
          <button
            onClick={() => props.setFlag(props.todo.id)}className="editbtn">編集</button>
          <button
            onClick={() => props.handleDelete(props.todo.id)} className="deletebtn">削除</button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
