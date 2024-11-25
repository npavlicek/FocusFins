import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'package:webview_flutter/webview_flutter.dart';

class MyReef extends StatefulWidget {
  const MyReef({super.key});
  @override
  State<MyReef> createState() => _MyReefState();
}

class _MyReefState extends State<MyReef> {
  final WebViewController _controller = WebViewController();

  void randomFunction() async {
    await getBubbles();
  }

  @override
  Widget build(BuildContext context) {
    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    _controller.setNavigationDelegate(
        NavigationDelegate(onNavigationRequest: (NavigationRequest req) {
      return NavigationDecision.navigate;
    }));
    _controller.loadFlutterAsset('assets/index.html');
    return WebViewWidget(controller: _controller);
  }
}
