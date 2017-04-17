package com.bluntsoftware.lib.conduit.activities.db;

import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import com.bluntsoftware.lib.conduit.json_editor.RecordProperty;
import com.bluntsoftware.lib.nosql.mongo.MongoRepository;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/27/2017.
 */
@Service
public class MongoFindActivity extends MongoActivity{

    @Override
    public Map<String,Object> run(Map<String, Object> input) {
        Map<String,Object> ret = new HashMap<>();
        try{
            MongoRepository mongoRepository = getRepository(input);
            String databaseName =  input.get("database").toString();
            String collectionName = input.get("collection").toString();

            Map<String,Object> query =((Map<String,Object>)input.get("query"));
            String filterByFields = "{}";
            Object qry =  query.get("filter");
            if(qry != null){
                filterByFields = qry.toString();
            }
             
            String rows = query.get("rows").toString();
            return  (Map<String, Object>)mongoRepository.findAll( databaseName,collectionName,filterByFields,rows );
        }catch(Exception e){
            System.out.print(e.getMessage());
        }
        return ret;
    }

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema =  super.getSchema();
        List<String> sord = new ArrayList<>();
        sord.add("ASC");
        sord.add("DESC");

        RecordProperty query = new RecordProperty("Query");
        query.addString("page","1");
        query.addString("rows","20",null);
        query.addEnum("Sort Order","sord",sord,"ASC");
        query.addString("Sort Index","sidx","_id",null);
        query.addString("filter","","json");
        schema.addRecord("query",query);
        return schema;
    }
}
