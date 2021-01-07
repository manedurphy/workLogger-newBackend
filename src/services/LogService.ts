import { injectable } from 'inversify';
import { LogCreateDto } from '../data/dtos/LogCreateDto';
import { ILogCreateDto } from '../data/interfaces/ILogCreateDto';
import { Log, Task } from '../models';

@injectable()
export class LogService {
  private GetSunday() {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() || 7));
    return date.toString().slice(0, 15);
  }

  private GetLastSunday() {
    const lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - (lastSunday.getDay() || 7) - 7);

    return lastSunday.toString().slice(0, 15);
  }

  private GetToday() {
    const date = new Date();
    return date.getDay();
  }

  public MapProps(
    body: ILogCreateDto,
    hoursWorked: number | null
  ): LogCreateDto {
    body.weekOf = this.GetSunday();
    body.day = this.GetToday();
    body.productiveHours = hoursWorked ? hoursWorked : body.hoursWorked;

    return new LogCreateDto(body);
  }

  public LogMatchesUser(logItem: Log, userId: number): boolean {
    return logItem.UserId === userId;
  }

  public async GetHoursWorkedAfterDelete(log: Log[], logItemRemoved: Log) {
    let sum = 0;

    for (let i = log.length - 1; i >= 0; i--) {
      if (log[i].id > logItemRemoved.id) {
        log[i].hoursWorked -= logItemRemoved.productiveHours;
        if (log[i + 1]) {
          log[i].productiveHours = log[i].hoursWorked - log[i + 1].hoursWorked;
        }
        await log[i].save();
        if (i === 0) {
          sum = log[i].hoursWorked;
        }
      }
    }

    return sum;
  }

  public async GetHoursWorkedAfterUpdate(log: Log[]) {
    let sum = 0;

    for (let i = log.length - 1; i >= 0; i--) {
      if (i === log.length - 1) {
        log[i].productiveHours = log[i].hoursWorked;
        sum += log[i].hoursWorked;
      } else {
        const diff = log[i].hoursWorked - log[i + 1].hoursWorked;
        sum += diff;
        log[i].productiveHours = diff;
      }
      await log[i].save();
    }

    return sum;
  }
}
