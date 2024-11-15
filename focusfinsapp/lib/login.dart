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
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
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
    Navigator.pushNamed(context, '/Timer');
  }

  // void passwordChanged()
  // {
  //   (bool, String) passwordCheck = isPassword(passwordController.text);
  //   setState(() {
  //     if(!passwordCheck.$1)
  //     {
  //       passwordError = passwordCheck.$2;
  //     }
  //     else 
  //     {
  //       passwordError = '';
  //     }
  //   });
  // }

  void submitLogin() async
  {
    final username = usernameController.text;
    final password = passwordController.text;

    // bool flag = false;
    // (bool, String) passwordCheck = isPassword(password);
    // setState(() {
    //   if(!passwordCheck.$1)
    //   {
    //     passwordError = passwordCheck.$2;
    //     flag = true;
    //   }
    //   else
    //   {
    //     passwordError = '';
    //   }
    // });
    // if(flag) return;

    final reqBody =  <String, String>
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
      errorMessage = 'Success';
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
        child: Container
        (
          constraints: const BoxConstraints
          (
            maxHeight: 550,
            minHeight: 100,
          ),
            child: 
            Card
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
                  TextBox(controller: usernameController, label: 'Username',),
                  PasswordTextBox(controller: passwordController, label: 'Password', passwordChanged: () {},),
                  ElevatedButton(onPressed: submitLogin, child: const Text('Submit')),
                  ElevatedButton(onPressed: switchToRegisterPage, child: const Text('New to FocusFins?')),
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