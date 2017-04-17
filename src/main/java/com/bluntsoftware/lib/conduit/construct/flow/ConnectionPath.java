package com.bluntsoftware.lib.conduit.construct.flow;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Alex Mcknight on 2/9/2017.
 *
 */

public class ConnectionPath {
    public enum FieldType{
        input,output
    }
    private String flowActivityId;
    private FieldType fieldType;
    private String path;

    public static void main(String[] args) {
        String path = "['233213']['input']['sam']['fred']";
        ConnectionPath connectionPath = new ConnectionPath(path);
        System.out.println(connectionPath);
    }
    public ConnectionPath(String path) {
          parsePath(path);
    }
    public void parsePath(String path){

        String[] paths = path.substring(2,path.length()-2).split("\'\\]\\[\'");
        List<String> keys = Arrays.stream(paths).collect(Collectors.toList());

        this.flowActivityId = keys.remove(0);
        this.fieldType =  FieldType.valueOf(keys.remove(0));
        String newPath = "";
        for(String val:keys){
            newPath += "['" + val + "']";
        }
        this.path = newPath;
    }
    public ConnectionPath(FlowActivity flowActivity, FieldType fieldType, String path) {
        this.flowActivityId = flowActivity.getId();
        this.fieldType = fieldType;
        this.path = path;
    }

    public ConnectionPath(String flowActivityId, FieldType fieldType, String path) {
        this.flowActivityId = flowActivityId;
        this.fieldType = fieldType;
        this.path = path;
    }

    public String getFlowActivityId() {
        return flowActivityId;
    }

    public void setFlowActivityId(String flowActivityId) {
        this.flowActivityId = flowActivityId;
    }

    public FieldType getFieldType() {
        return fieldType;
    }

    public void setFieldType(FieldType fieldType) {
        this.fieldType = fieldType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "ConnectionPath{" +
                "flowActivityId='" + flowActivityId + '\'' +
                ", fieldType=" + fieldType +
                ", path='" + path + '\'' +
                '}';
    }
}
