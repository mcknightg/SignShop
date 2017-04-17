package com.bluntsoftware.lib.conduit.construct.flow;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/12/2017.
 *
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class Connection {

    private String src;
    private String tgt;
    public Connection(FlowActivity lhs, FlowActivity rhs) {
           this.src = lhs.getId();
           this.tgt = rhs.getId();
    }
    public Connection(){

    }


    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public String getTgt() {
        return tgt;
    }

    public void setTgt(String tgt) {
        this.tgt = tgt;
    }


    @Override
    public String toString() {
        return "Connection{" +
                "src='" + src + '\'' +
                ", tgt='" + tgt + '\'' +
                '}';
    }
}
