import {
  Resolver,
  Query,
  Arg,
  Mutation,
  FieldResolver,
  Root,
} from 'type-graphql'
import Task from '../schema/Task'
import { TaskData, tasks, projects } from '../data'

@Resolver(of => Task)
export default class {
  @Query(returns => [Task])
  fetchTasks(): TaskData[] {
    return tasks
  }

  @Query(returns => Task, { nullable: true })
  getTask(@Arg('id') id: number): TaskData | undefined {
    return tasks.find(task => task.id === id)
  }

  @Mutation(returns => Task)
  markAsCompleted(@Arg('taskId') taskId: number): TaskData {
    const task = tasks.find(task => task.id === taskId)
    if (!task) {
      throw new Error(
        `Couldn't find the task witd id ${taskId}`,
      )
    }
    if (task.completed) {
      throw new Error(
        `Task with id ${taskId} is already completed`,
      )
    }
    task.completed = true
    return task
  }

  @FieldResolver()
  project(@Root() taskData: TaskData) {
    return projects.find(project => {
      return project.id === taskData.project_id
    })
  }
}
