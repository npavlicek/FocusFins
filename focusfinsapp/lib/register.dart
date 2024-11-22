import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

class MyRegister extends StatefulWidget{
  @override
  const MyRegister({super.key});
  @override
  State<MyRegister> createState() => _MyRegisterState();
}

class _MyRegisterState extends State<MyRegister> 
{
  final emailController = TextEditingController();
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  String errorMessage = '';
  String passwordError = '';

  void switchToLoginPage()
  {
    Navigator.pop(context, true);
  }

  void passwordChanged()
  {
    (bool, String) passwordCheck = isPassword(passwordController.text);
    setState(() {
      if(!passwordCheck.$1)
      {
        passwordError = passwordCheck.$2;
      }
      else
      {
        passwordError = '';
      }
    });
  }

  void submitRegister() async
  {
    final email = emailController.text;
    final username = usernameController.text;
    final password = passwordController.text;
    final firstName = firstNameController.text;
    final lastName = lastNameController.text;

    bool flag = false;
    (bool, String) passwordCheck = isPassword(password);
    setState(() {
      if(!passwordCheck.$1) 
      {
        errorMessage = passwordCheck.$2;
        flag = true;
      }
      else
      {
        passwordError = '';
      }
    });

    if(flag) 
      {return;}

    final reqBody = <String, String>
    {
      'username' : username,
      'password' : password,
      'firstName' : firstName,
      'lastName' : lastName,
      'email' : email,
    };

    API result = await callServer(reqBody, '/api/register');
    setState(() {
      if(result.statuscode == -1) 
      {
        errorMessage = 'Could Not Send Request';
        return; 
      } 
      if(result.statuscode !=201)
      {
        if(result.body['error'] != null) 
          {errorMessage = result.body['error'];}
        return;
      }
      errorMessage = 'Success';
    });
    return;
  }

  @override
  Widget build (BuildContext context)
  {
    return Scaffold
    (
      body: Center(
        child: Container(
          constraints: const BoxConstraints
          (
            maxWidth: 300,
            minHeight: 400,
            maxHeight: 700,
          ),
          child: Card(
            child: Column
            (
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const Text
                (
                  textScaler: TextScaler.linear(2),
                  'Register an Account'
                ),
                TextBox(controller: emailController, label: 'Email',),
                TextBox(controller: usernameController, label: 'Username',),
                PasswordTextBox(controller: passwordController, label: 'Password', passwordChanged: passwordChanged,),
                TextBox(controller: firstNameController, label: 'First Name',),
                TextBox(controller: lastNameController, label: 'Last Name',),
                ElevatedButton(onPressed: submitRegister, style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(20)),  child: const Text('Register'),),
                ElevatedButton(onPressed: switchToLoginPage, style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(20),), child: const Text('Back to Login'),),
                Text(passwordError),
                Text(errorMessage),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
