//
//  ViewController.swift
//  Wimbo
//
//  Created by Jamie Andrews on 11/3/19.
//  Copyright © 2019 com.teamalpha. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var txtUserName: UITextField!
    
    @IBOutlet weak var txtPassword: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        if UserDefaults.standard.bool(forKey: "ISUSERLOGGEDIN") == true{
            //the user is already logged in, just get them to navigate the home screen
            let homeVc = self.storyboard?.instantiateViewController(withIdentifier: "HomeVC") as! HomeVC
            self.navigationController?.pushViewController(homeVc, animated: false)
        }
    }

    @IBAction func authenticateUser(_ sender: Any) {
        
        //If credentials are correct, then user should be able to login
        if txtUserName.text == UserDefaults.standard.object(forKey: "userName") as? String && txtPassword.text == UserDefaults.standard.object(forKey: "userPassword") as? String {
            UserDefaults.standard.set(true, forKey: "ISUSERLOGGEDIN")
            let homeVc = self.storyboard?.instantiateViewController(withIdentifier: "HomeVC") as! HomeVC
            self.navigationController?.pushViewController(homeVc, animated: true)
        }
        else{
            UserDefaults.standard.set(false, forKey: "ISUSERLOGGEDIN")
            self.displayMessage(userMessage: "your credentials do not exist!")

        }
        
        
    }
    
    @IBAction func registerUser(_ sender: Any) {
        //if user clicks the sign up button, it should navigate them to the registration page
        let registerVc = self.storyboard?.instantiateViewController(withIdentifier: "RegisterVC") as! RegisterVC
        self.navigationController?.pushViewController(registerVc, animated: true)
    }
    
    func displayMessage(userMessage:String) -> Void {
        DispatchQueue.main.async{
            let alertController = UIAlertController(title: "Alert", message: userMessage, preferredStyle: .alert)
            let OKAction = UIAlertAction(title: "OK", style: .default){
                (action:UIAlertAction!) in
                //Code in this block will then trigger when the user presses OK
                print("OK button tapped")
                DispatchQueue.main.async{
                    self.dismiss(animated: true, completion: nil)
                }
            }
            alertController.addAction(OKAction)
            self.present(alertController, animated: true, completion: nil)
        }
    }
    
}

