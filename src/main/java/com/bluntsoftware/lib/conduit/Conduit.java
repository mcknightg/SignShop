package com.bluntsoftware.lib.conduit;

import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.construct.flow.FlowActivity;

import com.bluntsoftware.lib.conduit.construct.flow.JsonPath;
import com.bluntsoftware.lib.conduit.repository.ActivityRepository;
import com.bluntsoftware.lib.conduit.repository.FlowRepository;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 */
@Controller("ConduitService")
@RequestMapping(value = "/conduit/rest/{flowName}")
public class Conduit {

    private final ActivityRepository activityRepository;
    private final FlowRepository flowRepository;
    private final FlowListenerService flowListenerService;

    @Autowired
    public Conduit(ActivityRepository activityRepository, FlowRepository flowRepository, FlowListenerService flowListenerService) {
        this.activityRepository = activityRepository;
        this.flowRepository = flowRepository;
        this.flowListenerService = flowListenerService;
    }

    private Flow getOrCreateInputFlow(String flowName, Activity activity, Integer x, Integer y,Map<String,Object> input) throws Exception {
        Flow flow = flowRepository.getByName(flowName);
        if(flow == null){
            flow = new Flow(flowName);
            flow.setFlowListenerService(flowListenerService);
        }
        String classname = activity.getClass().getName();
        FlowActivity flowActivity = flow.getFirstByClassName(classname);
        if(!flow.getLocked()){
            if(flowActivity == null){
                flowActivity = flow.createFlowActivity(activity);
                flowActivity.setX(x);
                flowActivity.setY(y);
            }
            flowActivity.getInput().putAll(input);
            flowActivity.getOutput().putAll(input);
        }
        flowRepository.save(flow);
        return flow;
    }


    //Post (Save-Update)
    @RequestMapping(
            value = "",
            method = { RequestMethod.PUT ,RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object post(@PathVariable("flowName") String flowName,@RequestBody  Map<String,Object> object) throws Exception {
        Activity activity = activityRepository.getByKlass("com.bluntsoftware.lib.conduit.activities.input.PostActivity");
        Map<String,Object> in = getInput(flowName);
        in.put("payload",transform(object));
        Flow flow = getOrCreateInputFlow(flowName,activity,50,70,in);
        return response(run(flow,activity,in)) ;
    }

    Map<String,Object> transform(Map<String,Object> data){
        Map<String,Object> ret = new HashMap<>();
        for(String key:data.keySet()){
            Object value = data.get(key);
            JsonPath.createValue(ret,key,value);
        }
        return ret;
    }
    //Get (List All)
    @RequestMapping(
            value = "",
            method = { RequestMethod.GET},
            produces = {"application/json","application/xml","text/html"})
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object list(HttpServletRequest request, @PathVariable("flowName") String flowName) throws Exception {

        if(flowName.equalsIgnoreCase("api")){
            return "";
        }
        Activity activity = activityRepository.getByKlass("com.bluntsoftware.lib.conduit.activities.input.GetActivity");

        Map<String,Object> in = getInput(flowName);
        Map<String,Object> payload = new HashMap<>();
        for(String key:request.getParameterMap().keySet()){
            payload.put(key,request.getParameter(key));
        }
        in.put("payload",payload);
        Flow flow = getOrCreateInputFlow(flowName,activity,50,140,in);

        return response(run(flow,activity,in)) ;

    }

    //Get (Get by id find one)
    @RequestMapping(
            value = "{id}",
            method = { RequestMethod.GET},
            produces = {"application/json","application/xml","text/html"})
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object get(HttpServletRequest request,@PathVariable("flowName") String flowName,@PathVariable("id") String id) throws Exception {
        Activity activity = activityRepository.getByKlass("com.bluntsoftware.lib.conduit.activities.input.GetByIdActivity");

        Map<String,Object> in = getInput(flowName);
        Map<String,Object> payload = new HashMap<>();
        payload.put("id",id);
        for(String key:request.getParameterMap().keySet()){
            payload.put(key,request.getParameter(key));
        }
        in.put("payload",payload);
        Flow flow = getOrCreateInputFlow(flowName,activity,50,210,in);
        return response(run(flow,activity,in)) ;

    }
    //Delete By ID (Remove one)
    @RequestMapping(
            value = "{id}",
            method = { RequestMethod.DELETE},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object remove(HttpServletRequest request,@PathVariable("flowName") String flowName,@PathVariable("id") String id) throws Exception {
        Activity activity = activityRepository.getByKlass("com.bluntsoftware.lib.conduit.activities.input.DeleteActivity");
        Map<String,Object> in = getInput(flowName);
        Map<String,Object> payload = new HashMap<>();
        payload.put("id",id);
        in.put("payload",payload);
        Flow flow = getOrCreateInputFlow(flowName,activity,50,280,in);
        return response(run(flow,activity,in)) ;
    }
    Map<String,Object> getInput(String flowname){
        Date requested = new Date();
        Map<String,Object> in = new HashMap<>();
        in.put("flow",flowname);
        in.put("requested",requested.toString());
        return in;
    }
    private Object response(List<FlowActivity> out ){
        for(FlowActivity flowActivity:out){
            if(flowActivity.getActivityClass().equalsIgnoreCase("com.bluntsoftware.lib.conduit.activities.output.HttpResponseActivity")){
                Map<String,Object> in = flowActivity.getInput();
                return in.get("data");
            }
        }
        return out;
    }

    private List<FlowActivity> run(Flow flow, Activity activity, Map<String, Object> input){
        return flow.runWithActivityClass(activity.getActivityClass(),input);
    }

}
