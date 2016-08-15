/**  
 * @Title: DataBaseConnection.java 
 * @Package edu.whu.vge.db 
 * @Description: 鏁版嵁搴撴搷浣滃寘
 * @author bluce.liu 543802360@qq.com  
 * @date 2015-11-16 涓嬪崍5:08:26 
 * @version V1.0  
 */
package edu.whu.db;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

/**
 * 
 * Title: DataBaseConnection.java Description: mysql数据库链接
 * 
 * @author Bluce
 * @created 2016年4月14日 上午10:18:06
 */
public class DataBaseConnection
{
	// mysql驱动
	private final String DBDRIVER = "com.mysql.jdbc.Driver";
	// mysql数据库连接
	private String DBURL;
	// 数据库用户名
	private String DBUSER;
	// 数据库密码
	private String DBPASSWORD;
	// 数据库连接
	private Connection connection = null;
	// 数据库Host
	private String DBHOST;
	// 数据库端口
	private String DBPORT;
	// 数据库名称
	private String DBNAME;

	public DataBaseConnection()
	{
		try
		{
			loadconfig();
			Class.forName(DBDRIVER);
			this.connection = DriverManager.getConnection(DBURL, DBUSER,
					DBPASSWORD);
		} catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("");
		}
	}

	// 获取数据库连接
	public Connection getConnection()
	{
		return connection;
	}

	// 关闭数据库连接
	public void close()
	{

		try
		{
			connection.close();
		} catch (Exception e)
		{
			System.out.println("关闭数据库异常！");
		}
	}

	/**
	 * 
	 * @discription 获取数据库配置文件
	 * @author bluce
	 * @created 2016年4月14日 上午10:21:17
	 */
	protected void loadconfig()
	{
		try
		{
			Properties properties = new Properties();
			String rootPath = DataBaseConnection.class.getResource("/")
					.getPath();
			String configPath = rootPath.substring(1,
					rootPath.indexOf("classes"));

			properties.load(new FileInputStream(configPath
					+ "classes//config.properties"));

			properties.get("mysql_host");
			DBHOST = properties.get("mysql_host").toString();
			DBPORT = properties.get("mysql_port").toString();
			DBNAME = properties.get("mysql_db").toString();
			DBUSER = properties.get("mysql_user").toString();
			DBPASSWORD = properties.get("mysql_password").toString();

			DBURL = "jdbc:mysql://" + DBHOST + ":" + DBPORT + "/" + DBNAME;

		} catch (Exception e)
		{
			System.out.println("获取配置文件错误");

		}
	}
}
