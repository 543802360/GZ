package edu.whu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import edu.whu.db.DataBaseConnection;

public class getExportImportInfo extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public getExportImportInfo() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// 设置编码和跨域
		response.setContentType("text/html,charset=utf-8");
		response.setCharacterEncoding("utf-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Method", "POST,GET");
		// 获取参数
		PrintWriter out = response.getWriter();
		String year = request.getParameter("year");
		String continent = new String(request.getParameter("continent")
				.getBytes("ISO-8859-1"), "UTF-8");
		DataBaseConnection dbConnection = null;
		PreparedStatement pstmt;
		try {
			// 模糊查询所有企业
			dbConnection = new DataBaseConnection();
			// SELECT * FROM exportimport WHERE continent = 'asia' && year=2000
			String sql = "SELECT * FROM exportimport WHERE continent = " + "'"
					+ continent + "'" + " && year=" + year;
			pstmt = dbConnection.getConnection().prepareStatement(sql);
			ResultSet rs = pstmt.executeQuery();
			JSONArray array = new JSONArray();
			while (rs.next()) {

				JSONObject object = new JSONObject()
						.element("year", rs.getString(1))
						.element("continent", rs.getString(7))
						.element("import", rs.getString(3) + "万美元")
						.element("export", rs.getString(4) + "万美元")
						.element("import_rate", rs.getString(5) + "%")
						.element("export_rate", rs.getString(6) + "%");

				array.add(object);

			}
			out.println(array.toString());
			System.out.println(array.toString());

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			System.out.println("查询错误！！！");
		} finally {
			dbConnection.close();
		}

	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to
	 * post.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doGet(request, response);
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException
	 *             if an error occurs
	 */
	public void init() throws ServletException {
		// Put your code here
	}

}
