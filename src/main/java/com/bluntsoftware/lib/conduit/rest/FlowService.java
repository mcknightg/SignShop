package com.bluntsoftware.lib.conduit.rest;

import com.bluntsoftware.lib.conduit.Scheduler;
import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.construct.flow.FlowActivity;
import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.repository.FlowRepository;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 */
@Controller("FlowService")
@RequestMapping(value = "/conduit/flow")
public class FlowService {

    private final FlowRepository flowRepository;

    private static String validString(String value, String defaultValue){
        if (isValidParameter(value)) {
            return value;
        }
        return defaultValue;
    }
    private static boolean isValidParameter(String param) {
        return param != null && !param.isEmpty() && !param.equalsIgnoreCase("_empty") && !param.equalsIgnoreCase("undefined") && !param.equalsIgnoreCase("null");
    }


    @Autowired
    public FlowService(FlowRepository flowRepository ) {
        this.flowRepository = flowRepository;

    }

    @RequestMapping(
            value = "{id}",
            method = { RequestMethod.GET,RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Flow getById(HttpServletRequest request, @PathVariable("id") String id) throws Exception {
        Flow flow =  flowRepository.getById(id);
        return flow;
    }

    @RequestMapping(
            value = "",
            method = { RequestMethod.GET},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object list(HttpServletRequest request) throws Exception {
        String filterByFields =  validString(request.getParameter("filterByFields"), "{}");
        String rows = validString(request.getParameter("rows"),"25");
        Object flowList =   flowRepository.findAll(filterByFields,rows);
        return flowList;
    }

    @RequestMapping(
            value = "",
            method = {RequestMethod.POST,RequestMethod.PUT},
            produces = "application/json",
            consumes = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Flow save(@RequestBody Map<String,Object> object) throws Exception {

        Flow flow =  flowRepository.save(object);
        return flow;
    }

    @RequestMapping(
            value = "{id}/{flowActivityId}/src",
            method = { RequestMethod.GET,RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    List<FlowActivity> getSourceFlowActivities(@PathVariable("id") String id,@PathVariable("flowActivityId") String flowActivityId) throws Exception {
        return flowRepository.getById(id).getSourceFlowActivities(flowActivityId);
    }
    @RequestMapping(
            value = "{id}",
            method = {RequestMethod.DELETE},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Object delete(@PathVariable("id") String id) throws Exception{
        return flowRepository.remove(id);
    }



}
