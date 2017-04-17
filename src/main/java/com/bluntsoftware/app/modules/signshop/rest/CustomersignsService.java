package com.bluntsoftware.app.modules.signshop.rest;



import com.bluntsoftware.lib.jpa.repository.GenericRepository;
import com.bluntsoftware.app.modules.signshop.domain.Customersigns;
import com.bluntsoftware.app.modules.signshop.repository.CustomersignsRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
@Controller("signshopCustomersignsService")
@RequestMapping(value = "/signshop/customersigns")
@Transactional
@Qualifier("signshop")

public class CustomersignsService extends CustomService<Customersigns,Integer, CustomersignsRepository> {


}
