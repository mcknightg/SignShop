package com.bluntsoftware.lib.conduit.activities.files;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;


import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/3/2017.
 *
 */

@Service
public class CopyFileActivity extends ActivityImpl {

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema("Copy File");
        schema.addString("fileInputPath","c:/somefile.txt","");
        schema.addString("fileOutputPath","c:/somefile.txt","");
        return schema;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {
        System.out.println("Ran Function RUn");
        Map<String, Object> output = new HashMap<>();
        output.put("out","cool");
        return output;
    }

    @Override
    public String getIcon() {
        return "fa-file-o";
    }

}
