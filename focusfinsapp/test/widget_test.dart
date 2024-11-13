// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:focusfinsapp/main.dart';

void main() {
  testWidgets('Widget Load Test', (WidgetTester tester) async {
    // Build app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // TESTS FROM WHERE IT LOADS THE APP

    // TESTS FROM TIMER PAGE
  });

  test('isPassword Function Test', () 
  {
    expect(isPassword(''), (false, "\nPassword Too Short (8-20 Characters)\nNo Uppercase\nNo Lowercase\nNo Number\nNo Special Character"));
    expect(isPassword('pass'), (false, '\nPassword Too Short (8-20 Characters)\nNo Uppercase\nNo Number\nNo Special Character'));
    expect(isPassword('0123456789ABCDEF!@#\$%'), (false, '\nPassword Too Long (8-20 Characters)\nNo Lowercase'));
    expect(isPassword('password'), (false, '\nNo Uppercase\nNo Number\nNo Special Character'));
    expect(isPassword('PASSWORD'), (false, '\nNo Lowercase\nNo Number\nNo Special Character'));
    expect(isPassword('@@@@@@@@'), (false, '\nNo Uppercase\nNo Lowercase\nNo Number'));
    expect(isPassword('P@ssw0rd'), (true, 'Fits Criteria'));
  }
  );
}