import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
// import 'dart:async'; // FOR Timer()

// Host Here EX: website.com
String host = '';

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
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
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
      return uri;
    }
    return uri;
  }
  catch (_)
  {
    return Uri.http('');
  }
}

Future<dynamic> callServer(var reqBody, String api) async {
  Uri uri = await checkHost(host, api);
  final result = await http.post
  (
    uri,
    headers: <String, String>
    {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(reqBody),
  );
  return(jsonDecode(result.body) as Map<String, dynamic>);
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

  String errorMessage = '';
  void submitLogin() async
  {
    final username = usernameController.text;
    final password = passwordController.text;

    final reqBody =  <String, String>
    {
      'username': username,
      'password' : password,
    };
    Map<String, dynamic> result = await callServer(reqBody, "/api/login");
    if(result.isEmpty) 
    {
      errorMessage = 'Could Not Send Request';
      return; // Could Not Connect to Server? 
    } 
    if(result.containsKey('error'))
    {
      errorMessage = result['error'];
      return;
    }
    errorMessage = '';
    return;
  }

  @override
  build(BuildContext context)
  {
    return Scaffold
    (
      body:
      Center(
        child: SizedBox(
            width: 300,
            height: 300,
            child: 
            Card
            (
              child: Column
              (
                children: [
                  const Spacer(flex: 5),
                  const Text
                  (
                    textScaler: TextScaler.linear(3),
                    "Login"
                  ),
                  const Spacer(),
                  TextBox(controller: usernameController, label: "Username"),
                  const Spacer(),
                  TextBox(controller: passwordController, label: "Password"),
                  const Spacer(),
                  ElevatedButton(onPressed: submitLogin, child: const Text("Submit")),
                  const Spacer(),
                  ElevatedButton(onPressed: switchToRegisterPage, child: const Text("New to FocusFins?")),
                  const Spacer(),
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

  void switchToLoginPage()
  {
    Navigator.pop(context, true);
  }

  String errorMessage = '';
  void submitRegister() async
  {
    final email = emailController.text;
    final username = usernameController.text;
    final password = passwordController.text;
    final firstName = firstNameController.text;
    final lastName = lastNameController.text;

    final reqBody = <String, String>
    {
      'username' : username,
      'password' : password,
      'firstName' : firstName,
      'lastName' : lastName,
      'email' : email,
    };

    Map<String, dynamic> result = await callServer(reqBody, '/api/register');
    if(result.isEmpty) 
    {
      errorMessage = 'Could Not Send Request';
      return; // Could Not Connect to Server? 
    } 
    if(result.containsKey('error'))
    {
      errorMessage = result['error'];
      return;
    }
    errorMessage = '';
    return;
  }

  @override
  Widget build (BuildContext context)
  {
    return Scaffold
    (
      body: Center(
        child: SizedBox(
          width: 300,
          height: 500,
          child: Card(
            child: Column
            (
              children: [
                const Spacer(),
                const Text
                (
                  textScaler: TextScaler.linear(2),
                  "Register an Account"
                ),
                const Spacer(),
                TextBox(controller: emailController, label: "Email"),
                const Spacer(),
                TextBox(controller: usernameController, label: "Username"),
                const Spacer(),
                TextBox(controller: passwordController, label: "Password"),
                const Spacer(),
                TextBox(controller: firstNameController, label: "First Name"),
                const Spacer(),
                TextBox(controller: lastNameController, label: "Last Name"),
                const Spacer(),
                ElevatedButton(onPressed: submitRegister, child: const Text("Register")),
                const Spacer(),
                ElevatedButton(onPressed: switchToLoginPage, child: const Text("Back to Login")),
                const Spacer(),
                Text(errorMessage),
              ],
            ),
          ),
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
    return SizedBox(
      width: 250,
      child: TextField
      (
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

class MyTimerPage extends StatefulWidget 
{
  const MyTimerPage({super.key});

  @override
  State<MyTimerPage> createState() =>
      _MyTimerPage();
}

class _MyTimerPage extends State<MyTimerPage>
{
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Padding(
        padding: EdgeInsets.all(20.0),
        child: MyTimer(),
        ),
      );
  }
}

class MyTimer extends StatefulWidget 
{
  @override
  const MyTimer({super.key});
  @override
  State<MyTimer> createState() => _MyTimerState();
}

class _MyTimerState extends State<MyTimer>
  with TickerProviderStateMixin
{
  late AnimationController controller;

  bool determinate = false;

  String pauseMsg = "Pause";

  Duration time = Duration(seconds: 5);

  Duration timeRemaining = Duration(seconds: 5);

  String timeString()
  {
    int last = timeRemaining.toString().length;
    String res = '';
    res += timeRemaining.toString().replaceRange(last - 7, null, '');
    return res;
  }

  void pause()
  {
    setState( ()
    {
      // Swaps True to False and False to True
      determinate = determinate ? false : true;
      if(determinate)
      {
        controller.stop();
        pauseMsg = "Play";
      }
      else
      {
        pauseMsg = "Pause";
        controller
          ..forward(from: controller.value)
          ..repeat();
      }
    });
  }

  @override
  void initState() {
    controller = AnimationController(
      vsync: this,
      duration: time,
    )..addListener(() {
        setState(() {});
      });
    super.initState();
  }

  // @override
  // void dispose() {
  //   controller.dispose();
  //   super.dispose();
  // }

  @override
  Widget build(BuildContext context)
  {
    return Scaffold
    (
      body: Column
      (
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>
          [
            Text
            (
              'Timer',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 30),
            Stack
            (
              children: 
              [
                Center
                (
                  child: CircularProgressIndicator
                  (
                    value: controller.value,
                    semanticsLabel: 'Circular progress indicator',
                    strokeAlign: 35,
                    strokeWidth: 5,
                  ),
                ),
                Center(child: Text(timeString())),
              ]
            ),
            const SizedBox(height: 10),
            ElevatedButton
            (
              onPressed: pause, 
              child: Text(pauseMsg)
            ),
          ],
      ),
    );
  }
}