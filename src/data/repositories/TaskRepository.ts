import { injectable } from 'inversify';
import { Task } from '../../models';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class TaskRepository implements ITaskRepository {
  private _tasks: Task[] = [];
  private _task: Task | null = null;

  get tasks() {
    return this._tasks;
  }

  get task() {
    return this._task;
  }

  public async Get(userId: number): Promise<void> {
    const tasks = await Task.findAll({ where: { UserId: userId } });
    this._tasks = tasks;
  }

  public GetById(id: number): void {
    const task = this._tasks.find((task) => task.id === id);
    this._task = task || null;
  }

  public GetByProjectNumber(projectNumber: number): void {
    const task = this._tasks.find(
      (task) => task.projectNumber === projectNumber
    );

    if (task) this._task = task;
  }

  public async GetByStatus(userId: number, complete: boolean): Promise<void> {
    const tasks = await Task.findAll({
      where: { UserId: userId, complete },
      order: [['id', 'DESC']],
    });

    this._tasks = tasks;
  }

  public async Add(task: Task): Promise<void> {
    const newTask = await Task.create(task);
    this._task = newTask || null;
  }

  public async Delete(): Promise<void> {
    this._task?.destroy();
  }

  public async Update(updatedTask: Task): Promise<void> {
    const task = await this._task?.update(updatedTask);
    this._task = task || null;
  }

  public async UpdateHours(hoursWorked: number): Promise<void> {
    this._task?.update({ hoursWorked });
  }

  public async Complete(): Promise<void> {
    this._task?.update({ complete: true });
  }

  public async InComplete(): Promise<void> {
    this._task?.update({ complete: false });
  }
}
