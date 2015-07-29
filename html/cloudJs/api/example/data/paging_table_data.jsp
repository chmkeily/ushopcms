<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
StringBuffer result = new StringBuffer();
String key = request.getParameter("key");
int pageSize = Integer.parseInt(request.getParameter("pageSize"));
int pageNum = Integer.parseInt(request.getParameter("pageNum"));
int total = 1983;
int start = pageSize * (pageNum - 1) + 1;
int end = start + pageSize;
if(end > total) end = start + total % pageSize;
if(key == null || key.trim().length() == 0) key = "all";
result.append("{\"total\":" + total + ",\"table\":[");
for(int i = start; i < end; i++){
	if(i > start) result.append(",");
	result.append("{\"id\":" + i);
	result.append(",\"key\":\"" + key + "\"");
	result.append(",\"cnt\":\"" + ((i+2)*2+116) + "\"");
	result.append(",\"rate\":\"" + i*100/(i+26) + "\"");
	result.append("}");
	
}
result.append("]}");
out.print(result);
%>