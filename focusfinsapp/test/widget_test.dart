// import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// FILES
import 'package:focusfinsapp/main.dart';
import 'package:focusfinsapp/util.dart';


void main() {
  testWidgets('App Load Test', (WidgetTester tester) async {
    // Build app and trigger a frame.
    await tester.pumpWidget(const MyApp());
  });

  test('isPassword Function Test', () 
  {
    expect(isPassword(''), (false, '\nPassword Too Short (8-20 Characters)\nNo Uppercase\nNo Lowercase\nNo Number\nNo Special Character'));
    expect(isPassword('pass'), (false, '\nPassword Too Short (8-20 Characters)\nNo Uppercase\nNo Number\nNo Special Character'));
    expect(isPassword('0123456789ABCDEF!@#\$%'), (false, '\nPassword Too Long (8-20 Characters)\nNo Lowercase'));
    expect(isPassword('password'), (false, '\nNo Uppercase\nNo Number\nNo Special Character'));
    expect(isPassword('PASSWORD'), (false, '\nNo Lowercase\nNo Number\nNo Special Character'));
    expect(isPassword('@@@@@@@@'), (false, '\nNo Uppercase\nNo Lowercase\nNo Number'));
    expect(isPassword('P@ssw0rd'), (true, 'Fits Criteria'));
  });

  test('isEmail Function Test', ()
  {
    expect(isEmail(''), false);
    expect(isEmail('test'), false);
    expect(isEmail('test@test'), false);
    expect(isEmail('test@test.com'), true);
  });
}
