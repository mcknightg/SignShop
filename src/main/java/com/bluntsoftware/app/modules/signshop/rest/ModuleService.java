package com.bluntsoftware.app.modules.signshop.rest;

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
@Controller("signshop")
@RequestMapping(value = "/signshop")
public class ModuleService {
    //get api
    @RequestMapping(value = "api")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> getApi(HttpServletRequest request){
        return ModuleControllerImpl.getEntities("signshop",request);
    }
}
