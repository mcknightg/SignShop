package com.bluntsoftware.lib.conduit.construct.flow;

import com.bluntsoftware.lib.conduit.FlowListenerService;
import com.bluntsoftware.lib.conduit.activities.input.InputActivity;
import com.bluntsoftware.lib.conduit.construct.Activity;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 *
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class Flow {
    private List<FlowActivity> activities;
    private List<Connection> connections;
    private List<ConnectionMap> connectionMaps;
    private String _id;
    private String name;
    private Boolean locked = false;
    @JsonIgnore
    private FlowListenerService flowListenerService = null;
    
 
    public Flow() {
        connections = new ArrayList<>();
        activities = new ArrayList<>();
        connectionMaps = new ArrayList<>();
    }
    public List<ConnectionMap> getConnectionMaps() {
        return connectionMaps;
    }

    public void setConnectionMaps(List<ConnectionMap> connectionMaps) {
        this.connectionMaps = connectionMaps;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public List<Connection> getConnections() {
        return connections;
    }

    public void setConnections(List<Connection> connections) {
        this.connections = connections;
    }

    public List<FlowActivity> getActivities() {
        return activities;
    }

    public void setActivities(List<FlowActivity> activities) {
        this.activities = activities;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }


    @JsonIgnore
    private FlowListenerService getFlowListenerService() {
        return flowListenerService;
    }

    public void setFlowListenerService(FlowListenerService flowListenerService) {
        this.flowListenerService = flowListenerService;
    }
  
    public Flow(String name) {
        this();
        setName(name);
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    @JsonIgnore
    public FlowActivity getFirstByClassName(String activityClass){
        List<FlowActivity> flowActivities = listByClass(activityClass);
        if(flowActivities.size() > 0){
            return flowActivities.get(0);
        }
        return null;
    }

    public List<FlowActivity> listByClass(String activityClass){
        List<FlowActivity> ret = new ArrayList<>();
        for(FlowActivity flowActivity:activities){
            String flowActivityClass = flowActivity.getActivityClass();
             if(flowActivityClass != null && flowActivityClass.equalsIgnoreCase(activityClass)){
                  ret.add(flowActivity);
             }
         }
        return ret;
    }

    public FlowActivity createFlowActivityByClass(String activityClassName){
        return createFlowActivity(ActivityImpl.list().get(activityClassName));
    }

    public FlowActivity createFlowActivity(Activity activity){
        FlowActivity flowActivity = new FlowActivity();
        flowActivity.setIcon(activity.getIcon());
        flowActivity.setInput(activity.getInput());
        flowActivity.setCategory(activity.getCategory());
        flowActivity.setName(activity.getName());
        flowActivity.setOutput(activity.getOutput());
        flowActivity.setActivityClass(activity.getActivityClass());
        flowActivity.setId(UUID.randomUUID().toString());
        activities.add(flowActivity);
        return flowActivity;
    }



    @Override
    public boolean equals(Object object) {
        return object != null && object instanceof Flow && this._id.equalsIgnoreCase(((Flow) object)._id);
    }

    public List<FlowActivity> run(FlowActivity flowActivity) {
        List<FlowActivity> flowActivities = new ArrayList<>();
        run(flowActivity,flowActivities);
        if(getFlowListenerService() != null){
            for(FlowListener listener:getFlowListenerService().getListeners()){
                    Flow flow = new Flow(this.getName());

                    for(FlowActivity tFlowActivity:this.getActivities()){
                         if(!flowActivities.contains(tFlowActivity)){
                             flowActivities.add(tFlowActivity);
                         }
                    }
                    flow.setActivities(flowActivities);
                    flow.setConnectionMaps(this.getConnectionMaps());
                    flow.setConnections(this.getConnections());
                    listener.afterRun(flow);
            }
        }
        return flowActivities;
    }

    public List<FlowActivity> runWithInput(Map<String,Object> input) {
        return runWithActivityClass(InputActivity.class.getName(),input);
    }
    public List<FlowActivity> runWithActivityClass(String activityClassName, Map<String,Object> input) {
        return runWithActivityId(getFirstByClassName(activityClassName).getId(),input);
    }
    private List<FlowActivity> runWithActivityId(String flowActivityId, Map<String, Object> input) {
        return runWithActivity(getFlowActivityByID(flowActivityId),input);
    }
    private List<FlowActivity> runWithActivity(FlowActivity flowActivity, Map<String, Object> input) {
        flowActivity.setInput(input);
        return run(flowActivity);
    }



    private void run(FlowActivity flowActivity,List<FlowActivity> flowActivities ) {
        if(flowActivity != null && flowActivity.getId() != null){
            mapFields(flowActivity,flowActivities);
            flowActivity.run();
            flowActivities.add(flowActivity);
        }
        getTargetFlowActivities(flowActivity).forEach(t-> run(t,flowActivities));
    }


    private void mapFields(FlowActivity tgtFlowActivity,List<FlowActivity> flowActivities ){
        Map<String,Object> tgt = tgtFlowActivity.getInput();
        if(tgt != null){
            getActivityConnectionMaps(tgtFlowActivity).forEach(m->{
                String srcId = m.getSourcePath().getFlowActivityId();
                FlowActivity srcFlowActivity = flowActivities.stream()
                        .filter(f->f.getId().equalsIgnoreCase(srcId))
                        .findAny().orElseGet(null);
                if(srcFlowActivity != null){
                    Map<String,Object> src = srcFlowActivity.getOutput();
                    if(src != null){
                        if(m.getSourcePath().getFieldType() == ConnectionPath.FieldType.input){
                            src = srcFlowActivity.getInput();
                        }
                        JsonPath srcJson = new JsonPath(src);
                        JsonPath tgtJson = new JsonPath(tgt);
                        String key = m.getSourcePath().getPath();
                        Object val = srcJson.getValue(key);
                        tgtJson.setValue(m.getTargetPath().getPath(),val);
                    }
                }
            });
        }
    }

    private List<ConnectionMap> getActivityConnectionMaps(FlowActivity flowActivity){
      return  connectionMaps.stream()
                .filter(c->c.getTargetPath().getFlowActivityId().equalsIgnoreCase(flowActivity.getId()))
                .collect(Collectors.toList());
    }

    private FlowActivity getFlowActivityByID(String flowActivityId){
        return activities.stream()
                .filter(f->f.getId().equalsIgnoreCase(flowActivityId))
                .findAny().orElseGet(null);
    }
    @JsonIgnore
    public List<FlowActivity> getSourceFlowActivities(String flowActivityId ){
        return getSourceFlowActivities(getFlowActivityByID(flowActivityId));
    }

    private List<FlowActivity> getSourceFlowActivities(FlowActivity flowActivity){
        List<FlowActivity> ret =  new ArrayList<>();
        getSourceFlowActivities(flowActivity,ret);
        return ret;
    }

    private void getSourceFlowActivities(FlowActivity flowActivity, List<FlowActivity> ret){
        connections.stream()
                .filter(c->c.getTgt().equalsIgnoreCase(flowActivity.getId()))
                .forEach(c->{
                    FlowActivity fa = getFlowActivityByID(c.getSrc());
                    if(fa != null){
                        getSourceFlowActivities(fa,ret);
                        ret.add(fa);
                    }
                });
    }

    private List<FlowActivity> getTargetFlowActivities(FlowActivity flowActivity) {
        List<FlowActivity> ret =  new ArrayList<>();
        connections.stream()
                .filter(c->c.getSrc().equalsIgnoreCase(flowActivity.getId()))
                .forEach(c->{
                    FlowActivity fa = getFlowActivityByID(c.getTgt());
                    if(fa != null){ret.add(fa);}
                });
        return ret;
    }

    public Connection connect(FlowActivity lhs,FlowActivity rhs){
        return addConnection(new Connection(lhs,rhs));
    }
    private Connection addConnection(Connection connection){
        connections.add(connection);
        return connection;
    }


    public void map(FlowActivity srcFlowActivity, String src, FlowActivity tgtFlowActivity, String tgt) {
        String srcPath = "['" + srcFlowActivity.getId() + "']['output']" + "['" + src.replace(".","']['" + "']");
        String tgtPath = "['" + tgtFlowActivity.getId() + "']['input']" + "['" + tgt.replace(".","']['" + "']");
        getConnectionMaps().add(new ConnectionMap(srcPath,tgtPath));
    }

    @Override
    public String toString() {
        return "Flow{" +
                "activities=" + activities +
                ", connections=" + connections +
                ", connectionMaps=" + connectionMaps +
                ", _id='" + _id + '\'' +
                ", name='" + name + '\'' +
                ", locked=" + locked +
                '}';
    }
}
