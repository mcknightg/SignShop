package com.bluntsoftware.lib.conduit.construct;

import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * Created by Alex Mcknight on 1/3/2017.
 *
 */

public interface Activity {

    Map<String,Object> getInput();
    Map<String,Object> getOutput();
    String getName();
    String getActivityClass();
    String getCategory();
    String getIcon();

}
