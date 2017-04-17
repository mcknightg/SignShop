package com.bluntsoftware.lib.conduit.activities.db;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import com.bluntsoftware.lib.conduit.json_editor.RecordProperty;
import com.bluntsoftware.lib.nosql.mongo.MongoRepository;
import com.bluntsoftware.lib.nosql.mongo.MongoServiceImpl;

import org.bson.Document;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Alex Mcknight on 2/14/2017.
 *
 */

public abstract class MongoActivity extends ActivityImpl {

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema("Mongo Properties");
        schema.addString("database","test",null);
        schema.addString("collection","",null);
        RecordProperty connection = new RecordProperty("Connection");
        connection.addString("server","localhost",null);
        connection.addString("port","27017",null);
        connection.addString("user",null,null);
        connection.addString("password",null,"password");
        schema.addRecord("connection",connection);
        return schema;
    }
    protected MongoRepository getRepository(Map<String, Object> input){
            Map<String,Object> connection = (Map<String,Object>)input.get("connection");
            Integer port = Integer.parseInt(connection.get("port").toString());
            String server = connection.get("server").toString();
            return new MongoRepository(server,port);
    }
    public static void main(String[] args) {
        SQLActivity activity = new SQLActivity();
        System.out.println(activity.getInput());
        System.out.println(activity.getSchema().getJson());
    }

    @Override
    public String getIcon() {
        return "fa-leaf";
    }

}
