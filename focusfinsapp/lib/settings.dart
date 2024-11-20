import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';


class MySettings extends StatefulWidget
{
  const MySettings({super.key});
  @override
  State<MySettings> createState() => _MySettingsState();
}

class _MySettingsState extends State<MySettings> {
  TextEditingController originalPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController newPasswordCheckController = TextEditingController();
  void logout()
  {
    setEmpty();
    Navigator.pop(context, true);
  }
  void changePassword() async
  {
    if(newPasswordCheckController.text != newPasswordController.text)
    {
      return;
    }
    Map<String, dynamic> reqBody = 
    {
      'username': userUsername,
      'password': originalPasswordController.text,
    };
    API res = await callServer(reqBody, '/api/login');
    if(res.statuscode != 200)
    {
      return;
    }
    // CALL ON CHANGE PASSWORD API
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold
    (
      body: Center(
        child: Column
        (
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Card(
              child: Column(
                children: [
                  Text('Settings for $userFirstName $userLastName'),
                  ElevatedButton(onPressed: logout, child: const Text('Logout')),
                  TextField
                  (
                    obscureText: true,
                    controller: originalPasswordController,
                    decoration: const InputDecoration
                    (
                      border: OutlineInputBorder(),
                      labelText: 'Current Password',
                    ),
                  ),
                  TextField
                  (
                    obscureText: true,
                    controller: newPasswordController,
                    decoration: const InputDecoration
                    (
                      border: OutlineInputBorder(),
                      labelText: 'New Password',
                    ),
                  ),
                  TextField
                  (
                    obscureText: true,
                    controller: newPasswordCheckController,
                    decoration: const InputDecoration
                    (
                      border: OutlineInputBorder(),
                      labelText: 'Confirm Password',
                    ),
                  ),
                  ElevatedButton(onPressed: changePassword, child: const Text('Update Password')),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}