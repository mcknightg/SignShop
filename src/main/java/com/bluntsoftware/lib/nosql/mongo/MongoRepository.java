package com.bluntsoftware.lib.nosql.mongo;


import com.mongodb.BasicDBObject;
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.ListDatabasesIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.stereotype.Repository;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;

/**
 * Created by Alex Mcknight on 2/17/2017.
 */
@Repository("MongoRepository")
public class MongoRepository {

    private Integer port = 27017;
    private String server = "localhost";
    MongoClient mongoClient = null;
    List<MongoRepositoryListener> listeners = new ArrayList<>();

    public MongoRepository() {

    }

    public void addListener(MongoRepositoryListener listener){
        listeners.add(listener);
    }

    public MongoRepository( String server,Integer port) {
        this.port = port;
        this.server = server;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }
    public  MongoClient getClient(){
        if(mongoClient == null){
            mongoClient = new MongoClient(server, port);
        }
        return mongoClient;
    }

    public Object findAll(String database,String collection) throws Exception {
        String filterByFields = "{}";
        String rows = "25";
        return this.findAll(database,collection,filterByFields,rows);
    }

    public Object findAll(String database,String collection,String filterByFields,String rows) throws Exception {
        // Mongo DB Syntax IE - The compound query below selects all records where the
        // `status` equals "A" and either age is less than 30 or type equals 1:
        // {status: "A", $or: [ { age: { $lt: 30 } }, { type: 1 } ]}
        BasicDBObject query = new BasicDBObject();
        if(filterByFields != null && !filterByFields.equalsIgnoreCase("")){
            query = BasicDBObject.parse(filterByFields);
        }
        MongoCollection<Document> docList =  getCreateCollection(database,collection);
        FindIterable<Document> result  = docList.find(query).limit(Integer.parseInt(rows));
        Map<String,Object> ret = new HashMap<String, Object>();
        ret.put("currpage",1);
        ret.put("totalpages",1);
        ret.put("totalrecords",docList.count());

        List<Document> resultList = new ArrayList<>();
       for(Document doc:result){
           resultList.add(doc);
       }
       ret.put("rows",resultList);

        for(MongoRepositoryListener listener:listeners){
            listener.find(database,collection,ret);
        }

        return ret;
    }
    public  Map<String,Object> remove(String databaseName, String collectionName,String id){
        MongoCollection<Document> collection =  getCreateCollection(databaseName,collectionName);
        collection.deleteOne(eq("_id", id));
        Map<String,Object> ret = new HashMap<>();
        ret.put("status","success");
        ret.put("id",id);
        ret.put("action","remove");
        for(MongoRepositoryListener listener:listeners){
            listener.remove(databaseName,collectionName,ret);
        }
        return ret;
    }
    private  void createCollection(String database, String collection){
        MongoDatabase db = getClient().getDatabase(database);
        db.createCollection(collection);
    }
    private MongoCollection<Document> getCollection(String database, String collection){
        MongoDatabase db = getClient().getDatabase(database);
        return db.getCollection(collection);
    }

    public  MongoCollection<Document>  getCreateCollection(String database, String collection){
        MongoCollection<Document> ret = getCollection(database,collection);
        if(ret == null){createCollection(database,collection);}
        return getCollection(database,collection);
    }
    public Document getById(String id,String databaseName,String collectionName){
        MongoCollection<Document> collection = getCreateCollection(databaseName,collectionName);
        return collection.find(eq("_id", id)).first();
    }
    public Document save( String databaseName,String collectionName,Map<String,Object> data){
        MongoCollection<Document> collection = getCreateCollection(databaseName,collectionName);
        Document document = null;
        if(data.containsKey("_id") && data.get("_id") != null && !data.get("_id").equals("") ){
            document = this.getById(data.get("_id").toString(),databaseName,collectionName);
            if(document != null){
                document.putAll(data);
                collection.replaceOne(eq("_id", data.get("_id").toString()),document);
            }else{
                document = new Document();
                document.putAll(data);
                collection.insertOne(document);
            }
        }else{
            document = new Document();
            data.put("_id", UUID.randomUUID().toString());
            document.putAll(data);
            collection.insertOne(document);
        }
        for(MongoRepositoryListener listener:listeners){
            listener.save(databaseName,collectionName,document);
        }
        return document;
    }
    public static void main(String[] args) {

        try{
            MongoRepository mongoService = new MongoRepository();

            MongoCollection<Document> collection = mongoService.getCreateCollection("TestDb","testCol");
            Document doc = new Document("name", "MongoDB")
                    .append("_id",UUID.randomUUID().toString())
                    .append("type", "database")
                    .append("count", 1)
                    .append("info", new Document("x", 203).append("y", 102));

            collection.insertOne(doc);
            Block<Document> printBlock = new Block<Document>() {
                @Override
                public void apply(final Document document) {
                    System.out.println(document.toJson());
                }
            };
            collection.find().forEach(printBlock);
        }catch(Exception e){
            System.out.print(e.getMessage());
        }
    }

    public ListDatabasesIterable<Document> listDatabases() {
        MongoClient client =  getClient();
        return client.listDatabases();
    }
}
