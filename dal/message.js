import mysql from 'mysql2/promise';

const getSqlConnection = (function () {
    let connection = null;
    return async function () {
        if (!connection) {
            connection = await mysql.createConnection({
                user: process.env['USER'],
                password: process.env['PASS'],
                database: 'chat',
            });
        }
        return connection;
    }
})();

export async function insertMessage(username, text) {
    const conn = await getSqlConnection();
    const [{ insertId: senderId }] = await conn.execute('insert ignore sender (name) values (?)', [username]);
    const [{ insertId: messageId }] = await conn.execute({
        sql: `insert message (sender_id, text) values (${senderId ? ':senderId' : '(select id from sender where name = :username)'}, :text)`,
        namedPlaceholders: true,
    }, {
        senderId,
        username,
        text,
    });
    console.debug(`(id: ${messageId}, sender_id: ${senderId}, text: '${text}')`);
}

