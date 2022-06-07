import React, {useState} from 'react'

const Tasks = ({task, handleUpdateTask, handleDeleteTask}) => {
    const [name, setName] = useState(task.name)

    return (
        <div className="mx-full p-12 m-2 w-full flex justify-items-center rounded shadow-2xl flex-col">
            <form className='flex flex-col items-center'>
                <label htmlFor="name">Name:</label>
                <input className='rounded border-4 border-black mr-2' type="text" name="name" id="name" defaultValue={name} onChange={(e) => setName(e.target.value)}/>
                <div className="flex flex-col">
                    <label className='mx-auto' htmlFor="priority">Priority:</label>
                    <h1 className='mx-auto text-2xl'>{task.priority}</h1>
                </div>
            </form>
            <div className='mx-auto flex flex-row'>
                <button className="bg-indigo-600 rounded px-5 m-1" onClick={() => handleUpdateTask(task.id, name)}>UPDATE</button>
                <button className="bg-red-600 rounded px-5 m-1" onClick={() => handleDeleteTask(task.id)}>DELETE</button>
            </div>
        </div>
    )
}

export default Tasks
