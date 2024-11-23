import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';


class MyLogin extends StatefulWidget 
{
  const MyLogin({super.key});
  @override
  State<MyLogin> createState() => _MyLoginState();
}

class _MyLoginState extends State<MyLogin>
{
  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  String errorMessage = '';
  String passwordError = '';

  @override
  void dispose()
  {
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void switchToRegisterPage()
  {
    Navigator.pushNamed(context, '/Register');
  }

  void switchToTimerPage()
  {
    Navigator.pushNamed(context, '/Home');
  }

  void switchToForgotPasswordPage()
  {
    Navigator.pushNamed(context, '/ForgotPassword');
  }

  void submitLogin() async
  {
    final username = usernameController.text;
    final password = passwordController.text;

    Map<String, dynamic> reqBody =  <String, String>
    {
      'username': username,
      'password' : password,
    };
    API result = await callServer(reqBody, '/api/login');
    setState(() {
      if(result.statuscode == -1) 
      {
        errorMessage = 'Could Not Send Request';
        return; // Could Not Connect to Server? 
      } 
      if(result.statuscode != 200)
      {
        if(result.body['error'] != null) 
          {errorMessage = result.body['error'];}
        return;
      }
      errorMessage = '';
      userUsername = username;
      userId = result.body['id'];
      userFirstName = result.body['firstName'];
      userLastName = result.body['lastName'];
      jwt = result.body['token'];
      getBubbles();
      switchToTimerPage();
      return;
    });
  }

  @override
  build(BuildContext context)
  {
    return Scaffold
    (
      body:
      Center(
        child: Card
        (
          child: Column
          (
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: 
            [
              const Text
              (
                textScaler: TextScaler.linear(3),
                'Login'
              ),
              Text(errorMessage),
              TextBox(controller: usernameController, label: 'Username',),
              PasswordTextBox(controller: passwordController, label: 'Password', passwordChanged: () {},),
              ElevatedButton(onPressed: submitLogin, child: const Text('Submit')),
              ElevatedButton(onPressed: switchToForgotPasswordPage, child: const Text('Forgot Password?')),
              ElevatedButton(onPressed: switchToRegisterPage, child: const Text('New to FocusFins?')),
            ],
          ),
        ),
      ),   
    );
  }
}