package com.bluntsoftware.lib.nosql.mongo;

import com.mongodb.*;
import com.mongodb.client.*;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import static com.mongodb.client.model.Filters.*;

/**
 * Created by Alex Mcknight on 10/12/2016.
 *
 */
@Controller("MongoService")
@RequestMapping(value = "/mongo")
public class MongoServiceImpl {
     private final MongoRepository mongoRepository;

    @Autowired
    public MongoServiceImpl(MongoRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    @RequestMapping(
            value = "{databaseName}/{collectionName}/doc/save",
            method = { RequestMethod.GET,RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public  Object saveUpdateParams(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            HttpServletRequest request) throws Exception{

        Map<String,Object> object = new HashMap<>();
        Enumeration enumeration = request.getParameterNames();
        while (enumeration.hasMoreElements()) {
            String parameterName = (String) enumeration.nextElement();
            object.put(parameterName,request.getParameter(parameterName));
        }
        return mongoRepository.save(databaseName,collectionName,object);
    }



    @RequestMapping(
            value = "{databaseName}/{collectionName}",
            method = {RequestMethod.POST,RequestMethod.PUT},
            produces = "application/json",
            consumes = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public  Object saveUpdate(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            @RequestBody Map<String,Object> object) throws Exception{
        return mongoRepository.save(databaseName,collectionName,object);
    }

    //Save
    @RequestMapping(
            value="{databaseName}/{collectionName}/{id}",
            method = { RequestMethod.POST,RequestMethod.PUT},
            produces = "application/json",
            consumes = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    protected   Object save(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            @PathVariable("id") String id,
            @RequestBody Map<String,Object> object) throws Exception{

        Document myDoc = mongoRepository.getById(id,databaseName,collectionName);
        if(myDoc != null){
            myDoc.putAll(object);
        }
        return mongoRepository.save(databaseName,collectionName,myDoc);
    }
    private static String validString(String value, String defaultValue){
        if (isValidParameter(value)) {
            return value;
        }
        return defaultValue;
    }
    private static boolean isValidParameter(String param) {
        return param != null && !param.isEmpty() && !param.equalsIgnoreCase("_empty") && !param.equalsIgnoreCase("undefined") && !param.equalsIgnoreCase("null");
    }

    //List
    @RequestMapping(
            value = {"{databaseName}/{collectionName}","{databaseName}/{collectionName}/data"},
            method = {RequestMethod.GET},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public  Object findAll(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            HttpServletRequest request) throws Exception{
        String filterByFields =  validString(request.getParameter("filterByFields"), "{}");
        String rows = validString(request.getParameter("rows"),"25");
        return mongoRepository.findAll(databaseName,collectionName,filterByFields,rows);
    }

    //Get
    @RequestMapping(
            value = "{databaseName}/{collectionName}/{id}",
            method = {RequestMethod.GET},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Object findOne(@PathVariable("databaseName") String databaseName,
                          @PathVariable("collectionName") String collectionName,
                          @PathVariable("id") String id) throws Exception{
        return mongoRepository.getById(id,databaseName,collectionName);
    }

    //Remove
    @RequestMapping(
            value = "{databaseName}/{collectionName}/{id}",
            method = {RequestMethod.DELETE},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Object delete(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            @PathVariable("id") String id) throws Exception{
        return mongoRepository.remove(databaseName,collectionName,id);
    }

    //Show Schema
    @RequestMapping(
            value = "{databaseName}/{collectionName}/schema",
            method = {RequestMethod.GET, RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public  Map<String, Object> showSchema(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName){

        MongoCollection<Document> collection = mongoRepository.getCreateCollection(databaseName,collectionName);
        return collection.find().first();
    }

    //List Columns
    @RequestMapping(
            value = "{databaseName}/{collectionName}/columns",
            method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Set<String> columns(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName){
        MongoCollection<Document> collection = mongoRepository.getCreateCollection(databaseName,collectionName);
        Document document =  collection.find().first();
        return document.keySet();
    }



    @RequestMapping( value = "")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public ListDatabasesIterable<Document> listDatabases(){
        return mongoRepository.listDatabases();
    }

    //get api
    @RequestMapping( value = {"{databaseName}/{collectionName}/api","{database}/api"})
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> getApi(
            @PathVariable("databaseName") String databaseName,
            @PathVariable("collectionName") String collectionName,
            HttpServletRequest request){
      //  MongoCollection<Document> collection = mongoRepository.getCreateCollection(databaseName,collectionName);
        return config(databaseName,collectionName,request);
    }
    @RequestMapping( value = "api")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> api(
            HttpServletRequest request){
        Map<String,Object> ret =  getServerInfo(request);

        MongoClient client = mongoRepository.getClient();
        Map<String,Map> databaseMap = new HashMap<>();
        for(Document db:client.listDatabases()){
            String databaseName = (String)db.get("name");
            MongoDatabase database =  client.getDatabase(databaseName);

            Map<String,Map> collectionMap = new HashMap<>();
            for(Document collection:database.listCollections()){
                String collectionName = (String)collection.get("name");

                collectionMap.put(collectionName,config(databaseName,collectionName,request));
            }
            databaseMap.put(databaseName,collectionMap);

        }
        ret.put("mods",databaseMap);
        ret.put("serverConfig",getServerInfo(request));
        return ret;
    }

    @RequestMapping( value = "{databaseName}")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Object listCollections(
            @PathVariable("databaseName") String databaseName){
        MongoClient client = mongoRepository.getClient();
        MongoDatabase database =  client.getDatabase(databaseName);
        return database.listCollections();
    }
    private Map<String,Object> getServerInfo(HttpServletRequest request){

        String serverPath = "http://" + request.getServerName();
        Integer port = request.getLocalPort();
        String contextPath = request.getContextPath();
        if(!port.toString().equalsIgnoreCase("")){
            serverPath += ":" + port;
        }
        if(contextPath != null ){
            serverPath += "/" + contextPath;
        }

        serverPath += "/mongo/";

        Map<String,Object>  map = new HashMap<>();
        map.put("localAddress",request.getLocalAddr()); //- the server's IP address as a string
        map.put("localName",request.getLocalName()); //- the name of the server recieving the request
        map.put("serverName",request.getServerName()); //- the name of the server that the request was sent to
        map.put("port",request.getLocalPort()); //- the port the server recieved the request on
        map.put("serverPort",request.getServerPort()); //- the port the request was sent to
        map.put("contextPath",request.getContextPath()); //- the part of the path that identifies the application
        map.put("serverPath",serverPath);
        return map;
    }
    public Map<String,Object> config(String qualifier,String name,HttpServletRequest request) {
        Map<String,Object> serverInfo = getServerInfo(request);
        String address =  serverInfo.get("serverPath") + qualifier + "/" +  name + "/" ;
        Map<String,Object>  map = new HashMap<>();
        map.put("mod",qualifier);
        map.put("name",name);
        map.put("schema",address + "schema");
        map.put("columns",address +"columns");
        map.put("api",address +  "api");
        map.put("data",address + "data");
        return map;
    }
}
