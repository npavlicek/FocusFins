// Packages
import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

// Pages
import 'package:focusfinsapp/login.dart';
import 'package:focusfinsapp/register.dart';
import 'package:focusfinsapp/home.dart';

void main() 
{
  runApp(const MyApp());
}

class MyApp extends StatelessWidget 
{
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Focus Fins',
      theme: ThemeData
      (
        colorScheme: ColorScheme.dark
        (
          primary: myPrimary,
          // secondary: mySecondary,
        ),
        useMaterial3: true,
      ),
      home: const MyLogin(),
      routes: <String, WidgetBuilder>
      {
        '/Register' : (BuildContext context) => const MyRegister(),
        '/Home' : (BuildContext context) => const MyHome(),
      }
    );
  }
}