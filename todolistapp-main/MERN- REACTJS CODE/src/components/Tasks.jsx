import React from "react";

const Tasks = ({
  userName = "",
  dataArray,
  title,
  date,
  scope,
  setShowModal,
  setTodoID,
  deleteTodo,
  checkTodo,
}) => {
  const handleTodoClick = (e) => {
    const target = e.target;
    const todoID = target.closest(".todo")?.id;
    // EDIT BUTTON CLICK
    if (target.className === "edit-btn") {
      setTodoID(todoID);
      setShowModal(true);
    } // DELETE CLICK
    else if (target.className === "delete-btn") {
      deleteTodo(todoID);
    } // CHECKBOX Click
    else if (target.tagName === "INPUT") {
      checkTodo(todoID, target.checked);
    }
  };

  return (
    <section className="todo-container">
      <div>
        <h2>
          {title} {<span className="curr-user-name">{userName}</span>}
        </h2>
        <h3>
          It's <span className="curr-date">{date}</span>
        </h3>
      </div>

      <h4>{scope}</h4>

      <div className="todos">
        {dataArray.map((task) => (
          <div
            key={task._id}
            id={task._id}
            className="todo"
            onClick={handleTodoClick}
          >
            <input
              type="checkbox"
              name="todo-check"
              // onChange={handleTodoCheck}
              defaultChecked={task.isCompleted}
            />
            <p>{task.text}</p>
            <span className="todo-date">{task.date}</span>
            <span className={`priority ${task.priority}`}></span>
            <button className="edit-btn">
              <img src="./images/icEdit.svg" alt="icon edit" />
            </button>
            <button className="delete-btn">
              <img src="./images/icDelete.svg" alt="icon del" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tasks;
