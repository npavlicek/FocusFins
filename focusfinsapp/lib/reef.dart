import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = new FlutterSecureStorage();

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
    _controller.loadFlutterAsset('assets/index.html').whenComplete(() {
      storage.read(key: 'token').then((token) {
        storage.read(key: 'id').then((id) {
          if (token != null && id != null) {
            _controller.runJavaScript('initApp($token, $id);');
          }
        });
      });
    });
    return WebViewWidget(controller: _controller);
  }
}
