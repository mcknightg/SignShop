package com.bluntsoftware.lib.conduit.repository;

import com.bluntsoftware.lib.conduit.construct.Activity;
import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import org.springframework.stereotype.Repository;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/4/2017.
 *
 */
@Repository
public class ActivityRepository {
       ActivityRepository(){

       }

      public List<Activity> list(){
          List<Activity> ret = new ArrayList<>();
          Map<String,Activity> map = ActivityImpl.list();
          for(Activity activity :map.values()){
              ret.add(activity);
          }
          return ret;
      }

      public Activity getByKlass(String klass){
            return ActivityImpl.list().get(klass);
      }

}
