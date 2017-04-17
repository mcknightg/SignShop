package com.bluntsoftware.lib.conduit.activities.conduit;

import com.bluntsoftware.lib.conduit.construct.impl.ActivityImpl;
import com.bluntsoftware.lib.conduit.json_editor.JsonSchema;
import org.apache.commons.lang.CharEncoding;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import javax.mail.internet.MimeMessage;

import java.util.Map;

/**
 * Created by Alex Mcknight on 2/13/2017.
 *
 */
@Service
public class MailActivity extends ActivityImpl {
    private final JavaMailSenderImpl javaMailSender;
    
    private final static String to = "to";
    private final static String from = "from";
    private final static String subject = "subject";
    private final static String isHtml = "isHtml";
    private final static String content = "content";
    private final static String isMultipart = "isMultipart";

    @Autowired
    public MailActivity(JavaMailSenderImpl javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public JsonSchema getSchema() {
        JsonSchema schema = new JsonSchema("Mail");
        schema.addString(to,"admin@bluntsoftware.com","");
        schema.addString(from,"admin@bluntsoftware.com","");
        schema.addString(subject,"Test Email","");
        schema.addString(isHtml,"false","");
        schema.addString(content,"Hello World","");
        schema.addString(isMultipart,"false","");
        return schema;
    }

    @Override
    public Map<String, Object> run(Map<String, Object> input) {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, Boolean.parseBoolean(input.get(isMultipart).toString()), CharEncoding.UTF_8);
            message.setTo(input.get(to).toString());
            message.setFrom(input.get(from).toString());
            message.setSubject(input.get(subject).toString());
            message.setText(input.get(content).toString(), Boolean.parseBoolean(input.get(isHtml).toString()));
            //  ByteArrayResource stream = new ByteArrayResource(content.getBytes());
            //  message.addAttachment("content.html", stream);

            javaMailSender.send(mimeMessage);

        } catch (Exception e) {

        }

        return null;
    }
    @Override
    public Map<String, Object> getOutput() {
        return null;
    }
    @Override
    public String getIcon() {
        return "fa-send";
    }

    public static void main(String[] args) {
        //MailActivity activity = new MailActivity();
       // System.out.println(activity.getOutput());
    }
}
