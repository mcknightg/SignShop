package com.bluntsoftware.lib.conduit;

import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.construct.flow.FlowListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Alex Mcknight on 2/18/2017.
 */
@Controller("FlowListenerService")
public class FlowListenerService {
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    public FlowListenerService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;

        try {
            this.subscribe();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private List<FlowListener> listeners = new ArrayList<>();

    public void addListener(FlowListener listener){
        listeners.add(listener);
    }

    public List<FlowListener> getListeners() {
        return listeners;
    }

    public void setListeners(List<FlowListener> listeners) {
        this.listeners = listeners;
    }


    public void subscribe() throws Exception {

         this.addListener(new FlowListener() {
            @Override
            public void afterRun(Flow flow) {
                try {
                    if(messagingTemplate != null){
                        messagingTemplate.convertAndSend("/conduit/subscribe",flow);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

}
