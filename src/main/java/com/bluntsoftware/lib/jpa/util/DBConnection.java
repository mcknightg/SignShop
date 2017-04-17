package com.bluntsoftware.lib.jpa.util;


import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;


/**
 * Created by Alex Mcknight on 4/6/2017.
 */
public class DBConnection {
    private String driverName, host, port, database, params,userName,password,driverClassName;

    public DBConnection(String driverName, String host, String port, String database, String params, String userName, String password) {
        this.driverName = driverName;
        this.host = host;
        this.port = port;
        this.database = database;
        this.params = params;
        this.userName = userName;
        this.password = password;
    }

    public DBConnection() {
    }

    private DataSource getDataSource(String url, String driverClassname){
        final DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(getDriverClassName());
        dataSource.setUrl(url);
        dataSource.setUsername(getUserName());
        dataSource.setPassword(getPassword());
        return dataSource;
    }

    public DBConnection(String url,String driverClassname, String userName,String password) {
         parseJdbcUrl(url);
        this.userName = userName;
        this.password = password;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        this.params = params;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private void parseJdbcUrl(String jdbcUrl) {

        int pos, pos1, pos2;
        String connUri;

        if(jdbcUrl == null || !jdbcUrl.startsWith("jdbc:")
                || (pos1 = jdbcUrl.indexOf(':', 5)) == -1)
            throw new IllegalArgumentException("Invalid JDBC url.");

        driverName = jdbcUrl.substring(5, pos1);
        if((pos2 = jdbcUrl.indexOf(';', pos1)) == -1)
        {
            connUri = jdbcUrl.substring(pos1 + 1);
        }
        else
        {
            connUri = jdbcUrl.substring(pos1 + 1, pos2);
            params = jdbcUrl.substring(pos2 + 1);
        }

        if(connUri.startsWith("//"))
        {
            if((pos = connUri.indexOf('/', 2)) != -1)
            {
                host = connUri.substring(2, pos);
                database = connUri.substring(pos + 1);

                if((pos = host.indexOf(':')) != -1)
                {
                    port = host.substring(pos + 1);
                    host = host.substring(0, pos);
                }
            }
        }
        else
        {
            database = connUri;
        }

    }

    public static void createDatabaseIfNotExist(DriverManagerDataSource dataSource,String driverClassName ){
        DBConnection connection = new DBConnection();
        connection.parseJdbcUrl(dataSource.getUrl());
        String driverName = connection.getDriverName();
        String database = connection.getDatabase();
        String url = connection.urlNoDatabase();
        if(driverName.equalsIgnoreCase("postgresql")){
            url += "/postgres";
        }

        DriverManagerDataSource root = new DriverManagerDataSource();
        root.setUrl(url);
        root.setUsername(dataSource.getUsername());
        root.setPassword(dataSource.getPassword());
        root.setDriverClassName(driverClassName);
        createDatabase(root,database,driverClassName);

    }
    static void createDatabase(DriverManagerDataSource dataSource,String databaseName,String driverClassName){
        Connection conn = null;
        Statement stmt = null;

        try{
            //STEP 2: Register JDBC driver
            Class.forName( driverClassName);

            //STEP 3: Open a connection
            System.out.println("Connecting to database...");
            conn = dataSource.getConnection();

            //STEP 4: Execute a query
            System.out.println("Creating database...");
            stmt = conn.createStatement();

            String sql = "CREATE DATABASE " + databaseName;
            stmt.executeUpdate(sql);
            System.out.println("Database created successfully...");
        }catch(SQLException se){
            //Handle errors for JDBC
            se.printStackTrace();
        }catch(Exception e){
            //Handle errors for Class.forName
            e.printStackTrace();
        }finally{
            //finally block used to close resources
            try{
                if(stmt!=null)
                    stmt.close();
            }catch(SQLException se2){
            }// nothing we can do
            try{
                if(conn!=null)
                    conn.close();
            }catch(SQLException se){
                se.printStackTrace();
            }//end finally try
        }//end try
        System.out.println("Goodbye!");

    }

    public String urlNoDatabase(){
           return "jdbc:" + driverName + "://" + host + ":" + port ;
    }

    public static void main(String[] args) {
        DBConnection connection = new DBConnection();
        connection.parseJdbcUrl("jdbc:postgresql://localhost:5432/chinook");
        System.out.print(connection.urlNoDatabase());
    }
}
