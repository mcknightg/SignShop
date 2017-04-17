package com.bluntsoftware.lib.conduit.activities.input;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;


import java.util.Map;

/**
 * Created by Alex Mcknight on 1/5/2017.
 */

public class InputActivity extends ActivityImpl {
    @Override
    public JsonSchema getSchema() {
        JsonSchema editor = new JsonSchema(this.getName());
        editor.addString("hold","false",null);
        return editor;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {

        return input;
    }

    @Override
    public String getIcon() {
        return "fa-hand-o-right";
    }

    @Override
    public String getCategory() {
        return Category.Input.name();
    }
}
