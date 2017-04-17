package com.bluntsoftware.lib.conduit.activities.db;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/24/2017.
 */
@Service
public class SQLActivity extends ActivityImpl {
    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema("SQL Properties");
        List<String> db = new ArrayList<String>();
        db.add("Postgres");
        db.add("SQL Server");
        db.add("Oracle");
        db.add("My Sql");

        schema.addEnum("database_type",db,"Postgres");
        schema.addString("server","localhost",null);
        schema.addString("port","5432",null);
        schema.addString("user","postgres",null);
        schema.addString("password","stud1o","password");
        schema.addString("sql","select * from table","sql");
        return schema;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {

        System.out.println("SQL Activity " + input);

        return null;
    }

    public static void main(String[] args) {
        SQLActivity activity = new SQLActivity();
        System.out.println(activity.getInput());
        System.out.println(activity.getSchema().getJson());
    }

    @Override
    public String getIcon() {
        return "fa-database";
    }
}
