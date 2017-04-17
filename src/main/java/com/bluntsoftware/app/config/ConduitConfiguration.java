package com.bluntsoftware.app.config;


import com.bluntsoftware.lib.conduit.repository.FlowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

/**
 * Created by Alex Mcknight on 1/4/2017.
 */
@Configuration
@ComponentScan({"com.bluntsoftware.lib.conduit","com.bluntsoftware.app.modules.conduit.activity"})
public class ConduitConfiguration implements EnvironmentAware {

 @Autowired
 private
 FlowRepository flowRepository;
 @Override
 public void setEnvironment(Environment environment) {
  String appName = environment.getProperty("app.name");
  if(appName != null && !appName.equalsIgnoreCase("")){
   flowRepository.setAppName(appName);
  }
 }
}
