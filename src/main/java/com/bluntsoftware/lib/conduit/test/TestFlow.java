package com.bluntsoftware.lib.conduit.test;

import com.bluntsoftware.lib.conduit.FlowListenerService;
import com.bluntsoftware.lib.conduit.activities.db.SQLActivity;
import com.bluntsoftware.lib.conduit.activities.input.InputActivity;
import com.bluntsoftware.lib.conduit.construct.flow.ConnectionMap;
import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.construct.flow.FlowActivity;
import com.bluntsoftware.lib.conduit.construct.flow.FlowListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 2/6/2017.
 *
 */
public class TestFlow {
    public static void main(String[] args) {
        Map<String,Object> input = new HashMap<String,Object>();
        input.put("sql","select * from job");
        //run with an alternate input
        runSQLFlow(input);

    }

     private static  void runSQLFlow(Map<String,Object> input){
        Flow flow = new Flow();

        FlowListenerService listenerService = new FlowListenerService(null);
        listenerService.addListener(new FlowListener() {
            @Override
            public void afterRun(Flow flow) {
                System.out.println(flow);
            }
        });
        flow.setFlowListenerService(listenerService);
        //Create 2 flow activities
        FlowActivity inFlowActivity = flow.createFlowActivity(new InputActivity());
        FlowActivity sqlFlowActivity = flow.createFlowActivity(new SQLActivity());
        //Connect them
        flow.connect(inFlowActivity,sqlFlowActivity);
        //Map some fields
        flow.map(inFlowActivity,"sql",sqlFlowActivity,"sql");
        List<ConnectionMap> connectionMaps = flow.getConnectionMaps();
        flow.setConnectionMaps(connectionMaps);

        flow.runWithInput(input);
    }

}
