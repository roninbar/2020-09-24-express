import mysql from 'mysql2/promise';

export async function insertMessage(username, text) {
    const conn = await mysql.createConnection({
        user: 'root',
        database: 'chat',
    });
    try {
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
    finally {
        await conn.end();
    }
}
