package com.bluntsoftware.app.modules.user_manager.rest;

import com.bluntsoftware.lib.web.filter.module.ModuleControllerImpl;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/26/2017.
 */
@Controller("user_manager")
@RequestMapping(value = "/user_manager")
public class ModuleService {
    //get api
    @RequestMapping(value = "api")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> getApi(HttpServletRequest request){
        return ModuleControllerImpl.getEntities("user_manager",request);
    }
}
