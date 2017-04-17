package com.bluntsoftware.app.modules.signshop.rest;



import com.bluntsoftware.lib.jpa.repository.GenericRepository;
import com.bluntsoftware.app.modules.signshop.domain.Customer;
import com.bluntsoftware.app.modules.signshop.repository.CustomerRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
@Controller("signshopCustomerService")
@RequestMapping(value = "/signshop/customer")
@Transactional
@Qualifier("signshop")

public class CustomerService extends CustomService<Customer,Integer, CustomerRepository> {


}
