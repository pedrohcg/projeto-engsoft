import mssql from 'mssql';
import SqlServerConfig from '../config/sqlserverconfig';
import IUsersRepository from './IUserRepository';

import User from '../model/User';

class UsersRepository implements IUsersRepository{
  constructor(){}

  public async findById(id: string): Promise<any>{
    const user_id = Number(id);

    await mssql.connect(SqlServerConfig);

    const findUser = await mssql.query(`SELECT * FROM Users WHERE id = ${user_id}`);

    return findUser.recordset[0];
  }

  public async findByEmail(email: string): Promise<any> {
    await mssql.connect(SqlServerConfig);

    const findUser = await mssql.query(`SELECT * FROM Users WHERE email = '${email}'`);

    return findUser.recordset[0];
  }   

  public async create(newUser: User): Promise<User>{
    await mssql.connect(SqlServerConfig);

    await mssql.query(`INSERT INTO Users (name, email, password) VALUES('${newUser.name}', '${newUser.email}', '${newUser.password}')`);
    
    return newUser;
  }

  public async save(user: User){
    await mssql.connect(SqlServerConfig);

    await mssql.query(`INSERT INTO Users (name, email, password) VALUES('${user.name}', '${user.email}', '${user.password}')`);
  }

  public async update(id: String, user: User){
    await mssql.connect(SqlServerConfig);

    await mssql.query(`UPDATE Users SET name = '${user.name}', email = '${user.email}', password = '${user.password}' WHERE id = ${id}`)
  }
}

export default UsersRepository;