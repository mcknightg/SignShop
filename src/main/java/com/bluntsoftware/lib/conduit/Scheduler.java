package com.bluntsoftware.lib.conduit;

import com.bluntsoftware.lib.conduit.activities.input.HotFolderActivity;
import com.bluntsoftware.lib.conduit.activities.input.TimerActivity;
import com.bluntsoftware.lib.conduit.construct.flow.Flow;
import com.bluntsoftware.lib.conduit.construct.flow.FlowActivity;
import com.bluntsoftware.lib.conduit.repository.FlowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

/**
 * Created by Alex Mcknight on 2/17/2017.
 * 
 */
@Controller("SchedulerService")
public class Scheduler {
    private final PlatformTransactionManager txManager;
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final FlowRepository flowRepository;
    //Scheduler
    private Map<String,ScheduledFuture> scheduledFutureHashMap = new HashMap<>();
    @Autowired
    public Scheduler(@Qualifier("transactionManager") PlatformTransactionManager txManager, ThreadPoolTaskScheduler threadPoolTaskScheduler, FlowRepository flowRepository) {
        this.txManager = txManager;
        this.threadPoolTaskScheduler = threadPoolTaskScheduler;
        this.flowRepository = flowRepository;
        flowRepository.setScheduler(this);
    }

    @PostConstruct
    void startTimers(){
        TransactionTemplate transactionTemplate = new TransactionTemplate(txManager);
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                for(Flow flow:flowRepository.list()){
                    List<FlowActivity> timerActivityList = flow.listByClass(TimerActivity.class.getTypeName());
                    for(FlowActivity timerActivity:timerActivityList){
                        schedule(flow,timerActivity);
                    }
                    List<FlowActivity> hotFolderActivityList = flow.listByClass(HotFolderActivity.class.getTypeName());
                    for(FlowActivity hotFolderActivity:hotFolderActivityList){
                        schedule(flow,hotFolderActivity);
                    }
                }
            }
        });
    }
    void stopTimers(){
        threadPoolTaskScheduler.shutdown();
    }
    private ScheduledFuture schedule(final Flow flow,final FlowActivity activity){
        TimerActivity timerActivity = (TimerActivity)activity.getActivity();
        String cron = timerActivity.getCronExpression(activity.getInput());
        return threadPoolTaskScheduler.schedule(
                new FlowActivityRunner(flow,activity),
                new CronTrigger(cron)
        );
    }
    public void reSchedule( Flow flow){
        List<FlowActivity> timerActivityList = flow.listByClass(TimerActivity.class.getTypeName());
        for(FlowActivity timerActivity:timerActivityList){
            reSchedule(flow,timerActivity);
        }
        List<FlowActivity> hotFolderActivityList = flow.listByClass(HotFolderActivity.class.getTypeName());
        for(FlowActivity hotFolderActivity:hotFolderActivityList){
            reSchedule(flow,hotFolderActivity);
        }
    }
    private void reSchedule(final Flow flow,final FlowActivity timerActivity){
        cancel(timerActivity);
        scheduledFutureHashMap.put(timerActivity.getId(),schedule(flow,timerActivity));
    }
    private void cancel(final FlowActivity timerActivity){
        ScheduledFuture future = scheduledFutureHashMap.get(timerActivity.getId());
        if(future != null){
            future.cancel(false);
        }
    }
    class FlowActivityRunner implements Runnable{
        private FlowActivity flowActivity;
        private Flow flow;
        FlowActivityRunner(Flow flow, FlowActivity flowActivity){
            this.flow = flow;
            this.flowActivity = flowActivity;
        }
        @Override
        public void run() {
            if(flowActivity.shouldRun()){
                flow.run(flowActivity);
            }
        }
    }
}
