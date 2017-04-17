package com.bluntsoftware.lib.conduit.activities.input;

import org.springframework.stereotype.Service;

/**
 * Created by Alex Mcknight on 1/12/2017.
 */
@Service
public class PostActivity extends InputActivity {
    @Override
    public String getIcon() {
        return "fa-mail-forward";
    }
}
