import { UserReadDto } from '../data/dtos/UserReadDto';
import { IUserLoginResponseObject } from './interfaces/interfaces';

export class UserLoginResponse implements IUserLoginResponseObject {
  public jwt: string;
  public refreshToken: string;
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;

  public constructor(jwt: string, refreshToken: string, user: UserReadDto) {
    this.jwt = jwt;
    this.refreshToken = refreshToken;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
