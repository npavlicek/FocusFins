import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Host Here EX: website.com (DONT USE '/' WILL BREAK LATER DOWN)
String host = 'focusfins.org';

/*--- Classes ---*/

// API Class for JSON Return and Status Code
class API
{
  Map<String, dynamic> body;
  int statuscode;

  API(this.body, this.statuscode);
}

/*--- Functions ---*/

// Calls API and returns Result
Future<API> callServer(Map<String, dynamic> reqBody, String api) async 
{
  Uri uri;
  try
  {
    uri = Uri.http(host, api);
  }
  on Exception catch(_)
  {
    return API({}, -1);
  }
  final response = await http.post
  (
    uri,
    headers: <String, String>
    {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(reqBody),
  );
  API result = API(jsonDecode(response.body) as Map<String, dynamic>, response.statusCode);
  return result;
}

// Checks if Password Follows ReGex Rules
(bool, String) isPassword(String password)
{
  bool flag = false;
  String errorMessage = '';
  if(password.length < 8) 
    {flag = true; errorMessage += '\nPassword Too Short (8-20 Characters)';}
  if(password.length > 20) 
    {flag = true; errorMessage += '\nPassword Too Long (8-20 Characters)';}
  if(!RegExp('[A-Z]').hasMatch(password)) 
    {flag = true; errorMessage += '\nNo Uppercase';}// Uppercase
  if(!RegExp('[a-z]').hasMatch(password)) 
    {flag = true; errorMessage += '\nNo Lowercase';}// Lowercase
  if(!RegExp('[0-9]').hasMatch(password)) 
    {flag = true; errorMessage += '\nNo Number';} // Number
  if(!RegExp('[!@#\$%^&*(),.?;{}|<>]').hasMatch(password)) 
    {flag = true; errorMessage += '\nNo Special Character';} // Special Char

  if(flag) 
    {return (false, errorMessage);}
  
  return (true, 'Fits Criteria');
}


/*--- Widgets ---*/

// For Password Input (Obscure and Password Requirements)
class PasswordTextBox extends StatelessWidget 
{
  const PasswordTextBox
  ({
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

// TextBox is for both Login and Register Normal input boxes
class TextBox extends StatelessWidget 
{
  const TextBox
  ({
    super.key,
    required this.controller,
    required this.label,
  });

  final TextEditingController controller;
  final String label;

  @override
  Widget build(BuildContext context) 
  {
    return Container
    (
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
