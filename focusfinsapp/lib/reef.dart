import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';

class MyReef extends StatefulWidget
{
  const MyReef({super.key});
  @override
  State<MyReef> createState() => _MyReefState();
}

class _MyReefState extends State<MyReef> {
  void randomFunction() async{
    await getBubbles();
  }
  int number = 0; 
  @override
  Widget build(BuildContext context)
  {
    return Scaffold(body: Text(number.toString()));
  }
}