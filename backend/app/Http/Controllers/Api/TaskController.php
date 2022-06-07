<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $this->validate($request, [
            'name' => 'required',
            'projectId' => 'required'
        ]);


        $project = Project::find($request->projectId);

        Task::create([
            'name' => $request->name,
            'priority' => optional($project->tasks)->count()+1,
            'project_id' => $project->id,
        ]);

        return response()->json(['message' => 'Task saved successfuly.', 'tasks' => $project->fresh()->tasks->sortBy('priority')], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $this->validate($request, [
            'name' => 'required_without_all:index',
            'index' => 'required_without_all:name'
        ]);

        $taskTU = Task::find($id);
        if (isset($request->name)) {
            $taskTU->update([
                'name' => $request->name,
            ]);
        }

        //This section will update the priority using the current and new priority to check if the new is greater or lower than the previous one and then update everything.
        if (isset($request->index)) {
            if ($request->index + 1 !== $taskTU->priority) {

                if ($request->index + 1 > $taskTU->priority) {
                    $tasks = $taskTU->project->tasks->where('priority', '>', $taskTU->priority)->where('id', '!=', $taskTU->id)->sortBy('priority')->flatten();
                    foreach ($tasks as $task ) {
                        if ($task->priority <= $request->index + 1) {
                            $task->decrement('priority');
                        }
                    }
                } else {
                    $tasks = $taskTU->project->tasks->where('priority', '<', $taskTU->priority)->where('id', '!=', $taskTU->id)->sortBy('priority')->flatten();
                    foreach ($tasks as $task ) {
                        if ($task->priority >= $request->index + 1) {
                            $task->increment('priority');
                        }
                    }
                }
                
                $taskTU->update([
                    'priority' => $request->index+1,
                ]);
            }
        }

        return response()->json(['message' => 'Task updated successfuly.', 'tasks' => $taskTU->fresh()->project->tasks->sortBy('priority')->flatten()], 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $task = Task::find($id);

        $project = $task->project;

        $task->project()->dissociate();

        $task->delete();

        return response()->json(['message' => 'Task deleted successfuly.', 'tasks' => $project->tasks->sortBy('priority')->flatten()], 200);
    }
}
