package com.bluntsoftware.lib.conduit.json_editor;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/25/2017.
 *
 */
public class RecordProperty implements Property{
    private String type = "object";
    private String title= "untitled";
    private Map<String,Property> properties = new LinkedHashMap<>();

    public RecordProperty(String title) {
        this.title = title;
    }
    public StringProperty addString(String name, String defaultValue ){
            return addString(name,defaultValue,null);
    }
    public StringProperty addString(String name, String defaultValue,String format){
        return addString(null,name,defaultValue,format);
    }
    public StringProperty addString(String title,String name, String defaultValue,String format){
        StringProperty property = new StringProperty();
        property.setDefaultValue(defaultValue);
        if(title == null){
            property.setTitle(getTitle(name));
        }else{
            property.setTitle(title);
        }

        if(format != null){
            property.setFormat(format);
        }
        properties.put(name,property);
        return property;
    }

    public String getTitle(String name) {
        String[] sections = name.split("_");
        String title = "";
        for(String section:sections){
           title +=  section.substring(0, 1).toUpperCase() + section.substring(1) + " ";
        }
        return title;
    }
    public EnumProperty addEnum(String title,String name, List<String> enumeration, String defaultValue){
        EnumProperty property = new EnumProperty();
        property.setDefaultValue(defaultValue);
        property.set(enumeration);
        if(title == null){
            property.setTitle(getTitle(name));
        }else{
            property.setTitle(title);
        }
        properties.put(name,property);
        return property;
    }
    public EnumProperty addEnum(String name, List<String> enumeration, String defaultValue){
         return addEnum(null,name,enumeration,defaultValue);
    }
    public RecordProperty addRecord(String name, RecordProperty recordProperty){
        properties.put(name,recordProperty);
        return recordProperty;
    }

    @JsonIgnore
    @Override
    public Map<String,Object> getValue() {
        Map<String,Object> ret = new HashMap<>();
        for(String key:properties.keySet()){
            ret.put(key,properties.get(key).getValue());
        }
        return ret;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Map<String, Property> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Property> properties) {
        this.properties = properties;
    }


}
