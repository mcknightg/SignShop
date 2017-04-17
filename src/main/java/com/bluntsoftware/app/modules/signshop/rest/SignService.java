package com.bluntsoftware.app.modules.signshop.rest;



import com.bluntsoftware.lib.jpa.repository.GenericRepository;
import com.bluntsoftware.app.modules.signshop.domain.Sign;
import com.bluntsoftware.app.modules.signshop.repository.SignRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
@Controller("signshopSignService")
@RequestMapping(value = "/signshop/sign")
@Transactional
@Qualifier("signshop")

public class SignService extends CustomService<Sign,Integer, SignRepository> {


}
