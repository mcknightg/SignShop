package com.bluntsoftware.lib.conduit.repository;

import com.bluntsoftware.lib.conduit.FlowListenerService;
import com.bluntsoftware.lib.conduit.Scheduler;
import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.activities.files.CopyFileActivity;
import com.bluntsoftware.lib.conduit.construct.flow.FlowActivity;
import com.bluntsoftware.lib.nosql.mongo.MongoRepository;
import com.bluntsoftware.lib.nosql.mongo.MongoRepositoryListener;
import com.bluntsoftware.lib.nosql.mongo.MongoServiceImpl;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 */
@Repository
public class FlowRepository {

    private String appName = "conduit";
    private final MongoRepository mongoRepository;
    private final FlowListenerService flowListenerService;
    @Autowired
    public FlowRepository(MongoRepository mongoRepository,FlowListenerService flowListenerService) {
        this.mongoRepository = mongoRepository;
        this.flowListenerService = flowListenerService;
    }
    private Scheduler scheduler;
    public Scheduler getScheduler() {
        return scheduler;
    }

    public void setScheduler(Scheduler scheduler) {
        this.scheduler = scheduler;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public List<Flow> list(){
        List<Flow>  ret = new ArrayList<>();
        MongoCollection<Document> collection = mongoRepository.getCreateCollection(this.appName,"flow");
        for(Document flow:collection.find()){
           ret.add(toFlow(flow));
        }
        return ret;
    }

    public Map<String,Object> remove(String id){

         return mongoRepository.remove(this.appName,"flow",id);
    }

    public Object findAll() throws Exception {

        return findAll(this.appName,"flow");
    }
    public Object findAll(String filterByFields,String rows) throws Exception {
        return mongoRepository.findAll(this.appName,"flow",filterByFields,rows);
    }

    public Flow getById(String id) {
        Document doc = mongoRepository.getById(id,this.appName,"flow");
        return toFlow(doc);
    }
    public Flow save(Flow flow) throws Exception {
        return save(toMap(flow));
    }

    public Flow save(Map<String,Object> flowMap) throws Exception {
        Flow flow =  toFlow(mongoRepository.save(this.appName,"flow",flowMap));
        if(scheduler != null){
            scheduler.reSchedule(flow);
        }
        return flow;
    }

    private Map toMap(Flow flow){
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(flow, Map.class);
    }

    private Flow toFlow(Document doc){
        Flow flow = null;
        try{
            doc.put("@class",Flow.class.getTypeName());
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            objectMapper.registerSubtypes(FlowActivity.class);
            flow = objectMapper.convertValue(doc, Flow.class);
            flow.setFlowListenerService(this.flowListenerService);
        }catch(Exception e){

        }
        return flow;
    }

    public Flow getByName(String flowName) {
        BasicDBObject query = new BasicDBObject();
        query.put("name",flowName);
        MongoCollection<Document> collection = mongoRepository.getCreateCollection(this.appName,"flow");
        FindIterable<Document> result  = collection.find(query).limit(1);
        return toFlow(result.first());
    }


}
