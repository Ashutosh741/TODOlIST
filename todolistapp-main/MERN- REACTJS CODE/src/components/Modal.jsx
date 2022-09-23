import React, { useEffect, useRef, useState } from "react";
import "./Modal.css";

// This model component is same, for editing and adding todo.. the only difference is when user opened modal from editing button, props passed are different..

//read the code and you can easily find out what's happening..

const Modal = ({
  dataArray,
  setShowModal,
  todoID,
  setTodoID,
  getModalValue,
}) => {
  const [defTextValue, setDefTextValue] = useState();
  const [defDateValue, setDefDateValue] = useState();

  useEffect(() => {
    if (todoID) {
      const todo = dataArray.find((todo) => todo._id === todoID);
      setDefTextValue(todo.text);
      setDefDateValue(todo.date);
    }
  }, []);

  const textRef = useRef();
  const dateRef = useRef();
  const priorityRef = useRef();

  const handleSubmit = () => {
    const text = textRef.current.value;
    const date = dateRef.current.value;
    const priority = priorityRef.current.value;

    if (text == "" || date == "") return alert("All Fields are Required!");

    setTodoID(null);
    getModalValue(text, date, priority);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <input
          ref={textRef}
          type="text"
          defaultValue={defTextValue}
          placeholder="Write your todo here..."
        />
        <input ref={dateRef} defaultValue={defDateValue} type="date" />
        <select ref={priorityRef} name="priority">
          <option value="regular">Regular</option>
          <option value="urgent">Urgent</option>
          <option value="low">Low</option>
        </select>
        <div className="buttons">
          <button
            className="cancel modal-close"
            onClick={() => {
              setTodoID(null);
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          <button className="add modal-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
