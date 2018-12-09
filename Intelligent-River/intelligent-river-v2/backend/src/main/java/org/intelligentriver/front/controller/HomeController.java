package org.intelligentriver.front.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HomeController extends BaseController {

    // TODO: replace this by the main website later before deploying.

    @RequestMapping("/")
    public RedirectView index() {
        String redirectUrl = "http://localhost:" + mEnvironment.getProperty("frontend.port");
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(redirectUrl);
        return redirectView;
    }
}
