package com.bluntsoftware.lib.properties;


import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

/**
 * Created by Alex Mcknight on 12/16/2016.
 */
@Controller("PropertyService")
@RequestMapping(value = "/properties")
public class PropertyService {


    private String applicationName;

    @RequestMapping(
            value = "",
            method = {RequestMethod.POST},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Map<String, String> saveAppProperties(HttpServletRequest request, @RequestBody Map<String,Object> object) throws IOException {
        Properties prop = getAppProperties();
        for(String key:object.keySet()){
            Object value = object.get(key);
            if(value != null && !key.startsWith("$")){
                prop.setProperty(key,value.toString());
            }
        }
        OutputStream output = null;
        try {
            File propsFile =  getAppPropertiesFile();
            if(!propsFile.exists()){
                propsFile.mkdirs();
                propsFile.createNewFile();
            }
            output = new FileOutputStream(propsFile);
            prop.store(output, null);
        } catch (IOException io) {
            io.printStackTrace();
        } finally {
            if (output != null) {
                try {
                    output.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
        return new TreeMap(prop);
    }

    @RequestMapping(
            value = "",
            method = {RequestMethod.GET},
            produces = "application/json")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    Map<String, String> get() throws IOException {
        return new TreeMap(getAppProperties());
    }

    Properties getAppProperties() throws IOException {

        File propFile = getActiveAppPropertiesFile();
        Properties prop = new Properties();
        InputStream input = null;
        try {
            input = new FileInputStream(propFile);
            prop.load(input);
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return prop;
     }
    private File getActiveAppPropertiesFile() throws IOException {
        String propFileName = "app.properties";
        File propFile = getAppPropertiesFile();
        if(!propFile.exists()){
            Resource rsrc = new ClassPathResource(propFileName);
            propFile =  rsrc.getFile();
        }
        return propFile;
    }
    private File getAppPropertiesFile() throws IOException {
        String propFileName = "app.properties";
        File appPropertiesFolder = new File(System.getProperty("java.io.tmpdir"),getApplicationName());
        File propFile = new File(appPropertiesFolder,propFileName);
        return propFile;
    }
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getApplicationName() {
        return applicationName;
    }
}
