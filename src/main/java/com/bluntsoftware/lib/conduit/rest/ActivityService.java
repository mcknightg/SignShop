package com.bluntsoftware.lib.conduit.rest;

import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.repository.ActivityRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


/**
 * Created by Alex Mcknight on 1/4/2017.
 */
@Controller("ActivityService")
@RequestMapping(value = "/conduit/activity")
public class ActivityService {
    private final
    ActivityRepository activityRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @RequestMapping(
            value = "{id}",
            method = { RequestMethod.GET,RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Activity getById(HttpServletRequest request, @PathVariable("id") String id) throws Exception {
        return activityRepository.getByKlass(id);
    }

    @RequestMapping(
            value = "",
            method = { RequestMethod.GET},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Object list(HttpServletRequest request) throws Exception {
        Object ret =   activityRepository.list();

        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = mapper.writeValueAsString(ret);

        return ret;
    }

    @RequestMapping(
            value = "{id}/run",
            method = {RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Map<String,Object> runFlowActivity(@PathVariable("id") String id, @RequestBody Map<String,Object> object){
        ActivityImpl activity = (ActivityImpl)activityRepository.getByKlass(id);
        return activity.run(object);
    }
}
