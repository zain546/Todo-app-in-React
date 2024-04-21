"use client"
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
export default function Home() {
  const [title, setTitle] = useState("");
  const [disc, setDisc] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showFinished, setshowFinished] = useState(true)

  const toggleShowFinished = (e)=>{
    setshowFinished(!showFinished);
  }
  const saveToLS = (params) => {
    localStorage.setItem("tasks",JSON.stringify(tasks));
  }
  useEffect(() => {
    let todo = localStorage.getItem("tasks");
    if(todo){
      const data = JSON.parse(localStorage.getItem("tasks"));
      setTasks(data)
    }
  },[]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (title.trim() !== "") {
      if (editIndex > -1) {
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? { title, disc } : task
        );
        setTasks(updatedTasks);
        setEditIndex(-1);
      } else {
        setTasks([...tasks, { title, disc }]);
      }
    }
    setTitle("");
    setDisc("");
    saveToLS();
  };

  const deleteTask = (index) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      const updatedTasks = tasks.filter((task, idx) => idx !== index);
      setTasks(updatedTasks);
    }
    saveToLS();

  };

  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setTitle(taskToEdit.title);
    setDisc(taskToEdit.disc);
    setEditIndex(index);
    saveToLS();

  };

  const taskComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveToLS();

  };

  let renderTask;
  if (tasks.length === 0) {
    renderTask = <h2>No tasks available to do.</h2>;
  } else {
    renderTask = tasks.map((task, index) => {
      return (showFinished ||!task.completed) &&(
        <div key={index} className="flex items-center">
          <div className="flex w-full sm:w-[50%]">
            <input
              type="checkbox"
              className="mx-5"
              onClick={() => taskComplete(index)}
              name=""
              id=""
            />
            <p className={task.completed ? "line-through" : ""}>
              {task.title}
            </p>
          </div>

          <button onClick={() => handleEdit(index)} className="mb-2 pr-5">
          <CiEdit />
          </button>
          <button
            onClick={() => deleteTask(index)}
            className="text-red-600 mb-2"
          >
            <RiDeleteBin6Line className="text-red"/>
          </button>
        </div>
      );
    });
  }

  return (
    <main>
      <h1 className="p-5 font-[verdana] font-bold text-2xl">My to-do</h1>
      <form
        onSubmit={submitHandler}
        className="flex items-center justify-center flex-wrap gap-4 m-10"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-2 py-2 w-[90%] md:w-[60%] rounded border border-zinc-500 outline-none"
          type="text"
          placeholder="Enter task"
        />
        <button className="w-fit px-4 py-2 rounded-sm bg-black text-white" type="submit">
          {editIndex > -1 ? "Update Task" : "Add Task"}
        </button>
      </form>
      <input onChange={toggleShowFinished} className="ml-5 mb-5" type="checkbox" checked={showFinished} name="" id="" />Show Finished
      <div className=" shadow-md p-8 bg-violet-300">{renderTask}</div>
    </main>
  );
}
