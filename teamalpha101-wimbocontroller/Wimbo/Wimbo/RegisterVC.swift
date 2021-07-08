//
//  RegisterVC.swift
//  Wimbo
//
//  Created by Jamie Andrews on 11/3/19.
//  Copyright © 2019 com.teamalpha. All rights reserved.
//

import UIKit

class RegisterVC: UIViewController {

    @IBOutlet weak var createFirstName: UITextField!
    
    @IBOutlet weak var createLastName: UITextField!
    
    @IBOutlet weak var createEmailAddress: UITextField!
    
    @IBOutlet weak var createPassword: UITextField!
    
    @IBOutlet weak var retypePassword: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.setHidesBackButton(true, animated: false)
        // Do any additional setup after loading the view.
    }
    
    @IBAction func cancelRegistration(_ sender: Any) {
        self.navigationController?.popViewController(animated: true)
    }
    
    @IBAction func createAccount(_ sender: Any) {
        //validate that required fields are not empty or left blank
        if(createFirstName.text?.isEmpty)! || (createLastName.text?.isEmpty)! || (createEmailAddress.text?.isEmpty)! || (createPassword.text?.isEmpty)!{
            //if it is blank, display the alert message and return
            displayMessage(userMessage: "All fields are required to fill in!")
            return
        }
        if ((createPassword.text?.elementsEqual(retypePassword.text!))! != true){
            //Display alert message and return
            displayMessage(userMessage: "Please make sure that the password matches!")
            return
        }
        
        if self.signup() == true{
            let homeVc = self.storyboard?.instantiateViewController(withIdentifier: "HomeVC") as! HomeVC
            self.navigationController?.pushViewController(homeVc, animated: true)
        }
    }
    
    func signup() -> Bool {
        if let username = UserDefaults.standard.object(forKey: "userName") {
            if (username as? String != nil){
                if (username as! String == createEmailAddress.text!){
                    self.displayMessage(userMessage: "UserName already exist!")
                    return false
                }
            }
        }
        UserDefaults.standard.set(createEmailAddress.text!, forKey: "userName")
        UserDefaults.standard.set(createFirstName.text!, forKey: "firstName")
        UserDefaults.standard.set(createLastName.text!, forKey: "lastName")
        UserDefaults.standard.set(createPassword.text!, forKey: "userPassword")
        return true
    }
    
    func removeActivityIndicator(activityIndicator: UIActivityIndicatorView){
        DispatchQueue.main.async {
            activityIndicator.stopAnimating()
            activityIndicator.removeFromSuperview()
        }
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

    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */


