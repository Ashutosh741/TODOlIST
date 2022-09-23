import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Option from "./Option";
import Tasks from "./Tasks";
import "./Todo.css";

// This components renders the view after user have logged in..

const Todo = ({ setPage }) => {
  const [userData, setUserData] = useState({});
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    fetch("/getdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("todoJWTtoken"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.userDetails);
        setUserData(data.userDetails);
        setDataArray(data.userDetails.todos);
      });
  }, []);

  const [tasksData, setTasksData] = useState({
    userName: "",
    title: "",
    scope: "",
  });
  const [navSwitch, setNavSwitch] = useState("all");

  const [todoID, setTodoID] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddTodo = () => {
    setTodoID(null);
    setShowModal(true);
  };

  const getAddTodoModalValue = (text, date, priority) => {
    setShowModal(false);

    if (todoID) {
      // EDIT TODO
      // console.log(text, date, priority, todoID);
      fetch("/edittodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("todoJWTtoken"),
          id: todoID,
          text: text,
          date: date,
          priority: priority,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData((prevState) => ({
            ...prevState,
            todos: data.userDetails.todos,
          }));
        });
    } // ADD TODO
    else {
      fetch("/addtodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("todoJWTtoken"),
          text: text,
          date: date,
          priority: priority,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData((prevState) => ({
            ...prevState,
            todos: data.userDetails.todos,
          }));
        });
    }
  };

  // DELETE TODO
  const deleteTodo = (id) => {
    console.log("Delete", id);
    fetch("/deletetodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("todoJWTtoken"),
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserData((prevState) => ({
          ...prevState,
          todos: data.userDetails.todos,
        }));
      });
  };
  // CHECK TODO
  const checkTodo = (id, isChecked) => {
    console.log("Check", id, isChecked);
    fetch("/completedtodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("todoJWTtoken"),
        id: id,
        isCompleted: isChecked,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData((prevState) => ({
          ...prevState,
          todos: data.userDetails.todos,
        }));
      });
  };

  const handleNavbarClick = (e) => {
    const target = e.target;
    if (target.tagName === "DIV") {
      document
        .querySelectorAll("div.option")
        .forEach((option) => option.classList.remove("active"));
      target.classList.add("active");

      if (target.className.includes("all")) {
        setNavSwitch("all");
      }
      // TODAY
      if (target.className.includes("today")) {
        setNavSwitch("today");
      }
      // Completed
      if (target.className.includes("completed")) {
        setNavSwitch("completed");
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("todoJWTtoken");
    setPage("signin");
  };

  function todayDate() {
    const date = new Date();
    const currDate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0");
    return currDate;
  }

  useEffect(() => {
    if (navSwitch === "all") {
      setDataArray(userData.todos);
      setTasksData((prevState) => ({
        ...prevState,
        userName: userData.name,
        title: "Nice To See You, ",
        scope: "All Tasks",
      }));
    } //
    else if (navSwitch === "today") {
      const todayTodos = [];
      userData.todos.forEach((todo) => {
        if (todo.date === todayDate()) todayTodos.push(todo);
      });
      setDataArray(todayTodos); // so here we are filtering the tasks from alltasks array, whoose date matches today's date..
      setTasksData((prevState) => ({
        ...prevState,
        userName: "",
        title: "Today's Tasks",
        scope: "Today",
      }));
    } //
    else if (navSwitch === "completed") {
      const completedTodos = [];
      userData.todos.forEach((todo) => {
        if (todo.isCompleted) completedTodos.push(todo);
      });
      setDataArray(completedTodos); // here we are filtering the tasks fro todo array where isCompleted property is true..
      setTasksData((prevState) => ({
        ...prevState,
        userName: "",
        title: "Completed Tasks",
        scope: "Completed Task",
      }));
    }
  }, [navSwitch, userData.todos]);

  return (
    <div id="todo">
      <header>
        <h1>Todo App</h1>
        <span className="add-todo-btn img-add-btn" onClick={handleAddTodo}>
          <img src="./images/icAddTodo.svg" alt="add todo" />
        </span>
        <button className="sign-out" onClick={handleSignOut}>
          SignOut
        </button>
        <span className="profile-img">
          <img
            className="pp"
            src={`./images/pp-${userData.avtaar}.png`}
            alt="User Profile Pic"
          />
        </span>
      </header>

      <main>
        <nav onClick={handleNavbarClick}>
          <Option className={"all active"} text="All Tasks" img={"All"} />
          <Option className={"today"} text="Today's Tasks" img={"Today"} />
          <Option
            className={"completed"}
            text="Completed Tasks"
            img={"Completed"}
          />
        </nav>
        {dataArray && (
          <Tasks
            userName={tasksData.userName}
            dataArray={dataArray}
            title={tasksData.title}
            date={todayDate()}
            scope={tasksData.scope}
            setShowModal={setShowModal}
            setTodoID={setTodoID}
            deleteTodo={deleteTodo}
            checkTodo={checkTodo}
          />
        )}

        <div className="add-todo-btn add-todo-ic" onClick={handleAddTodo}>
          <img src="./images/icAddTodo.svg" alt="add-todo" />
        </div>
      </main>

      {showModal ? (
        <Modal
          dataArray={dataArray}
          setShowModal={setShowModal}
          todoID={todoID}
          setTodoID={setTodoID}
          getModalValue={getAddTodoModalValue}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Todo;
