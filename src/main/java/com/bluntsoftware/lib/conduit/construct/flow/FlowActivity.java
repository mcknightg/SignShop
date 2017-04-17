package com.bluntsoftware.lib.conduit.construct.flow;

import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.Map;

/**
 * Created by Alex Mcknight on 1/4/2017.\
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class FlowActivity implements Activity{

    private String activityClass;
    private Map<String,Object> input;
    private Map<String,Object> output;
    private String id;
    private Integer x;
    private Integer y;
    private String icon;
    private String category;
    private String name;
    private String description;

    public String getIcon() {
        return icon;
    }


    public Boolean shouldRun() {
        ActivityImpl activity = getActivity();
        return activity.shouldRun(this.getInput());
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getActivityClass() {
        return activityClass;
    }

    public void setActivityClass(String activityClass) {
        this.activityClass = activityClass;
    }

    public Map<String, Object> getInput() {
        return input;
    }

    public void setInput(Map<String, Object> input) {
        this.input = input;
    }

    public Map<String, Object> getOutput() {
        return output;
    }

    public void setOutput(Map<String, Object> output) {
        this.output = output;
    }


    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void run(){
        ActivityImpl activity = getActivity();
        setOutput(activity.run(getInput()));
    }

    @JsonIgnore
    public ActivityImpl getActivity(){
         return (ActivityImpl)ActivityImpl.getByClassName(activityClass);
    };

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "FlowActivity{" +
                "activityClass='" + activityClass + '\'' +
                ", input=" + input +
                ", output=" + output +
                ", id='" + id + '\'' +
                ", x=" + x +
                ", y=" + y +
                ", icon='" + icon + '\'' +
                ", category='" + category + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
