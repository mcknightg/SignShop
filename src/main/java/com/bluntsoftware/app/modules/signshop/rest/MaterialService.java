package com.bluntsoftware.app.modules.signshop.rest;



import com.bluntsoftware.lib.jpa.repository.GenericRepository;
import com.bluntsoftware.app.modules.signshop.domain.Material;
import com.bluntsoftware.app.modules.signshop.repository.MaterialRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
@Controller("signshopMaterialService")
@RequestMapping(value = "/signshop/material")
@Transactional
@Qualifier("signshop")

public class MaterialService extends CustomService<Material,Integer, MaterialRepository> {


}
