package org.intelligentriver.front.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BaseController {

    Logger mLogger = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    Environment mEnvironment;
}
