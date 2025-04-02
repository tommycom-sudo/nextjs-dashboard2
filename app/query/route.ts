import oracledb from 'oracledb';

// 配置Oracle连接
const dbConfig = {
	user: process.env.ORACLE_USER,
	password: process.env.ORACLE_PASSWORD,
	connectString: process.env.ORACLE_CONNECTION_STRING,
	autoCommit: true
};

async function listInvoices() {
	let connection;
	try {
		connection = await oracledb.getConnection(dbConfig);
		const result = await connection.execute(
			`SELECT id_user, na FROM bbp.hi_sys_user where rownum = 1`
		);
		return result.rows;
	} catch (err) {
		console.error('数据库查询错误:', err);
		throw err;
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (err) {
				console.error('关闭连接错误:', err);
			}
		}
	}
}

export async function GET() {
	try {
		return Response.json(await listInvoices());
	} catch (error) {
		console.error('API错误:', error);
		return Response.json({ 
			error: '数据库操作失败',
			details: error instanceof Error ? error.message : '未知错误'
		}, { status: 500 });
	}
}
