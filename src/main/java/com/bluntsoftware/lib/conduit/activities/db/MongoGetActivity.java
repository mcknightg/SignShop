package com.bluntsoftware.lib.conduit.activities.db;

import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import com.bluntsoftware.lib.nosql.mongo.MongoRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/27/2017.
 */
@Service
public class MongoGetActivity extends MongoActivity{
    @Override
    public Map<String, Object> run(Map<String, Object> input) {
        Map<String,Object> ret = new HashMap<>();
        try{
            MongoRepository mongoRepository = getRepository(input);
            String databaseName =  input.get("database").toString();
            String collectionName = input.get("collection").toString();
            String id =input.get("id").toString();
            return (Map<String, Object>)mongoRepository.getById(id, databaseName,collectionName);
        }catch(Exception e){
            System.out.print(e.getMessage());
        }
        return ret;
    }

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema =  super.getSchema();
        schema.addString("id","",null);
        return schema;
    }
}
