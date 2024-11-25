import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

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
    setState(() {
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
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/blue2.png'), // Path to your background image
            fit: BoxFit.cover, // Ensures the image covers the entire background
          ),
        ),
        child: Center(
          child: Container(
            constraints: const BoxConstraints(
              maxHeight: 400,
              minWidth: 300,
              maxWidth: 380 
            ),
            child: Container(
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 52,90,95).withOpacity(0.6), // Semi-transparent black background
                borderRadius: BorderRadius.circular(8), // Rounded corners
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0), // Spacing inside the box
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start, // Align items to the top
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      textScaler: TextScaler.linear(3),
                      'Login',
                      style: TextStyle(color: Colors.white), // Make the title white
                    ),
                    SizedBox(height: 8), // Space between Login and errorMessage
                    Text(
                      errorMessage,
                      style: const TextStyle(color: Colors.red), // Error message style
                    ),
                    SizedBox(height: 12), // Space between errorMessage and TextBox
                    TextField(
                      controller: usernameController,
                      decoration: InputDecoration(
                        labelText: 'Username',
                        labelStyle: const TextStyle(color: Colors.white), // White label text
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(color: Color.fromARGB(255,255,255,255), width: 2),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(color: Colors.white, width: 1),
                        ),
                      ),
                      style: const TextStyle(color: Colors.white), // White text input
                    ),
                    SizedBox(height: 12), // Space between username and password fields
TextField(
  controller: passwordController,
  obscureText: true, // Hide password input
  decoration: InputDecoration(
    labelText: 'Password',
    labelStyle: const TextStyle(color: Colors.white), // White label text
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Colors.white, width: 2), // White border on focus
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Colors.white, width: 1), // White border when enabled
    ),
  ),
  style: const TextStyle(color: Colors.white), // White text input
),

                    SizedBox(height: 16), // Space before the Submit button
                    ElevatedButton(
                      onPressed: submitLogin,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white, // Button background color
                        foregroundColor: Colors.black, // Button text color
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Submit'),
                    ),
                    ElevatedButton(
                      onPressed: switchToRegisterPage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white, // Button background color
                        foregroundColor: Colors.black, // Button text color
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('New to FocusFins?'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
