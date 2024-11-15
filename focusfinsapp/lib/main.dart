import 'package:flutter/material.dart';

// Pages
import 'package:focusfinsapp/login.dart';
import 'package:focusfinsapp/register.dart';
import 'package:focusfinsapp/timer.dart';

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
      title: 'Focus Fins App',
      theme: ThemeData
      (
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.lightBlue),
        useMaterial3: true,
      ),
      home: const MyLogin(),
      routes: <String, WidgetBuilder>
      {
        '/Register' : (BuildContext context) => const MyRegister(),
        '/Timer' : (BuildContext context) => const MyTimer(),
      }
    );
  }
}