package com.bluntsoftware.lib.conduit.activities.input;

import org.springframework.stereotype.Service;

/**
 * Created by Alex Mcknight on 1/12/2017.
 */
@Service
public class FileUploadActivity extends InputActivity {

    @Override
    public String getIcon() {
        return "fa-upload";
    }

    @Override
    public String getName() {
        return "Upload";
    }
}
