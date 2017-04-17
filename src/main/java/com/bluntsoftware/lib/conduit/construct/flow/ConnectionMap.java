package com.bluntsoftware.lib.conduit.construct.flow;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeInfo;



/**
 * Created by Alex Mcknight on 2/9/2017.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class ConnectionMap {

    private String src;
    private String tgt;

    public ConnectionMap() {
    }

    public ConnectionMap(String src, String tgt) {
        this.src = src;
        this.tgt = tgt;
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
    @JsonIgnore
    public ConnectionPath getTargetPath(){
        return new ConnectionPath(this.getTgt());
    }
    @JsonIgnore
    public ConnectionPath getSourcePath(){
        return new ConnectionPath(this.getSrc());
    }

}
