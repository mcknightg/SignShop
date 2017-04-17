package com.bluntsoftware.lib.conduit.activities.conduit;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Alex Mcknight on 1/17/2017.
 *
 */
@Service
public class CalculateActivity extends ActivityImpl {

    private final static String LHS = "lhs";
    private final static String OPERATOR = "operator";
    private final static String RHS = "rhs";
    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema("Calculator");
        List<String> operator = new ArrayList<String>();
        operator.add("+");
        operator.add("-");
        operator.add("*");
        operator.add("/");
        operator.add("%");

        schema.addString(LHS,"2","");
        schema.addEnum(OPERATOR,operator ,"*");
        schema.addString(RHS,"5","");
        return schema;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {

        Double lhs = Double.parseDouble( input.get(LHS).toString());
        Double rhs = Double.parseDouble( input.get(RHS).toString());
        Double result = 0.0;
        String operator = input.get(OPERATOR).toString();
        switch(operator.charAt(0)){
            case '-': result = lhs - rhs;break;
            case '*': result = lhs * rhs;break;
            case '/': result = lhs / rhs;break;
            case '%': result = lhs % rhs;break;
            default: result = lhs + rhs;
        }
        Map<String, Object> ret = new HashMap<>();
        ret.put("afterRun",result);
        return ret;
    }

    @Override
    public String getIcon() {
        return "fa-calculator";
    }

    public static void main(String[] args) {
        CalculateActivity activity = new CalculateActivity();
        System.out.println(activity.getOutput());
    }
}
