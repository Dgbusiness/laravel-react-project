import './App.css'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Dropdown } from './components/Dropdown'
import Tasks from './components/Tasks'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const App = () => {

    const [data, setData] = useState(null)
    const [projectId, setProjectId] = useState(null)
    const [tasks, setTasks] = useState(null)
    const [name, setName] = useState(null)

    const buildTasksArray = tasks => {
        console.log(tasks)
        if (!tasks) {
            setTasks(null)
        }
        else {
            //This dropable section was extracted and modified from: https://contactmentor.com/react-drag-drop-list/
            let tasksArray = (
                <DragDropContext onDragEnd={handleDrop}>
                    <Droppable droppableId="list-container">
                        {(provided) => (
                            <div
                                className="list-container"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {tasks.map((task, index) => 
                                <Draggable key={task.id} draggableId={task.name+' '+task.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="item-container"
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                        >
                                            <Tasks key={task.id} task={task} handleUpdateTask={handleUpdateTask} handleDeleteTask={handleDeleteTask}/>
                                        </div>
                                    )}
                                </Draggable>
                                )} 
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>)
            setTasks(tasksArray)
        }
    }

    useEffect( () => {
        const res = async () => {
            const { data } = await axios.get('/api/projectResource')

            setData(data)
            setProjectId(data[0].id)
            buildTasksArray(data[0].tasks.length? data[0].tasks : null)
        }

        res()
    }, [])


    //Handle create task
    const handleCreateTask = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/task",
            { name, projectId },
            config
        );

        buildTasksArray(data.tasks)
    }

    //handler para cambiar tareas
    const changeProjectHandler = async (e) => {
        e.preventDefault()
        let project_id = e.target.dataset.project_id

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.get(
            "/api/projectResource/"+project_id,
            config
        );

        buildTasksArray(data.tasks)
        setProjectId(project_id)
    } 

    //handler para editar
    const handleUpdateTask = async (id, name, priority) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put(
            "/api/task/"+id,
            { name, projectId },
            config
        );

        buildTasksArray(data.tasks)
    }

    //handler para borrar
    const handleDeleteTask = async (id) => {
        const { data } = await axios.delete(
            "/api/task/"+id
        );

        buildTasksArray(data.tasks)
    }

    //drag and drop
    const handleDrop = async (droppedItem) => {
        // Ignore drop outside droppable container

        const id = droppedItem.draggableId.split(' ').slice(-1)[0]
        const index = droppedItem.destination.index


        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put(
            "/api/task/"+id,
            { index },
            config
        );

        buildTasksArray(data.tasks)
    };

    return (
        <div className="App">
            <h1 className="text-3xl font-bold mb-5">
                DnD laravel-react app!
            </h1>

            {data && 
            <div className='flex flex-col'>
                <div className="w-1/4 mx-auto w-full">
                    {<Dropdown projects={data} projectHandler={changeProjectHandler}/>}
                </div>
                <div className="w-3/4 mx-auto w-full flex justify-center items-center flex-col">
                    <div className="flex flex-col w-1/3">
                        {tasks === null ? 'This project has no tasks.' : tasks}
                    </div>
                    <div className="mx-auto w-full justify-center my-2">
                        <form onSubmit={handleCreateTask}>
                            <label htmlFor="name">Name:</label>
                            <input className='rounded border-4 border-black mr-2' type="text" name="name" id="name" onChange={(e) => setName(e.target.value)}/>
                            <button className='bg-green-400 border p-1 border-black rounded'>CREATE TASK</button>
                        </form>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default App;
