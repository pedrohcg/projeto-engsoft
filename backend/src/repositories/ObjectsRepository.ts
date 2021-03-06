import mssql from 'mssql';
import SqlServerConfig from '../config/sqlserverconfig';
import IObjectsRepository from './IObjectsRepository';

import Object from '../model/Object';

export default class ObjectsRepository implements IObjectsRepository{
    constructor(){}

    public async findById(id: string): Promise<any> {
        const object_id = Number(id);

        await mssql.connect(SqlServerConfig);

        const findUser = await mssql.query(`SELECT O.id, U.name OwnerName, O.name ObjectName, O.price, O.description, O.image, C.name CategoryName, U.id owner_id FROM Objects O 
                                            INNER JOIN Categories C 
                                            ON O.category_id =  C.id
                                            INNER JOIN Users U
                                            ON O.owner_id = U.id
                                            WHERE O.id = ${object_id}`);

        return findUser.recordset[0];
    }

    public async findByOwner(owner_id: string): Promise<any> {
        const id = Number(owner_id);

        await mssql.connect(SqlServerConfig);

        const findUser = await mssql.query(`SELECT O.id, U.name OwnerName, O.name ObjectName, O.price, O.description, O.image, C.name CategoryName, U.id owner_id FROM Objects O
                                            INNER JOIN Categories C 
                                            ON O.category_id =  C.id
                                            INNER JOIN Users U
                                            ON O.owner_id = U.id
                                            WHERE O.owner_id = ${id}`);

        return findUser.recordset;
    }

    public async findByCategory(category: string): Promise<any> {
        await mssql.connect(SqlServerConfig);

        const findItems = await mssql.query(`SELECT O.id, O.name ObjectName, O.price, O.description, O.image, U.name OwnerName, U.email, C.name Category FROM Objects O
                                            INNER JOIN Users U
                                            ON O.owner_id = U.id
                                            INNER JOIN Categories C
                                            ON C.id = O.category_id
                                            WHERE O.category_id = ${category}`);
        
        return findItems.recordset;
    }

    public async findByString(searchString: string): Promise<any> {
        await mssql.connect(SqlServerConfig);

        const findItems = await mssql.query(`SELECT O.id, O.name ObjectName, O.price, O.description, O.image, U.name OwnerName, U.email, C.name Category FROM Objects O
                                            INNER JOIN Users U
                                            ON O.owner_id = U.id
                                            INNER JOIN Categories C
                                            ON C.id = O.category_id
                                            WHERE O.name like '%${searchString}%'
                                            or O.description like '%${searchString}%'`);

        return findItems.recordset;
    }

    public async findRandomObject(): Promise<any> {
        await mssql.connect(SqlServerConfig);

        const objects = await mssql.query(`SELECT TOP 4 O.id, O.name ObjectName, O.price, O.description, O.image, U.name OwnerName, U.email, C.name Category FROM Objects O
                                            INNER JOIN Users U
                                            ON O.owner_id = U.id
                                            INNER JOIN Categories C
                                            ON C.id = O.category_id
                                            ORDER BY NEWID()`)

        return objects.recordset
    }

    public async getCategory(category_name: string): Promise<string> {
        await mssql.connect(SqlServerConfig);

        const category = await mssql.query(`SELECT id FROM Categories WHERE name = '${category_name}'`);

        return category.recordset[0].id;
    }

    public async update(id: string, data: Object): Promise<any> {
        await mssql.connect(SqlServerConfig);
       
        await mssql.query(`UPDATE Objects SET name = '${data.name}', price = '${data.price}', description = '${data.description}', image = '${data.image}' WHERE id = ${id}`)
    }

    public async delete(id: string){
        await mssql.connect(SqlServerConfig);

        await mssql.query(`DELETE FROM Objects WHERE id = ${id}`)
    }

    public async create(data: Object): Promise<any> {
        const id = Number(data.owner_id);
        console.log(data.category)
        await mssql.connect(SqlServerConfig);

        await mssql.query(`INSERT INTO Objects (owner_id, name, price, description, image, category_id) 
                        VALUES('${id}', '${data.name}', '${data.price}', '${data.description}', '${data.image}', '${data.category}')`);
    }
}