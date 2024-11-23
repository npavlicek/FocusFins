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
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Settings for $userFirstName $userLastName'),
                  Row
                  (
                    mainAxisAlignment: MainAxisAlignment.center,
                    children:
                    [
                      ElevatedButton
                      (
                        onPressed: (){}, child: const Text('Light Mode')
                      ),
                      ElevatedButton
                      (
                        onPressed: (){}, child: const Text('Dark Mode')
                      ),
                    ]),
                  Row(),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}