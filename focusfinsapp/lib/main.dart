import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

// Host Here EX: website.com (DONT USE '/' WILL BREAK LATER DOWN)
String host = 'focusfins.org';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Focus Fins App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.lightBlue),
        useMaterial3: true,
      ),
      home: const MyLogin(),
      routes: <String, WidgetBuilder>{
      '/Register' : (BuildContext context) => const MyRegister(),
      '/Timer' : (BuildContext context) => const MyTimer(),
      }
    );
  }
}

Future<Uri> checkHost(String url, String api) async
{
  final uri = Uri.http(url, api);
  try
  {
    final test = await http.get(uri);
    if(test.statusCode == 200)
    {
      return (uri);
    }
    return (uri);
  }
  catch (_)
  {
    return (Uri.http('')); // COULD NOT CHECK HOST
  }
}

Future<dynamic> callServer(var reqBody, String api) async {
  Uri uri = await checkHost(host, api);
  if(uri.toString() == '') return ({}, -1); // COULD NOT CHECK HOST
  final result = await http.post
  (
    uri,
    headers: <String, String>
    {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(reqBody),
  );
  return((jsonDecode(result.body) as Map<String, dynamic>), result.statusCode);
}

(bool, String) isPassword(String password)
{
  bool flag = false;
  String errorMessage = '';
  if(password.length < 8) {flag = true; errorMessage += '\nPassword Too Short (8-20 Characters)';}
  if(password.length > 20) {flag = true; errorMessage += '\nPassword Too Long (8-20 Characters)';}
  if(!RegExp('[A-Z]').hasMatch(password)) {flag = true; errorMessage += '\nNo Uppercase';}// Uppercase
  if(!RegExp('[a-z]').hasMatch(password)) {flag = true; errorMessage += '\nNo Lowercase';}// Lowercase
  if(!RegExp('[0-9]').hasMatch(password)) {flag = true; errorMessage += '\nNo Number';} // Number
  if(!RegExp('[!@#\$%^&*(),.?;{}|<>]').hasMatch(password)) {flag = true; errorMessage += '\nNo Special Character';} // Special Char

  if(flag) return (false, errorMessage);
  
  return (true, 'Fits Criteria');
}


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
    (Map<String, dynamic>, int) result = await callServer(reqBody, "/api/login");
    setState(() {
      if(result.$1.isEmpty) 
      {
        errorMessage = 'Could Not Send Request';
        return; // Could Not Connect to Server? 
      } 
      if((result.$1.containsKey('error') && result.$1['error'] != '') || result.$2 != 200)
      {
        print(result);
        errorMessage = result.$1['error'];
        return;
      }
      errorMessage = 'Success';
      // print(result);
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
                    "Login"
                  ),
                  TextBox(controller: usernameController, label: "Username",),
                  PasswordTextBox(controller: passwordController, label: "Password", passwordChanged: () {},),
                  ElevatedButton(onPressed: submitLogin, child: const Text("Submit")),
                  ElevatedButton(onPressed: switchToRegisterPage, child: const Text("New to FocusFins?")),
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

    if(flag) return;

    final reqBody = <String, String>
    {
      'username' : username,
      'password' : password,
      'firstName' : firstName,
      'lastName' : lastName,
      'email' : email,
    };

    (Map<String, dynamic>, int) result = await callServer(reqBody, '/api/register');
    setState(() {
      if(result.$2 == -1) 
      {
        errorMessage = 'Could Not Send Request';
        return; // Could Not Connect to Server? 
      } 
      if(result.$2 !=201)
      {
        if(result.$1['error'] != null) errorMessage = result.$1['error'];
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
                  "Register an Account"
                ),
                TextBox(controller: emailController, label: "Email",),
                TextBox(controller: usernameController, label: "Username",),
                PasswordTextBox(controller: passwordController, label: "Password", passwordChanged: passwordChanged,),
                TextBox(controller: firstNameController, label: "First Name",),
                TextBox(controller: lastNameController, label: "Last Name",),
                ElevatedButton(onPressed: submitRegister, style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(20)),  child: const Text("Register"),),
                ElevatedButton(onPressed: switchToLoginPage, style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(20),), child: const Text("Back to Login"),),
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

// For Password Input (Obscure and Password Requirements)
class PasswordTextBox extends StatelessWidget {
  const PasswordTextBox({
    super.key,
    required this.controller,
    required this.label,
    required this.passwordChanged(),
  });

  final TextEditingController controller;
  final String label;
  final VoidCallback passwordChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      constraints:const BoxConstraints
      (
        maxWidth: 250,
        minWidth: 100,
      ),
      child: TextField
      (
        onChanged: (value) {passwordChanged();},
        obscureText: true,
        controller: controller,
        decoration: 
        InputDecoration
        (
          border: const OutlineInputBorder(),
          labelText: label,
        ),
      ),
    );
  }
}

