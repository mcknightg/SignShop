package com.bluntsoftware.lib.conduit.activities.db;

import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import com.bluntsoftware.lib.nosql.mongo.MongoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.Document;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/27/2017.
 */
@Service
public class MongoSaveActivity extends MongoActivity{
    @Override
    public JsonSchema getSchema() {
        JsonSchema schema =  super.getSchema();
        schema.addString("payload","{}","json");
        return schema;
    }

    @Override
    public Map<String, Object> getInput() {
        Map<String, Object> ret = getSchema().getValue();
        return ret;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {
        Map<String,Object> ret = new HashMap<>();
        try{
            MongoRepository mongoRepository = getRepository(input);
            String databaseName =  input.get("database").toString();
            String collectionName = input.get("collection").toString();

            Map<String,Object> msg = new HashMap<>();
            Object payload = input.get("payload");
            if(payload != null && payload instanceof Map){
                msg = (Map<String,Object>)payload;
            }else if(payload != null &&  payload instanceof String){
                try{
                    ObjectMapper mapper = new ObjectMapper();
                    msg = mapper.readValue(payload.toString(), Map.class);
                }catch (Exception e){
                    msg.put("msg",payload);
                }
            }
            return mongoRepository.save( databaseName,collectionName,msg);

        }catch(Exception e){
            System.out.print(e.getMessage());
        }

        return ret;
    }
}
