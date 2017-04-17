package com.bluntsoftware.lib.conduit.json_editor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;


/**
 *
 * Created by Alex Mcknight on 1/25/2017.
 */
public class JsonSchema extends RecordProperty {

    public JsonSchema(String title) {
        super(title);
    }
    @JsonIgnore
    public String getJson(){
         ObjectMapper mapper = new ObjectMapper();
         mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
         try {
             return mapper.writeValueAsString(this);
         } catch (JsonProcessingException e) {
             e.printStackTrace();
         }
         return "{}";
     }
    public static void main(String[] args) {
        List<String> gender = new ArrayList<String>();
        gender.add("Male");
        gender.add("Female");

        JsonSchema form = new JsonSchema("User");

        form.addString("first_name","Alex");
        form.addString("last_name","Mcknight");
        form.addString("age","51");
        form.addEnum("gender",gender,"Male");
        form.addString("color","blue","color");

        RecordProperty address = new RecordProperty("Address");
        address.addString("address1","816 Stonybrook");
        address.addString("address2","");
        address.addString("city","W. Norriton");
        address.addString("state","PA");
        address.addString("zip","19403");

        form.addRecord("address",address);

        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        try {
            String jsonInString = mapper.writeValueAsString(form);
            System.out.println(jsonInString);
            System.out.println(mapper.writeValueAsString(form.getValue()));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