// TextBox is for both Login and Register input boxes
class TextBox extends StatelessWidget {
  const TextBox({
    super.key,
    required this.controller,
    required this.label,
  });

  final TextEditingController controller;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      constraints:const BoxConstraints
      (
        maxWidth: 250,
        minWidth: 100,
      ),
      child: TextField
      (
        obscureText: false,
        controller: controller,
        decoration: 
        InputDecoration
        (
          border: const OutlineInputBorder(),
          labelText: label,
        ),
      ),
    );
  }
}

class MyTimer extends StatefulWidget
{
  const MyTimer({super.key});
  @override
  State<MyTimer> createState() => _MyTimerState();
}

class _MyTimerState extends State<MyTimer> 
  with TickerProviderStateMixin
{
  late AnimationController controller;
  Timer? timer;

  bool isTimerRunning = false;
  bool isTimerPaused = false;

  int startTimeInSeconds = 60;
  int remainTimeInSeconds = 60;

  void startTimer()
  {
    if(isTimerRunning) return;
    isTimerRunning = true;
    timer = Timer.periodic(const Duration(seconds:1), (clock)
    {
      setState(() {
        if(remainTimeInSeconds <= 0) 
        {
          remainTimeInSeconds = 0;
          isTimerRunning = false;
          controller.stop();
          controller.value = 1;
          return;
        }
        controller
          ..forward(from: controller.value)
          ..repeat();
        remainTimeInSeconds--;
      });
    });
  }

  void pauseTimer()
  {
    setState(() {
      controller.stop();
      isTimerPaused = true;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void resetTimer()
  {
    setState(() {
      controller.stop();
      controller.reset();
      remainTimeInSeconds = startTimeInSeconds;
      isTimerPaused = false;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void setStartingTime(int time)
  {
    setState(() {
      startTimeInSeconds = time;
      remainTimeInSeconds = time;
      isTimerPaused = false;
      isTimerRunning = false;
    }); 
    timer?.cancel();
  }

  @override
  void initState() {
    controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: remainTimeInSeconds),
    )..addListener(() {
        setState(() {});
      });
    super.initState();
  }

  @override
  void dispose()
  {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(context)
  {
    int seconds = remainTimeInSeconds % 60;
    int minutes = (remainTimeInSeconds / 60).floor();
    return Scaffold
    (
      body: 
      Center
      (
        child :
        Stack(
          children:
          [
            Center(
              child: CircularProgressIndicator
              (
                      value: 1- controller.value,
                      semanticsLabel: 'Circular progress indicator',
                      strokeAlign: 35,
                      strokeWidth: 5,
              ),
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}'),
                Row
                (
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: 
                  [
                    ElevatedButton(onPressed: startTimer, child: const Text("Start")),
                    ElevatedButton(onPressed: pauseTimer, child: const Text("Pause")),
                    ElevatedButton(onPressed: resetTimer, child: const Text("Reset")),
                  ],
                ),
              ],
            ),
          ]
        ),
      ),
    );
  }
}