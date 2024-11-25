import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = const FlutterSecureStorage();

class MyLogin extends StatefulWidget {
  const MyLogin({super.key});
  @override
  State<MyLogin> createState() => _MyLoginState();
}

class _MyLoginState extends State<MyLogin> {
  TextEditingController usernameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  String errorMessage = '';
  String passwordError = '';

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void switchToRegisterPage() {
    Navigator.pushNamed(context, '/Register');
  }

  void switchToTimerPage() {
    Navigator.pushNamed(context, '/Home');
  }

  void submitLogin() async {
    final username = usernameController.text;
    final password = passwordController.text;

    Map<String, dynamic> reqBody = <String, String>{
      'username': username,
      'password': password,
    };
    API result = await callServer(reqBody, '/api/login');
    setState(() async {
      if (result.statuscode == -1) {
        errorMessage = 'Could Not Send Request';
        return; // Could Not Connect to Server?
      }
      if (result.statuscode != 200) {
        if (result.body['error'] != null) {
          errorMessage = result.body['error'];
        }
        return;
      }
      errorMessage = '';
      userUsername = username;
      await storage.write(key: 'token', value: result.body['token']);
      await storage.write(key: 'id', value: result.body['id']);
      await storage.write(key: 'firstName', value: result.body['firstName']);
      await storage.write(key: 'lastName', value: result.body['lastName']);
      getBubbles();
      switchToTimerPage();
      return;
    });
  }

  @override
  build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          constraints: const BoxConstraints(
            maxHeight: 550,
            minHeight: 100,
          ),
          child: Card(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                const Text(textScaler: TextScaler.linear(3), 'Login'),
                Text(errorMessage),
                TextBox(
                  controller: usernameController,
                  label: 'Username',
                ),
                PasswordTextBox(
                  controller: passwordController,
                  label: 'Password',
                  passwordChanged: () {},
                ),
                ElevatedButton(
                    onPressed: submitLogin, child: const Text('Submit')),
                ElevatedButton(
                    onPressed: switchToRegisterPage,
                    child: const Text('New to FocusFins?')),
                // Text(passwordError),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
