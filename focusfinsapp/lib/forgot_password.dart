import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

class ForgotPasswordPage extends StatefulWidget
{
  const ForgotPasswordPage({super.key});
  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  String error = '';


  void switchToLoginPage()
  {
    Navigator.pop(context, true);
  }

  void submitForgotPassword() async
  {
    Map<String, dynamic> reqBody = {'email' : emailController.text};
    API res = await callServer(reqBody, '/api/resetPassword');
    if(res.statuscode != 200)
    {
      if(res.body.containsKey('error'))
      {
        error = res.body['error'];
      }
      return;
    }
    setState(() {
      error = 'Check Your Email';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold
    (
      body: Center(
        child: Column
        (
          mainAxisAlignment: MainAxisAlignment.center,
          children: 
          [
            TextBox(controller: emailController, label: 'Email'),
            ElevatedButton(onPressed: submitForgotPassword, child: const Text('Forgot Password')),
            ElevatedButton(onPressed: switchToLoginPage, child: const Text('Back To Login')),
            Text(error),
          ],
        ),
      ),
    );
  }
}