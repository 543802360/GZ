package edu.whu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javassist.compiler.ast.Variable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import edu.whu.db.DataBaseConnection;

public class getCompanyByName extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public getCompanyByName() {
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

		/**
		 * 设置编码与跨域
		 */
		response.setContentType("text/html,charset=utf-8");
		response.setCharacterEncoding("utf-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST,GET");
		PrintWriter out = response.getWriter();

		String name = new String(request.getParameter("companyName").getBytes(
				"ISO-8859-1"), "UTF-8");

		DataBaseConnection dbConnection = null;
		PreparedStatement pstmt;
		try {
			// 模糊查询所有企业
			dbConnection = new DataBaseConnection();
			String sql = "SELECT * FROM company_gz WHERE name LIKE " + "'%"
					+ name + "%'";
			pstmt = dbConnection.getConnection().prepareStatement(sql);
			ResultSet rs = pstmt.executeQuery();
			JSONArray array = new JSONArray();
			while (rs.next()) {
				if ((rs.getDouble(20) != 0) && (rs.getDouble(21) != 0)) {
					String address = rs.getString(3) + "省" + rs.getString(4)
							+ rs.getString(5) + rs.getString(6)
							+ rs.getString(7);
					JSONObject object = new JSONObject()
							.element("name", rs.getString(1))
							.element("legal", rs.getString(2))
							.element("address", address)
							.element("tel", rs.getString(10))
							.element("fax", rs.getString(11))
							.element("kind", rs.getString(12))
							.element("industry", rs.getString(13))
							.element("number", rs.getString(15))
							.element("income", rs.getString(16))
							.element("assest", rs.getString(17))
							.element("website", rs.getString(19))
							.element("email", rs.getString(18))
							.element("lat", rs.getDouble(20))
							.element("lon", rs.getDouble(21));

					array.add(object);
				}

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
