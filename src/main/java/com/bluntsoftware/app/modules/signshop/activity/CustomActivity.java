package com.bluntsoftware.app.modules.signshop.activity;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;

/**
* To Create a Custom activity extend this CustomActivity class and add the @Service
* annotation to the top of the newly custom activity class definition
*/
//@Service
abstract class CustomActivity extends ActivityImpl{
    @Override
    public String getCategory() {
        return "Custom Activities";
    }
}