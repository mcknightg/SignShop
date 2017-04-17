package com.bluntsoftware.lib.conduit.construct.impl;

import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public abstract class ActivityImpl implements Activity {
    public enum Category{
        Conduit,Input,FileAndFolders
    }

    public abstract Map<String,Object> run(Map<String,Object> input);
    public abstract JsonSchema getSchema();

    private final static Map<String,Activity> activities = new HashMap<>();
    public static Map<String,Activity> list(){return activities;}


    public static Activity getByClassName(String className){
        Activity activity = activities.get(className);
        try {
            if(activity == null){
                activity =  (Activity)Class.forName(className).newInstance();
                activities.put(className,activity);
            }
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException e) {
            e.printStackTrace();
        }
        return activity;
    }

    public ActivityImpl() {
      if(getClass().isAnnotationPresent(Service.class)){
          activities.put(getClass().getTypeName(),this);
      }
    }

    public Map<String,Object> execute(Map<String,Object> input) {
        Map<String,Object> activityInput = getInput();
        input.putAll(activityInput);
        return run(activityInput);
    }

    @Override
    public String getName() {
        String name = this.getClass().getSimpleName();
        if(name.contains("Activity")){
                return name.substring(0,name.indexOf("Activity"));
        }
        return name;
    }

    @Override
    public String getIcon() {
        return "fa-university";
    }

    @Override
    public String getActivityClass() {
        return getClass().getTypeName();
    }
     @Override
    public String getCategory(){
         String className = getActivityClass();
         String module = className.substring(0,className.lastIndexOf('.'));
         return module.substring(module.lastIndexOf('.')+1,module.length());
     }

    public Map<String, Object> getInput() {
        return getSchema().getValue();
    }


    public Boolean shouldRun(Map<String,Object> input) {
        return true;
    }

    @Override
    public Map<String, Object> getOutput() {
        return run(getInput());
    }
}
