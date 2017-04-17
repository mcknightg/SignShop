package com.bluntsoftware.lib.conduit.activities.output;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/27/2017.
 */
@Service
public class HttpResponseActivity extends ActivityImpl {
    @Override
    public Map<String, Object> run(Map<String, Object> input) {
        return null;
    }

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema(this.getName());
        List<String> outType = new ArrayList<String>();
        outType.add("json");
        outType.add("html");
        outType.add("xml");
        outType.add("file");
        schema.addEnum("output_type",outType ,"json");
        schema.addString("data","false","json");
        return schema;
    }
}
