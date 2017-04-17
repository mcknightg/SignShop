package com.bluntsoftware.lib.conduit.activities.input;

import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/12/2017.
 */
@Service
public class HotFolderActivity extends TimerActivity {
    @Override
    public JsonSchema getSchema() {

        JsonSchema schema =  super.getSchema();
        schema.setTitle("Hot Folder Properties");
        schema.addString("folderLocation","/hot",null);
        schema.addString("include","*.*",null);
        return schema;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {
        Map<String, Object> out =  super.run(input);
        List<String> filesFound = new ArrayList<>();
        //Lets move the files we find
        //and list those file on the output
        out.put("foundFiles",filesFound);
        return out;
    }

    @Override
    public Map<String, Object> getOutput() {
        List<String> filesFound = new ArrayList<>();
        Map<String, Object> out =  super.getOutput();
        out.put("foundFiles",filesFound);
        return super.getOutput();
    }

    @Override
    public Boolean shouldRun(Map<String,Object> input) {
        return false;
    }

    @Override
    public String getIcon() {
        return "fa-folder-open-o";
    }
}
