package com.bluntsoftware.lib.conduit.activities.input;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import org.springframework.stereotype.Service;

/**
 * Created by Alex Mcknight on 1/12/2017.
 */
@Service
public class DeleteActivity extends InputActivity {

    @Override
    public String getIcon() {
        return "fa-remove";
    }

}
