// Packages
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

/*--- Variables ---*/

// Host Here EX: website.com (DONT USE '/' WILL BREAK LATER DOWN)
String host = 'focusfins.org';

String userUsername = '';
String userId = '';
String userFirstName = '';
String userLastName = '';
String jwt = '';

int curBubbles = 0;

// Color Pallete
Color myPrimary = const Color.fromARGB(255, 56, 84, 91);
Color mySecondary= const Color.fromARGB(255, 50, 30, 50);


/*--- Classes ---*/

// API Class for JSON Return and Status Code
class API
{
  Map<String, dynamic> body;
  int statuscode;

  API(this.body, this.statuscode);
}

Icon bubbleIcon = 
const Icon
(
  Icons.bubble_chart_outlined,
);

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
  if(response.body == 'OK') 
  {
    return API({'message': 'OK'} as Map<String, dynamic>, response.statusCode);
  } 
  return API(jsonDecode(response.body) as Map<String, dynamic>, response.statusCode);
}

// Returns the Number of Bubbles
Future<String> getBubbles() async
{
  String id = '0'; // Need this too
  Map<String, dynamic> reqBody = <String, dynamic> 
  {
    'id': id,
    'token' : jwt,
  };
  API res = await callServer(reqBody, '/api/getBubbles');
  if(res.statuscode != 200)
  {
    if(res.body.containsKey('error'))
    {
      return res.body['error'];
    }
    return 'Could Not Connect to Server?';
  }
  curBubbles = res.body['bubbles'];
  return '';
}

// Increment Bubbles (Earned Bubbles from Timer)
Future<bool> incBubbles(int amount) async
{
  Map<String, dynamic> reqBody = <String, dynamic>
  {
    'amount': amount,
    'token' : jwt,
  };

  API res = await callServer(reqBody, '/api/incBubbles');
  if(res.statuscode != 200)
  {
    if(res.body.containsKey('error'))
    {
      res.body['error'];
    }
    return false;
  }
  return true;
}

// Decreases Bubble Count (Bought Something From Store)
Future<bool> decBubbles(int amount) async
{
  Map<String, dynamic> reqBody = <String, dynamic>
  {
    'amount' : amount,
    'token' : jwt,
  };
  API res = await callServer(reqBody, '/api/decBubbles');
  if(res.statuscode != 200)
  {
    if(res.body.containsKey('error'))
    {
      res.body['error'];
    }
    return false;
  }
  return true;
}

void setEmpty()
{
  userUsername = '';
  userId = '';
  jwt = '';
  userFirstName = '';
  userLastName = '';
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